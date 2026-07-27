import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Copy, X, Calendar, LayoutGrid, Image as ImageIcon, Briefcase, Play, Users, MessageCircle } from 'lucide-react';
import postsData from './data/posts.json';
import profilesData from './data/profiles.json';
import highlightsData from './data/highlights.json';
import assetsData from './data/assets.json';
import './index.css';

const copyText = (text: string) => {
  navigator.clipboard.writeText(text);
  alert('Copiado al portapapeles');
};

const CopyBtn = ({ text, label }: { text: string, label: string }) => (
  <button className="copy-btn" onClick={() => copyText(text)}><Copy size={14}/> {label}</button>
);

const Sidebar = () => {
  const location = useLocation();
  const menu = [
    { name: 'Identidad Digital', path: '/', icon: Briefcase },
    { name: 'Instagram', path: '/Instagram', icon: ImageIcon },
    { name: 'Facebook', path: '/Facebook', icon: Users },
    { name: 'TikTok', path: '/TikTok', icon: Play },
    { name: 'WhatsApp Biz', path: '/WhatsApp', icon: MessageCircle },
    { name: 'LinkedIn', path: '/LinkedIn', icon: Briefcase },
    { name: 'YouTube', path: '/YouTube', icon: Play }
  ];

  return (
    <aside className="sidebar">
      <h1>StreetBoss SBOS</h1>
      <nav>
        {menu.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Icon size={18} /> {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

const AssetView = () => (
  <div className="main-content">
    <div className="header">
      <h2>Identidad Digital (Brand Assets)</h2>
      <p style={{color:'var(--text-secondary)'}}>Base de operaciones corporativas</p>
    </div>
    
    <div className="data-block">
      <h4 className="section-title">Información Oficial</h4>
      <p><strong>Tagline:</strong> {assetsData.brand.tagline}</p>
      <p><strong>WhatsApp Oficial:</strong> {assetsData.brand.officialWhatsApp}</p>
      <p><strong>Website:</strong> {assetsData.brand.website}</p>
      <CopyBtn text={assetsData.brand.officialWhatsApp} label="Copiar WA" />
    </div>

    <h4 className="section-title">Paleta de Colores</h4>
    <div className="grid-metrics">
      {Object.entries(assetsData.colors).map(([key, c]: any) => (
        <div key={key} className="metric-card" style={{borderLeft: `4px solid ${c.hex}`}}>
          <h3 style={{fontSize:'20px'}}>{c.name}</h3>
          <p style={{fontSize:'12px', color:'var(--text-secondary)'}}>{c.hex}</p>
          <p style={{fontSize:'12px', marginTop:'8px'}}>{c.usage}</p>
        </div>
      ))}
    </div>

    <div className="data-block" style={{background:'#fff0eb'}}>
      <h4 className="section-title" style={{color:'var(--street-orange)'}}>Términos Prohibidos</h4>
      <ul>
        {assetsData.forbiddenTerms.map((t: string, i: number) => <li key={i} style={{fontSize:'14px', marginBottom:'4px'}}>{t}</li>)}
      </ul>
    </div>
  </div>
);

const ProfileView = ({ profile }: { profile: any }) => {
  return (
    <div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', marginBottom:'32px'}}>
        <div className="data-block">
          <h4 className="section-title">Configuración de Perfil</h4>
          <p><strong>Usuario:</strong> {profile.username}</p>
          <p><strong>Categoría:</strong> {profile.category}</p>
          <p><strong>Sitio Web:</strong> {profile.contactInfo?.url}</p>
          <p><strong>Botones:</strong> {profile.buttons?.join(', ')}</p>
          <p><strong>CTA Global:</strong> {profile.cta}</p>
        </div>

        <div className="data-block">
          <h4 className="section-title">Foto de Perfil (Avatar)</h4>
          <p style={{fontSize:'12px', fontWeight:600}}>SAFE ZONE:</p>
          <p style={{fontSize:'12px'}}>{profile.profilePic.safeZone}</p>
          <br/>
          <p style={{fontSize:'12px', fontWeight:600}}>PROMPT:</p>
          <p style={{fontSize:'12px'}}>{profile.profilePic.prompt}</p>
          <CopyBtn text={profile.profilePic.prompt} label="Copiar Prompt" />
        </div>
      </div>

      {profile.coverPhoto && (
        <div className="data-block">
          <h4 className="section-title">Foto de Portada / Cover</h4>
          <p style={{fontSize:'12px'}}><strong>Mobile Safe Zone:</strong> {profile.coverPhoto.mobileSafeZone}</p>
          <p style={{fontSize:'12px'}}><strong>Desktop Safe Zone:</strong> {profile.coverPhoto.desktopSafeZone}</p>
          <br/>
          <p style={{fontSize:'12px'}}><strong>Texto en portada:</strong> {profile.coverPhoto.text}</p>
          <br/>
          <p style={{fontSize:'12px', fontWeight:600}}>PROMPT:</p>
          <p style={{fontSize:'12px'}}>{profile.coverPhoto.prompt}</p>
          <CopyBtn text={profile.coverPhoto.prompt} label="Copiar Prompt" />
        </div>
      )}

      <h4 className="section-title">Biografías A/B</h4>
      <div className="grid-metrics">
        {profile.bios.map((bio: any) => (
          <div key={bio.id} className="metric-card">
            <span className="post-card-badge">Versión {bio.id}: {bio.name}</span>
            <p style={{marginTop:'12px', fontSize:'14px', whiteSpace:'pre-wrap'}}>{bio.text}</p>
            <CopyBtn text={bio.text} label="Copiar Bio" />
          </div>
        ))}
      </div>
    </div>
  );
};

const PostModal = ({ post, onClose }: { post: any, onClose: () => void }) => {
  if (!post) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{fontSize:'20px'}}>{post.id}</h3>
            <p style={{color:'var(--text-secondary)', fontSize:'14px'}}>{post.network} • {post.format}</p>
          </div>
          <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}><X size={24}/></button>
        </div>
        <div className="modal-body">
          <div>
            <h4 className="section-title">Copy & Hook</h4>
            <div className="data-block">
              <p><strong>Hook:</strong> {post.hook}</p>
              <br/>
              <p>{post.copy}</p>
              <br/>
              <p><strong>CTA:</strong> {post.cta}</p>
              <br/>
              <p style={{color:'var(--street-orange)'}}>{post.hashtags.join(' ')}</p>
              <CopyBtn text={`${post.hook}\n\n${post.copy}\n\n${post.cta}\n\n${post.hashtags.join(' ')}`} label="Copiar Copy Completo" />
            </div>
            {post.carouselTexts && (
              <div className="data-block">
                <h4 className="section-title">Textos de Carrusel</h4>
                {post.carouselTexts.map((t: string, i: number) => <p key={i}><strong>Slide {i+1}:</strong> {t}</p>)}
              </div>
            )}
            {post.script && (
              <div className="data-block">
                <h4 className="section-title">Guion / Texto en video</h4>
                <p>{post.script}</p>
              </div>
            )}
          </div>
          <div>
            <h4 className="section-title">Dirección Visual y Prompts</h4>
            <div className="data-block">
              <p><strong>Formato:</strong> {post.aspectRatio} ({post.resolution})</p>
              <p><strong>Archivo Sugerido:</strong> {post.filename}</p>
            </div>
            <div className="data-block">
              <p style={{fontSize:'12px', fontWeight:600, marginBottom:'8px'}}>PROMPT DE IMAGEN</p>
              <p style={{fontSize:'12px'}}>{post.imagePrompt}</p>
              <CopyBtn text={post.imagePrompt} label="Copiar Prompt" />
            </div>
            <div className="data-block" style={{background:'#fff0eb'}}>
              <p style={{fontSize:'12px', fontWeight:600, marginBottom:'8px', color:'var(--street-orange)'}}>NEGATIVE PROMPT</p>
              <p style={{fontSize:'12px', color:'var(--street-orange)'}}>{post.negativePrompt}</p>
              <CopyBtn text={post.negativePrompt} label="Copiar Negative" />
            </div>
            {post.motionPrompt && (
              <div className="data-block" style={{background:'#f0f4ff'}}>
                <p style={{fontSize:'12px', fontWeight:600, marginBottom:'8px', color:'#2563eb'}}>PROMPT DE MOVIMIENTO (VIDEO)</p>
                <p style={{fontSize:'12px'}}>{post.motionPrompt}</p>
                <CopyBtn text={post.motionPrompt} label="Copiar Motion" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NetworkView = () => {
  const location = useLocation();
  const network = location.pathname.replace('/', '') || 'Instagram';
  
  const profile = profilesData.find(p => p.network.toLowerCase() === network.toLowerCase());
  const posts = postsData.filter(p => p.network.toLowerCase() === network.toLowerCase());
  
  const [activeTab, setActiveTab] = useState('perfil');
  const [selectedPost, setSelectedPost] = useState(null);

  const formats = Array.from(new Set(posts.map(p => p.format)));

  return (
    <div className="main-content">
      <div className="header">
        <h2>{network}</h2>
        <p style={{color:'var(--text-secondary)', marginTop:'8px'}}>Configuración y Biblioteca de Activos</p>
      </div>

      <div className="tabs">
        <div className={`tab ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>
          Perfil & Bios
        </div>
        {network.toLowerCase() === 'instagram' && (
          <div className={`tab ${activeTab === 'destacados' ? 'active' : ''}`} onClick={() => setActiveTab('destacados')}>
            Destacados
          </div>
        )}
        {formats.map(f => (
          <div key={f} className={`tab ${activeTab === f ? 'active' : ''}`} onClick={() => setActiveTab(f as string)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({posts.filter(p => p.format === f).length})
          </div>
        ))}
      </div>

      {activeTab === 'perfil' && profile && <ProfileView profile={profile} />}
      
      {activeTab === 'destacados' && network.toLowerCase() === 'instagram' && (
        <div className="grid-metrics">
          {highlightsData.map(hl => (
            <div key={hl.id} className="metric-card">
              <h4>{hl.name}</h4>
              <p style={{fontSize:'12px', marginTop:'8px'}}>{hl.contentDesc}</p>
              <br/>
              <p style={{fontSize:'12px', fontWeight:600}}>PROMPT PORTADA:</p>
              <p style={{fontSize:'12px'}}>{hl.prompt}</p>
              <CopyBtn text={hl.prompt} label="Copiar Prompt" />
            </div>
          ))}
        </div>
      )}

      {formats.includes(activeTab) && (
        <div className="grid-posts">
          {posts.filter(p => p.format === activeTab).map(post => (
            <div key={post.id} className="post-card" onClick={() => setSelectedPost(post as any)}>
              <div className="post-card-header">
                <span style={{fontSize:'12px', fontWeight:600}}>{post.id}</span>
                <span className="post-card-badge badge-ready">{post.status}</span>
              </div>
              <div className="post-card-body">
                <h4 style={{textTransform:'capitalize'}}>{post.title}</h4>
                <p>{post.hook}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
};

export default function App() {
  const menu = [
    { name: 'Assets', path: '/', icon: Briefcase },
    { name: 'Instagram', path: '/Instagram', icon: ImageIcon },
    { name: 'Facebook', path: '/Facebook', icon: Users },
    { name: 'TikTok', path: '/TikTok', icon: Play },
    { name: 'WhatsApp', path: '/WhatsApp', icon: MessageCircle },
  ];

  const MobileBottomBar = () => {
    const location = useLocation();
    return (
      <div className="mobile-bottom-bar">
        {menu.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className={`mobile-tab ${location.pathname === item.path ? 'active' : ''}`}>
              <Icon size={24} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<AssetView />} />
          <Route path="/:network" element={<NetworkView />} />
        </Routes>
        <MobileBottomBar />
      </div>
    </BrowserRouter>
  );
}
