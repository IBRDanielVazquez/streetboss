const fs = require('fs');
const path = require('path');

const demosDir = '/Users/danielvazquez/.gemini/antigravity/scratch/streetboss-web/public/demos';

const demos = [
  '01-taqueria-el-guero.html',
  '02-gorditas-la-dona.html',
  '03-birria-los-toritos.html',
  '04-mariscos-la-perla.html',
  '05-tamales-dona-chucha.html',
  '06-pizza-callejera-don-nacho.html',
  '07-cafe-el-molino.html',
  '08-elotes-la-chela.html',
  '09-hamburguesas-el-brutal.html',
  '10-pozoleria-la-guerrera.html',
];

demos.forEach(file => {
  const filePath = path.join(demosDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // ─────────────────────────────────────────
  // BUG 1: ÍCONO — quitar filter invert, 
  // el PNG ya tiene colores propios, no necesita invertirse
  // ─────────────────────────────────────────
  html = html.replace(
    /filter:brightness\(0\) invert\(1\)/g,
    'filter: none'
  );

  // ─────────────────────────────────────────
  // BUG 2 y 3: BOTÓN "+" 
  // Debe sumar al carrito Y LUEGO abrir WhatsApp
  // No abrir WhatsApp inmediatamente
  // Reemplazar onclick de todos los botones prod-add
  // ─────────────────────────────────────────
  // Primero eliminar cualquier onclick que abra WhatsApp directo en el +
  html = html.replace(
    /(<button class="prod-add"[^>]*?)onclick="[^"]*wa\.me[^"]*"([^>]*>)/g,
    '$1onclick="agregarAlCarrito(this)"$2'
  );

  // Si el botón + no tiene onclick, agregarlo
  html = html.replace(
    /(<button class="prod-add")(?![^>]*onclick)([^>]*>)/g,
    '$1 onclick="agregarAlCarrito(this)"$2'
  );

  // ─────────────────────────────────────────
  // BUG 3: REEMPLAZAR SCRIPT JS COMPLETO
  // Lógica correcta: + suma carrito, carrito abre WhatsApp
  // ─────────────────────────────────────────
  
  // Extraer el link de WhatsApp del archivo actual
  const waMatch = html.match(/https:\/\/wa\.me\/[^"'\s]*/);
  const waLink = waMatch ? waMatch[0] : 'https://wa.me/529610000000';

  const nuevoScript = `
  <script>
    // ── CARRITO ──────────────────────────────
    let count = 0;
    let items = [];

    function agregarAlCarrito(btn) {
      count++;
      const card = btn.closest('.product-card');
      const nombre = card.querySelector('.prod-name').textContent;
      const precio = card.querySelector('.prod-price').textContent;
      items.push(nombre);

      // Feedback visual en el botón
      btn.textContent = '✓';
      btn.style.transform = 'scale(1.2)';
      setTimeout(() => {
        btn.textContent = '+';
        btn.style.transform = 'scale(1)';
      }, 600);

      // Mostrar carrito
      const cartBar = document.getElementById('cart-bar');
      const cartCount = document.getElementById('cart-count');
      if (cartBar) {
        cartBar.style.display = 'block';
        if (cartCount) cartCount.textContent = count;
      }
    }

    function abrirWhatsApp() {
      const resumen = items.join(', ');
      const waMatch = '${waLink}';
      const base = waMatch.split('?text=')[0];
      const msgPedido = encodeURIComponent(
        'Hola, quiero hacer un pedido:\\n' + resumen + 
        '\\n\\nTotal de productos: ' + count
      );
      window.open(base + '?text=' + msgPedido, '_blank');
    }

    // ── CATEGORÍAS ───────────────────────────
    document.addEventListener('DOMContentLoaded', function() {
      const pills = document.querySelectorAll('.cat-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', function() {
          pills.forEach(p => p.classList.remove('activa'));
          this.classList.add('activa');
          const target = this.dataset.target;
          if (target) {
            const section = document.getElementById(target);
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    });
  </script>`;

  // Reemplazar script existente o agregar antes del </body>
  if (html.includes('<script>')) {
    html = html.replace(/<script>[\s\S]*?<\/script>(\s*<\/body>)/, nuevoScript + '$1');
  } else {
    html = html.replace('</body>', nuevoScript + '\n</body>');
  }

  // ─────────────────────────────────────────
  // FIX CARRITO: asegurar id="cart-bar" y id="cart-count"
  // y que llame a abrirWhatsApp() al tocarlo
  // ─────────────────────────────────────────
  html = html.replace(
    /<div class="cart-bar"[^>]*>/,
    '<div class="cart-bar" id="cart-bar" style="display:none;" onclick="abrirWhatsApp()">'
  );

  html = html.replace(
    /🛒 Ver pedido \((\d+|X) productos?\)/,
    '🛒 Ver pedido (<span id="cart-count">0</span> productos)'
  );

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('✅ ' + file);
});

console.log('\n🔧 3 bugs corregidos en 10 demos');
