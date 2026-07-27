const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3055;
const BASE_DIR = '/Users/danielvazquez/Proyectos/StreetBoss';

// Serve the whole project directory so relative paths work
app.use(express.static(BASE_DIR));

const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
  :root {
    --charcoal: #0D0E12;
    --orange: #FF4B00;
    --orange-light: #FF6A1A;
    --white: #FFFFFF;
  }
  body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background: #e0e0e0; }
  .asset-wrapper { margin: 20px; display: inline-block; }
  .asset {
    position: relative;
    background-color: var(--charcoal);
    color: var(--white);
    overflow: hidden;
    display: flex;
    box-sizing: border-box;
  }
  
  .bg-gradient {
    position: absolute;
    top: -20%; right: -20%;
    width: 120%; height: 120%;
    background: radial-gradient(circle, rgba(255,75,0,0.15) 0%, rgba(13,14,18,0) 60%);
    z-index: 1;
  }

  .mockup-container {
    position: absolute;
    bottom: -30px; right: 5%;
    width: 320px; height: 690px;
    border-radius: 40px;
    border: 12px solid #222;
    background: #000;
    overflow: hidden;
    box-shadow: -20px 20px 60px rgba(0,0,0,0.6);
    transform: rotate(-5deg);
    z-index: 5;
  }
  .mockup-img { width: 100%; height: 100%; object-fit: cover; }

  /* Profiles & Icons */
  .profile-sq { justify-content: center; align-items: center; background: var(--charcoal); }
  
  .h1-main { font-size: 3.5em; font-weight: 900; line-height: 1.1; margin: 40px 0 20px; z-index: 10; position: relative; }
  .h1-main span { color: var(--orange); }
  .logo-img { z-index: 10; position: relative; max-width: 60%; max-height: 60%; }
</style>
</head>
<body>

