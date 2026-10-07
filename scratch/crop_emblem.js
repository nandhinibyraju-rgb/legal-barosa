import fs from 'fs';

async function cropEmblem() {
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
            resolve(canvas.toDataURL('image/png').split(',')[1]);
          };
        });
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    fs.writeFileSync('c:/lb/scratch/emblem_cropped.png', Buffer.from(res.result.value, 'base64'));
    console.log('Saved emblem_cropped.png');
    ws.close();
  };
}

cropEmblem().catch(console.error);
// Final submission update
