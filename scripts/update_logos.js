const fs = require('fs');
const path = require('path');

const logosDir = '/Users/danielvazquez/.gemini/antigravity/scratch/streetboss-web/public/demos/img/logos';
const demosDir = '/Users/danielvazquez/.gemini/antigravity/scratch/streetboss-web/public/demos';

if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

const svgs = {
  '01': { color: '#E63A1E', initials: 'TG',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 15C22 10.5817 17.5228 7 12 7C6.47715 7 2 10.5817 2 15C2 16.1046 2.89543 17 4 17H20C21.1046 17 22 16.1046 22 15Z"/><path d="M6 13L8 11L10 13L12 11L14 13L16 11L18 13"/></svg>` },
  '02': { color: '#D97706', initials: 'GD',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="10" ry="6"/><path d="M4 12H20"/></svg>` },
  '03': { color: '#B45309', initials: 'BT',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6C5 6 3 9 3 11C3 13.5 5 16 8 18L12 21L16 18C19 16 21 13.5 21 11C21 9 19 6 19 6"/><path d="M5 6C5 3 8 2 8 2"/><path d="M19 6C19 3 16 2 16 2"/><path d="M9 10H15"/></svg>` },
  '04': { color: '#06B6D4', initials: 'MP',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18C16 18 19 16 19 12C19 8 15 5 11 5C7 5 5 8 5 12C5 15 8 18 12 18"/><path d="M16 18C17 20 20 21 20 21C20 21 21 19 21 17C21 15 19 14 19 14"/><path d="M12 18H8"/></svg>` },
  '05': { color: '#7C3AED', initials: 'TC',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M6 8H18"/><path d="M6 16H18"/><path d="M12 8V16"/></svg>` },
  '06': { color: '#16A34A', initials: 'PN',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L20 20H4L12 2Z"/><path d="M8 14H8.01"/><path d="M12 10H12.01"/><path d="M14 16H14.01"/></svg>` },
  '07': { color: '#92400E', initials: 'CM',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8H5V14C5 16.2091 6.79086 18 9 18H13C15.2091 18 17 16.2091 17 14V8Z"/><path d="M17 10H19C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14H17"/><path d="M9 3V5"/><path d="M13 3V5"/></svg>` },
  '08': { color: '#EAB308', initials: 'EC',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4C18 4 20 6 20 10C20 16 14 20 10 20C6 20 4 18 4 14C4 10 10 4 14 4Z"/><path d="M9 20L6 22"/><path d="M10 20L12 22"/><path d="M8 8L16 16"/><path d="M12 6L18 12"/><path d="M6 12L12 18"/></svg>` },
  '09': { color: '#DC2626', initials: 'HB',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10C5 6.13401 8.13401 3 12 3C15.866 3 19 6.13401 19 10H5Z"/><path d="M4 14H20"/><path d="M5 18H19C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18Z"/></svg>` },
  '10': { color: '#9F1239', initials: 'PG',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11H21C21 15.9706 16.9706 20 12 20C7.02944 20 3 15.9706 3 11Z"/><path d="M8 6V8"/><path d="M12 4V8"/><path d="M16 6V8"/><circle cx="10" cy="14" r="1"/><circle cx="14" cy="15" r="1"/></svg>` }
};

for (const [key, data] of Object.entries(svgs)) {
  const logoPath = path.join(logosDir, `logo-${key}.svg`);
  fs.writeFileSync(logoPath, data.content.replace('#FFFFFF', data.color)); // Actually, save with requested color!
  
  const files = fs.readdirSync(demosDir).filter(f => f.startsWith(key) && f.endsWith('.html'));
  if (files.length > 0) {
    const htmlFile = path.join(demosDir, files[0]);
    let html = fs.readFileSync(htmlFile, 'utf8');
    
    // Replace .profile-pic CSS completely
    const newCss = `.profile-pic {\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  background-color: var(--accent);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 8px;\n}`;
    html = html.replace(/\.profile-pic\s*{[^}]+}/, newCss);
    
    // Replace initials with image, using exactly the user's requested HTML
    const replacement = `<div class="profile-pic">\n  <img src="img/logos/logo-${key}.svg" alt="logo" \n  style="width:26px;height:26px;object-fit:contain; filter: brightness(0) invert(1);">\n</div>`;
    
    html = html.replace(new RegExp(`<div class="profile-pic">${data.initials}</div>`), replacement);
    fs.writeFileSync(htmlFile, html);
  }
}
