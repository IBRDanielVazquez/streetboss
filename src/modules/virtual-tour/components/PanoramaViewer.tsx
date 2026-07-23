import { useEffect, useRef, useState, useCallback } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import { Scene, Hotspot, TourConfig } from '../types';
import { Volume2, VolumeX, Maximize, Minimize, Play, ChevronLeft, ChevronRight, Share2, Phone } from 'lucide-react';

interface PanoramaViewerProps {
  config: TourConfig;
  activeScene: Scene;
  scenes: Scene[];
  onSceneChange: (sceneId: string) => void;
  mode: 'landing' | 'standalone' | 'editor';
  
  // Props específicas para el modo Editor
  onAddHotspotClick?: (yaw: number, pitch: number) => void;
  isAddingPoint?: boolean;
  onMoveHotspot?: (hotspotId: string, yaw: number, pitch: number) => void;
  activeEditHotspotId?: string;
  selectedHotspot?: Hotspot | null;
  onSelectHotspot?: (hs: Hotspot | null) => void;
}

// Helper para generar SVG de iconos Lucide comunes
function getIconSvg(iconName: string, color = '#c3a479'): string {
  const size = 24;
  let paths = '<circle cx="12" cy="12" r="10" />'; // Default circle
  
  switch (iconName.toLowerCase()) {
    case 'navigation':
    case 'map-pin':
      paths = '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />';
      break;
    case 'info':
      paths = '<circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />';
      break;
    case 'link':
    case 'external-link':
      paths = '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />';
      break;
    case 'whatsapp':
    case 'phone':
      paths = '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />';
      break;
    case 'galeria':
    case 'image':
      paths = '<rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />';
      break;
    case 'home':
      paths = '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />';
      break;
    case 'sparkles':
      paths = '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />';
      break;
    case 'dollar':
    case 'dollar-sign':
      paths = '<line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />';
      break;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tour-hs-svg">
      ${paths}
    </svg>
  `;
}

export default function PanoramaViewer({
  config,
  activeScene,
  scenes,
  onSceneChange,
  mode,
  onAddHotspotClick,
  isAddingPoint = false,
  onMoveHotspot,
  activeEditHotspotId,
  selectedHotspot,
  onSelectHotspot
}: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const markersPluginRef = useRef<MarkersPlugin | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [hasEntered, setHasEntered] = useState(mode !== 'landing');
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [infoPopup, setInfoPopup] = useState<{ title: string; description: string; color: string } | null>(null);

  // Inicializar audio de fondo
  useEffect(() => {
    if (mode === 'landing') return;
    audioRef.current = new Audio('https://www.soundjay.com/nature/sounds/countryside-1.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.1;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [mode]);

  // Manejar mute
  useEffect(() => {
    if (!audioRef.current) return;
    if (muted) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        console.warn('Reproducción de audio bloqueada por el navegador.');
        setMuted(true);
      });
    }
  }, [muted]);

  // Inicializar Photo Sphere Viewer
  useEffect(() => {
    if (!hasEntered || !containerRef.current) return;

    // Destruir visor anterior si existe
    if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }

    setLoading(true);

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: activeScene.panorama,
      caption: activeScene.title,
      defaultYaw: activeScene.initialView.yaw || 0,
      defaultPitch: activeScene.initialView.pitch || 0,
      defaultZoomLvl: 0,
      navbar: false, // Desactivar navbar por defecto para barra personalizada
      plugins: [
        [MarkersPlugin, {}]
      ]
    });

    viewerRef.current = viewer;
    const markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin;
    markersPluginRef.current = markersPlugin;

    viewer.addEventListener('ready', () => {
      setLoading(false);
    });

    // Escuchar clicks para agregar hotspots (solo modo Editor)
    if (mode === 'editor') {
      viewer.addEventListener('click', ({ data }) => {
        // data.yaw y data.pitch contienen las coordenadas exactas de la esfera
        if (isAddingPoint && onAddHotspotClick) {
          onAddHotspotClick(data.yaw, data.pitch);
        }
      });
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [hasEntered, activeScene.id, mode]); // Recargar solo si cambia la escena o el modo

  // Actualizar marcadores cuando cambian los hotspots o el estado de edición
  useEffect(() => {
    const markersPlugin = markersPluginRef.current;
    if (!markersPlugin) return;

    // Limpiar marcadores anteriores
    markersPlugin.clearMarkers();

    // Agregar hotspots aprobados y habilitados (o todos en modo editor)
    const hotspotsToRender = mode === 'editor' 
      ? activeScene.hotspots 
      : activeScene.hotspots.filter(hs => hs.approved && hs.enabled);

    hotspotsToRender.forEach(hs => {
      const isSelected = activeEditHotspotId === hs.id;
      const markerHtml = `
        <div class="tour-marker ${isSelected ? 'is-selected' : ''}" style="--hs-color: ${hs.color}">
          <div class="tour-marker-icon">
            ${getIconSvg(hs.icono, hs.color)}
          </div>
          <div class="tour-marker-pulse" style="background-color: ${hs.color}"></div>
          <span class="tour-marker-label">${hs.titulo}</span>
        </div>
      `;

      markersPlugin.addMarker({
        id: hs.id,
        position: { yaw: hs.yaw, pitch: hs.pitch },
        html: markerHtml,
        anchor: 'bottom center',
        draggable: mode === 'editor', // Solo drag en editor
        data: hs
      });
    });

    // Escuchar eventos de marcadores
    const handleSelectMarker = (e: any) => {
      const hs = e.marker.data as Hotspot;
      if (!hs) return;

      if (mode === 'editor') {
        if (onSelectHotspot) onSelectHotspot(hs);
      } else {
        // Modo visitante: ejecutar acción del hotspot
        if (hs.tipo === 'navigation' && hs.destino) {
          onSceneChange(hs.destino);
        } else if (hs.tipo === 'info') {
          setInfoPopup({ title: hs.titulo, description: hs.descripcion, color: hs.color });
        } else if (hs.tipo === 'link' && hs.url) {
          window.open(hs.url, '_blank');
        } else if (hs.tipo === 'whatsapp' && hs.url) {
          window.open(hs.url, '_blank');
        }
      }
    };

    const handleDragMarker = (e: any) => {
      if (mode === 'editor' && onMoveHotspot) {
        onMoveHotspot(e.marker.id, e.position.yaw, e.position.pitch);
      }
    };

    markersPlugin.addEventListener('select-marker', handleSelectMarker);
    markersPlugin.addEventListener('drag-marker', handleDragMarker);

    return () => {
      markersPlugin.removeEventListener('select-marker', handleSelectMarker);
      markersPlugin.removeEventListener('drag-marker', handleDragMarker);
    };
  }, [activeScene.hotspots, mode, activeEditHotspotId, isAddingPoint, onSceneChange, onSelectHotspot, onMoveHotspot]);

  // Manejar pantalla completa
  const toggleFullscreen = () => {
    const el = containerRef.current?.parentElement;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => {
        console.error('Error al entrar en fullscreen', err);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // Escuchar cambio en fullscreen nativo
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Compartir en WhatsApp
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${config.WhatsApp.message} ${window.location.origin}${config.rutas.tour}`);
    window.open(`https://wa.me/${config.WhatsApp.number}?text=${text}`, '_blank');
  };

  // Renderizar portada
  if (!hasEntered) {
    return (
      <div 
        className="tour-portal-cover" 
        style={{ backgroundImage: `url(${config.Portada.backgroundImage})` }}
      >
        <div className="tour-portal-overlay"></div>
        <div className="tour-portal-content">
          <span className="tour-portal-badge">EXPERIENCIA VIRTUAL 360°</span>
          <h1 className="tour-portal-title">{config.Portada.title}</h1>
          <p className="tour-portal-subtitle">{config.Portada.subtitle}</p>
          <button 
            onClick={() => setHasEntered(true)} 
            className="tour-portal-enter-btn"
            style={{ backgroundColor: config.colores.accent }}
          >
            <Play size={20} fill="currentColor" />
            Comenzar Recorrido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`tour-viewer-wrapper ${isFullscreen ? 'is-fullscreen' : ''}`}>
      {/* Barra Superior */}
      <div className="tour-viewer-header" style={{ backgroundColor: `${config.colores.primary}dd` }}>
        <div className="tour-header-info">
          <h2 className="tour-title">{config.nombre}</h2>
          <span className="tour-scene-title" style={{ color: config.colores.secondary }}>
            {activeScene.title}
          </span>
        </div>

        <div className="tour-header-actions">
          {mode !== 'editor' && (
            <>
              <button onClick={() => setMuted(!muted)} className="tour-nav-btn" title="Audio">
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button onClick={handleShareWhatsApp} className="tour-nav-btn text-[#25D366]" title="Compartir WhatsApp">
                <Phone size={18} />
              </button>
            </>
          )}
          <button onClick={toggleFullscreen} className="tour-nav-btn" title="Pantalla Completa">
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {/* Visor WebGL */}
      <div className="tour-canvas-container">
        {loading && (
          <div className="tour-loader-overlay">
            <div className="tour-loader-spinner" style={{ borderTopColor: config.colores.accent }}></div>
            <span className="tour-loader-text">Cargando espacio 360°...</span>
          </div>
        )}
        <div ref={containerRef} className="h-full w-full bg-black" />
        
        {/* Leyenda de Agregar Punto en Editor */}
        {mode === 'editor' && isAddingPoint && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-yellow-600/90 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg pointer-events-none z-20 border border-yellow-500 animate-bounce">
            Haz clic en cualquier parte de la imagen para posicionar el Hotspot
          </div>
        )}

        {/* Popup de Información */}
        {infoPopup && (
          <div className="tour-info-popup-overlay" onClick={() => setInfoPopup(null)}>
            <div className="tour-info-popup" style={{ borderTop: `4px solid ${infoPopup.color}` }} onClick={e => e.stopPropagation()}>
              <h3 className="tour-popup-title" style={{ color: infoPopup.color }}>{infoPopup.title}</h3>
              <p className="tour-popup-desc">{infoPopup.description}</p>
              <button onClick={() => setInfoPopup(null)} className="tour-popup-close-btn" style={{ backgroundColor: infoPopup.color }}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Carrusel de Escenas Inferior */}
      {mode !== 'editor' && scenes.filter(s => s.approved && s.enabled).length > 1 && (
        <div className="tour-viewer-footer" style={{ backgroundColor: `${config.colores.primary}ee` }}>
          <div className="tour-thumbnails-track">
            {scenes.filter(s => s.approved && s.enabled).map((sc) => (
              <button
                key={sc.id}
                onClick={() => onSceneChange(sc.id)}
                className={`tour-thumb-card ${activeScene.id === sc.id ? 'is-active' : ''}`}
                style={{ borderColor: activeScene.id === sc.id ? config.colores.accent : 'transparent' }}
              >
                <img src={sc.thumb} alt={sc.title} className="tour-thumb-img" />
                <span className="tour-thumb-label">{sc.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
