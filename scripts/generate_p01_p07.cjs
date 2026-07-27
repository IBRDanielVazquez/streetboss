const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const app = express();
const PORT = 3456;
const PROJECT_ROOT = '/Users/danielvazquez/Proyectos/StreetBoss';

app.use('/assets', express.static(path.join(PROJECT_ROOT, 'brand-assets')));
app.use('/core', express.static(path.join(PROJECT_ROOT, 'brand-core')));
app.use('/temp', express.static('/Users/danielvazquez/.gemini/antigravity/brain/9cf855eb-98d5-4671-81aa-bdf7a1324ea1')); 

const OUT_DIR = path.join(PROJECT_ROOT, 'brand-assets', '05-calendar', 'week-01', 'final-content');
['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07'].forEach(p => fs.mkdirSync(path.join(OUT_DIR, p), { recursive: true }));

function getHtml(content, isVertical = false) {
  return '<!DOCTYPE html><html><head><style>' +
    '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap");' +
    'body, html { margin: 0; padding: 0; width: 100%; height: 100%; font-family: "Inter", sans-serif; background: #0D0E12; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; }' +
    '.bg-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.4; z-index: 1; }' +
    '.content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; height: 100%; padding: 80px; box-sizing: border-box; justify-content: center; }' +
    '.phone { border-radius: 40px; border: 12px solid #222; box-shadow: 0 20px 50px rgba(0,0,0,0.8); overflow: hidden; position: relative; background: #000; display: flex; justify-content: center; align-items: center; }' +
    '.phone img { width: 100%; height: auto; display: block; }' +
    'h1 { font-size: ' + (isVertical ? '90px' : '75px') + '; font-weight: 900; color: #FFFFFF; text-transform: uppercase; line-height: 1.1; margin: 0 0 20px 0; text-shadow: 0 10px 30px rgba(0,0,0,0.8); }' +
    'h2 { font-size: ' + (isVertical ? '60px' : '45px') + '; font-weight: 700; color: #FF4B00; margin: 0; text-shadow: 0 5px 20px rgba(0,0,0,0.8); }' +
    '.logo { width: 600px; margin-top: 40px; }' +
    '.huge-brand { font-size: 140px; font-weight: 900; color: #FF4B00; text-transform: uppercase; letter-spacing: -3px; margin: 0 0 20px 0; line-height: 1; }' +
    '.cta { margin-top: 40px; background: #FF4B00; color: white; padding: 20px 60px; font-size: 40px; font-weight: 900; border-radius: 100px; text-transform: uppercase; }' +
  '</style></head><body>' + content + '</body></html>';
}

const pieces = [];

const phoneHtml = (src, w, h) => '<div class="phone" style="width: ' + w + 'px; height: ' + h + 'px;"><img src="' + src + '" style="width: 100%; height: 100%; object-fit: cover; object-position: top;"/></div>';

// P01 REEL
pieces.push({ id: 'P01_F1', dir: 'P01', w: 1080, h: 1920, html: getHtml('<img src="http://localhost:' + PORT + '/temp/burger_hero_v3_1784739862779.jpg" class="bg-img"/><div class="content"><h1>TU MENÚ NO DEBERÍA VERSE COMO UNA LISTA.</h1></div>', true) });
pieces.push({ id: 'P01_F2', dir: 'P01', w: 1080, h: 1920, html: getHtml('<img src="http://localhost:' + PORT + '/temp/burger_hero_v3_1784739862779.jpg" class="bg-img"/><div class="content">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/01_portada.png', 500, 1000) + '<h2 style="margin-top:60px;">CONVIÉRTELO EN TU ESCAPARATE DIGITAL.</h2></div>', true) });
pieces.push({ id: 'P01_F3', dir: 'P01', w: 1080, h: 1920, html: getHtml('<img src="http://localhost:' + PORT + '/temp/burger_hero_v3_1784739862779.jpg" class="bg-img"/><div class="content">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/02_categorias.png', 600, 1100) + '<h1 style="margin-top:50px; font-size: 60px;">TUS PRODUCTOS.<br>TUS CATEGORÍAS.<br><span style="color:#FF4B00;">TU MARCA.</span></h1></div>', true) });
pieces.push({ id: 'P01_F4', dir: 'P01', w: 1080, h: 1920, html: getHtml('<img src="http://localhost:' + PORT + '/temp/burger_hero_v3_1784739862779.jpg" class="bg-img"/><div class="content">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/05_carrito.png', 600, 1200) + '<h2 style="margin-top:50px;">TU CLIENTE ELIGE Y ARMA SU PEDIDO.</h2></div>', true) });
pieces.push({ id: 'P01_F5', dir: 'P01', w: 1080, h: 1920, html: getHtml('<div class="content"><div class="huge-brand">STREETBOSS</div><img src="http://localhost:' + PORT + '/core/oficial-raster/StreetBoss-Logo-Horizontal.png" class="logo"/><h2 style="margin-top:60px; font-size: 50px;">VENDE DIRECTO. MANDA TÚ.</h2><div class="cta">CONOCE STREETBOSS</div></div>', true) });

