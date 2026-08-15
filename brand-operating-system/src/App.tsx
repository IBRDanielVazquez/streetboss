import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Copy, X, Calendar, LayoutGrid, Image as ImageIcon, Briefcase, Play, Users, MessageCircle, Linkedin, Youtube, ChevronLeft, ChevronRight } from 'lucide-react';

// ── Helpers de calendario cronológico (solo Instagram) ──
const CATEGORIES = ["Venta directa","Producto","Educación","Objeciones","Marca","Conversión","Historia humana","Autoridad FoodTech","Demostración","Comunidad"];
const hashNum = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h; };
const categoryOf = (p: any) => CATEGORIES[hashNum(p.id + 'cat') % CATEGORIES.length];
const FORMAT_PRIO: any = { story: 0, status: 0, feed: 1, educativo: 1, comercial: 1, post: 1, carrusel: 2, reel: 3, video: 3, short: 3 };
const chronoSort = (a: any, b: any) => {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  if (a.time !== b.time) return a.time < b.time ? -1 : 1;
  return (FORMAT_PRIO[a.format] ?? 9) - (FORMAT_PRIO[b.format] ?? 9);
};
const DIAS = ['DOMINGO','LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO'];
const MESES = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
const diaFecha = (d: string) => { const [y, m, day] = (d || '2026-01-01').split('-').map(Number); const dt = new Date(y, m - 1, day); return `${DIAS[dt.getDay()]} ${day} DE ${MESES[m - 1]}`; };
const isReady = (p: any) => p.status && !/PENDIENTE/i.test(p.status);
import postsData from './data/posts.json';
import profilesData from './data/profiles.json';
import highlightsData from './data/highlights.json';
import assetsData from './data/assets.json';
import './index.css';

