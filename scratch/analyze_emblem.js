import fs from 'fs';

async function analyze() {
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
    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const img = new Image();
        img.src = '/assets/legalbharosa-horizontal.png';
        return new Promise(resolve => {
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, 200, 180).data;
            
            // Sample along columns x=10, 30, 50, 70, 90, 110, 130, 150, 170
            // and along rows y=20, 50, 80, 100, 120, 140, 160
            // Also let's inspect the gold pixels vs blue pixels
            let goldPixels = [];
            let bluePixels = [];
            for (let y = 0; y < 180; y += 4) {
              for (let x = 0; x < 200; x += 4) {
                const idx = (y * 200 + x) * 4;
                const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
                if (a > 100) {
                  // Gold is high R, high G, low B (e.g. r>180, g>130, b<80)
                  if (r > 160 && g > 120 && b < 100) {
                    goldPixels.push({x, y, r, g, b});
                  } else if (b > 120 && b > r) {
                    bluePixels.push({x, y, r, g, b});
                  }
                }
              }
            }
            
            // Find gold bounds
            let gMinX=200, gMaxX=0, gMinY=180, gMaxY=0;
            goldPixels.forEach(p => {
              if (p.x < gMinX) gMinX = p.x;
              if (p.x > gMaxX) gMaxX = p.x;
              if (p.y < gMinY) gMinY = p.y;
              if (p.y > gMaxY) gMaxY = p.y;
            });

            // Find blue bounds
            let bMinX=200, bMaxX=0, bMinY=180, bMaxY=0;
            bluePixels.forEach(p => {
              if (p.x < bMinX) bMinX = p.x;
              if (p.x > bMaxX) bMaxX = p.x;
              if (p.y < bMinY) bMinY = p.y;
              if (p.y > bMaxY) bMaxY = p.y;
            });

            resolve({
              goldBounds: { gMinX, gMaxX, gMinY, gMaxY, count: goldPixels.length },
              blueBounds: { bMinX, bMaxX, bMinY, bMaxY, count: bluePixels.length },
            });
          };
        });
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Analysis:', JSON.stringify(res.result.value, null, 2));
    ws.close();
  };
}

analyze().catch(console.error);
