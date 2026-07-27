const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const BASE_DIR = '/Users/danielvazquez/Proyectos/StreetBoss';
const WEB_DIR = path.join(BASE_DIR, 'streetboss-web');
const MASTER_DEST = path.join(WEB_DIR, 'public', 'brand', 'master');
const DERIVED_DEST = path.join(WEB_DIR, 'public', 'brand', 'derived');
const MANIFEST_PATH = path.join(WEB_DIR, 'public', 'brand', 'ASSET_MANIFEST.md');

// Ensure directories exist
[MASTER_DEST, DERIVED_DEST].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Assets to copy directly to master
const MASTER_ASSETS = [
  { src: 'brand-core/01_Master_Logo_Dark.svg', dest: '01_Master_Logo_Dark.svg', function: 'Header principal (fondo oscuro)', format: 'SVG' },
  { src: 'brand-core/01_Master_Logo_Light.svg', dest: '01_Master_Logo_Light.svg', function: 'Alternativa (fondo claro)', format: 'SVG' },
  { src: 'brand-core/01_Master_Icon.svg', dest: '01_Master_Icon.svg', function: 'Isotipo', format: 'SVG' },
  { src: 'brand-core/oficial-raster/StreetBoss_AppIcon_Oficial.png', dest: 'StreetBoss_AppIcon_Oficial.png', function: 'Favicon base maestro', format: 'PNG' },
  { src: 'brand-assets/03-open-graph/og_master.svg', dest: 'og_master.svg', function: 'Plantilla OG principal', format: 'SVG' }
];

// Screenshot assets (product-real)
const screenshotsDir = path.join(BASE_DIR, 'brand-assets/ui/product-real/screenshots');
if (fs.existsSync(screenshotsDir)) {
  const files = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
  files.forEach(f => {
    MASTER_ASSETS.push({
      src: path.join('brand-assets/ui/product-real/screenshots', f),
      dest: f,
      function: 'Captura de producto real',
      format: 'PNG'
    });
  });
}

const getHash = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
};

let manifest = `# BRAND ASSET MANIFEST
**Fecha de generación:** ${new Date().toISOString()}

Esta es la lista oficial de trazabilidad entre los archivos maestros originales y las copias o derivados utilizados en el ecosistema web. Los archivos maestros permanecen intactos.

## 1. ARCHIVOS MAESTROS (Copiados intactos)

| Archivo Web (Destino) | Ruta Original (Origen) | Función | Formato | SHA-256 Original | SHA-256 Copia |
| :--- | :--- | :--- | :--- | :--- | :--- |
`;

MASTER_ASSETS.forEach(asset => {
  const srcPath = path.join(BASE_DIR, asset.src);
  const destPath = path.join(MASTER_DEST, asset.dest);
  
  if (fs.existsSync(srcPath)) {
    const originalHash = getHash(srcPath);
    fs.copyFileSync(srcPath, destPath);
    const copyHash = getHash(destPath);
    
    manifest += `| \`public/brand/master/${asset.dest}\` | \`${asset.src}\` | ${asset.function} | ${asset.format} | \`${originalHash.substring(0,8)}...\` | \`${copyHash.substring(0,8)}...\` |\n`;
  } else {
    console.warn(`Warning: Could not find ${srcPath}`);
  }
});

manifest += `\n## 2. ARCHIVOS DERIVADOS

| Archivo Derivado | Archivo Fuente Maestro | Dimensiones | Formato | Generación | SHA-256 |
| :--- | :--- | :--- | :--- | :--- | :--- |
`;

fs.writeFileSync(MANIFEST_PATH, manifest);
console.log('Manifest initialized and master files copied.');
