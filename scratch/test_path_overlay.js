import fs from 'fs';

async function testPath() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.type === 'page');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
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

  ws.onopen = async () => {
    // Navigate tab to a data URL that renders the logo and the path
    const testHtml = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 20px; background: #ffffff;">
        <div style="position: relative; width: 200px; height: 180px;">
          <img src="/assets/legalbharosa-horizontal.png" style="position: absolute; left: 0; top: 0; width: 700px; height: 180px; opacity: 0.4;" />
          <svg viewBox="0 0 200 180" style="position: absolute; left: 0; top: 0; width: 200px; height: 180px; overflow: visible;">
            <path id="testPath"
              d="
                M 14 162
                L 14 38
                C 14 16, 32 6, 80 5
                L 80 120
                M 42 50 L 118 50
                M 48 50 L 48 95
                M 40 95 C 40 108, 56 108, 56 95 Z
                M 112 50 L 112 95
                M 104 95 C 104 108, 120 108, 120 95 Z
                M 80 5
                C 118 5, 172 16, 172 45
                C 172 65, 145 74, 110 74
                C 148 74, 188 88, 188 116
                C 188 142, 150 174, 105 175
                C 65 176, 35 168, 35 160
                C 65 152, 130 148, 188 121
              "
              fill="none"
              stroke="red"
              stroke-width="26"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </body>
      </html>
    `;

    await send('Page.navigate', { url: 'data:text/html;charset=utf-8,' + encodeURIComponent(testHtml) });
    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 240, height: 220, scale: 1 }
    });
    fs.writeFileSync('c:/lb/scratch/path_overlay_test.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved path_overlay_test.png');
    ws.close();
  };
}

testPath().catch(console.error);
// Final submission update
