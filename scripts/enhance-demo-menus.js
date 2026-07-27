const fs = require('fs');
const path = require('path');

const demosDir = path.join(__dirname, 'public', 'demos');
const files = fs
  .readdirSync(demosDir)
  .filter((file) => /^\d{2}-.*\.html$/.test(file) && !file.startsWith('01-'));

const firstDemoFile = path.join(demosDir, '01-taqueria-el-guero.html');

const premiumCss = `

        /* StreetBoss premium food-app layer */
        body {
            background: #F3F4F8;
            padding-top: 168px;
            padding-bottom: 118px;
        }
        .top-bar {
            border-bottom: 0;
            border-radius: 0 0 26px 26px;
            padding: 14px 20px 18px;
            box-shadow: 0 14px 30px rgba(17, 17, 17, 0.08);
        }
        .store-info h1 {
            letter-spacing: 0;
        }
        .store-info p::before {
            content: "Abierto ahora · ";
            color: var(--accent);
            font-weight: 800;
        }
        .categories {
            top: 76px;
            background: rgba(243, 244, 248, 0.94);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 0;
            padding: 14px 18px 12px;
        }
        .cat-pill {
            background: #FFFFFF;
            border: 1px solid rgba(17, 17, 17, 0.08);
            border-radius: 999px;
            box-shadow: 0 8px 18px rgba(17, 17, 17, 0.06);
            color: #222222;
            font-weight: 800;
        }
        .cat-pill.activa {
            box-shadow: 0 10px 22px color-mix(in srgb, var(--accent) 24%, transparent);
        }
        #geo-banner {
            top: 132px !important;
            background: #FFFFFF !important;
            border: 0 !important;
            border-radius: 22px !important;
            margin: 0 16px 12px !important;
            box-shadow: 0 10px 26px rgba(17, 17, 17, 0.08);
        }
        .container {
            padding: 0 14px;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            align-items: start;
        }
        .section-title {
            grid-column: 1 / -1;
            border-left: 0;
            padding-left: 2px;
            margin: 22px 0 2px;
            font-size: 1.18rem;
            letter-spacing: 0;
        }
        .section-title::after {
            content: "  · Popular";
            color: var(--accent);
            font-size: 0.78rem;
            font-weight: 800;
        }
        .product-card {
            position: relative;
            border: 0;
            border-radius: 24px;
            overflow: hidden;
            padding: 0;
            margin-bottom: 0;
            background: #FFFFFF;
            box-shadow: 0 14px 34px rgba(17, 17, 17, 0.10);
            min-width: 0;
        }
        .product-card::before {
            content: "Street pick";
            position: absolute;
            top: 12px;
            left: 12px;
            z-index: 2;
            background: color-mix(in srgb, var(--accent) 92%, #ffffff 8%);
            color: #FFFFFF;
            border-radius: 999px;
            padding: 5px 8px;
            font-size: 0.62rem;
            font-weight: 900;
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
        }
        .product-card:nth-of-type(even)::before {
            content: "Favorito";
            background: #111111;
        }
        .prod-img {
            height: 132px;
            border-radius: 0;
            margin-bottom: 0;
        }
        .prod-img-placeholder {
            height: 132px;
            border: 0;
            border-radius: 0;
            margin-bottom: 0;
            background: linear-gradient(135deg, #111111, var(--accent));
            color: #FFFFFF;
        }
        .prod-bottom {
            display: block;
            padding: 10px 10px 58px;
            min-height: 168px;
        }
        .prod-name {
            font-size: 0.92rem;
            line-height: 1.2;
            letter-spacing: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .prod-desc {
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin: 5px 0 8px;
            line-height: 1.35;
            color: #7A7A82;
            font-size: 0.78rem;
        }
        .prod-price {
            font-size: 1.05rem;
        }
        .prod-add {
            position: absolute;
            right: 10px;
            bottom: 10px;
            width: 42px;
            height: 42px;
            font-size: 1.42rem;
            box-shadow: 0 10px 22px color-mix(in srgb, var(--accent) 34%, transparent);
        }
        .prod-actions {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 8px;
        }
        .prod-more {
            border: 0;
            background: #F3F4F8;
            color: #111111;
            border-radius: 999px;
            padding: 8px 10px;
            font-size: 0.74rem;
            font-weight: 900;
            cursor: pointer;
            font-family: inherit;
        }
        .cart-bar {
            padding: 14px 18px calc(18px + env(safe-area-inset-bottom));
            background: linear-gradient(to top, rgba(243,244,248,1) 65%, rgba(243,244,248,0));
        }
        .cart-btn {
            max-width: 520px;
            border-radius: 18px;
            padding: 15px 16px;
            justify-content: space-between;
            box-shadow: 0 16px 36px color-mix(in srgb, var(--accent) 32%, transparent);
        }
        .cart-btn::after {
            content: "Revisar";
            background: rgba(255,255,255,0.2);
            border-radius: 999px;
            padding: 7px 10px;
            font-size: 0.78rem;
        }
        .sb-sheet {
            position: fixed;
            inset: 0;
            z-index: 120;
            display: none;
            align-items: flex-end;
            background: rgba(0,0,0,0.55);
        }
        .sb-sheet.visible {
            display: flex;
        }
        .sb-panel {
            width: 100%;
            max-height: 88vh;
            overflow-y: auto;
            background: #FFFFFF;
            border-radius: 28px 28px 0 0;
            padding: 12px 18px calc(28px + env(safe-area-inset-bottom));
            box-shadow: 0 -20px 50px rgba(0,0,0,0.2);
        }
        .sb-handle {
            width: 44px;
            height: 5px;
            border-radius: 999px;
            background: #E5E7EB;
            margin: 0 auto 16px;
        }
        .sb-detail-img {
            width: 100%;
            height: 240px;
            object-fit: cover;
            border-radius: 22px;
            margin-bottom: 16px;
        }
        .sb-title-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 14px;
            margin-bottom: 8px;
        }
        .sb-title {
            font-size: 1.26rem;
            font-weight: 900;
            line-height: 1.15;
            color: #111111;
        }
        .sb-price {
            flex-shrink: 0;
            color: var(--accent);
            font-weight: 900;
            font-size: 1.18rem;
        }
        .sb-meta {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin: 12px 0;
        }
        .sb-pill {
            background: #F3F4F8;
            color: #444444;
            border-radius: 999px;
            padding: 7px 10px;
            font-size: 0.76rem;
            font-weight: 800;
        }
        .sb-desc {
            color: #5F6368;
            line-height: 1.55;
            font-size: 0.95rem;
            margin: 10px 0 16px;
        }
        .sb-panel-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .sb-secondary,
        .sb-primary {
            border: 0;
            border-radius: 16px;
            padding: 14px 16px;
            font-family: inherit;
            font-weight: 900;
            cursor: pointer;
        }
        .sb-secondary {
            background: #F3F4F8;
            color: #111111;
        }
        .sb-primary {
            background: var(--accent);
            color: #FFFFFF;
        }
        .sb-cart-list {
            display: grid;
            gap: 10px;
            margin: 14px 0;
        }
        .sb-cart-item {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: center;
            background: #F7F7F9;
            border-radius: 18px;
            padding: 12px;
        }
        .sb-cart-name {
            font-weight: 900;
            color: #111111;
            margin-bottom: 3px;
        }
        .sb-cart-sub {
            color: #777777;
            font-size: 0.82rem;
        }
        .sb-qty {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #FFFFFF;
            border-radius: 999px;
            padding: 5px;
        }
        .sb-qty button {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 0;
            background: #111111;
            color: #FFFFFF;
            font-weight: 900;
            cursor: pointer;
        }
        .sb-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #EEEEEE;
            padding-top: 14px;
            margin-top: 12px;
            font-weight: 900;
            font-size: 1.1rem;
        }
        .sb-shipping-note {
            background: #FFF7ED;
            border: 1px solid #FED7AA;
            color: #9A3412;
            border-radius: 16px;
            padding: 12px;
            font-size: 0.86rem;
            line-height: 1.45;
            font-weight: 700;
            margin-top: 12px;
        }
        .sb-form {
            display: grid;
            gap: 10px;
            margin-top: 16px;
        }
        .sb-form-title {
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #666666;
            font-weight: 900;
        }
        .sb-field {
            width: 100%;
            border: 1.5px solid #E5E7EB;
            border-radius: 14px;
            padding: 12px 13px;
            font-family: inherit;
            font-size: 0.9rem;
            outline: none;
            background: #FFFFFF;
            color: #111111;
        }
        .sb-field:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent);
        }
        .sb-location-tools {
            display: grid;
            gap: 8px;
        }
        .sb-location-btn {
            border: 0;
            background: #111111;
            color: #FFFFFF;
            border-radius: 14px;
            padding: 12px 13px;
            font-family: inherit;
            font-size: 0.86rem;
            font-weight: 900;
            cursor: pointer;
        }
        .sb-location-status {
            color: #666666;
            font-size: 0.78rem;
            line-height: 1.35;
        }
        .sb-map-link {
            display: none;
            color: var(--accent);
            font-weight: 900;
            font-size: 0.82rem;
            text-decoration: none;
        }
        .sb-map-fallback {
            display: grid;
            gap: 8px;
            padding-top: 2px;
        }
        .sb-map-open {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 14px;
            padding: 11px 13px;
            background: #F3F4F8;
            color: #111111;
            font-weight: 900;
            font-size: 0.84rem;
            text-decoration: none;
        }
        @media (min-width: 720px) {
            .container { max-width: 920px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .product-card {
                display: block;
            }
            .prod-img,
            .prod-img-placeholder {
                height: 150px;
                min-height: 150px;
            }
            .sb-panel {
                max-width: 560px;
                margin: 0 auto;
                border-radius: 28px 28px 0 0;
            }
        }
        @media (min-width: 1024px) {
            .container { max-width: 1080px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
`;