const useCompletedPosts = () => {
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sbos_completed');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const toggleComplete = (id: string) => {
    setCompleted(prev => {
      const isDone = prev.includes(id);
      const next = isDone ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('sbos_completed', JSON.stringify(next));
      return next;
    });
  };
  return { completed, toggleComplete };
};


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
    { name: 'LinkedIn', path: '/LinkedIn', icon: Linkedin },
    { name: 'YouTube', path: '/YouTube', icon: Youtube }
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
  const isIG = post.network === 'Instagram';
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{fontSize:'20px'}}>{post.id}</h3>
            <p style={{color:'var(--text-secondary)', fontSize:'14px'}}>{post.network} • {post.format} • {post.productionStatus}</p>
          </div>
          <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}><X size={24}/></button>
        </div>
        <div className="modal-body">
          <div>
            <h4 className="section-title">Estrategia de Embudo</h4>
            <div className="data-block">
              <p><strong>Campaña:</strong> {post.campaign}</p>
              <p><strong>Embudo:</strong> {post.funnel}</p>
              <p><strong>Objetivo:</strong> {post.objective}</p>
              <p><strong>Audiencia:</strong> {post.audience}</p>
              <p><strong>Concepto Visual:</strong> {post.visualConcept}</p>
            </div>
            
            <h4 className="section-title">Copy & Hook</h4>
            <div className="data-block">
              <p><strong>Hook:</strong> {post.hook}</p>
              <br/>
              <p>{post.copy}</p>
              <br/>
              <p><strong>CTA:</strong> {post.cta}</p>
              <br/>
              <p style={{color:'var(--street-orange)'}}>{post.hashtags.join(' ')}</p>
              <br/>
              <p><strong>Primer Comentario (Pinned):</strong> {post.pinnedComment}</p>
              <CopyBtn text={post.copy} label="Copiar Copy" />
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
              <p><strong>Ruta:</strong> {post.path}</p>
              {post.cover && <p><strong>Portada:</strong> {post.cover}</p>}
            </div>
            
            {isIG ? (
              <>
                <div className="data-block">
                  <p style={{fontSize:'12px', fontWeight:600, marginBottom:'8px'}}>PROMPT COMPLETO PARA GENERACIÓN</p>
                  <p style={{fontSize:'12px', whiteSpace:'pre-wrap'}}>{post.promptCompleto}</p>
                  <CopyBtn text={post.promptCompleto} label="Copiar Prompt Completo" />
                </div>
                <div className="data-block" style={{background:'#f2fbf3'}}>
                  <p style={{fontSize:'12px', fontWeight:600, marginBottom:'8px', color:'#166534'}}>PROMPT PARA APLICAR EL TEXTO FINAL</p>
                  <p style={{fontSize:'12px', whiteSpace:'pre-wrap'}}>{post.promptTextoFinal}</p>
                  <CopyBtn text={post.promptTextoFinal} label="Copiar Prompt de Texto" />
                </div>
                <div className="data-block">
                  <p style={{fontSize:'12px', fontWeight:600, marginBottom:'8px'}}>DATOS TÉCNICOS</p>
                  <p style={{fontSize:'12px'}}><strong>Zona segura:</strong> {post.safeZone}</p>
                  <p style={{fontSize:'12px'}}><strong>ALT:</strong> {post.alt}</p>
                </div>
              </>
            ) : (
              <>
                <div className="data-block">
                  <p style={{fontSize:'12px', fontWeight:600, marginBottom:'8px'}}>TEXTO EN IMAGEN (UX)</p>
                  <p style={{fontSize:'12px'}}>{post.imageText}</p>
                  <br/>
                  <p style={{fontSize:'12px', fontWeight:600, marginBottom:'8px'}}>ZONA SEGURA</p>
                  <p style={{fontSize:'12px'}}>{post.safeZone}</p>
                  <br/>
                  <p style={{fontSize:'12px', fontWeight:600, marginBottom:'8px'}}>TEXTO ALTERNATIVO (ALT)</p>
                  <p style={{fontSize:'12px'}}>{post.alt}</p>
                </div>

                <div className="data-block">
                  <p style={{fontSize:'12px', fontWeight:600, marginBottom:'8px'}}>PROMPT DE IMAGEN (5 párrafos · negativo integrado)</p>
                  <p style={{fontSize:'12px', whiteSpace:'pre-wrap'}}>{post.imagePrompt}</p>
                  <CopyBtn text={post.imagePrompt} label="Copiar Prompt Completo" />
                </div>

                {post.overlayText && (
                  <div className="data-block" style={{background:'#f2fbf3'}}>
                    <p style={{fontSize:'12px', fontWeight:600, marginBottom:'8px', color:'#166534'}}>POST-PRODUCCIÓN · Se agrega ENCIMA de la imagen</p>
                    <p style={{fontSize:'12px'}}><strong>Titular:</strong> {post.overlayText.titular}</p>
                    <p style={{fontSize:'12px'}}><strong>Subtítulo:</strong> {post.overlayText.subtitulo}</p>
                    <p style={{fontSize:'12px'}}><strong>CTA visual:</strong> {post.overlayText.ctaVisual}</p>
                    {post.logo && (
                      <>
                        <br/>
                        <p style={{fontSize:'12px', fontWeight:600, marginBottom:'4px'}}>LOGO</p>
                        <p style={{fontSize:'12px'}}>{post.logo.version} — {post.logo.ubicacion} ({post.logo.margen})</p>
                      </>
                    )}
                    <CopyBtn text={`Titular: ${post.overlayText.titular}\nSubtítulo: ${post.overlayText.subtitulo}\nCTA visual: ${post.overlayText.ctaVisual}\nLogo: ${post.logo?.version} — ${post.logo?.ubicacion} (${post.logo?.margen})`} label="Copiar Textos + Logo" />
                  </div>
                )}
                <div className="data-block" style={{background:'#fff0eb'}}>
                  <p style={{fontSize:'12px', fontWeight:600, marginBottom:'8px', color:'var(--street-orange)'}}>NEGATIVE PROMPT</p>
                  <p style={{fontSize:'12px', color:'var(--street-orange)'}}>{post.negativePrompt}</p>
                  <CopyBtn text={post.negativePrompt} label="Copiar Negative" />
                </div>
              </>
            )}
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

