const fs = require('fs');
const path = require('path');

const demosDir = '/Users/danielvazquez/.gemini/antigravity/scratch/streetboss-web/public/demos';

// Paleta de cada demo: solo el acento cambia
const configs = [
  { file: '01-taqueria-el-guero.html',       accent: '#E63A1E', accentDark: '#A52A15', shadow: 'rgba(230,58,30,0.15)' },
  { file: '02-gorditas-la-dona.html',         accent: '#D97706', accentDark: '#B45309', shadow: 'rgba(217,119,6,0.15)'  },
  { file: '03-birria-los-toritos.html',       accent: '#B45309', accentDark: '#92400E', shadow: 'rgba(180,83,9,0.15)'   },
  { file: '04-mariscos-la-perla.html',        accent: '#06B6D4', accentDark: '#0891B2', shadow: 'rgba(6,182,212,0.15)'  },
  { file: '05-tamales-dona-chucha.html',      accent: '#7C3AED', accentDark: '#6D28D9', shadow: 'rgba(124,58,237,0.15)' },
  { file: '06-pizza-callejera-don-nacho.html',accent: '#16A34A', accentDark: '#15803D', shadow: 'rgba(22,163,74,0.15)'  },
  { file: '07-cafe-el-molino.html',           accent: '#92400E', accentDark: '#78350F', shadow: 'rgba(146,64,14,0.15)'  },
  { file: '08-elotes-la-chela.html',          accent: '#CA8A04', accentDark: '#A16207', shadow: 'rgba(202,138,4,0.15)'  },
  { file: '09-hamburguesas-el-brutal.html',   accent: '#DC2626', accentDark: '#B91C1C', shadow: 'rgba(220,38,38,0.15)'  },
  { file: '10-pozoleria-la-guerrera.html',    accent: '#9F1239', accentDark: '#881337', shadow: 'rgba(159,18,57,0.15)'  },
];

const newStyle = (accent, accentDark, shadow) => `
    <style>
        :root {
            --bg: #FFFFFF;
            --accent: ${accent};
            --accent-dark: ${accentDark};
            --text: #111111;
            --cards: #F8F8F8;
            --borders: #EEEEEE;
            --text-muted: #666666;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; background-color: #FFFFFF; color: #111111; padding-top: 130px; padding-bottom: 100px; -webkit-font-smoothing: antialiased; }
        a { text-decoration: none; color: inherit; }

        /* Top Bar */
        .top-bar { position: fixed; top: 0; left: 0; width: 100%; background-color: #FFFFFF; border-bottom: 3px solid ${accent}; z-index: 50; display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; box-shadow: 0 2px 8px ${shadow}; }
        .top-left { display: flex; align-items: center; gap: 12px; }
        .profile-pic { width: 44px; height: 44px; border-radius: 50%; background-color: ${accent}; color: #FFF; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; }
        .store-info h1 { font-size: 1.1rem; font-weight: 700; color: #111111; }
        .store-info p { font-size: 0.8rem; color: #666666; }
        .wp-icon { width: 28px; height: 28px; fill: ${accent}; cursor: pointer; }

        /* Categories */
        .categories { position: fixed; top: 77px; left: 0; width: 100%; background-color: #FFFFFF; border-bottom: 1px solid #EEEEEE; z-index: 40; padding: 10px 20px; overflow-x: auto; white-space: nowrap; display: flex; gap: 10px; scrollbar-width: none; }
        .categories::-webkit-scrollbar { display: none; }
        .cat-pill { background-color: #F8F8F8; border: 1.5px solid #EEEEEE; color: #444444; padding: 7px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .cat-pill.activa { background-color: ${accent}; border-color: ${accent}; color: #FFFFFF; font-weight: 700; }

        /* Content */
        .container { max-width: 768px; margin: 0 auto; padding: 0 20px; }
        .section-title { font-size: 1.1rem; font-weight: 700; margin: 28px 0 14px; padding-top: 8px; color: #111111; border-left: 4px solid ${accent}; padding-left: 12px; }

        /* Products */
        .product-card { background-color: #FFFFFF; border: 1.5px solid #EEEEEE; border-radius: 16px; padding: 16px; margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .prod-img-placeholder { height: 140px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: ${accent}; font-weight: 700; font-size: 0.85rem; margin-bottom: 14px; padding: 10px; background-color: #F8F8F8; border: 2px dashed ${accent}; gap: 6px; line-height: 1.4; }
        .prod-img-placeholder span.emoji { font-size: 2.5rem; line-height: 1; }
        .prod-bottom { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
        .prod-info { flex: 1; }
        .prod-name { font-weight: 700; font-size: 1rem; margin-bottom: 3px; color: #111111; }
        .prod-desc { font-size: 0.82rem; color: #666666; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .prod-price { font-weight: 700; color: ${accent}; font-size: 1.05rem; }
        .prod-add { width: 36px; height: 36px; border-radius: 50%; background-color: ${accent}; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: bold; cursor: pointer; border: none; flex-shrink: 0; box-shadow: 0 4px 10px ${shadow}; }

        /* Bottom Cart */
        .cart-bar { position: fixed; bottom: 0; left: 0; width: 100%; padding: 16px 20px; background: linear-gradient(to top, rgba(255,255,255,1) 60%, rgba(255,255,255,0)); display: none; z-index: 50; }
        .cart-btn { max-width: 768px; margin: 0 auto; background-color: ${accent}; color: #FFFFFF; padding: 16px; border-radius: 12px; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; box-shadow: 0 8px 20px ${shadow}; }

        @media (min-width: 768px) {
            .container { padding: 0 40px; }
        }
    </style>`;

configs.forEach(({ file, accent, accentDark, shadow }) => {
  const filePath = path.join(demosDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Reemplazar bloque <style> completo
  html = html.replace(/<style>[\s\S]*?<\/style>/, newStyle(accent, accentDark, shadow));
  
  // Actualizar cart-bar background en JS inline si existe
  html = html.replace(/rgba\(\d+,\d+,\d+,1\) 50%/g, 'rgba(255,255,255,1) 60%');
  html = html.replace(/rgba\(\d+,\d+,\d+,0\)/g, 'rgba(255,255,255,0)');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ ${file} actualizado`);
});

console.log('\n🎨 Paletas actualizadas en 10 demos');