const premiumJs = `
  <script>
    // StreetBoss premium food-app behavior
    (function() {
      const money = (value) => '$' + value.toFixed(2).replace(/\\.00$/, '');
      const cart = new Map();
      const sbLocation = { lat: null, lng: null, address: '', maps: '' };
      const iconMap = [
        ['gordita', '🫓'], ['sopa', '🍲'], ['bebida', '🥤'], ['antojito', '🇲🇽'],
        ['birria', '🍲'], ['consom', '🍜'], ['orden', '🔥'], ['quesabirria', '🧀'],
        ['marisco', '🦐'], ['taco', '🌮'], ['tostada', '🌊'],
        ['tamal', '🫔'], ['combo', '🎁'], ['pan', '🍞'], ['dulce', '🍰'],
        ['pizza', '🍕'], ['rebanada', '🍕'], ['extra', '➕'],
        ['cafe', '☕'], ['café', '☕'], ['desayuno', '🍳'],
        ['elote', '🌽'], ['esquite', '🌽'],
        ['hamburguesa', '🍔'], ['burger', '🍔'], ['papas', '🍟'],
        ['pozole', '🍜']
      ];

      function parsePrice(text) {
        const num = String(text || '').replace(/[^0-9.]/g, '');
        return Number(num || 0);
      }

      function getProduct(btn) {
        const card = btn.closest('.product-card');
        return {
          card,
          name: card.querySelector('.prod-name')?.textContent.trim() || 'Producto',
          desc: card.querySelector('.prod-desc')?.textContent.trim() || 'Preparado al momento',
          priceText: card.querySelector('.prod-price')?.textContent.trim() || '$0',
          price: parsePrice(card.querySelector('.prod-price')?.textContent),
          img: card.querySelector('.prod-img')?.getAttribute('src') || '',
          section: card.previousElementSibling?.classList?.contains('section-title')
            ? card.previousElementSibling.textContent.trim()
            : card.closest('.container')?.querySelector('.section-title')?.textContent.trim() || 'Especialidad'
        };
      }

      function flash(btn) {
        const old = btn.textContent;
        btn.textContent = '✓';
        btn.style.background = '#16A34A';
        btn.style.transform = 'scale(1.08)';
        setTimeout(() => {
          btn.textContent = old || '+';
          btn.style.background = 'var(--accent)';
          btn.style.transform = 'scale(1)';
        }, 650);
      }

      function updateCartBar() {
        const count = Array.from(cart.values()).reduce((acc, item) => acc + item.qty, 0);
        const total = Array.from(cart.values()).reduce((acc, item) => acc + item.qty * item.price, 0);
        const bar = document.getElementById('cart-bar');
        const countEl = document.getElementById('cart-count');
        const text = document.getElementById('cartText');
        if (countEl) countEl.textContent = count;
        if (text) text.innerHTML = '🛒 Ver pedido (<span id="cart-count">' + count + '</span> productos) · ' + money(total);
        if (bar) bar.style.display = count > 0 ? 'block' : 'none';
      }

      window.sbAddProduct = function(btn) {
        const product = getProduct(btn);
        const current = cart.get(product.name) || { ...product, qty: 0 };
        current.qty += 1;
        cart.set(product.name, current);
        flash(btn);
        updateCartBar();
      };

      window.add = function() {
        const btn = window.event?.currentTarget || window.event?.target;
        if (btn) window.sbAddProduct(btn);
      };

      window.scrollToCat = function(id, pill) {
        document.querySelectorAll('.cat-pill').forEach((item) => item.classList.remove('activa'));
        pill?.classList.add('activa');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      window.sbChangeQty = function(name, delta) {
        const item = cart.get(name);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) cart.delete(name);
        renderCart();
        updateCartBar();
      };

      function ingredients(product) {
        const base = product.desc.replace(/\\.$/, '');
        return [
          base,
          'Preparado al momento',
          'Puedes pedir notas especiales al enviar el pedido'
        ].filter(Boolean).join(' · ');
      }

      window.sbShowProduct = function(btn) {
        const product = getProduct(btn);
        const detail = document.getElementById('sb-detail-sheet');
        if (!detail) return;
        detail.querySelector('.sb-detail-img').src = product.img;
        detail.querySelector('.sb-title').textContent = product.name;
        detail.querySelector('.sb-price').textContent = product.priceText;
        detail.querySelector('.sb-desc').textContent = ingredients(product);
        detail.querySelector('.sb-primary').onclick = function() {
          window.sbAddProduct(product.card.querySelector('.prod-add'));
          detail.classList.remove('visible');
        };
        detail.classList.add('visible');
      };

      function renderCart() {
        const sheet = document.getElementById('sb-cart-sheet');
        if (!sheet) return;
        const list = sheet.querySelector('.sb-cart-list');
        const total = Array.from(cart.values()).reduce((acc, item) => acc + item.qty * item.price, 0);
        list.innerHTML = Array.from(cart.values()).map((item) => (
          '<div class="sb-cart-item">' +
            '<div><div class="sb-cart-name">' + item.name + '</div><div class="sb-cart-sub">' + item.priceText + ' · ' + item.desc + '</div></div>' +
            '<div class="sb-qty"><button onclick="sbChangeQty(\\'' + item.name.replace(/'/g, "\\\\'") + '\\', -1)">−</button><strong>' + item.qty + '</strong><button onclick="sbChangeQty(\\'' + item.name.replace(/'/g, "\\\\'") + '\\', 1)">+</button></div>' +
          '</div>'
        )).join('') || '<p class="sb-desc">Tu carrito está vacío.</p>';
        sheet.querySelector('.sb-total strong').textContent = money(total);
        const subtotalLabel = sheet.querySelector('#sb-subtotal-label');
        if (subtotalLabel) subtotalLabel.textContent = money(total);
      }

      window.sbOpenCart = function() {
        renderCart();
        document.getElementById('sb-cart-sheet')?.classList.add('visible');
      };

      async function sbReverseGeocode(lat, lng) {
        try {
          const res = await fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&accept-language=es');
          const data = await res.json();
          return data.display_name || ('Lat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6));
        } catch (error) {
          return 'Lat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6);
        }
      }

      window.sbUseCurrentLocation = function() {
        const status = document.getElementById('sb-location-status');
        const btn = document.getElementById('sb-location-btn');
        const address = document.getElementById('sb-address');
        const link = document.getElementById('sb-map-link');
        const pastedMap = document.getElementById('sb-map-url');
        if (!window.isSecureContext) {
          if (status) status.textContent = 'La ubicación automática solo funciona abriendo el demo desde https://streetboss-web.vercel.app. Si estás en file://, pega el link de Maps abajo.';
          return;
        }
        if (!navigator.geolocation) {
          if (status) status.textContent = 'Este navegador no permite capturar GPS. Abre en Safari/Chrome o pega el link de Google Maps abajo.';
          return;
        }
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Detectando ubicación...';
        }
        if (status) status.textContent = 'Abriendo GPS para capturar la ubicación del cliente.';
        navigator.geolocation.getCurrentPosition(async function(pos) {
          sbLocation.lat = pos.coords.latitude;
          sbLocation.lng = pos.coords.longitude;
          sbLocation.maps = 'https://www.google.com/maps?q=' + sbLocation.lat + ',' + sbLocation.lng;
          sbLocation.address = await sbReverseGeocode(sbLocation.lat, sbLocation.lng);
          if (address) address.value = sbLocation.address;
          if (link) {
            link.href = sbLocation.maps;
            link.style.display = 'inline-block';
          }
          if (pastedMap) pastedMap.value = sbLocation.maps;
          if (status) status.textContent = 'Ubicación capturada. Revisa o ajusta la dirección antes de enviar.';
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Actualizar ubicación en Maps';
          }
        }, function(error) {
          let reason = 'No se pudo capturar la ubicación.';
          if (error && error.code === 1) reason = 'Permiso de ubicación bloqueado.';
          if (error && error.code === 2) reason = 'El GPS no entregó ubicación disponible.';
          if (error && error.code === 3) reason = 'La ubicación tardó demasiado en responder.';
          if (status) status.textContent = reason + ' Activa permisos de ubicación o pega el link de Google Maps abajo.';
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Usar mi ubicación en Maps';
          }
        }, { enableHighAccuracy: true, timeout: 12000 });
      };

      window.sbSendWhatsApp = function() {
        const store = document.querySelector('.store-info h1')?.textContent.trim() || 'StreetBoss';
        const lines = Array.from(cart.values()).map((item) => item.qty + ' x ' + item.name + ' - ' + money(item.qty * item.price));
        const total = Array.from(cart.values()).reduce((acc, item) => acc + item.qty * item.price, 0);
        const nombre = document.getElementById('sb-customer-name')?.value.trim() || 'No especificado';
        const telefono = document.getElementById('sb-customer-phone')?.value.trim() || 'No especificado';
        const direccion = document.getElementById('sb-address')?.value.trim() || 'No especificada';
        const referencias = document.getElementById('sb-reference')?.value.trim() || 'Sin referencias';
        const mapsInput = document.getElementById('sb-map-url')?.value.trim();
        const maps = mapsInput || sbLocation.maps || 'No capturada';
        const msg = encodeURIComponent(
          'Hola, quiero hacer un pedido en ' + store + ':\\n\\n' +
          '*Cliente:* ' + nombre + '\\n' +
          '*Teléfono:* ' + telefono + '\\n\\n' +
          '*Productos:*\\n' + lines.join('\\n') + '\\n\\n' +
          '*Subtotal:* ' + money(total) + '\\n' +
          '*Envío:* Pendiente de confirmar\\n' +
          '*Total final:* Pendiente de envío\\n\\n' +
          '*Dirección:* ' + direccion + '\\n' +
          '*Referencias:* ' + referencias + '\\n' +
          '*Ubicación Maps:* ' + maps + '\\n\\n' +
          'Quedo pendiente del costo de envío para confirmar el total.'
        );
        window.open('https://wa.me/529612466204?text=' + msg, '_blank');
      };

      window.abrirWhatsApp = window.sbOpenCart;
      window.openWp = window.sbOpenCart;

      document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.cat-pill').forEach((pill) => {
          const text = pill.textContent.trim();
          const lower = text.toLowerCase();
          const icon = iconMap.find(([key]) => lower.includes(key))?.[1] || '🍽️';
          if (!text.startsWith(icon)) pill.textContent = icon + ' ' + text;
        });

        document.querySelectorAll('.prod-add').forEach((btn) => {
          btn.setAttribute('onclick', 'sbAddProduct(this)');
          btn.setAttribute('aria-label', 'Agregar al carrito');
        });

        document.querySelectorAll('.product-card').forEach((card) => {
          if (card.querySelector('.prod-more')) return;
          const info = card.querySelector('.prod-info') || card.querySelector('.prod-body');
          const more = document.createElement('button');
          more.className = 'prod-more';
          more.type = 'button';
          more.textContent = 'Ver más';
          more.setAttribute('onclick', 'sbShowProduct(this)');
          const actions = document.createElement('div');
          actions.className = 'prod-actions';
          actions.appendChild(more);
          info?.appendChild(actions);
        });

        const cartBar = document.getElementById('cart-bar');
        if (cartBar) cartBar.setAttribute('onclick', 'sbOpenCart()');
        document.querySelector('.cart-btn')?.removeAttribute('onclick');

        if (!document.getElementById('sb-detail-sheet')) {
          document.body.insertAdjacentHTML('beforeend', '<div class="sb-sheet" id="sb-detail-sheet" onclick="if(event.target===this)this.classList.remove(\\'visible\\')"><div class="sb-panel"><div class="sb-handle"></div><img class="sb-detail-img" alt=""><div class="sb-title-row"><div class="sb-title"></div><div class="sb-price"></div></div><div class="sb-meta"><span class="sb-pill">⭐ Recomendado</span><span class="sb-pill">⏱ 15-25 min</span><span class="sb-pill">🔥 Hecho al momento</span></div><p class="sb-desc"></p><div class="sb-panel-actions"><button class="sb-secondary" type="button" onclick="document.getElementById(\\'sb-detail-sheet\\').classList.remove(\\'visible\\')">Cerrar</button><button class="sb-primary" type="button">Agregar</button></div></div></div>');
        }
        if (!document.getElementById('sb-cart-sheet')) {
          document.body.insertAdjacentHTML('beforeend', '<div class="sb-sheet" id="sb-cart-sheet" onclick="if(event.target===this)this.classList.remove(\\'visible\\')"><div class="sb-panel"><div class="sb-handle"></div><div class="sb-title-row"><div><div class="sb-title">Tu pedido</div><p class="sb-desc">Revisa productos, captura datos y envíalo por WhatsApp.</p></div></div><div class="sb-cart-list"></div><div class="sb-total"><span>Subtotal</span><strong id="sb-subtotal-label">$0</strong></div><div class="sb-shipping-note"><strong>Subtotal pendiente de envío.</strong><br>El restaurante confirmará el costo de envío por WhatsApp antes de cerrar el total.</div><div class="sb-form"><div class="sb-form-title">Datos para entrega</div><input id="sb-customer-name" class="sb-field" type="text" placeholder="Nombre del cliente" autocomplete="name"><input id="sb-customer-phone" class="sb-field" type="tel" placeholder="Teléfono" autocomplete="tel"><textarea id="sb-address" class="sb-field" rows="2" placeholder="Dirección de entrega"></textarea><input id="sb-reference" class="sb-field" type="text" placeholder="Referencias: color de casa, esquina, local, etc."><div class="sb-location-tools"><button id="sb-location-btn" class="sb-location-btn" type="button" onclick="sbUseCurrentLocation()">Usar mi ubicación en Maps</button><div id="sb-location-status" class="sb-location-status">Puedes capturar GPS o escribir la dirección manualmente.</div><a id="sb-map-link" class="sb-map-link" target="_blank" rel="noreferrer">Ver ubicación capturada en Maps</a><div class="sb-map-fallback"><a class="sb-map-open" href="https://www.google.com/maps/search/?api=1&query=Mi%20ubicaci%C3%B3n" target="_blank" rel="noreferrer">Abrir Google Maps</a><input id="sb-map-url" class="sb-field" type="url" placeholder="Pegar link de Google Maps si el GPS no abre"></div></div></div><div class="sb-panel-actions" style="margin-top:16px;"><button class="sb-secondary" type="button" onclick="document.getElementById(\\'sb-cart-sheet\\').classList.remove(\\'visible\\')">Seguir viendo</button><button class="sb-primary" type="button" onclick="sbSendWhatsApp()">Enviar pedido</button></div></div></div>');
        }
      });
    })();
  </script>
`;

