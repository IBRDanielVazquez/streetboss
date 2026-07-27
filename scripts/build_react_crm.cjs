const fs = require('fs');
const path = require('path');

const rootDir = '/Users/danielvazquez/Proyectos/StreetBoss/social-command-center';
const srcDir = path.join(rootDir, 'src');

if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

// Ensure folders
['components', 'pages', 'data', 'assets'].forEach(dir => fs.mkdirSync(path.join(srcDir, dir), { recursive: true }));

// CSS
const indexCss = \`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --boss-charcoal: #0D0E12;
  --boss-charcoal-light: #1A1C23;
  --boss-charcoal-lighter: #252830;
  --street-orange: #FF4B00;
  --street-orange-light: #FF6A1A;
  --white: #FFFFFF;
  --text-gray: #A0AEC0;
  --border-color: rgba(255, 255, 255, 0.1);
}

* { box-sizing: border-box; }
body {
  margin: 0; padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: var(--boss-charcoal);
  color: var(--white);
  overflow: hidden;
}

.app-container { display: flex; height: 100vh; width: 100vw; }

/* Sidebar */
.sidebar {
  width: 260px;
  background-color: rgba(26, 28, 35, 0.8);
  backdrop-filter: blur(20px);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
}
.sidebar-logo {
  font-size: 20px; font-weight: 800; color: var(--white);
  display: flex; align-items: center; gap: 10px; margin-bottom: 40px;
  padding: 0 12px;
}
.sidebar-logo img { height: 24px; }
.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 8px; color: var(--text-gray);
  text-decoration: none; font-size: 14px; font-weight: 500;
  transition: all 0.2s ease; margin-bottom: 4px;
}
.nav-item:hover { background: rgba(255, 255, 255, 0.05); color: var(--white); }
.nav-item.active { background: var(--street-orange); color: var(--white); }

/* Main Content */
.main-content {
  flex: 1; display: flex; flex-direction: column; overflow: hidden;
}
.topbar {
  height: 70px; border-bottom: 1px solid var(--border-color);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; background: rgba(13, 14, 18, 0.9);
  backdrop-filter: blur(10px);
}
.page-title { font-size: 22px; font-weight: 700; }
.scroll-area {
  flex: 1; overflow-y: auto; padding: 32px;
}

/* UI Components */
.card {
  background: var(--boss-charcoal-light);
  border: 1px solid var(--border-color);
  border-radius: 12px; padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.grid { display: grid; gap: 24px; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

.chip {
  display: inline-block; padding: 4px 12px; border-radius: 20px;
  font-size: 12px; font-weight: 600; text-transform: uppercase;
}
.chip.orange { background: rgba(255, 75, 0, 0.2); color: var(--street-orange-light); }
.chip.green { background: rgba(72, 187, 120, 0.2); color: #48bb78; }
.chip.gray { background: rgba(255, 255, 255, 0.1); color: var(--text-gray); }

.btn {
  background: var(--boss-charcoal-lighter); border: 1px solid var(--border-color);
  color: var(--white); padding: 8px 16px; border-radius: 6px;
  font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease;
  display: flex; align-items: center; gap: 8px;
}
.btn:hover { background: rgba(255, 255, 255, 0.1); }
.btn.primary { background: var(--street-orange); border-color: var(--street-orange); }
.btn.primary:hover { background: var(--street-orange-light); }

.input {
  background: rgba(0,0,0,0.2); border: 1px solid var(--border-color);
  color: white; padding: 10px 14px; border-radius: 6px; width: 100%;
  font-family: inherit; font-size: 14px; outline: none;
}
.input:focus { border-color: var(--street-orange); }

/* Asset Card */
.asset-card { display: flex; flex-direction: column; overflow: hidden; }
.asset-card img { width: 100%; height: 200px; object-fit: contain; background: #000; border-bottom: 1px solid var(--border-color); }
.asset-info { padding: 16px; }
.asset-title { font-weight: 600; font-size: 14px; margin-bottom: 8px; word-break: break-all; }
.asset-meta { font-size: 12px; color: var(--text-gray); margin-bottom: 12px; }

/* Dashboard sections */
.dashboard-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
.metric-card { background: var(--boss-charcoal-light); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); }
.metric-value { font-size: 36px; font-weight: 800; color: var(--street-orange); margin-bottom: 4px; }
.metric-label { font-size: 13px; color: var(--text-gray); font-weight: 500; }
\`;
fs.writeFileSync(path.join(srcDir, 'index.css'), indexCss);

// Sidebar
const sidebarTsx = \`
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Image as ImageIcon, LayoutGrid, Megaphone, Share2, Palette, CheckSquare, ListTodo, PieChart, Settings } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/calendar', icon: Calendar, label: 'Calendario' },
    { to: '/posts', icon: LayoutGrid, label: 'Publicaciones' },
    { to: '/campaigns', icon: Megaphone, label: 'Campañas' },
    { to: '/library', icon: ImageIcon, label: 'Biblioteca Visual' },
    { to: '/profiles', icon: Share2, label: 'Perfiles Sociales' },
    { to: '/brand', icon: Palette, label: 'Activos de Marca' },
    { to: '/approvals', icon: CheckSquare, label: 'Aprobaciones' },
    { to: '/pending', icon: ListTodo, label: 'Pendientes' },
    { to: '/reports', icon: PieChart, label: 'Reportes' },
    { to: '/settings', icon: Settings, label: 'Configuración' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/assets/brand-core/StreetBoss-Isotipo-Circular.png" alt="SB" style={{borderRadius: '50%'}} />
        STREETBOSS
      </div>
      <nav style={{display: 'flex', flexDirection: 'column'}}>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({isActive}) => \`nav-item \${isActive ? 'active' : ''}\`}>
            <l.icon size={18} />
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
\`;
fs.writeFileSync(path.join(srcDir, 'components', 'Sidebar.tsx'), sidebarTsx);

// App.tsx
const appTsx = \`
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VisualLibrary from './pages/VisualLibrary';
import Posts from './pages/Posts';
import Profiles from './pages/Profiles';
import BrandAssets from './pages/BrandAssets';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<div className="scroll-area"><h1>Calendario</h1><p>Vista de calendario en construcción.</p></div>} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/campaigns" element={<div className="scroll-area"><h1>Campañas</h1><p>Campaña Semana 1: El Mando.</p></div>} />
            <Route path="/library" element={<VisualLibrary />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/brand" element={<BrandAssets />} />
            <Route path="/approvals" element={<div className="scroll-area"><h1>Aprobaciones</h1></div>} />
            <Route path="/pending" element={<div className="scroll-area"><h1>Pendientes</h1></div>} />
            <Route path="/reports" element={<div className="scroll-area"><h1>Reportes</h1></div>} />
            <Route path="/settings" element={<div className="scroll-area"><h1>Configuración</h1></div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
\`;
fs.writeFileSync(path.join(srcDir, 'App.tsx'), appTsx);

// Dashboard
const dashTsx = \`
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="topbar">
        <div className="page-title">Executive Dashboard</div>
        <div style={{fontSize: '14px', color: 'var(--text-gray)'}}>Social Command Center V1.0</div>
      </div>
      <div className="scroll-area">
        <div className="dashboard-metrics">
          <div className="metric-card"><div className="metric-value">7</div><div className="metric-label">Publicaciones Planeadas (S1)</div></div>
          <div className="metric-card"><div className="metric-value">7</div><div className="metric-label">Publicaciones Listas</div></div>
          <div className="metric-card"><div className="metric-value">28</div><div className="metric-label">Activos Institucionales</div></div>
          <div className="metric-card"><div className="metric-value">0</div><div className="metric-label">Bloqueos</div></div>
        </div>

        <div className="grid grid-cols-2">
          <div className="card">
            <h3 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px'}}><AlertCircle size={18} color="var(--street-orange)"/> Próximas Acciones</h3>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              <li style={{padding: '12px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between'}}><span>Configurar perfil en Instagram</span> <button className="btn">Ir</button></li>
              <li style={{padding: '12px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between'}}><span>Revisar copys de P01-P07</span> <button className="btn">Ir</button></li>
              <li style={{padding: '12px 0', display: 'flex', justifyContent: 'space-between'}}><span>Aprobar lanzamiento Semana 1</span> <button className="btn">Ir</button></li>
            </ul>
          </div>
          
          <div className="card">
            <h3 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px'}}><CheckCircle size={18} color="#48bb78"/> Resumen de Plataformas</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'YouTube', 'X'].map(p => (
                <div key={p} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--boss-charcoal)', borderRadius: '6px'}}>
                  <span style={{fontWeight: 600}}>{p}</span>
                  <span className="chip orange">Pendiente de Configurar</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
\`;
fs.writeFileSync(path.join(srcDir, 'pages', 'Dashboard.tsx'), dashTsx);

// VisualLibrary
const libTsx = \`
import { useState, useEffect } from 'react';
import assetsData from '../data/assets.json';
import { Download, ExternalLink } from 'lucide-react';

export default function VisualLibrary() {
  const [filter, setFilter] = useState('all');
  
  const platforms = [...new Set(assetsData.map(a => a.platform))];
  
  const filtered = filter === 'all' ? assetsData : assetsData.filter(a => a.platform === filter || a.type === filter);

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="topbar">
        <div className="page-title">Biblioteca Visual</div>
        <div style={{display: 'flex', gap: '10px'}}>
          <select className="input" style={{width: '200px'}} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">Todas las plataformas</option>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            <option value="content">Contenido (P01-P07)</option>
          </select>
        </div>
      </div>
      <div className="scroll-area">
        <div className="grid grid-cols-4">
          {filtered.map((a, i) => (
            <div key={i} className="card asset-card" style={{padding: 0}}>
              <img src={a.path} alt={a.name} />
              <div className="asset-info">
                <div className="chip orange" style={{marginBottom: '10px'}}>{a.type}</div>
                <div className="asset-title">{a.name}</div>
                <div className="asset-meta">Plataforma: {a.platform}<br/>Dim: {a.dim}</div>
                <div style={{display: 'flex', gap: '10px'}}>
                  <a href={a.path} target="_blank" className="btn" style={{flex: 1, justifyContent: 'center', textDecoration: 'none'}}><ExternalLink size={14}/> Abrir</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
\`;
fs.writeFileSync(path.join(srcDir, 'pages', 'VisualLibrary.tsx'), libTsx);

// Posts
const postsTsx = \`
import postsData from '../data/posts.json';

export default function Posts() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="topbar">
        <div className="page-title">Fichas CRM de Publicaciones</div>
      </div>
      <div className="scroll-area">
        <div className="grid">
          {postsData.map(p => (
            <div key={p.id} className="card" style={{display: 'flex', gap: '24px'}}>
              <div style={{width: '200px', flexShrink: 0}}>
                <img src={p.thumb} style={{width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)'}} />
              </div>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px'}}>
                    <span className="chip orange">{p.id}</span>
                    <h2 style={{margin: 0}}>{p.title}</h2>
                  </div>
                  <span className="chip gray">{p.status}</span>
                </div>
                <div className="grid grid-cols-3" style={{gap: '12px', marginTop: '16px'}}>
                  <div><strong>Formato:</strong> {p.format}</div>
                  <div><strong>Pilar:</strong> {p.pilar}</div>
                  <div><strong>Plataformas:</strong> {p.platforms.join(', ')}</div>
                </div>
                <div style={{marginTop: '20px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px'}}>
                  <strong>Copy Principal:</strong><br/>
                  <span style={{color: 'var(--text-gray)', whiteSpace: 'pre-wrap'}}>{p.copy}</span>
                </div>
                <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                   <button className="btn primary" onClick={() => {navigator.clipboard.writeText(p.copy); alert('Copy copiado!');}}>Copiar Copy</button>
                   <button className="btn">Aprobar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
\`;
fs.writeFileSync(path.join(srcDir, 'pages', 'Posts.tsx'), postsTsx);

// Profiles
const profilesTsx = \`
import { Copy } from 'lucide-react';

export default function Profiles() {
  const profiles = [
    { name: 'Instagram', user: '@streetboss.mx', status: 'PENDIENTE_DE_CONFIGURAR', bio: 'Tu escaparate digital de comida. 🍔📱\\nVende directo. Manda tú.\\nOlvídate de las comisiones. 👇' },
    { name: 'Facebook', user: 'StreetBoss', status: 'PENDIENTE_DE_CONFIGURAR', bio: 'Tu escaparate digital de comida. Vende directo. Manda tú.' },
    { name: 'LinkedIn', user: 'StreetBoss', status: 'PENDIENTE_DE_CONFIGURAR', bio: 'StreetBoss es la plataforma diseñada para que los negocios de comida retomen el control...' },
    { name: 'TikTok', user: '@streetboss.mx', status: 'PENDIENTE_DE_CONFIGURAR', bio: 'Tu menú digital que sí vende 🍔📱\\nVende directo. Manda tú. 👇' },
    { name: 'X', user: '@streetbossmx', status: 'PENDIENTE_DE_CONFIGURAR', bio: 'Tu escaparate digital de comida. Convierte tu menú en ventas directas. Vende directo. Manda tú.' }
  ];

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="topbar">
        <div className="page-title">Perfiles Sociales</div>
      </div>
      <div className="scroll-area">
        <div className="grid grid-cols-2">
          {profiles.map(p => (
            <div key={p.name} className="card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h2 style={{margin: 0}}>{p.name}</h2>
                <span className="chip gray">{p.status}</span>
              </div>
              <div style={{marginBottom: '10px'}}><strong>Usuario sugerido:</strong> {p.user}</div>
              <div style={{marginBottom: '10px'}}><strong>Biografía:</strong></div>
              <div style={{background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', whiteSpace: 'pre-wrap', color: 'var(--text-gray)', marginBottom: '16px'}}>
                {p.bio}
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button className="btn" onClick={() => {navigator.clipboard.writeText(p.bio); alert('Bio copiada!');}}><Copy size={16}/> Copiar Biografía</button>
                <button className="btn primary">Marcar Configurado</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
\`;
fs.writeFileSync(path.join(srcDir, 'pages', 'Profiles.tsx'), profilesTsx);

// BrandAssets
const brandTsx = \`
export default function BrandAssets() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="topbar">
        <div className="page-title">Activos de Marca Oficiales</div>
      </div>
      <div className="scroll-area">
        <div className="card" style={{marginBottom: '24px'}}>
          <h2 style={{color: 'var(--street-orange)', marginTop: 0}}>LEY ABSOLUTA (Documentada)</h2>
          <p>El <strong>Logo Horizontal Completo (con Tagline)</strong> es el activo de máxima autoridad. Debe usarse para portadas, publicitarios y piezas principales de manera FUERTE y predominante.</p>
        </div>
        <div className="grid grid-cols-2">
          <div className="card">
            <h3>Logo Horizontal Principal</h3>
            <img src="/assets/brand-core/StreetBoss-Logo-Horizontal.png" style={{width: '100%', background: '#000', padding: '20px', borderRadius: '8px'}}/>
            <p style={{fontSize: '12px', color: 'var(--text-gray)'}}>Uso: Portadas, headers, piezas principales.</p>
          </div>
          <div className="card">
            <h3>Isotipo Circular</h3>
            <img src="/assets/brand-core/StreetBoss-Isotipo-Circular.png" style={{width: '150px', background: '#000', padding: '20px', borderRadius: '50%'}}/>
            <p style={{fontSize: '12px', color: 'var(--text-gray)'}}>Uso: Avatares de redes sociales y espacios mínimos cuadrados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
\`;
fs.writeFileSync(path.join(srcDir, 'pages', 'BrandAssets.tsx'), brandTsx);

// Data files
const postsJson = [
  { id: 'P01', title: 'Tu menú no debería verse...', thumb: '/assets/p01-p07/P01/P01_COVER.jpg', format: 'Reel', pilar: 'Demostración de Producto', platforms: ['Instagram', 'TikTok'], copy: 'Tu menú no debería verse como una simple lista. \\nConvierte tu menú en tu Escaparate Digital. Tu cliente elige y arma su pedido directamente.\\n\\nVende directo. Manda tú. 🔥\\n\\n#StreetBoss #FoodTech #VentaDirecta', status: 'LISTO_PARA_REVISIÓN' },
  { id: 'P02', title: 'Del antojo al carrito', thumb: '/assets/p01-p07/P02/P02_S1.webp', format: 'Carrusel', pilar: 'Educativo / Producto', platforms: ['Instagram', 'LinkedIn', 'Facebook'], copy: 'El proceso de pedir comida no debe ser aburrido.\\nDe ver la foto al carrito de compras en segundos. Tus clientes exploran, se les antoja y te envían el pedido estructurado directo a WhatsApp.\\n\\nVende directo. Manda tú.\\n\\n#Restaurantes #FoodTech', status: 'LISTO_PARA_REVISIÓN' },
  { id: 'P03', title: 'Hacer que se antoje', thumb: '/assets/p01-p07/P03/P03.webp', format: 'Post', pilar: 'Inspiracional', platforms: ['Instagram', 'Facebook', 'X'], copy: 'No basta con decir qué vendes. Hay que hacer que se antoje.\\nDale a tu menú el poder visual que tu comida merece.\\n\\nConoce StreetBoss. Vende directo. Manda tú. 🍔🚀', status: 'LISTO_PARA_REVISIÓN' },
  { id: 'P04', title: 'Vende con los ojos', thumb: '/assets/p01-p07/P04/P04_S1.webp', format: 'Carrusel', pilar: 'Educativo', platforms: ['Instagram', 'LinkedIn', 'Facebook'], copy: 'Tu menú también vende con los ojos.\\nFotografías que despiertan el antojo, categorías claras para decidir más rápido y un carrito para organizar la elección.\\n\\nVende directo. Manda tú.', status: 'LISTO_PARA_REVISIÓN' },
  { id: 'P05', title: 'Un menú solo informa', thumb: '/assets/p01-p07/P05/P05_COVER.jpg', format: 'Reel', pilar: 'Educativo / Producto', platforms: ['Instagram', 'TikTok'], copy: 'Un PDF solo se consulta. Un escaparate presenta tu marca y ayuda a organizar el pedido.\\n\\nStreetBoss transforma tu menú en una experiencia interactiva sin altas comisiones de apps.\\n\\nVende directo. Manda tú.', status: 'LISTO_PARA_REVISIÓN' },
  { id: 'P06', title: 'No es otro menú QR', thumb: '/assets/p01-p07/P06/P06_S1.webp', format: 'Carrusel', pilar: 'Demostración', platforms: ['Instagram', 'Facebook', 'LinkedIn'], copy: 'No es otro menú QR. Un PDF solo se consulta. StreetBoss presenta tu negocio, organiza tus productos por categorías y permite que tu cliente arme su carrito para enviarlo a WhatsApp.\\n\\nTu menú. Tus clientes. Tus pedidos.\\nVende directo. Manda tú.', status: 'LISTO_PARA_REVISIÓN' },
  { id: 'P07', title: 'Vende directo, manda tú', thumb: '/assets/p01-p07/P07/P07.webp', format: 'Post', pilar: 'Cierre de Campaña', platforms: ['Instagram', 'Facebook', 'X'], copy: 'Tu menú. Tus clientes. Tus pedidos.\\n\\nRecupera el control de tus ganancias. Olvídate de pagar comisiones por cada pedido.\\nCon StreetBoss, tu menú es un escaparate digital que vende directo.\\n\\nVende directo. Manda tú. 🚀🍔', status: 'LISTO_PARA_REVISIÓN' }
];
fs.writeFileSync(path.join(srcDir, 'data', 'posts.json'), JSON.stringify(postsJson, null, 2));

const assetsJson = [];
['facebook', 'instagram', 'linkedin', 'pinterest', 'tiktok', 'x', 'youtube', 'favicon', 'open-graph'].forEach(plat => {
  const platPath = path.join(rootDir, 'public', 'assets', 'social-final', plat);
  if (fs.existsSync(platPath)) {
    fs.readdirSync(platPath).forEach(file => {
      if(file.endsWith('.webp')) {
        assetsJson.push({
          name: file.replace('.webp',''),
          platform: plat,
          type: 'Institucional',
          path: \`/assets/social-final/\${plat}/\${file}\`,
          dim: 'Ver original'
        });
      }
    });
  }
});
// Add P01-P07 covers
postsJson.forEach(p => {
  assetsJson.push({
    name: p.id + ' Cover',
    platform: 'content',
    type: p.format,
    path: p.thumb,
    dim: '1080x'
  });
});
fs.writeFileSync(path.join(srcDir, 'data', 'assets.json'), JSON.stringify(assetsJson, null, 2));

console.log('React application files generated successfully.');
