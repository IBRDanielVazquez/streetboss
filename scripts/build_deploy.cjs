const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const finalDir = '/Users/danielvazquez/Proyectos/StreetBoss/brand-assets/social/final';
const deployDir = '/Users/danielvazquez/Proyectos/StreetBoss/brand-assets/social/vercel-deploy';

// Create deploy dir
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir, { recursive: true });

// Copy all assets
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy everything from finalDir to deployDir
fs.readdirSync(finalDir).forEach(item => {
  if (item !== 'REVIEW_SOCIAL_ASSETS.html') {
    copyRecursiveSync(path.join(finalDir, item), path.join(deployDir, item));
  }
});

// Read the markdown setup
const mdPath = '/Users/danielvazquez/.gemini/antigravity/brain/9cf855eb-98d5-4671-81aa-bdf7a1324ea1/SOCIAL_MEDIA_SETUP.md';
let markdownContent = '';
if (fs.existsSync(mdPath)) {
  markdownContent = fs.readFileSync(mdPath, 'utf8');
}

// Simple Markdown to HTML convert
function mdToHtml(md) {
  return md
    .replace(/\\n/g, '<br>')
    .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
    .replace(/## (.*?)<br>/g, '<h2>$1</h2>')
    .replace(/# (.*?)<br>/g, '<h1>$1</h1>')
    .replace(/> \\[\!TIP\\]<br>> (.*?)<br>> (.*?)<br>/g, '<div class="alert"><strong>TIP:</strong> $1<br>$2</div>')
    .replace(/---/g, '<hr>');
}

const mdHtml = mdToHtml(markdownContent);

// Build the index.html
const htmlContent = \`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>StreetBoss Social Assets & Copy</title>
<style>
  body { font-family: sans-serif; background: #0D0E12; color: #FFFFFF; padding: 40px; }
  h1, h2 { color: #FF4B00; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; margin-top: 20px; }
  .card { background: #1a1c23; border-radius: 12px; padding: 20px; text-align: left; border: 1px solid #333; }
  .card img { max-width: 100%; max-height: 200px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #333; }
  .card h3 { margin: 0 0 10px 0; font-size: 14px; word-break: break-all; color: #FF6A1A; }
  .meta { font-size: 12px; color: #aaa; margin: 5px 0; text-align: left; }
  .status { display: inline-block; padding: 4px 8px; border-radius: 4px; background: #4caf50; color: white; font-weight: bold; font-size: 10px; margin-top: 10px;}
  .platform-section { margin-top: 50px; border-top: 2px solid #333; padding-top: 20px; }
  .copy-section { background: #1a1c23; border-radius: 12px; padding: 30px; border: 1px solid #333; margin-bottom: 50px; line-height: 1.6; }
  .alert { background: rgba(255, 75, 0, 0.1); border-left: 4px solid #FF4B00; padding: 15px; margin: 20px 0; }
  hr { border-color: #333; margin: 30px 0; }
</style>
</head>
<body>
  <div class="copy-section">
    \${mdHtml}
  </div>

  <h1>Tablero de Activos Sociales Institucionales V01</h1>
  <div id="assets"></div>

  <script>
    const assets = [
      { w: 1080, h: 1080, name: 'SB_INSTAGRAM_PROFILE_1080x1080_V01', cat: 'instagram', type: 'Profile' },
      { w: 1080, h: 1350, name: 'SB_INSTAGRAM_POST_TEMPLATE_1080x1350_V01', cat: 'instagram', type: 'Post' },
      { w: 1080, h: 1350, name: 'SB_INSTAGRAM_CAROUSEL_TEMPLATE_1080x1350_V01', cat: 'instagram', type: 'Carousel' },
      { w: 1080, h: 1920, name: 'SB_INSTAGRAM_STORY_TEMPLATE_1080x1920_V01', cat: 'instagram', type: 'Story' },
      { w: 1080, h: 1920, name: 'SB_INSTAGRAM_REEL_COVER_1080x1920_V01', cat: 'instagram', type: 'Reel Cover' },
      
      { w: 1080, h: 1080, name: 'SB_FACEBOOK_PROFILE_1080x1080_V01', cat: 'facebook', type: 'Profile' },
      { w: 1640, h: 624, name: 'SB_FACEBOOK_COVER_1640x624_V01', cat: 'facebook', type: 'Cover' },
      { w: 1080, h: 1350, name: 'SB_FACEBOOK_POST_VERTICAL_1080x1350_V01', cat: 'facebook', type: 'Post V' },
      { w: 1200, h: 630, name: 'SB_FACEBOOK_POST_HORIZONTAL_1200x630_V01', cat: 'facebook', type: 'Post H' },

      { w: 1080, h: 1080, name: 'SB_TIKTOK_PROFILE_1080x1080_V01', cat: 'tiktok', type: 'Profile' },
      { w: 1080, h: 1920, name: 'SB_TIKTOK_VIDEO_COVER_1080x1920_V01', cat: 'tiktok', type: 'Cover' },

      { w: 400, h: 400, name: 'SB_LINKEDIN_COMPANY_LOGO_400x400_V01', cat: 'linkedin', type: 'Logo' },
      { w: 1128, h: 191, name: 'SB_LINKEDIN_COVER_1128x191_V01', cat: 'linkedin', type: 'Cover' },
      { w: 1080, h: 1350, name: 'SB_LINKEDIN_POST_VERTICAL_1080x1350_V01', cat: 'linkedin', type: 'Post V' },
      { w: 1200, h: 627, name: 'SB_LINKEDIN_POST_HORIZONTAL_1200x627_V01', cat: 'linkedin', type: 'Post H' },
      { w: 1080, h: 1350, name: 'SB_LINKEDIN_CAROUSEL_TEMPLATE_1080x1350_V01', cat: 'linkedin', type: 'Carousel' },

      { w: 800, h: 800, name: 'SB_YOUTUBE_PROFILE_800x800_V01', cat: 'youtube', type: 'Profile' },
      { w: 2560, h: 1440, name: 'SB_YOUTUBE_BANNER_2560x1440_V01', cat: 'youtube', type: 'Banner' },
      { w: 1280, h: 720, name: 'SB_YOUTUBE_THUMBNAIL_TEMPLATE_1280x720_V01', cat: 'youtube', type: 'Thumb' },

      { w: 1080, h: 1080, name: 'SB_X_PROFILE_1080x1080_V01', cat: 'x', type: 'Profile' },
      { w: 1500, h: 500, name: 'SB_X_HEADER_1500x500_V01', cat: 'x', type: 'Header' },
      { w: 1600, h: 900, name: 'SB_X_POST_HORIZONTAL_1600x900_V01', cat: 'x', type: 'Post H' },

      { w: 1080, h: 1080, name: 'SB_PINTEREST_PROFILE_1080x1080_V01', cat: 'pinterest', type: 'Profile' },
      { w: 1000, h: 1500, name: 'SB_PINTEREST_PIN_VERTICAL_1000x1500_V01', cat: 'pinterest', type: 'Pin V' },

      { w: 1200, h: 630, name: 'SB_OPEN_GRAPH_1200x630_V01', cat: 'open-graph', type: 'OG Image' },
      { w: 512, h: 512, name: 'SB_FAVICON_512x512_V01', cat: 'favicon', type: 'Favicon' },
      { w: 180, h: 180, name: 'SB_APPLE_TOUCH_ICON_180x180_V01', cat: 'favicon', type: 'Apple Touch' },
      { w: 1024, h: 1024, name: 'SB_APP_ICON_1024x1024_V01', cat: 'favicon', type: 'App Icon' }
    ];

    const platforms = [...new Set(assets.map(a => a.cat))];
    const container = document.getElementById('assets');

    platforms.forEach(p => {
      const pAssets = assets.filter(a => a.cat === p);
      let html = \`<div class="platform-section"><h2 style="text-transform: capitalize; color: #fff;">\${p.replace('-', ' ')}</h2><div class="grid">\`;
      
      pAssets.forEach(a => {
        html += \`
          <div class="card">
            <a href="\${a.cat}/\${a.name}.webp" target="_blank">
              <img src="\${a.cat}/\${a.name}.webp" alt="\${a.name}" onerror="this.src=''; this.alt='Error loading image';"/>
            </a>
            <h3>\${a.name}</h3>
            <div class="meta"><strong>Plataforma:</strong> \${p.toUpperCase()}</div>
            <div class="meta"><strong>Dimensiones:</strong> \${a.w} x \${a.h} px</div>
          </div>
        \`;
      });
      html += \`</div></div>\`;
      container.innerHTML += html;
    });
  </script>
</body>
</html>
\`;

fs.writeFileSync(path.join(deployDir, 'index.html'), htmlContent);
console.log('Deploy directory built at ' + deployDir);
