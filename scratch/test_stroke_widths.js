import fs from 'fs';

async function testStrokeWidths() {
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
    const html = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 20px; background: #0f172a; color: white; font-family: sans-serif;">
        <h2>Stroke Width Comparison Masking the Original Emblem</h2>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          ${[28, 32, 36, 40].map(sw => `
            <div style="background: white; padding: 10px; border-radius: 8px;">
              <div style="color: black; font-weight: bold; margin-bottom: 5px;">Stroke Width: ${sw}px</div>
              <svg viewBox="0 0 200 180" style="width: 200px; height: 180px;">
                <defs>
                  <mask id="mask-${sw}">
                    <rect width="200" height="180" fill="black" />
                    <path
                      d="
                        M 14 162
                        L 14 40
                        C 14 16, 32 6, 80 5
                        C 125 5, 172 16, 172 45
                        C 172 65, 145 74, 110 74
                        C 148 74, 188 88, 188 116
                        C 188 142, 150 174, 105 175
                        C 65 176, 35 168, 35 160
                        C 65 152, 130 148, 188 121
                      "
                      fill="none"
                      stroke="white"
                      stroke-width="${sw}"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="
                        M 80 20 L 80 118
                        M 42 50 L 118 50
                        M 48 50 L 48 95
                        M 40 95 C 40 106, 56 106, 56 95 Z
                        M 112 50 L 112 95
                        M 104 95 C 104 106, 120 106, 120 95 Z
                      "
                      fill="none"
                      stroke="white"
                      stroke-width="${Math.min(sw, 30)}"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </mask>
                </defs>
                <image href="http://localhost:5173/assets/legalbharosa-horizontal.png" width="700" height="180" mask="url(#mask-${sw})" />
              </svg>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;

    await send('Page.navigate', { url: 'data:text/html;charset=utf-8,' + encodeURIComponent(html) });
    await new Promise(r => setTimeout(r, 1200));

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 950, height: 350, scale: 1 }
    });
    fs.writeFileSync('c:/lb/scratch/stroke_widths_comparison.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved stroke_widths_comparison.png');
    ws.close();
  };
}

testStrokeWidths().catch(console.error);
// Final submission update