<script>
  const assets = [
    { id: 'ig_profile', w: 1080, h: 1080, name: 'SB_INSTAGRAM_PROFILE_1080x1080_V01', cat: 'instagram' },
    { id: 'ig_post_v', w: 1080, h: 1350, name: 'SB_INSTAGRAM_POST_TEMPLATE_1080x1350_V01', cat: 'instagram' },
    { id: 'ig_carousel', w: 1080, h: 1350, name: 'SB_INSTAGRAM_CAROUSEL_TEMPLATE_1080x1350_V01', cat: 'instagram' },
    { id: 'ig_story', w: 1080, h: 1920, name: 'SB_INSTAGRAM_STORY_TEMPLATE_1080x1920_V01', cat: 'instagram' },
    { id: 'ig_reel', w: 1080, h: 1920, name: 'SB_INSTAGRAM_REEL_COVER_1080x1920_V01', cat: 'instagram' },
    
    { id: 'fb_profile', w: 1080, h: 1080, name: 'SB_FACEBOOK_PROFILE_1080x1080_V01', cat: 'facebook' },
    { id: 'fb_cover', w: 1640, h: 624, name: 'SB_FACEBOOK_COVER_1640x624_V01', cat: 'facebook' },
    { id: 'fb_post_v', w: 1080, h: 1350, name: 'SB_FACEBOOK_POST_VERTICAL_1080x1350_V01', cat: 'facebook' },
    { id: 'fb_post_h', w: 1200, h: 630, name: 'SB_FACEBOOK_POST_HORIZONTAL_1200x630_V01', cat: 'facebook' },

    { id: 'tt_profile', w: 1080, h: 1080, name: 'SB_TIKTOK_PROFILE_1080x1080_V01', cat: 'tiktok' },
    { id: 'tt_cover', w: 1080, h: 1920, name: 'SB_TIKTOK_VIDEO_COVER_1080x1920_V01', cat: 'tiktok' },

    { id: 'li_logo', w: 400, h: 400, name: 'SB_LINKEDIN_COMPANY_LOGO_400x400_V01', cat: 'linkedin' },
    { id: 'li_cover', w: 1128, h: 191, name: 'SB_LINKEDIN_COVER_1128x191_V01', cat: 'linkedin' },
    { id: 'li_post_v', w: 1080, h: 1350, name: 'SB_LINKEDIN_POST_VERTICAL_1080x1350_V01', cat: 'linkedin' },
    { id: 'li_post_h', w: 1200, h: 627, name: 'SB_LINKEDIN_POST_HORIZONTAL_1200x627_V01', cat: 'linkedin' },
    { id: 'li_carousel', w: 1080, h: 1350, name: 'SB_LINKEDIN_CAROUSEL_TEMPLATE_1080x1350_V01', cat: 'linkedin' },

    { id: 'yt_profile', w: 800, h: 800, name: 'SB_YOUTUBE_PROFILE_800x800_V01', cat: 'youtube' },
    { id: 'yt_banner', w: 2560, h: 1440, name: 'SB_YOUTUBE_BANNER_2560x1440_V01', cat: 'youtube' },
    { id: 'yt_thumb', w: 1280, h: 720, name: 'SB_YOUTUBE_THUMBNAIL_TEMPLATE_1280x720_V01', cat: 'youtube' },

    { id: 'x_profile', w: 1080, h: 1080, name: 'SB_X_PROFILE_1080x1080_V01', cat: 'x' },
    { id: 'x_header', w: 1500, h: 500, name: 'SB_X_HEADER_1500x500_V01', cat: 'x' },
    { id: 'x_post_h', w: 1600, h: 900, name: 'SB_X_POST_HORIZONTAL_1600x900_V01', cat: 'x' },

    { id: 'pin_profile', w: 1080, h: 1080, name: 'SB_PINTEREST_PROFILE_1080x1080_V01', cat: 'pinterest' },
    { id: 'pin_vertical', w: 1000, h: 1500, name: 'SB_PINTEREST_PIN_VERTICAL_1000x1500_V01', cat: 'pinterest' },

    { id: 'og_main', w: 1200, h: 630, name: 'SB_OPEN_GRAPH_1200x630_V01', cat: 'open-graph' },
    { id: 'favicon', w: 512, h: 512, name: 'SB_FAVICON_512x512_V01', cat: 'favicon' },
    { id: 'apple_touch', w: 180, h: 180, name: 'SB_APPLE_TOUCH_ICON_180x180_V01', cat: 'favicon' },
    { id: 'app_icon', w: 1024, h: 1024, name: 'SB_APP_ICON_1024x1024_V01', cat: 'favicon' }
  ];

  const logoH = '/brand-core/oficial-raster/StreetBoss_Logo_Horizontal_Oficial.png';
  const logoCirc = '/brand-core/oficial-raster/StreetBoss_Avatar_Circular_Oficial.png';
  const logoSq = '/brand-core/oficial-raster/StreetBoss_AppIcon_Oficial.png';
  const uiMockup = '/brand-assets/ui/product-real/screenshots/01_portada.png';

  const container = document.createElement('div');
  
  assets.forEach(a => {
    let content = '';
    const isProfile = a.id.includes('profile') || a.id.includes('favicon') || a.id.includes('apple') || a.id.includes('icon') || a.id.includes('logo');
    
    if (isProfile) {
      let lSrc = logoSq;
      if (a.id.includes('x_') || a.id.includes('tt_') || a.id.includes('ig_') || a.id.includes('pin_')) {
          lSrc = logoCirc;
      }
      content = \`
        <div id="\${a.id}" class="asset profile-sq" style="width:\${a.w}px; height:\${a.h}px;" data-file="\${a.name}" data-cat="\${a.cat}">
          <img src="\${lSrc}" class="logo-img" />
        </div>
      \`;
    } else {
      let scale = (a.w < 1100) ? 0.8 : (a.w > 2000 ? 1.5 : 1);
      let mockupScale = 'width: 320px; height: 690px; bottom: -30px; right: 5%; transform: rotate(-5deg);';
      if (a.h > 1000) {
        mockupScale = 'width: 400px; height: 850px; bottom: 50px; right: auto; left: 50%; transform: translateX(-50%) rotate(0deg);';
      }
      if (a.id === 'li_cover') {
         mockupScale = 'display:none;';
      }

      content = \`
        <div id="\${a.id}" class="asset" style="width:\${a.w}px; height:\${a.h}px; padding: \${60 * scale}px;" data-file="\${a.name}" data-cat="\${a.cat}">
          <div class="bg-gradient"></div>
          <div style="z-index:10; position:relative; width: 100%;">
            <img src="\${logoH}" style="height: \${80 * scale}px; margin-bottom: 20px;" />
            <h1 class="h1-main" style="font-size:\${4 * scale}em">
              \${a.w > a.h ? 'Vende directo.<br><span>Manda tú.</span>' : 'Tu menú.<br><span>Tus clientes.</span>'}
            </h1>
          </div>
          <div class="mockup-container" style="\${mockupScale}">
             <img src="\${uiMockup}" class="mockup-img" onerror="this.src=''"/>
          </div>
        </div>
      \`;
    }

    container.innerHTML += \`
      <div class="asset-wrapper">
        <h3 style="margin: 0 0 10px 0;">\${a.name} (\${a.w}x\${a.h})</h3>
        \${content}
      </div><br>
    \`;
  });

  document.body.appendChild(container);
  
  // Signal Puppeteer that rendering is ready
  const readyDiv = document.createElement('div');
  readyDiv.id = 'render-ready';
  document.body.appendChild(readyDiv);
</script>
</body>
</html>
`;

app.get('/render.html', (req, res) => {
  res.send(htmlContent);
});

const server = app.listen(PORT, async () => {
  console.log('Server running on http://localhost:' + PORT);
  
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 3000, height: 20000 });
    
    console.log('Loading page...');
    await page.goto('http://localhost:' + PORT + '/render.html', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for the ready signal and fonts to load
    await page.waitForSelector('#render-ready');
    // small extra wait to ensure web fonts fully applied
    await new Promise(r => setTimeout(r, 2000));
    
    const elements = await page.$$('.asset');
    console.log('Found ' + elements.length + ' assets to export.');
    
    const outBase = path.join(BASE_DIR, 'brand-assets', 'social', 'final');
    
    let pngCount = 0;
    let webpCount = 0;

    for (const el of elements) {
      const dataFile = await el.evaluate(n => n.getAttribute('data-file'));
      const dataCat = await el.evaluate(n => n.getAttribute('data-cat'));
      if (!dataFile || !dataCat) continue;
      
      const outDir = path.join(outBase, dataCat);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      
      // Save PNG
      const pngPath = path.join(outDir, dataFile + '.png');
      await el.screenshot({ path: pngPath, type: 'png' });
      pngCount++;
      
      // Save WebP
      const webpPath = path.join(outDir, dataFile + '.webp');
      await el.screenshot({ path: webpPath, type: 'webp', quality: 100 });
      webpCount++;
      
      console.log('Generated:', dataFile);
    }
    
    console.log('DONE. Generated PNGs:', pngCount, 'WebPs:', webpCount);
    await browser.close();
  } catch (err) {
    console.error('Error in Puppeteer:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
