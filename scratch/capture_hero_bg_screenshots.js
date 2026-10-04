import fs from 'fs';

async function captureHeroBackgrounds() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const lbTab = tabs.find(t => t.url.includes('localhost:5173') || t.url.includes('127.0.0.1:5173')) || tabs[0];

  const ws = new WebSocket(lbTab.webSocketDebuggerUrl);
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
    // 1. Desktop viewport 1440x900
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise(r => setTimeout(r, 2000));
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await new Promise(r => setTimeout(r, 600));

    // Capture Slide 1
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/hero_bg_slide1.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved scratch/hero_bg_slide1.png');

    // Advance to Slide 2
    await send('Runtime.evaluate', { expression: `
      const buttons = document.querySelectorAll('button[aria-label*="Switch to slide"]');
      if (buttons && buttons[1]) buttons[1].click();
    ` });
    await new Promise(r => setTimeout(r, 700));
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/hero_bg_slide2.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved scratch/hero_bg_slide2.png');

    // 2. Mobile Viewport 390x844
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await new Promise(r => setTimeout(r, 800));

    const mobShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/hero_bg_mobile.png', Buffer.from(mobShot.data, 'base64'));
    console.log('Saved scratch/hero_bg_mobile.png');

    // Reset desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('All hero background screenshots captured!');
    process.exit(0);
  };
}

captureHeroBackgrounds();
