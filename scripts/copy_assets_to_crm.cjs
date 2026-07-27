const fs = require('fs');
const path = require('path');

const rootDir = '/Users/danielvazquez/Proyectos/StreetBoss';
const publicAssetsDir = path.join(rootDir, 'social-command-center', 'public', 'assets');

// Create directories
fs.mkdirSync(publicAssetsDir, { recursive: true });
fs.mkdirSync(path.join(publicAssetsDir, 'social-final'), { recursive: true });
fs.mkdirSync(path.join(publicAssetsDir, 'p01-p07'), { recursive: true });
fs.mkdirSync(path.join(publicAssetsDir, 'product-real'), { recursive: true });
fs.mkdirSync(path.join(publicAssetsDir, 'brand-core'), { recursive: true });

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(child => {
      copyDirRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy social assets
copyDirRecursive(path.join(rootDir, 'brand-assets', 'social', 'final'), path.join(publicAssetsDir, 'social-final'));
// Copy P01-P07
copyDirRecursive(path.join(rootDir, 'brand-assets', '05-calendar', 'week-01', 'final-content'), path.join(publicAssetsDir, 'p01-p07'));
// Copy product screenshots
copyDirRecursive(path.join(rootDir, 'brand-assets', 'ui', 'product-real', 'screenshots'), path.join(publicAssetsDir, 'product-real'));
// Copy brand core
copyDirRecursive(path.join(rootDir, 'brand-core', 'oficial-raster'), path.join(publicAssetsDir, 'brand-core'));

console.log('Assets copied to public folder!');
