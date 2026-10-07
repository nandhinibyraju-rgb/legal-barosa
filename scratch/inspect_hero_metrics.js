async function check() {
  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await listRes.json();
  const targetPage = pages.find(p => p.url.includes('5173')) || pages[0];
  const ws = new WebSocket(targetPage.webSocketDebuggerUrl);
  ws.onopen = () => {
    const expr = `
      (() => {
        const nav = document.querySelector('header');
        const h1 = document.querySelector('h1');
        const badge = h1 ? h1.previousElementSibling : null;
        const ill = h1 ? h1.parentElement.nextElementSibling : null;
        
        return {
          navBottom: nav.getBoundingClientRect().bottom,
          badgeTop: badge ? badge.getBoundingClientRect().top : null,
          gapNavToBadge: badge ? (badge.getBoundingClientRect().top - nav.getBoundingClientRect().bottom) : null,
          h1Bottom: h1.getBoundingClientRect().bottom,
          illTop: ill ? ill.getBoundingClientRect().top : null,
          gapH1ToIll: ill ? (ill.getBoundingClientRect().top - h1.getBoundingClientRect().bottom) : null,
          illHeight: ill ? ill.getBoundingClientRect().height : null
        };
      })()
    `;
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: { expression: expr, returnByValue: true }
    }));
  };
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    console.log('UPDATED METRICS:', data.result?.result?.value);
    process.exit(0);
  };
}
check();
// Final submission update
