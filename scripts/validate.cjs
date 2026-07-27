const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const expected = {
  'SB_INSTAGRAM_PROFILE_1080x1080_V01': [1080, 1080],
  'SB_INSTAGRAM_POST_TEMPLATE_1080x1350_V01': [1080, 1350],
  'SB_INSTAGRAM_CAROUSEL_TEMPLATE_1080x1350_V01': [1080, 1350],
  'SB_INSTAGRAM_STORY_TEMPLATE_1080x1920_V01': [1080, 1920],
  'SB_INSTAGRAM_REEL_COVER_1080x1920_V01': [1080, 1920],
  'SB_FACEBOOK_PROFILE_1080x1080_V01': [1080, 1080],
  'SB_FACEBOOK_COVER_1640x624_V01': [1640, 624],
  'SB_FACEBOOK_POST_VERTICAL_1080x1350_V01': [1080, 1350],
  'SB_FACEBOOK_POST_HORIZONTAL_1200x630_V01': [1200, 630],
  'SB_TIKTOK_PROFILE_1080x1080_V01': [1080, 1080],
  'SB_TIKTOK_VIDEO_COVER_1080x1920_V01': [1080, 1920],
  'SB_LINKEDIN_COMPANY_LOGO_400x400_V01': [400, 400],
  'SB_LINKEDIN_COVER_1128x191_V01': [1128, 191],
  'SB_LINKEDIN_POST_VERTICAL_1080x1350_V01': [1080, 1350],
  'SB_LINKEDIN_POST_HORIZONTAL_1200x627_V01': [1200, 627],
  'SB_LINKEDIN_CAROUSEL_TEMPLATE_1080x1350_V01': [1080, 1350],
  'SB_YOUTUBE_PROFILE_800x800_V01': [800, 800],
  'SB_YOUTUBE_BANNER_2560x1440_V01': [2560, 1440],
  'SB_YOUTUBE_THUMBNAIL_TEMPLATE_1280x720_V01': [1280, 720],
  'SB_X_PROFILE_1080x1080_V01': [1080, 1080],
  'SB_X_HEADER_1500x500_V01': [1500, 500],
  'SB_X_POST_HORIZONTAL_1600x900_V01': [1600, 900],
  'SB_PINTEREST_PROFILE_1080x1080_V01': [1080, 1080],
  'SB_PINTEREST_PIN_VERTICAL_1000x1500_V01': [1000, 1500],
  'SB_OPEN_GRAPH_1200x630_V01': [1200, 630],
  'SB_FAVICON_512x512_V01': [512, 512],
  'SB_APPLE_TOUCH_ICON_180x180_V01': [180, 180],
  'SB_APP_ICON_1024x1024_V01': [1024, 1024]
};

const base = '/Users/danielvazquez/Proyectos/StreetBoss/brand-assets/social/final';
let pngs = 0;
let webps = 0;
let errors = [];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walkDir(p);
    } else {
      if (f.endsWith('.png')) pngs++;
      else if (f.endsWith('.webp')) webps++;
      else continue;
      
      const stat = fs.statSync(p);
      if (stat.size === 0) {
        errors.push(f + ' is empty');
        continue;
      }
      
      try {
        const cmd = 'file "' + p + '"';
        const out = execSync(cmd).toString();
        
        let width = 0, height = 0;
        if (f.endsWith('.png')) {
           const match = out.match(/(\\d+) x (\\d+)/);
           if (match) { width = parseInt(match[1]); height = parseInt(match[2]); }
        }
        
        const key = f.replace('.png', '').replace('.webp', '');
        if (expected[key]) {
          if (width > 0 && height > 0) {
            if (width !== expected[key][0] || height !== expected[key][1]) {
              errors.push(f + ' bad size: ' + width + 'x' + height + ' != ' + expected[key][0] + 'x' + expected[key][1]);
            }
          }
        } else {
          errors.push(f + ' unknown asset');
        }
      } catch (err) {
        errors.push(f + ' corrupt: ' + err.message);
      }
    }
  }
}

walkDir(base);

console.log('PNGs: ' + pngs);
console.log('WebPs: ' + webps);
if (errors.length > 0) {
  console.log('ERRORS:');
  errors.forEach(e => console.log(e));
} else {
  console.log('ALL PERFECT');
}