// P02 CAROUSEL
pieces.push({ id: 'P02_S1', dir: 'P02', w: 1080, h: 1350, html: getHtml('<div class="content"><h1>DEL ANTOJO AL CARRITO.</h1></div>') });
pieces.push({ id: 'P02_S2', dir: 'P02', w: 1080, h: 1350, html: getHtml('<div class="content">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/01_portada.png', 500, 900) + '<h2 style="margin-top:40px;">TU CLIENTE ENTRA A TU ESCAPARATE.</h2></div>') });
pieces.push({ id: 'P02_S3', dir: 'P02', w: 1080, h: 1350, html: getHtml('<div class="content">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/02_categorias.png', 500, 900) + '<h2 style="margin-top:40px;">EXPLORA POR CATEGORÍAS.</h2></div>') });
pieces.push({ id: 'P02_S4', dir: 'P02', w: 1080, h: 1350, html: getHtml('<div class="content"><div class="phone" style="width: 800px; height: 600px;"><img src="http://localhost:' + PORT + '/assets/ui/product-real/screenshots/02_categorias.png" style="width: 100%; height: auto; object-fit: cover; object-position: center; margin-top: -200px;"/></div><h2 style="margin-top:60px;">DESCUBRE TUS PRODUCTOS.</h2></div>') });
pieces.push({ id: 'P02_S5', dir: 'P02', w: 1080, h: 1350, html: getHtml('<div class="content">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/05_carrito.png', 500, 900) + '<h2 style="margin-top:40px;">AGREGA Y REVISA SU CARRITO.</h2></div>') });
pieces.push({ id: 'P02_S6', dir: 'P02', w: 1080, h: 1350, html: getHtml('<div class="content"><div class="huge-brand">STREETBOSS</div><h1>TU MENÚ.<br>TUS CLIENTES.<br><span style="color:#FF4B00;">TUS PEDIDOS.</span></h1><div class="cta">CONOCE STREETBOSS</div></div>') });

// P03 POST
pieces.push({ id: 'P03', dir: 'P03', w: 1080, h: 1350, html: getHtml('<img src="http://localhost:' + PORT + '/temp/tacos_pastor_v3_1784739808494.jpg" class="bg-img" style="opacity: 0.6;"/><div class="content" style="flex-direction: row; padding: 40px;">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/01_portada.png', 400, 800) + '<div style="margin-left: 40px; text-align: left; max-width: 500px;"><div class="huge-brand" style="font-size: 80px; margin-bottom: 30px;">STREETBOSS</div><h1 style="font-size: 65px; text-align: left;">NO BASTA CON DECIR QUÉ VENDES.</h1><h2 style="font-size: 45px; text-align: left; margin-top: 20px; color: #fff; background: #FF4B00; display: inline-block; padding: 10px 20px;">HAY QUE HACER QUE SE ANTOJE.</h2></div></div>') });

