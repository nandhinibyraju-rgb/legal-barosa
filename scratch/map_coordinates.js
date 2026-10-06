import fs from 'fs';

async function mapCoordinates() {
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
            canvas.width = 200;
            canvas.height = 180;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Let's find key points:
            // 1. Left spine: x range at y=40, y=70, y=100, y=130, y=155
            // 2. Pillar center: x center at y=60, y=80, y=100
            // 3. Beam: y coordinate, x left tip, x right tip
            // 4. Left pan: center, bounds
            // 5. Right pan: center, bounds
            // 6. Upper lobe: peak x at y=30, y=50, y=70
            // 7. Waist tuck: innermost x around y=75
            // 8. Lower lobe: peak x at y=95, y=115, y=135
            // 9. Gold hand: tip 1, tip 2, wrist
            
            const isOpaque = (x, y) => {
              if (x<0||x>=200||y<0||y>=180) return false;
              return ctx.getImageData(x, y, 1, 1).data[3] > 40;
            };

            const spineY = [40, 70, 100, 130, 155];
            const spineData = spineY.map(y => {
              let minX=200, maxX=0;
              for (let x=0; x<50; x++) {
                if (isOpaque(x, y)) {
                  if (x<minX) minX=x;
                  if (x>maxX) maxX=x;
                }
              }
              return { y, minX, maxX, width: maxX-minX+1, midX: (minX+maxX)/2 };
            });

            // Find waist
            let waistMinX = 200, waistY = 0;
            for (let y=65; y<=85; y++) {
              let rightmost=0;
              for (let x=80; x<=180; x++) {
                if (isOpaque(x, y)) rightmost = x;
              }
              // inner edge of right lobe
              let innerX = 200;
              for (let x=80; x<=140; x++) {
                if (isOpaque(x, y)) {
                  innerX = x; break;
                }
              }
              if (innerX < waistMinX) { waistMinX = innerX; waistY = y; }
            }

            // Find top of B
            let topY = 180, topX = 0;
            for (let y=0; y<30; y++) {
              for (let x=0; x<150; x++) {
                if (isOpaque(x, y) && y < topY) { topY = y; topX = x; }
              }
            }

            // Find rightmost tip of upper lobe
            let upperLobeMaxX = 0, upperLobeY = 0;
            for (let y=15; y<75; y++) {
              for (let x=120; x<200; x++) {
                if (isOpaque(x, y) && x > upperLobeMaxX) { upperLobeMaxX = x; upperLobeY = y; }
              }
            }

            // Find rightmost tip of lower lobe
            let lowerLobeMaxX = 0, lowerLobeY = 0;
            for (let y=75; y<140; y++) {
              for (let x=120; x<200; x++) {
                if (isOpaque(x, y) && x > lowerLobeMaxX) { lowerLobeMaxX = x; lowerLobeY = y; }
              }
            }

            // Find gold hand tips
            let goldTips = [];
            for (let x=160; x<195; x++) {
              for (let y=100; y<160; y++) {
                const p = ctx.getImageData(x, y, 1, 1).data;
                if (p[3] > 100 && p[0] > 180 && p[1] > 130 && p[2] < 80) {
                  goldTips.push({ x, y });
                }
              }
            }
            let maxGoldX = 0, maxGoldY = 0;
            goldTips.forEach(p => {
              if (p.x > maxGoldX) { maxGoldX = p.x; maxGoldY = p.y; }
            });

            resolve({
              spineData,
              top: { topX, topY },
              upperLobe: { upperLobeMaxX, upperLobeY },
              waist: { waistMinX, waistY },
              lowerLobe: { lowerLobeMaxX, lowerLobeY },
              goldTip: { maxGoldX, maxGoldY }
            });
          };
        });
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Coordinates:', JSON.stringify(res.result.value, null, 2));
    ws.close();
  };
}

mapCoordinates().catch(console.error);
