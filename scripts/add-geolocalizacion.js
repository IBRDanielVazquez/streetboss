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

// Banner HTML que se inserta justo después del <body>
const geoBanner = `
  <!-- GEO BANNER -->
  <div id="geo-banner" style="
    background: #F8F8F8;
    border-bottom: 1px solid #EEEEEE;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-family: 'Inter', sans-serif;
    position: sticky;
    top: 130px;
    z-index: 35;
  ">
    <div style="display:flex;align-items:center;gap:8px;">
      <span id="geo-icon" style="font-size:1.2rem;">📍</span>
      <div>
        <div id="geo-text" style="font-size:0.82rem;font-weight:600;color:#111111;">
          Detectando tu ubicación...
        </div>
        <div id="geo-sub" style="font-size:0.75rem;color:#666666;margin-top:1px;">
          Para calcular el costo de envío
        </div>
      </div>
    </div>
    <button onclick="detectarUbicacion()" id="geo-btn" style="
      background: var(--accent);
      color: #FFFFFF;
      border: none;
      padding: 7px 14px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      white-space: nowrap;
    ">Detectar 📍</button>
  </div>
`;

// Script JS que se inserta antes del </body>
const geoScript = `
  <script>
    const ORIGEN_LAT = 16.7516;
    const ORIGEN_LNG = -93.1152;

    function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }

    function calcularEnvio(distanciaKm) {
      if (distanciaKm <= 1) return { costo: 'GRATIS', emoji: '🟢', color: '#16A34A', mensaje: 'Estás muy cerca' };
      if (distanciaKm <= 3) return { costo: '$20 MXN', emoji: '🟡', color: '#D97706', mensaje: 'Entrega disponible' };
      if (distanciaKm <= 5) return { costo: '$40 MXN', emoji: '🟠', color: '#EA580C', mensaje: 'Entrega disponible' };
      return { costo: null, emoji: '🔴', color: '#DC2626', mensaje: 'Fuera del rango de entrega' };
    }

    function detectarUbicacion() {
      const btn = document.getElementById('geo-btn');
      const texto = document.getElementById('geo-text');
      const sub = document.getElementById('geo-sub');
      const icono = document.getElementById('geo-icon');

      btn.textContent = 'Detectando...';
      btn.disabled = true;
      texto.textContent = 'Obteniendo tu ubicación...';

      if (!navigator.geolocation) {
        texto.textContent = 'Tu navegador no soporta geolocalización';
        btn.textContent = 'Reintentar';
        btn.disabled = false;
        return;
      }

      navigator.geolocation.getCurrentPosition(
        function(position) {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const distancia = calcularDistanciaKm(ORIGEN_LAT, ORIGEN_LNG, userLat, userLng);
          const envio = calcularEnvio(distancia);

          icono.textContent = envio.emoji;

          if (envio.costo === null) {
            texto.textContent = '😔 ' + envio.mensaje;
            texto.style.color = envio.color;
            sub.textContent = 'Estás a ' + distancia.toFixed(1) + ' km — máximo 5 km';
            btn.style.display = 'none';
          } else if (envio.costo === 'GRATIS') {
            texto.textContent = '🎉 Envío GRATIS para ti';
            texto.style.color = envio.color;
            sub.textContent = 'Estás a ' + distancia.toFixed(1) + ' km · ' + envio.mensaje;
            btn.style.display = 'none';
          } else {
            texto.textContent = 'Envío ' + envio.costo;
            texto.style.color = envio.color;
            sub.textContent = 'Estás a ' + distancia.toFixed(1) + ' km · ' + envio.mensaje;
            btn.style.display = 'none';
          }

          // Actualizar carrito con costo de envío
          const cartBtn = document.querySelector('.cart-btn');
          if (cartBtn && envio.costo && envio.costo !== 'GRATIS') {
            cartBtn.dataset.envio = envio.costo;
          }
        },
        function(error) {
          texto.textContent = 'No pudimos detectar tu ubicación';
          sub.textContent = 'Activa el GPS e intenta de nuevo';
          btn.textContent = 'Reintentar 📍';
          btn.disabled = false;
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    }

    // Detectar automáticamente al cargar la página
    window.addEventListener('load', function() {
      setTimeout(detectarUbicacion, 1500);
    });
  </script>
`;

demos.forEach(file => {
  const filePath = path.join(demosDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Insertar banner después del <body>
  if (!html.includes('geo-banner')) {
    html = html.replace('<body>', '<body>\n' + geoBanner);
  }

  // Ajustar padding-top del body para compensar el banner
  html = html.replace('padding-top: 130px', 'padding-top: 185px');

  // Insertar script antes del </body>
  if (!html.includes('ORIGEN_LAT')) {
    html = html.replace('</body>', geoScript + '\n</body>');
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('✅ ' + file);
});

console.log('\n📍 Geolocalización agregada a 10 demos');
