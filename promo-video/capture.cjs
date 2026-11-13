const puppeteer = require('puppeteer-core');
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args:['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  const routes = { home:'/', paquetes:'/paquetes', checkout:'/checkout', viajes:'/mis-viajes', asistente:'/asistente-viaje', ayuda:'/asistencia' };
  for (const [name, r] of Object.entries(routes)) {
    await p.goto('http://localhost:5199/#' + r, { waitUntil: 'networkidle0' });
    await new Promise(s=>setTimeout(s,2500));
    await p.screenshot({ path: `shots/${name}.png` });
    await p.screenshot({ path: `shots/${name}-full.png`, fullPage: true });
  }
  await b.close();
})();
