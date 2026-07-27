const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function renderAssets() {
  console.log('Launching Puppeteer for rendering assets...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Disable viewport limitations so all assets fit and render correctly
  await page.setViewport({ width: 3000, height: 10000 });
  
  const fileUrl = 'file://' + path.resolve(__dirname, 'social_assets_renderer.html');
  console.log('Loading HTML:', fileUrl);
  
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  
  const elements = await page.$$('.asset');
  console.log('Found assets to render:', elements.length);
  
  for (const el of elements) {
    let dataFile = await el.evaluate(n => n.getAttribute('data-file'));
    const dataCat = await el.evaluate(n => n.getAttribute('data-cat'));
    if (!dataFile || !dataCat) continue;
    
    // Add extension if missing
    if (!dataFile.endsWith('.webp')) dataFile += '.webp';
    
    const outDir = path.resolve('/Users/danielvazquez/Proyectos/StreetBoss/brand-assets/social/final', dataCat);
    fs.mkdirSync(outDir, { recursive: true });
    
    const outPath = path.join(outDir, dataFile);
    await el.screenshot({ path: outPath, type: 'webp', quality: 90 });
    console.log('Saved:', outPath);
  }
  
  await browser.close();
}

renderAssets().catch(err => console.error('RENDER ERROR:', err));
