const fs = require('fs');

const file = '/Users/danielvazquez/.gemini/antigravity/scratch/streetboss-web/public/demos/index.html';
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  { old: 'background: linear-gradient(135deg, #E63A1E, #8B1A0A);', num: '01' },
  { old: 'background: linear-gradient(135deg, #D97706, #7C3A00);', num: '02' },
  { old: 'background: linear-gradient(135deg, #B45309, #5C2A00);', num: '03' },
  { old: 'background: linear-gradient(135deg, #06B6D4, #003A4D);', num: '04' },
  { old: 'background: linear-gradient(135deg, #7C3AED, #2D0A6E);', num: '05' },
  { old: 'background: linear-gradient(135deg, #16A34A, #052E16);', num: '06' },
  { old: 'background: linear-gradient(135deg, #92400E, #3A1A00);', num: '07' },
  { old: 'background: linear-gradient(135deg, #EAB308, #5C4400);', num: '08' },
  { old: 'background: linear-gradient(135deg, #DC2626, #5A0A0A);', num: '09' },
  { old: 'background: linear-gradient(135deg, #9F1239, #3D0015);', num: '10' },
];

replacements.forEach(r => {
  content = content.replace(r.old, `background-image: url('img/card-${r.num}.jpg'); background-size: cover; background-position: center;`);
});

fs.writeFileSync(file, content);
