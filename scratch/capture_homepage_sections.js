import fs from 'fs';
import path from 'path';

async function captureSections() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const lbTab = tabs.find(t => t.url.includes('localhost:5173') || t.url.includes('127.0.0.1:5173')) || tabs[0];

  const ws = new WebSocket(lbTab.webSocketDebuggerUrl);
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
    // 1. Desktop viewport 1440x900
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // Navigate to / and wait
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll to top
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await new Promise(r => setTimeout(r, 600));

    // Capture Viewport 1: Hero & Trust Stats
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/home_01_hero.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved scratch/home_01_hero.png');

    // Scroll to "Does This Sound Like You"
    await send('Runtime.evaluate', { expression: `
      document.getElementById('sound-like-you').scrollIntoView({ behavior: 'instant', block: 'start' });
    ` });
    await new Promise(r => setTimeout(r, 600));
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/home_02_sound_like_you.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved scratch/home_02_sound_like_you.png');

    // Scroll to "Client Stories Preview"
    await send('Runtime.evaluate', { expression: `
      document.getElementById('client-stories').scrollIntoView({ behavior: 'instant', block: 'start' });
    ` });
    await new Promise(r => setTimeout(r, 600));
    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/home_03_client_stories.png', Buffer.from(shot3.data, 'base64'));
    console.log('Saved scratch/home_03_client_stories.png');

    // Scroll to "Our Services Resolution"
    await send('Runtime.evaluate', { expression: `
      document.getElementById('our-services-resolution').scrollIntoView({ behavior: 'instant', block: 'start' });
    ` });
    await new Promise(r => setTimeout(r, 600));
    const shot4 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/home_04_our_services.png', Buffer.from(shot4.data, 'base64'));
    console.log('Saved scratch/home_04_our_services.png');

    // Scroll to "How It Works"
    await send('Runtime.evaluate', { expression: `
      document.getElementById('how-it-works').scrollIntoView({ behavior: 'instant', block: 'start' });
    ` });
    await new Promise(r => setTimeout(r, 600));
    const shot5 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/home_05_how_it_works.png', Buffer.from(shot5.data, 'base64'));
    console.log('Saved scratch/home_05_how_it_works.png');

    // 2. Mobile Viewport 390x844
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await new Promise(r => setTimeout(r, 800));

    // Capture Mobile Hero
    const mobHero = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/mob_01_hero.png', Buffer.from(mobHero.data, 'base64'));
    console.log('Saved scratch/mob_01_hero.png');

    // Mobile Our Services
    await send('Runtime.evaluate', { expression: `
      document.getElementById('our-services-resolution').scrollIntoView({ behavior: 'instant', block: 'start' });
    ` });
    await new Promise(r => setTimeout(r, 600));
    const mobServices = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/mob_02_our_services.png', Buffer.from(mobServices.data, 'base64'));
    console.log('Saved scratch/mob_02_our_services.png');

    // Reset emulation to desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('All screenshots captured successfully!');
    process.exit(0);
  };
}

captureSections();
// Final submission update