const detailOnlyCss = `

/* StreetBoss product detail layer */
.prod-actions { display:flex; align-items:center; gap:8px; margin-top:8px; }
.prod-more {
  border:0;
  background:#F3F4F8;
  color:#111111;
  border-radius:999px;
  padding:8px 11px;
  font-size:0.74rem;
  font-weight:900;
  cursor:pointer;
  font-family:inherit;
}
.sb-sheet {
  position:fixed;
  inset:0;
  z-index:120;
  display:none;
  align-items:flex-end;
  background:rgba(0,0,0,0.55);
}
.sb-sheet.visible { display:flex; }
.sb-panel {
  width:100%;
  max-height:88vh;
  overflow-y:auto;
  background:#FFFFFF;
  border-radius:28px 28px 0 0;
  padding:12px 18px calc(28px + env(safe-area-inset-bottom));
  box-shadow:0 -20px 50px rgba(0,0,0,0.2);
}
.sb-handle {
  width:44px;
  height:5px;
  border-radius:999px;
  background:#E5E7EB;
  margin:0 auto 16px;
}
.sb-detail-img {
  width:100%;
  height:240px;
  object-fit:cover;
  border-radius:22px;
  margin-bottom:16px;
}
.sb-title-row {
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:14px;
  margin-bottom:8px;
}
.sb-title {
  font-size:1.26rem;
  font-weight:900;
  line-height:1.15;
  color:#111111;
}
.sb-price {
  flex-shrink:0;
  color:var(--accent);
  font-weight:900;
  font-size:1.18rem;
}
.sb-meta { display:flex; gap:8px; flex-wrap:wrap; margin:12px 0; }
.sb-pill {
  background:#F3F4F8;
  color:#444444;
  border-radius:999px;
  padding:7px 10px;
  font-size:0.76rem;
  font-weight:800;
}
.sb-desc {
  color:#5F6368;
  line-height:1.55;
  font-size:0.95rem;
  margin:10px 0 16px;
}
.sb-panel-actions {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
}
.sb-secondary,
.sb-primary {
  border:0;
  border-radius:16px;
  padding:14px 16px;
  font-family:inherit;
  font-weight:900;
  cursor:pointer;
}
.sb-secondary { background:#F3F4F8; color:#111111; }
.sb-primary { background:var(--accent); color:#FFFFFF; }
@media (min-width:720px) {
  .sb-panel { max-width:560px; margin:0 auto; }
}
`;