// P04 CAROUSEL
pieces.push({ id: 'P04_S1', dir: 'P04', w: 1080, h: 1350, html: getHtml('<div class="content"><h1>TU MENÚ TAMBIÉN VENDE CON LOS OJOS.</h1></div>') });
pieces.push({ id: 'P04_S2', dir: 'P04', w: 1080, h: 1350, html: getHtml('<img src="http://localhost:' + PORT + '/temp/tacos_pastor_v3_1784739808494.jpg" class="bg-img" style="opacity:0.8;"/><div class="content"><h2>FOTOGRAFÍAS QUE DESPIERTAN EL ANTOJO.</h2></div>') });
pieces.push({ id: 'P04_S3', dir: 'P04', w: 1080, h: 1350, html: getHtml('<div class="content">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/02_categorias.png', 500, 900) + '<h2 style="margin-top:40px;">CATEGORÍAS CLARAS PARA DECIDIR MÁS RÁPIDO.</h2></div>') });
pieces.push({ id: 'P04_S4', dir: 'P04', w: 1080, h: 1350, html: getHtml('<div class="content">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/05_carrito.png', 500, 900) + '<h2 style="margin-top:40px;">UN CARRITO PARA ORGANIZAR LA ELECCIÓN.</h2></div>') });
pieces.push({ id: 'P04_S5', dir: 'P04', w: 1080, h: 1350, html: getHtml('<div class="content"><div class="huge-brand" style="font-size:100px;">STREETBOSS</div><h1>CONVIERTE TU MENÚ EN UNA EXPERIENCIA QUE VENDE.</h1><div class="cta">CONOCE STREETBOSS</div></div>') });

// P05 REEL
pieces.push({ id: 'P05_F1', dir: 'P05', w: 1080, h: 1920, html: getHtml('<div class="content"><h1>UN MENÚ SOLO INFORMA.</h1></div>', true) });
pieces.push({ id: 'P05_F2', dir: 'P05', w: 1080, h: 1920, html: getHtml('<div class="content">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/01_portada.png', 550, 1100) + '<h2 style="margin-top:50px;">UN ESCAPARATE PRESENTA TU MARCA.</h2></div>', true) });
pieces.push({ id: 'P05_F3', dir: 'P05', w: 1080, h: 1920, html: getHtml('<div class="content" style="flex-direction: row; gap: 40px;">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/02_categorias.png', 400, 900) + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/05_carrito.png', 400, 900) + '</div><div class="content" style="height: auto; padding: 0;"><h2 style="margin-top:40px; font-size: 50px;">AYUDA A ELEGIR Y ORGANIZA EL PEDIDO.</h2></div>', true) });
pieces.push({ id: 'P05_F4', dir: 'P05', w: 1080, h: 1920, html: getHtml('<div class="content"><div class="huge-brand">STREETBOSS</div><img src="http://localhost:' + PORT + '/core/oficial-raster/StreetBoss-Logo-Horizontal.png" class="logo"/><h2 style="margin-top:60px; font-size: 70px;">VENDE DIRECTO.</h2></div>', true) });

// P06 CAROUSEL
pieces.push({ id: 'P06_S1', dir: 'P06', w: 1080, h: 1350, html: getHtml('<div class="content"><div class="huge-brand" style="font-size: 100px;">STREETBOSS</div><h1 style="color:#FF4B00;">NO ES OTRO MENÚ QR.</h1></div>') });
pieces.push({ id: 'P06_S2', dir: 'P06', w: 1080, h: 1350, html: getHtml('<div class="content"><h1>UN PDF SOLO SE CONSULTA.</h1></div>') });
pieces.push({ id: 'P06_S3', dir: 'P06', w: 1080, h: 1350, html: getHtml('<div class="content">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/01_portada.png', 500, 900) + '<h2 style="margin-top:40px;">STREETBOSS PRESENTA TU NEGOCIO.</h2></div>') });
pieces.push({ id: 'P06_S4', dir: 'P06', w: 1080, h: 1350, html: getHtml('<div class="content">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/02_categorias.png', 500, 900) + '<h2 style="margin-top:40px;">ORGANIZA TUS PRODUCTOS POR CATEGORÍAS.</h2></div>') });
pieces.push({ id: 'P06_S5', dir: 'P06', w: 1080, h: 1350, html: getHtml('<div class="content">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/05_carrito.png', 500, 900) + '<h2 style="margin-top:40px;">PERMITE QUE TU CLIENTE ARME SU CARRITO.</h2></div>') });
pieces.push({ id: 'P06_S6', dir: 'P06', w: 1080, h: 1350, html: getHtml('<div class="content"><div class="huge-brand">STREETBOSS</div><h1>TU MENÚ.<br>TUS CLIENTES.<br><span style="color:#FF4B00;">TUS PEDIDOS.</span></h1><div class="cta">CONOCE STREETBOSS</div></div>') });

