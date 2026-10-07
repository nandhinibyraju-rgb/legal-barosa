async function measureHomePage() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const lbTab = tabs.find(t => t.url.includes('localhost:5173') || t.url.includes('127.0.0.1:5173')) || tabs[0];
  
  const ws = new WebSocket(lbTab.webSocketDebuggerUrl);
  ws.onopen = () => {
    const expr = `
      (() => {
        const sections = [
          { name: 'Hero (home)', el: document.getElementById('home') },
          { name: 'Hero Carousel', el: document.querySelector('section[aria-label="LegalBharosa Core Services Carousel"]') },
          { name: 'Does This Sound Like You', el: document.getElementById('sound-like-you') },
          { name: 'Client Stories Preview', el: document.getElementById('client-stories') },
          { name: 'Our Services Resolution', el: document.getElementById('our-services-resolution') },
          { name: 'How It Works', el: document.getElementById('how-it-works') },
          { name: 'Footer', el: document.querySelector('footer') }
        ];

        return sections.map(s => {
          if (!s.el) return { name: s.name, found: false };
          const rect = s.el.getBoundingClientRect();
          const style = window.getComputedStyle(s.el);
          return {
            name: s.name,
            found: true,
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            height: rect.height,
            paddingTop: style.paddingTop,
            paddingBottom: style.paddingBottom,
            marginTop: style.marginTop,
            marginBottom: style.marginBottom,
          };
        });
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
    console.log('HOME PAGE SECTIONS MEASUREMENTS:');
    console.log(JSON.stringify(data.result?.result?.value, null, 2));
    
    // Also calculate gaps between consecutive sections
    const items = data.result?.result?.value || [];
    for (let i = 0; i < items.length - 1; i++) {
      if (items[i].found && items[i+1].found) {
        const gap = items[i+1].top - items[i].bottom;
        console.log(`GAP between ${items[i].name} and ${items[i+1].name}: ${gap}px`);
      }
    }
    process.exit(0);
  };
}

measureHomePage();
// Final submission update