const detailOnlyJs = `
<script>
  // StreetBoss product detail behavior
  (function() {
    function getProduct(btn) {
      const card = btn.closest('.product-card');
      return {
        card,
        name: card.querySelector('.prod-name')?.textContent.trim() || 'Producto',
        desc: card.querySelector('.prod-desc')?.textContent.trim() || 'Preparado al momento',
        priceText: card.querySelector('.prod-price')?.textContent.trim() || '$0',
        img: card.querySelector('.prod-img')?.getAttribute('src') || ''
      };
    }

    window.sbShowProduct = function(btn) {
      const product = getProduct(btn);
      const detail = document.getElementById('sb-detail-sheet');
      if (!detail) return;
      detail.querySelector('.sb-detail-img').src = product.img;
      detail.querySelector('.sb-title').textContent = product.name;
      detail.querySelector('.sb-price').textContent = product.priceText;
      detail.querySelector('.sb-desc').textContent = product.desc.replace(/\\.$/, '') + ' · Preparado al momento · Puedes pedir notas especiales al enviar el pedido';
      detail.querySelector('.sb-primary').onclick = function() {
        product.card.querySelector('.prod-add')?.click();
        detail.classList.remove('visible');
      };
      detail.classList.add('visible');
    };

    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('.product-card').forEach((card) => {
        if (card.querySelector('.prod-more')) return;
        const body = card.querySelector('.prod-body') || card.querySelector('.prod-info');
        const more = document.createElement('button');
        more.className = 'prod-more';
        more.type = 'button';
        more.textContent = 'Ver más';
        more.setAttribute('onclick', 'sbShowProduct(this)');
        const actions = document.createElement('div');
        actions.className = 'prod-actions';
        actions.appendChild(more);
        body?.appendChild(actions);
      });
      if (!document.getElementById('sb-detail-sheet')) {
        document.body.insertAdjacentHTML('beforeend', '<div class="sb-sheet" id="sb-detail-sheet" onclick="if(event.target===this)this.classList.remove(\\'visible\\')"><div class="sb-panel"><div class="sb-handle"></div><img class="sb-detail-img" alt=""><div class="sb-title-row"><div class="sb-title"></div><div class="sb-price"></div></div><div class="sb-meta"><span class="sb-pill">⭐ Recomendado</span><span class="sb-pill">⏱ 15-25 min</span><span class="sb-pill">🔥 Hecho al momento</span></div><p class="sb-desc"></p><div class="sb-panel-actions"><button class="sb-secondary" type="button" onclick="document.getElementById(\\'sb-detail-sheet\\').classList.remove(\\'visible\\')">Cerrar</button><button class="sb-primary" type="button">Agregar</button></div></div></div>');
      }
    });
  })();
</script>
`;

