import { spawn } from 'child_process';
import http from 'http';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json/list');
    const pages = await listRes.json();
    console.log('Pages:', pages);
    const wsUrl = pages[0].webSocketDebuggerUrl;
    
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `
            (() => {
              const nav = document.querySelector('header');
              const home = document.querySelector('#home');
              const badge = document.querySelector('.inline-flex.items-center.gap-1\\\\.5');
              const h1 = document.querySelector('h1');
              const illWrapper = document.querySelector('.relative.w-full.h-\\\\[230px\\\\]');
              return {
                nav: nav ? nav.getBoundingClientRect() : null,
                home: home ? home.getBoundingClientRect() : null,
                homeComputedPt: home ? window.getComputedStyle(home).paddingTop : null,
                badge: badge ? badge.getBoundingClientRect() : null,
                h1: h1 ? h1.getBoundingClientRect() : null,
                ill: illWrapper ? illWrapper.getBoundingClientRect() : null
              };
            })()
          `,
          returnByValue: true
        }
      }));
    };
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === 1) {
        console.log('BOXES:', JSON.stringify(data.result.value, null, 2));
        ws.close();
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
    process.exit(1);
  }
}, 2000);
