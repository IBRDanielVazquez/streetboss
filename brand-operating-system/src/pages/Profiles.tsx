// @ts-nocheck
import { Copy } from 'lucide-react';

export default function Profiles() {
  const copyToClip = (text) => {
    navigator.clipboard.writeText(text);
    alert('¡Copiado!');
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="topbar">
        <div className="page-title">Configuración Real de Perfiles Sociales</div>
      </div>
      <div className="scroll-area">
        
        {/* WHATSAPP */}
        <div className="card" style={{marginBottom: '24px'}}>
          <h2 style={{color: '#48bb78', marginTop: 0}}>WhatsApp Business</h2>
          <div className="grid grid-cols-2">
            <div>
              <p><strong>Nombre:</strong> StreetBoss</p>
              <p><strong>Categoría:</strong> Servicio para empresas</p>
              <p><strong>Descripción:</strong></p>
              <pre style={{whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', color: 'var(--text-gray)'}}>
StreetBoss ayuda a restaurantes y negocios de comida a vender directamente mediante un escaparate digital optimizado para móviles y recepción ordenada de pedidos por WhatsApp.
              </pre>
              <button className="btn" onClick={() => copyToClip('StreetBoss ayuda a restaurantes y negocios de comida a vender directamente mediante un escaparate digital optimizado para móviles y recepción ordenada de pedidos por WhatsApp.')}>Copiar Descripción</button>
            </div>
            <div>
              <p><strong>Mensaje de Bienvenida:</strong></p>
              <pre style={{whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', color: 'var(--text-gray)'}}>
¡Hola! 👋 Gracias por contactar a StreetBoss.

Ayudamos a restaurantes y negocios de comida a transformar su menú en un escaparate digital optimizado para móviles y recibir pedidos directamente por WhatsApp.

Cuéntanos, ¿qué tipo de negocio de comida tienes?
              </pre>
              <button className="btn" onClick={() => copyToClip('¡Hola! 👋 Gracias por contactar a StreetBoss.\n\nAyudamos a restaurantes y negocios de comida a transformar su menú en un escaparate digital optimizado para móviles y recibir pedidos directamente por WhatsApp.\n\nCuéntanos, ¿qué tipo de negocio de comida tienes?')}>Copiar Bienvenida</button>
            </div>
          </div>
        </div>

        {/* INSTAGRAM */}
        <div className="card" style={{marginBottom: '24px'}}>
          <h2 style={{color: '#E1306C', marginTop: 0}}>Instagram</h2>
          <div className="grid grid-cols-2">
            <div>
              <p><strong>Nombre:</strong> StreetBoss | Venta directa para restaurantes</p>
              <p><strong>Usuario:</strong> PENDIENTE_DE_CONFIRMAR</p>
              <p><strong>Categoría:</strong> Producto/servicio</p>
              <p><strong>Enlace:</strong> https://streetboss.com.mx/</p>
              <p><strong>Destacadas iniciales:</strong> Qué es, Cómo funciona, Menú, Pedidos, Restaurantes, Demo.</p>
            </div>
            <div>
              <p><strong>Biografía:</strong></p>
              <pre style={{whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', color: 'var(--text-gray)'}}>
🔥 Tu escaparate digital de comida
📲 Pedidos directos por WhatsApp
👑 Tu menú. Tus clientes. Tu control.
👇 Solicita una demo
              </pre>
              <button className="btn" onClick={() => copyToClip('🔥 Tu escaparate digital de comida\n📲 Pedidos directos por WhatsApp\n👑 Tu menú. Tus clientes. Tu control.\n👇 Solicita una demo')}>Copiar Bio</button>
            </div>
          </div>
        </div>

        {/* FACEBOOK */}
        <div className="card" style={{marginBottom: '24px'}}>
          <h2 style={{color: '#1877F2', marginTop: 0}}>Facebook</h2>
          <div className="grid grid-cols-2">
            <div>
              <p><strong>Nombre:</strong> StreetBoss</p>
              <p><strong>Usuario:</strong> PENDIENTE_DE_CONFIRMAR</p>
              <p><strong>Categoría:</strong> Servicio para empresas</p>
              <p><strong>Botón principal:</strong> Enviar mensaje por WhatsApp (https://wa.me/529613725386</p>
              <p><strong>Descripción Corta:</strong> Plataforma de venta directa para restaurantes y negocios de comida.</p>
            </div>
            <div>
              <p><strong>Descripción Larga:</strong></p>
              <pre style={{whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', color: 'var(--text-gray)'}}>
StreetBoss ayuda a restaurantes, cafeterías, food trucks, dark kitchens y negocios gastronómicos a vender directamente mediante un escaparate digital optimizado para móviles y recepción ordenada de pedidos por WhatsApp.

Tu menú. Tus clientes. Tus pedidos.
              </pre>
              <button className="btn" onClick={() => copyToClip('StreetBoss ayuda a restaurantes, cafeterías, food trucks, dark kitchens y negocios gastronómicos a vender directamente mediante un escaparate digital optimizado para móviles y recepción ordenada de pedidos por WhatsApp.\n\nTu menú. Tus clientes. Tus pedidos.')}>Copiar Descripción Larga</button>
            </div>
          </div>
        </div>

        {/* TIKTOK */}
        <div className="card" style={{marginBottom: '24px'}}>
          <h2 style={{color: '#00F2FE', marginTop: 0}}>TikTok</h2>
          <div className="grid grid-cols-2">
            <div>
              <p><strong>Nombre:</strong> StreetBoss</p>
              <p><strong>Usuario:</strong> PENDIENTE_DE_CONFIRMAR</p>
              <p><strong>Enlace:</strong> https://streetboss.com.mx/</p>
            </div>
            <div>
              <p><strong>Biografía:</strong></p>
              <pre style={{whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', color: 'var(--text-gray)'}}>
Tu escaparate digital de comida 🔥
Vende directo. Manda tú.
👇 Conoce StreetBoss
              </pre>
              <button className="btn" onClick={() => copyToClip('Tu escaparate digital de comida 🔥\nVende directo. Manda tú.\n👇 Conoce StreetBoss')}>Copiar Bio</button>
            </div>
          </div>
        </div>

        {/* LINKEDIN */}
        <div className="card" style={{marginBottom: '24px'}}>
          <h2 style={{color: '#0077B5', marginTop: 0}}>LinkedIn</h2>
          <div className="grid grid-cols-2">
            <div>
              <p><strong>Nombre:</strong> StreetBoss</p>
              <p><strong>Eslogan:</strong> Venta directa para restaurantes y negocios de comida.</p>
              <p><strong>Sector:</strong> Servicios y tecnologías de la información</p>
              <p><strong>Sitio Web:</strong> https://streetboss.com.mx/</p>
            </div>
            <div>
              <p><strong>Descripción:</strong></p>
              <pre style={{whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', color: 'var(--text-gray)'}}>
StreetBoss es una plataforma de venta directa para restaurantes y negocios de comida.

Ayudamos a cada negocio gastronómico a transformar su menú en un escaparate digital optimizado para móviles, presentar mejor sus productos y recibir pedidos directamente por WhatsApp.

StreetBoss no es un marketplace, una aplicación de delivery ni un sistema POS. El restaurante conserva el control de su marca, sus precios, sus clientes y sus ventas.

Vende directo. Manda tú.
              </pre>
              <button className="btn" onClick={() => copyToClip('StreetBoss es una plataforma de venta directa para restaurantes y negocios de comida.\n\nAyudamos a cada negocio gastronómico a transformar su menú en un escaparate digital optimizado para móviles, presentar mejor sus productos y recibir pedidos directamente por WhatsApp.\n\nStreetBoss no es un marketplace, una aplicación de delivery ni un sistema POS. El restaurante conserva el control de su marca, sus precios, sus clientes y sus ventas.\n\nVende directo. Manda tú.')}>Copiar Descripción</button>
            </div>
          </div>
        </div>

        {/* YOUTUBE */}
        <div className="card" style={{marginBottom: '24px'}}>
          <h2 style={{color: '#FF0000', marginTop: 0}}>YouTube</h2>
          <div className="grid grid-cols-2">
            <div>
              <p><strong>Nombre:</strong> StreetBoss</p>
              <p><strong>Handle:</strong> PENDIENTE_DE_CONFIRMAR</p>
            </div>
            <div>
              <p><strong>Descripción:</strong></p>
              <pre style={{whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', color: 'var(--text-gray)'}}>
StreetBoss ayuda a restaurantes y negocios de comida a vender directamente mediante un escaparate digital optimizado para móviles y recepción ordenada de pedidos por WhatsApp.

En este canal encontrarás demostraciones, estrategias de venta directa, presentación gastronómica, marketing para restaurantes y formas de recuperar el control de tus clientes y tus ventas.

🌐 streetboss.com.mx
💬 WhatsApp: +52 961 372 5386

Vende directo. Manda tú.
              </pre>
              <button className="btn" onClick={() => copyToClip('StreetBoss ayuda a restaurantes y negocios de comida a vender directamente mediante un escaparate digital optimizado para móviles y recepción ordenada de pedidos por WhatsApp.\n\nEn este canal encontrarás demostraciones, estrategias de venta directa, presentación gastronómica, marketing para restaurantes y formas de recuperar el control de tus clientes y tus ventas.\n\n🌐 streetboss.com.mx\n💬 WhatsApp: +52 961 372 5386 directo. Manda tú.')}>Copiar Descripción</button>
            </div>
          </div>
        </div>

        {/* X y Pinterest */}
        <div className="grid grid-cols-2" style={{gap: '24px'}}>
          <div className="card">
            <h2 style={{color: '#fff', marginTop: 0}}>X</h2>
            <p><strong>Usuario:</strong> PENDIENTE_DE_CONFIRMAR</p>
            <p><strong>Bio:</strong> Venta directa para restaurantes. Tu escaparate digital, tus clientes y tus pedidos bajo tu control.</p>
            <button className="btn" onClick={() => copyToClip('Venta directa para restaurantes. Tu escaparate digital, tus clientes y tus pedidos bajo tu control.')}>Copiar Bio</button>
          </div>
          <div className="card">
            <h2 style={{color: '#E60023', marginTop: 0}}>Pinterest</h2>
            <p><strong>Usuario:</strong> PENDIENTE_DE_CONFIRMAR</p>
            <p><strong>Bio:</strong> Ideas, diseño y estrategias para convertir el menú de tu restaurante en un escaparate digital que vende directamente.</p>
            <button className="btn" onClick={() => copyToClip('Ideas, diseño y estrategias para convertir el menú de tu restaurante en un escaparate digital que vende directamente.')}>Copiar Bio</button>
          </div>
        </div>

      </div>
    </div>
  );
}