if (fs.existsSync(firstDemoFile)) {
  let html = fs.readFileSync(firstDemoFile, 'utf8');
  html = html.replace(/\/\* StreetBoss product detail layer \*\/[\s\S]*?(?=\s*<\/style>)/, '');
  html = html.replace(/\s*<script>\s*\/\/ StreetBoss product detail behavior[\s\S]*?<\/script>\s*(?=<\/body>)/, '\n');
  html = html.replace('</style>', () => `${detailOnlyCss}\n</style>`);
  html = html.replace('</body>', () => `${detailOnlyJs}\n</body>`);
  fs.writeFileSync(firstDemoFile, html);
  console.log('Enhanced 01-taqueria-el-guero.html');
}

for (const file of files) {
  const fullPath = path.join(demosDir, file);
  let html = fs.readFileSync(fullPath, 'utf8');
  html = html.replace(/\/\* StreetBoss premium food-app layer \*\/[\s\S]*?(?=\s*<\/style>)/, '');
  html = html.replace(/\s*<script>\s*\/\/ StreetBoss premium food-app behavior[\s\S]*?<\/script>\s*(?=<\/body>)/, '\n');
  html = html.replace(/onclick="add\(\)"/g, 'onclick="sbAddProduct(this)"');
  html = html.replace(/<div class="cart-bar" id="cart-bar" style="display:none;" onclick="abrirWhatsApp\(\)">/g, '<div class="cart-bar" id="cart-bar" style="display:none;" onclick="sbOpenCart()">');
  html = html.replace(/<div class="cart-btn" onclick="openWp\(\)">/g, '<div class="cart-btn">');
  html = html.replace('</style>', () => `${premiumCss}\n    </style>`);
  html = html.replace('</body>', () => `${premiumJs}\n</body>`);
  fs.writeFileSync(fullPath, html);
  console.log(`Enhanced ${file}`);
}
