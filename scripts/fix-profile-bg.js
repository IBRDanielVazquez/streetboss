const fs = require('fs');
const path = require('path');
const dir = '/Users/danielvazquez/.gemini/antigravity/scratch/streetboss-web/public/demos';

for (let i = 1; i <= 10; i++) {
  const num = i.toString().padStart(2, '0');
  const files = fs.readdirSync(dir).filter(f => f.startsWith(num) && f.endsWith('.html'));
  if (files.length > 0) {
    const file = path.join(dir, files[0]);
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/(\.profile-pic\s*\{[^}]*)background-color:\s*var\(--accent\);/g, '$1background-color: #E5E5E5;');
    fs.writeFileSync(file, html);
  }
}
