const fs = require('fs');
const dir = '/Users/danielvazquez/.gemini/antigravity/scratch/streetboss-web/public/demos';
fs.readdirSync(dir).forEach(file => {
  if(file.endsWith('.html') && file !== 'index.html') {
    let content = fs.readFileSync(dir + '/' + file, 'utf8');
    content = content.replace(/529612466224/g, '529612466204');
    fs.writeFileSync(dir + '/' + file, content);
  }
});