// P07 POST
pieces.push({ id: 'P07', dir: 'P07', w: 1080, h: 1350, html: getHtml('<img src="http://localhost:' + PORT + '/temp/burger_hero_v3_1784739862779.jpg" class="bg-img" style="opacity: 0.5;"/><div class="content"><div class="huge-brand" style="font-size: 120px;">STREETBOSS</div><div style="display:flex; gap: 30px; margin-top: 30px; margin-bottom: 40px;">' + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/01_portada.png', 350, 700) + phoneHtml('http://localhost:' + PORT + '/assets/ui/product-real/screenshots/05_carrito.png', 350, 700) + '</div><h1 style="font-size:60px;">VENDE DIRECTO. <span style="color:#FF4B00;">MANDA TÚ.</span></h1><h2 style="font-size:35px; color:#fff;">TU MENÚ. TUS CLIENTES. TUS PEDIDOS.</h2></div>') });

let server;
async function generate() {
  const browser = await puppeteer.launch({ headless: true });
  for (const p of pieces) {
    const page = await browser.newPage();
    await page.setViewport({ width: p.w, height: p.h });
    await page.setContent(p.html, { waitUntil: 'networkidle0' });
    const outPng = path.join(OUT_DIR, p.dir, p.id + '.png');
    const outWebp = path.join(OUT_DIR, p.dir, p.id + '.webp');
    await page.screenshot({ path: outPng, type: 'png' });
    await page.screenshot({ path: outWebp, type: 'webp', quality: 90 });
    console.log('Generated ' + p.id);
    await page.close();
  }
  await browser.close();
  
  try {
    fs.writeFileSync(path.join(OUT_DIR, 'P01', 'input.txt'), "file 'P01_F1.png'\\nduration 2\\nfile 'P01_F2.png'\\nduration 2\\nfile 'P01_F3.png'\\nduration 2\\nfile 'P01_F4.png'\\nduration 2\\nfile 'P01_F5.png'\\nduration 2\\nfile 'P01_F5.png'\\n");
    execSync('ffmpeg -y -f concat -i input.txt -vsync vfr -pix_fmt yuv420p P01_FINAL.mp4', { cwd: path.join(OUT_DIR, 'P01') });
    fs.copyFileSync(path.join(OUT_DIR, 'P01', 'P01_F1.png'), path.join(OUT_DIR, 'P01', 'P01_COVER.jpg'));

    fs.writeFileSync(path.join(OUT_DIR, 'P05', 'input.txt'), "file 'P05_F1.png'\\nduration 2\\nfile 'P05_F2.png'\\nduration 2\\nfile 'P05_F3.png'\\nduration 2\\nfile 'P05_F4.png'\\nduration 2\\nfile 'P05_F4.png'\\n");
    execSync('ffmpeg -y -f concat -i input.txt -vsync vfr -pix_fmt yuv420p P05_FINAL.mp4', { cwd: path.join(OUT_DIR, 'P05') });
    fs.copyFileSync(path.join(OUT_DIR, 'P05', 'P05_F1.png'), path.join(OUT_DIR, 'P05', 'P05_COVER.jpg'));
  } catch(e) {
    console.error("FFMPEG error:", e);
  }
  console.log('Done!');
  server.close();
  process.exit(0);
}
server = app.listen(PORT, () => {
  console.log('Server started on ' + PORT);
  generate().catch(e => { console.error(e); process.exit(1); });
});
