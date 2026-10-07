import fs from 'fs';

async function reproduce() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.type === 'page');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;

  const consoleLogs = [];
  const exceptions = [];

  const send = (m, p = {}) => new Promise(res => {
    const cur = id++;
    const h = (msg) => {
      const d = JSON.parse(msg.data);
      if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method: m, params: p }));
  });

  ws.addEventListener('message', (msg) => {
    const d = JSON.parse(msg.data);
    if (d.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push({
        type: d.params.type,
        args: d.params.args.map(a => a.value || a.description)
      });
    }
    if (d.method === 'Runtime.exceptionThrown') {
      exceptions.push({
        timestamp: d.params.timestamp,
        exception: d.params.exceptionDetails
      });
    }
  });

  ws.onopen = async () => {
    await send('Runtime.enable');
    await send('Page.enable');

    console.log('Navigating to http://localhost:5173/articles...');
    await send('Page.navigate', { url: 'http://localhost:5173/articles' });
    await new Promise(r => setTimeout(r, 1500));

    // Check if the page loaded
    const pageTitleRes = await send('Runtime.evaluate', {
      expression: 'document.title'
    });
    console.log('Page Title:', pageTitleRes.result.value);

    // Find the "Write Article" or "Create Article" button
    const buttonsRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button, a'));
        return btns.map(b => ({
          text: b.innerText?.trim(),
          id: b.id,
          tag: b.tagName
        })).filter(b => b.text && (b.text.toLowerCase().includes('write') || b.text.toLowerCase().includes('create') || b.text.toLowerCase().includes('article')));
      })()`,
      returnByValue: true
    });
    console.log('Found Article Buttons:', buttonsRes.result.value);

    // Let's click the write article button
    const clickRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button, a'));
        const btn = btns.find(b => {
          const t = (b.innerText || '').toLowerCase();
          return t.includes('write article') || t.includes('create article') || t.includes('write');
        });
        if (btn) {
          btn.click();
          return { clicked: true, text: btn.innerText };
        }
        return { clicked: false };
      })()`,
      returnByValue: true
    });
    console.log('Click Result:', clickRes.result.value);
    await new Promise(r => setTimeout(r, 1000));

    // Check DOM after click
    const domStatus1 = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          bodyHTML: document.body.innerHTML.length,
          hasModal: !!document.querySelector('[role="dialog"], .fixed, .modal'),
          modalInputs: Array.from(document.querySelectorAll('input, textarea')).map(i => ({
            name: i.name,
            placeholder: i.placeholder,
            id: i.id
          }))
        };
      })()`,
      returnByValue: true
    });
    console.log('DOM status after opening editor:', domStatus1.result.value);

    // Try typing into inputs
    const typeRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const titleInput = document.querySelector('input[name="title"], input[placeholder*="title" i], input[type="text"]');
        if (titleInput) {
          titleInput.value = 'Testing Article Title';
          titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          titleInput.dispatchEvent(new Event('change', { bubbles: true }));
          return { typedTitle: true };
        }
        return { typedTitle: false };
      })()`,
      returnByValue: true
    });
    console.log('Type Title Result:', typeRes.result.value);
    await new Promise(r => setTimeout(r, 1000));

    // Check if body went blank or if exceptions occurred
    const domStatus2 = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          bodyText: document.body.innerText.trim(),
          bodyChildrenCount: document.body.children.length,
          rootChildrenCount: document.getElementById('root')?.children.length || 0,
          rootHTML: document.getElementById('root')?.innerHTML || ''
        };
      })()`,
      returnByValue: true
    });
    console.log('DOM status after typing:', {
      bodyChildrenCount: domStatus2.result.value.bodyChildrenCount,
      rootChildrenCount: domStatus2.result.value.rootChildrenCount,
      rootHTMLPreview: domStatus2.result.value.rootHTML.slice(0, 200)
    });

    console.log('Exceptions captured:', JSON.stringify(exceptions, null, 2));
    console.log('Recent Console Logs:', JSON.stringify(consoleLogs.slice(-15), null, 2));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('c:/lb/scratch/bug_reproduce_screenshot.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved bug_reproduce_screenshot.png');

    ws.close();
  };
}

reproduce().catch(console.error);
// Final submission update
