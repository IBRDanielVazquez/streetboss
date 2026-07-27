const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outDir = '/Users/danielvazquez/Proyectos/StreetBoss/docs/auditoria-visual-2026-07-23';

async function capture() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const captureUrl = async (url, prefix, isLocal) => {
    // Desktop
    await page.setViewport({ width: 1440, height: 1200 });
    console.log(`Navigating desktop to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(outDir, isLocal ? '02_local_desktop.png' : '04_produccion_desktop.png'), fullPage: true });

    // Mobile
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    console.log(`Navigating mobile to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));
    
    // Hero (viewport only)
    await page.screenshot({ path: path.join(outDir, isLocal ? '05_local_mobile_hero.png' : '06_produccion_mobile_hero.png'), fullPage: false });
    
    // Full mobile
    await page.screenshot({ path: path.join(outDir, isLocal ? '01_local_mobile.png' : '03_produccion_mobile.png'), fullPage: true });
  };

  try {
    await captureUrl('http://127.0.0.1:5175', 'local', true);
    await captureUrl('https://streetboss.com.mx', 'produccion', false);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

capture();
