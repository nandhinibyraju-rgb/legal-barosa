import fs from 'fs';

async function testNavbarLogo() {
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
    // Set standard desktop viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise(r => setTimeout(r, 2600));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector("nav a img") || document.querySelector("nav a svg");
        const rect = el ? el.getBoundingClientRect() : null;
        return {
          rect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
          src: el?.src || el?.tagName
        };
      })()`,
      returnByValue: true
    });
    console.log('Final Logo Info:', evalRes.result.value);

    // Full navbar screenshot
    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1440, height: 120, scale: 1 }
    });
    fs.writeFileSync('c:/lb/scratch/navbar_live_screenshot.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved navbar screenshot');

    ws.close();
  };
}

testNavbarLogo().catch(console.error);
// Final submission update
