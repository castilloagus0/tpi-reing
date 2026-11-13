const puppeteer = require('puppeteer-core');
const wait = ms => new Promise(s=>setTimeout(s,ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args:['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  // hide floating chat teaser for clean crops
  const hide = () => p.addStyleTag({content:'.lc-teaser,.lc-launcher-wrap{display:none!important}'});
  const shot = async (sel, name, pad=0) => { const el = await p.$(sel); if(!el){console.log('MISSING',sel);return;} await el.screenshot({path:`shots/c-${name}.png`, omitBackground:true}); console.log('ok',name); };
  await p.goto('http://localhost:5199/#/', {waitUntil:'networkidle0'}); await wait(1500); await hide();
  await p.screenshot({path:'shots/home-clean.png'});
  await shot('.search', 'search');
  await p.goto('http://localhost:5199/#/paquetes', {waitUntil:'networkidle0'}); await wait(1500); await hide();
  await p.screenshot({path:'shots/paquetes-clean.png'});
  const cards = await p.$$('.pkg-card, article'); console.log('cards', cards.length);
  for (let i=0;i<Math.min(cards.length,4);i++) await cards[i].screenshot({path:`shots/c-pkg${i}.png`});
  await shot('.summary', 'summary');
  await p.goto('http://localhost:5199/#/checkout', {waitUntil:'networkidle0'}); await wait(1500); await hide();
  await p.screenshot({path:'shots/checkout-clean.png'});
  await shot('.stepper', 'stepper');
  await p.goto('http://localhost:5199/#/mis-viajes', {waitUntil:'networkidle0'}); await wait(2000); await hide();
  await p.screenshot({path:'shots/viajes-clean.png'});
  await shot('.trip-hero', 'triphero');
  await shot('.bpass', 'bpass');
  await shot('.side-card', 'reserva');
  const secs = await p.$$('.tsec, .tl-body > *'); console.log('secs', secs.length);
  await p.goto('http://localhost:5199/#/asistente-viaje', {waitUntil:'networkidle0'}); await wait(1500); await hide();
  await p.screenshot({path:'shots/asistente-clean.png'});
  // live chat open
  await p.goto('http://localhost:5199/#/mis-viajes', {waitUntil:'networkidle0'}); await wait(1500);
  await p.click('.lc-launcher'); await wait(2500);
  const inp = await p.$('.lc-panel__input'); if (inp) { await inp.type('Hola Lucía, ¿puedo cambiar el asiento?'); await p.keyboard.press('Enter'); await wait(7000); }
  await shot('.lc-panel', 'livechat');
  await b.close();
})();
