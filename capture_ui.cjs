const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function capture() {
  const baseDir = '/Users/danielvazquez/Proyectos/StreetBoss/brand-assets/ui/product-real';
  const dirs = ['screenshots', 'screen-recordings', 'admin', 'public-storefront', 'checkout', 'order-output'];
  
  dirs.forEach(d => {
    fs.mkdirSync(path.join(baseDir, d), { recursive: true });
  });

  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Mobile viewport
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const url = 'http://localhost:5175';

  try {
    console.log('Navigating to', url);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    await delay(3000);

    // 1. Portada del escaparate
    await page.screenshot({ path: path.join(baseDir, 'screenshots', '01_portada.png') });
    console.log('Captured 01_portada.png');

    await page.screenshot({ path: path.join(baseDir, 'public-storefront', '01_portada_full.png'), fullPage: true });
    
    // Try to scroll down to categories
    await page.evaluate(() => window.scrollBy(0, 500));
    await delay(1000);
    await page.screenshot({ path: path.join(baseDir, 'screenshots', '02_categorias.png') });
    console.log('Captured 02_categorias.png');
    
    // Try to click first product if available
    const productClicked = await page.evaluate(() => {
      // Find something that looks like an 'add' button or a product card
      const elements = Array.from(document.querySelectorAll('button, [role="button"], a'));
      if (elements.length > 0) {
        // click the 3rd button/link (usually past header/nav)
        const btn = elements[Math.min(2, elements.length - 1)];
        btn.click();
        return true;
      }
      return false;
    });

    if (productClicked) {
      await delay(2000);
      await page.screenshot({ path: path.join(baseDir, 'screenshots', '03_detalle_producto.png') });
      console.log('Captured 03_detalle_producto.png');
      
      // Try to click 'Agregar al carrito'
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const addBtn = btns.find(b => b.textContent.toLowerCase().includes('agregar') || b.textContent.toLowerCase().includes('add'));
        if (addBtn) addBtn.click();
      });
      await delay(1000);
      await page.screenshot({ path: path.join(baseDir, 'screenshots', '04_agregado.png') });
      console.log('Captured 04_agregado.png');
    }

    // Try to open cart
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cartBtn = btns.find(b => b.textContent.toLowerCase().includes('carrito') || b.textContent.toLowerCase().includes('cart') || b.querySelector('svg'));
      if (cartBtn) cartBtn.click();
    });
    await delay(2000);
    await page.screenshot({ path: path.join(baseDir, 'screenshots', '05_carrito.png') });
    console.log('Captured 05_carrito.png');
    
    // Admin panel
    await page.goto(`${url}/admin`, { waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.log('Admin route may not exist'));
    await delay(2000);
    await page.screenshot({ path: path.join(baseDir, 'admin', '06_admin_panel.png') });
    console.log('Captured 06_admin_panel.png');

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

capture();