// ── Ficha de Instagram en pestañas + navegación cronológica ──
const IG_TABS = ['RESUMEN','COPY','PROMPT VISUAL','FORMATO','PRODUCCIÓN'];
const CalendarPostModal = ({ post, list, num, weekInfo, onClose, onNav }: any) => {
  const [tab, setTab] = useState('RESUMEN');
  useEffect(() => { setTab('RESUMEN'); }, [post?.id]);
  if (!post) return null;
  const idx = list.findIndex((p: any) => p.id === post.id);
  const wi = weekInfo[post.id] || { pos: 1, total: 1 };
  const cat = categoryOf(post);
  const isVideo = ['reel','video','short'].includes(post.format);
  const isCarousel = ['carrusel','story','status'].includes(post.format);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ig-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header ig-modal-header">
          <div style={{minWidth:0}}>
            <p className="ig-pos">{num(post)} · SEMANA {post.week} · PUBLICACIÓN {wi.pos} DE {wi.total}</p>
            <h3 style={{fontSize:'17px'}}>{diaFecha(post.date)} · {post.time}</h3>
            <div className="ig-tags">
              <span className="tag tag-format">{post.format}</span>
              <span className="tag tag-cat">{cat}</span>
              <span className="tag tag-pilar">{post.pilar || '—'}</span>
              <span className="tag tag-status">{post.status}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={22}/></button>
        </div>
        <div className="ig-tabbar">
          {IG_TABS.map(t => <button key={t} className={`ig-tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>{t}</button>)}
        </div>
        <div className="modal-body ig-modal-body">
          {tab === 'RESUMEN' && (
            <div className="data-block">
              <p><strong>Título interno:</strong> {post.title}</p>
              <p><strong>Campaña:</strong> {post.campaign}</p>
              <p><strong>Categoría:</strong> {cat}</p>
              <p><strong>Pilar:</strong> {post.pilar || '—'}</p>
              <p><strong>Embudo:</strong> {post.funnel}</p>
              <p><strong>Objetivo:</strong> {post.objective}</p>
              <p><strong>Audiencia:</strong> {post.audience}</p>
              <p><strong>Estado:</strong> {post.status}</p>
            </div>
          )}
          {tab === 'COPY' && (
            <div className="data-block">
              <p style={{fontSize:'11px',fontWeight:700,color:'var(--text-secondary)'}}>COPY PUBLICABLE (se copia tal cual a Instagram)</p>
              <p style={{marginTop:'8px'}}>{post.copy}</p>
              <CopyBtn text={post.copy} label="Copiar Copy" />
              <br/>
              <p style={{marginTop:'12px'}}><strong>Primer comentario (fijado):</strong> {post.pinnedComment}</p>
            </div>
          )}
          {tab === 'PROMPT VISUAL' && (
            <div className="data-block">
              <p style={{fontSize:'11px',fontWeight:700,color:'var(--text-secondary)'}}>PROMPT COMPLETO PARA GENERACIÓN</p>
              <p style={{marginTop:'8px'}}>{post.promptCompleto || post.imagePrompt}</p>
              <CopyBtn text={post.promptCompleto || post.imagePrompt} label="Copiar Prompt Completo" />
              {!post.promptCompleto && post.negativePrompt && (<><br/><p style={{fontSize:'11px',fontWeight:700,color:'var(--street-orange)'}}>NEGATIVE PROMPT</p><p style={{color:'var(--street-orange)'}}>{post.negativePrompt}</p></>)}
            </div>
          )}
          {tab === 'TEXTO FINAL' && (
            <div className="data-block" style={{background:'#f2fbf3'}}>
              <p style={{fontSize:'11px',fontWeight:700,color:'#166534'}}>PROMPT PARA APLICAR EL TEXTO FINAL</p>
              {post.promptTextoFinal ? (
                <><p style={{marginTop:'8px'}}>{post.promptTextoFinal}</p><CopyBtn text={post.promptTextoFinal} label="Copiar Prompt de Texto" /></>
              ) : post.overlayText ? (
                <>
                  <p style={{marginTop:'8px'}}><strong>Titular:</strong> {post.overlayText.titular}</p>
                  <p><strong>Subtítulo:</strong> {post.overlayText.subtitulo}</p>
                  <p><strong>CTA visual:</strong> {post.overlayText.ctaVisual}</p>
                  {post.logo && <p><strong>Logo:</strong> {post.logo.version} — {post.logo.ubicacion} ({post.logo.margen})</p>}
                  <p style={{marginTop:'8px',fontSize:'12px',color:'var(--text-secondary)'}}>La imagen base se genera SIN texto y SIN logo; el texto se aplica después en diseño.</p>
                  <CopyBtn text={`Titular: ${post.overlayText.titular}\nSubtítulo: ${post.overlayText.subtitulo}\nCTA visual: ${post.overlayText.ctaVisual}`} label="Copiar Textos" />
                </>
              ) : <p style={{color:'var(--text-secondary)'}}>Sin datos de texto.</p>}
            </div>
          )}
          {tab === 'FORMATO' && (
            <div className="data-block">
              <p><strong>Formato:</strong> {post.format} · {post.resolution}</p>
              {isVideo && post.script && (<><br/><p style={{fontSize:'11px',fontWeight:700}}>GUION / ESCENAS</p><p>{post.script}</p></>)}
              {isVideo && post.motionPrompt && (<><br/><p style={{fontSize:'11px',fontWeight:700}}>MOVIMIENTO</p><p>{post.motionPrompt}</p><CopyBtn text={post.motionPrompt} label="Copiar Motion" /></>)}
              {isVideo && post.cover && (<p style={{marginTop:'8px'}}><strong>Portada:</strong> {post.cover}</p>)}
              {isCarousel && post.carouselTexts && (<><br/><p style={{fontSize:'11px',fontWeight:700}}>SECUENCIA / DIAPOSITIVAS</p>{post.carouselTexts.map((t: string, i: number) => <p key={i}><strong>{i+1}.</strong> {t}</p>)}</>)}
              {!isVideo && !isCarousel && <p style={{color:'var(--text-secondary)',fontSize:'13px'}}>Publicación de imagen única (feed). Sin diapositivas ni movimiento.</p>}
            </div>
          )}
          {tab === 'PRODUCCIÓN' && (
            <div className="data-block">
              <p><strong>Estado de imagen:</strong> {post.status}</p>
              <p><strong>Estado de producción:</strong> {post.productionStatus}</p>
              <p><strong>Ruta:</strong> {post.path}</p>
              {post.cover && <p><strong>Portada:</strong> {post.cover}</p>}
              <br/>
              <p><strong>Zona segura:</strong> {post.safeZone}</p>
              <p><strong>ALT:</strong> {post.alt}</p>
            </div>
          )}
        </div>
        <div className="ig-modal-footer">
          <button className="ig-nav-btn" onClick={() => onNav(-1)} disabled={idx <= 0}><ChevronLeft size={16}/> Anterior</button>
          <button className="ig-nav-btn ig-nav-center" onClick={onClose}>Volver a la semana</button>
          <button className="ig-nav-btn" onClick={() => onNav(1)} disabled={idx >= list.length - 1}>Siguiente <ChevronRight size={16}/></button>
        </div>
      </div>
    </div>
  );
};

const CalendarView = ({ network, profile, posts }: any) => {
  const [mainTab, setMainTab] = useState('pendientes');
  const { completed, toggleComplete } = useCompletedPosts();
  const [week, setWeek] = useState('all');
  const [fCat, setFCat] = useState('all');
  const [fFormat, setFFormat] = useState('all');
  const [sel, setSel] = useState<any>(null);

  const prefix = network.toLowerCase() === 'facebook' ? 'FB' : network.toLowerCase() === 'instagram' ? 'IG' : network.slice(0, 2).toUpperCase();
  const fullOrdered = useMemo(() => [...posts].sort(chronoSort), [posts]);
  const seqOf = useMemo(() => { const m: any = {}; fullOrdered.forEach((p: any, i: number) => { m[p.id] = i + 1; }); return m; }, [fullOrdered]);
  const weekInfo = useMemo(() => { const byW: any = {}; fullOrdered.forEach((p: any) => { (byW[p.week] = byW[p.week] || []).push(p); }); const m: any = {}; Object.values(byW).forEach((wl: any) => wl.forEach((p: any, i: number) => { m[p.id] = { pos: i + 1, total: wl.length }; })); return m; }, [fullOrdered]);
  const num = (p: any) => `${prefix}-${String(seqOf[p.id]).padStart(3, '0')}`;

  const formats = useMemo(() => Array.from(new Set(posts.map((p: any) => p.format))), [posts]);
  const ordered = useMemo(() => {
    let list = [...posts];
    if (fCat !== 'all') list = list.filter((p: any) => categoryOf(p) === fCat);
    if (fFormat !== 'all') list = list.filter((p: any) => p.format === fFormat);
    if (mainTab === 'pendientes') list = list.filter((p: any) => !completed.includes(p.id));
    if (mainTab === 'realizados') list = list.filter((p: any) => completed.includes(p.id));
    return list.sort(chronoSort);
  }, [posts, fCat, fFormat, mainTab, completed]);
  const byWeek = useMemo(() => { const g: any = {}; ordered.forEach((p: any) => { (g[p.week] = g[p.week] || []).push(p); }); return g; }, [ordered]);
  const allWeeks = Array.from(new Set(posts.map((p: any) => p.week))).sort((a: any, b: any) => a - b);
  const visibleWeeks = (week === 'all' ? allWeeks : [Number(week)]).filter((w: any) => byWeek[w]);

  const nav = (dir: number) => { const i = ordered.findIndex((p: any) => p.id === sel.id); const ni = i + dir; if (ni >= 0 && ni < ordered.length) setSel(ordered[ni]); };

  return (
    <div className="main-content">
      <div className="header">
        <h2>{network}</h2>
        <p style={{color:'var(--text-secondary)', marginTop:'8px'}}>Calendario editorial · 13 semanas en orden cronológico</p>
      </div>

      <div className="tabs">
        <div className={`tab ${mainTab==='pendientes'?'active':''}`} onClick={() => setMainTab('pendientes')}>Pendientes</div>
        <div className={`tab ${mainTab==='realizados'?'active':''}`} onClick={() => setMainTab('realizados')}>Realizados</div>
        <div className={`tab ${mainTab==='perfil'?'active':''}`} onClick={() => setMainTab('perfil')}>Perfil & Bios</div>
      </div>

      {mainTab === 'perfil' && profile && <ProfileView profile={profile} />}

      {(mainTab === 'pendientes' || mainTab === 'realizados') && (
        <>
          <div className="ig-toolbar">
            <label className="ig-filter">
              <span>Semana</span>
              <select value={week} onChange={e => setWeek(e.target.value)}>
                <option value="all">Todas las semanas</option>
                {allWeeks.map((w: any) => <option key={w} value={w}>Semana {w}</option>)}
              </select>
            </label>
            <label className="ig-filter">
              <span>Categoría</span>
              <select value={fCat} onChange={e => setFCat(e.target.value)}>
                <option value="all">Todas</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="ig-filter">
              <span>Formato</span>
              <select value={fFormat} onChange={e => setFFormat(e.target.value)}>
                <option value="all">Todos</option>
                {formats.map((f: any) => <option key={f} value={f}>{f}</option>)}
              </select>
            </label>
          </div>

          {visibleWeeks.length === 0 && <p style={{color:'var(--text-secondary)'}}>No hay publicaciones con esos filtros.</p>}

          {visibleWeeks.map((w: any) => {
            const list = byWeek[w];
            const ready = list.filter(isReady).length;
            const pend = list.length - ready;
            return (
              <div key={w} className="ig-week-block">
                <div className="ig-week-head">
                  <h3>Semana {w}</h3>
                  <span className="ig-week-stats">{list.length} publicaciones · {ready} listas · {pend} pendientes</span>
                </div>
                <div className="ig-cards">
                  {list.map((post: any) => (
                    <div key={post.id} className="ig-card" onClick={() => setSel(post)}>
                      <div className="ig-card-idrow">
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                          <input 
                            type="checkbox" 
                            checked={completed.includes(post.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleComplete(post.id);
                            }}
                            style={{width:'18px', height:'18px', cursor:'pointer'}}
                          />
                          <span className="ig-card-id">{num(post)}</span>
                        </div>
                        <span className="ig-card-pos">Sem {post.week} · {weekInfo[post.id]?.pos}/{weekInfo[post.id]?.total}</span>
                      </div>
                      
                      <div className="ig-card-title">{post.title}</div>
                      <div className="ig-tags">
                        <span className="tag tag-format">{post.format}</span>
                        <span className="tag tag-cat">{categoryOf(post)}</span>
                        <span className="tag tag-status">{post.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      <CalendarPostModal post={sel} list={ordered} num={num} weekInfo={weekInfo} onClose={() => setSel(null)} onNav={nav} />
    </div>
  );
};


const NetworkView = () => {
  const location = useLocation();
  const network = location.pathname.replace('/', '') || 'Instagram';
  const profile = profilesData.find(p => p.network.toLowerCase() === network.toLowerCase());
  const posts = postsData.filter(p => p.network.toLowerCase() === network.toLowerCase());
  return <CalendarView network={network} profile={profile} posts={posts} />;
};

export default function App() {
  const menu = [
    { name: 'Assets', path: '/', icon: Briefcase },
    { name: 'Instagram', path: '/Instagram', icon: ImageIcon },
    { name: 'Facebook', path: '/Facebook', icon: Users },
    { name: 'TikTok', path: '/TikTok', icon: Play },
    { name: 'WhatsApp', path: '/WhatsApp', icon: MessageCircle },
    { name: 'LinkedIn', path: '/LinkedIn', icon: Linkedin },
    { name: 'YouTube', path: '/YouTube', icon: Youtube }
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
