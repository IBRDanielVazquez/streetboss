const fs = require('fs');
const path = require('path');

const srcDir = '/Users/danielvazquez/.gemini/antigravity/brain/b669664a-be78-4098-a9b2-b29bcf487703';
const destDir = '/Users/danielvazquez/.gemini/antigravity/scratch/streetboss-web/public/demos/img/taqueria';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const map = {
  'taco_carne_asada': 'taco-carne-asada.jpg',
  'taco_pastor': 'taco-pastor.jpg',
  'taco_suadero': 'taco-suadero.jpg',
  'taco_longaniza': 'taco-longaniza.jpg',
  'quesadilla_queso': 'quesadilla-queso.jpg',
  'quesadilla_rajas': 'quesadilla-rajas.jpg',
  'quesadilla_hongos': 'quesadilla-hongos.jpg',
  'agua_jamaica': 'agua-jamaica.jpg',
  'agua_horchata': 'agua-horchata.jpg',
  'refresco': 'refresco.jpg',
  'guacamole': 'guacamole.jpg',
  'tortillas': 'tortillas.jpg'
};

const allFiles = fs.readdirSync(srcDir);

for (const [prefix, targetName] of Object.entries(map)) {
  const matches = allFiles.filter(f => f.startsWith(prefix + '_') && f.endsWith('.png'));
  if (matches.length > 0) {
    matches.sort((a, b) => fs.statSync(path.join(srcDir, b)).mtime.getTime() - fs.statSync(path.join(srcDir, a)).mtime.getTime());
    const sourceFile = path.join(srcDir, matches[0]);
    const targetFile = path.join(destDir, targetName);
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`Copiado: ${matches[0]} -> ${targetName}`);
  } else {
    console.log(`No encontrado: ${prefix}`);
  }
}
