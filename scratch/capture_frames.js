import fs from 'fs';

async function captureAnimationProgression() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.type === 'page');
  if (!tab) return;

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const curId = id++;
      const handler = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  ws.onopen = async () => {
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const checkpoints = [
      { delay: 400, name: 'frame_1_start.png' },
      { delay: 600, name: 'frame_2_mid.png' },
      { delay: 700, name: 'frame_3_scales.png' },
      { delay: 800, name: 'frame_4_text.png' },
      { delay: 900, name: 'frame_5_finish.png' },
    ];

    await send('Page.navigate', { url: 'http://localhost:5173/' });

    let accum = 0;
    for (const cp of checkpoints) {
      await new Promise(r => setTimeout(r, cp.delay - accum));
      accum = cp.delay;

      const screenshot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: 30, y: 10, width: 220, height: 60, scale: 2 }
      });
      fs.writeFileSync(`c:/lb/scratch/${cp.name}`, Buffer.from(screenshot.data, 'base64'));
      console.log(`Saved ${cp.name}`);
    }

    ws.close();
  };
}

captureAnimationProgression().catch(console.error);
