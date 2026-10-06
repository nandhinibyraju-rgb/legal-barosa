import fs from 'fs';

async function testLiveNavbar() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.type === 'page');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  const send = (m, p = {}) => new Promise(res => {
    const cur = id++;
    const h = (msg) => {
      const d = JSON.parse(msg.data);
      if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method: m, params: p }));
  });

  ws.onopen = async () => {
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise(r => setTimeout(r, 800));

    // Capture frames across the 5s loop
    const checkpoints = [
      { delay: 600, name: 'live_nav_1_spine' },
      { delay: 1000, name: 'live_nav_2_scales' },
      { delay: 800, name: 'live_nav_3_upperlobe' },
      { delay: 600, name: 'live_nav_4_hand_and_text' },
      { delay: 800, name: 'live_nav_5_complete' }
    ];

    for (const cp of checkpoints) {
      await new Promise(r => setTimeout(r, cp.delay));
      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: 0, y: 0, width: 380, height: 80, scale: 1 }
      });
      fs.writeFileSync(`c:/lb/scratch/${cp.name}.png`, Buffer.from(shot.data, 'base64'));
      console.log(`Captured ${cp.name}`);
    }

    ws.close();
  };
}

testLiveNavbar().catch(console.error);
