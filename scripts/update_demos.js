const fs = require('fs');
const path = require('path');

const dir = '/Users/danielvazquez/.gemini/antigravity/scratch/streetboss-web/public/demos';
const files = fs.readdirSync(dir).filter(f => f.match(/^0\d.*\.html$/));

const emojis = {
  '01': { 'Tacos': '🌮', 'Quesadillas': '🫓', 'Bebidas': '🥤', 'Extras': '🥑' },
  '02': { 'Gorditas': '🫓', 'Sopas': '🍲', 'Bebidas': '☕', 'Antojitos': '🍽️' },
  '03': { 'Tacos': '🌮', 'Quesabirria': '🧀', 'Consomé': '🍲', 'Bebidas': '🍺' },
  '04': { 'Tostadas': '🦐', 'Cocteles': '🍹', 'Tacos': '🌮', 'Bebidas': '🍺' },
  '05': { 'Tamales': '🫔', 'Bebidas calientes': '☕', 'Dulces': '🍮', 'Combos': '📦' },
  '06': { 'Rebanadas': '🍕', 'Pizzas completas': '🍕', 'Bebidas': '🥤', 'Extras': '🧄' },
  '07': { 'Cafés': '☕', 'Tés': '🍵', 'Panes': '🥐', 'Desayunos': '🍳' },
  '08': { 'Elotes': '🌽', 'Esquites': '🌽', 'Preparados': '✨', 'Bebidas': '🥤' },
  '09': { 'Hamburguesas': '🍔', 'Papas': '🍟', 'Bebidas': '🥤', 'Extras': '🥓' },
  '10': { 'Pozole': '🍜', 'Tostadas': '🫓', 'Bebidas': '🍺', 'Extras': '🍋' }
};

files.forEach(f => {
  let content = fs.readFileSync(path.join(dir, f), 'utf8');
  
  // Replace CSS
  content = content.replace(
    /background: linear-gradient\(135deg, var\(--accent\), var\(--accent-dark\)\);/g, 
    'background-color: var(--cards); border: 2px solid var(--accent);'
  );
  content = content.replace(
    /color: #FFF; font-weight: 700; font-size: 1\.2rem;/g, 
    'color: var(--accent); font-weight: 700; font-size: 1rem;'
  );

  // Replace emojis based on section
  const fileId = f.substring(0, 2);
  const map = emojis[fileId];
  
  let updatedContent = '';
  let currentCategory = '';
  
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check for category header
    const catMatch = line.match(/<h2[^>]*class="section-title"[^>]*>(.*?)<\/h2>/);
    if (catMatch) {
      currentCategory = catMatch[1];
    }
    
    // Check for prod-img-placeholder
    const imgMatch = line.match(/<div class="prod-img-placeholder">(.*?)<\/div>/);
    if (imgMatch && currentCategory && map[currentCategory]) {
      const productName = imgMatch[1];
      const emoji = map[currentCategory];
      line = line.replace(`>${productName}<`, `>${emoji}<br>${productName}<`);
    }
    
    updatedContent += line + '\n';
  }
  
  fs.writeFileSync(path.join(dir, f), updatedContent.replace(/\n$/, ''));
  console.log('Updated ' + f);
});
