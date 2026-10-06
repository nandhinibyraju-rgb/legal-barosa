import fs from 'fs';

async function captureLoop() {
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
    await send('Page.navigate', { url: 'http://localhost:5173/test_logo_drawing.html' });
    await new Promise(r => setTimeout(r, 600));

    const rectRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const r = document.getElementById('live-container').getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })()`,
      returnByValue: true
    });
    const rect = rectRes.result.value;
    console.log('Rect:', rect);

    // Reset start time so it synchronizes with our captures
    await send('Runtime.evaluate', {
      expression: `window.start = performance.now();`
    });

    const delays = [500, 1000, 1600, 2100, 2500, 3000, 4200, 4850, 5200];
    const names = [
      'loop_01_500ms_spine',
      'loop_02_1000ms_pillar',
      'loop_03_1600ms_upperlobe',
      'loop_04_2100ms_waist',
      'loop_05_2500ms_text',
      'loop_06_3000ms_complete',
      'loop_07_4200ms_held',
      'loop_08_4850ms_reset',
      'loop_09_5200ms_next_cycle'
    ];

    let prevTime = 0;
    for (let i = 0; i < delays.length; i++) {
      const wait = delays[i] - prevTime;
      await new Promise(r => setTimeout(r, wait));
      prevTime = delays[i];

      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: rect.x - 10, y: rect.y - 10, width: 320, height: rect.height + 20, scale: 1 }
      });
      fs.writeFileSync(`c:/lb/scratch/${names[i]}.png`, Buffer.from(shot.data, 'base64'));
      console.log(`Captured ${names[i]}`);
    }

    ws.close();
  };
}

captureLoop().catch(console.error);
