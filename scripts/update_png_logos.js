const fs = require('fs');
const path = require('path');

const srcDir = '/Users/danielvazquez/.gemini/antigravity/brain/b669664a-be78-4098-a9b2-b29bcf487703';
const destDir = '/Users/danielvazquez/.gemini/antigravity/scratch/streetboss-web/public/demos/img/logos';
const demosDir = '/Users/danielvazquez/.gemini/antigravity/scratch/streetboss-web/public/demos';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// 1. Copy generated images 1 to 7
for (let i = 1; i <= 7; i++) {
    const num = i.toString().padStart(2, '0');
    const files = fs.readdirSync(srcDir).filter(f => f.startsWith(`logo_${num}_`) && f.endsWith('.png'));
    if (files.length > 0) {
        // Sort by modified time in case there are multiple, get newest
        files.sort((a, b) => fs.statSync(path.join(srcDir, b)).mtime.getTime() - fs.statSync(path.join(srcDir, a)).mtime.getTime());
        fs.copyFileSync(path.join(srcDir, files[0]), path.join(destDir, `logo-${num}.png`));
    }
}

// 2. Update HTML files 1 to 7
for (let i = 1; i <= 7; i++) {
    const num = i.toString().padStart(2, '0');
    const files = fs.readdirSync(demosDir).filter(f => f.startsWith(num) && f.endsWith('.html'));
    if (files.length > 0) {
        const htmlFile = path.join(demosDir, files[0]);
        let html = fs.readFileSync(htmlFile, 'utf8');
        
        const replacement = `<div class="profile-pic">\n  <img src="img/logos/logo-${num}.png" alt="logo" \n  style="width:28px;height:28px;object-fit:contain;\nfilter:brightness(0) invert(1);">\n</div>`;
        
        html = html.replace(/<div class="profile-pic">[\s\S]*?<\/div>/, replacement);
        fs.writeFileSync(htmlFile, html);
    }
}
