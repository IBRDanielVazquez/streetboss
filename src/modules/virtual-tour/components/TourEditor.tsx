import { useState, useRef, useCallback } from 'react';
import { useTourState } from '../hooks/useTourState';
import PanoramaViewer from './PanoramaViewer';
import { validate360Image } from '../utils/validation';
import { Scene, Hotspot, HotspotType } from '../types';
import { 
  Plus, Trash2, Copy, Download, RefreshCw, Eye, Edit2, 
  Settings, CheckCircle, XCircle, ArrowUp, ArrowDown, CopyPlus, 
  Upload, Sparkles, HelpCircle, Save, Check
} from 'lucide-react';

export default function TourEditor() {
  const {
    config,
    activeSceneId,
    setActiveSceneId,
    activeScene,
    restoreOriginalConfig,
    importJSONConfig,
    addScene,
    editScene,
    deleteScene,
    duplicateScene,
    reorderScenes,
    addHotspot,
    editHotspot,
    deleteHotspot
  } = useTourState();

  const [isEditMode, setIsEditMode] = useState(true);
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  
  // Modal de Agregar Imagen
  const [showAddSceneModal, setShowAddSceneModal] = useState(false);
  const [newSceneTitle, setNewSceneTitle] = useState('');
  const [newSceneFile, setNewSceneFile] = useState<File | null>(null);
  const [newScenePreview, setNewScenePreview] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [newSceneEnabled, setNewSceneEnabled] = useState(true);
  const [newSceneApproved, setNewSceneApproved] = useState(true);

  // Formulario de edición de Escena
  const [editingSceneInfo, setEditingSceneInfo] = useState<Scene | null>(null);

  // Copiado a portapapeles
  const [copied, setCopied] = useState(false);

  // Agregar hotspot al hacer clic en el visor
  const handleAddHotspotClick = useCallback((yaw: number, pitch: number) => {
    if (!activeScene) return;
    
    const newHs = addHotspot(activeScene.id, {
      yaw,
      pitch,
      tipo: 'info',
      titulo: 'Nuevo Hotspot',
      descripcion: 'Ingresa una descripción aquí.',
      color: '#c3a479',
      icono: 'info',
      approved: true,
      enabled: true
    });

    setSelectedHotspot(newHs);
    setIsAddingPoint(false);
  }, [activeScene, addHotspot]);

  // Mover hotspot (drag & drop en el visor)
  const handleMoveHotspot = useCallback((hotspotId: string, yaw: number, pitch: number) => {
    if (!activeScene) return;
    editHotspot(activeScene.id, hotspotId, { yaw, pitch });
    
    // Si es el hotspot actualmente seleccionado, actualizar sus coordenadas en el formulario
    setSelectedHotspot(prev => {
      if (prev && prev.id === hotspotId) {
        return { ...prev, yaw, pitch };
      }
      return prev;
    });
  }, [activeScene, editHotspot]);

  // Selección de archivo de imagen 360
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError(null);
    setNewSceneFile(file);

    // Ejecutar validaciones locales exigidas
    const result = await validate360Image(file);
    if (!result.isValid) {
      setValidationError(result.error || 'Imagen inválida');
      setNewScenePreview('');
      return;
    }

    // Crear preview local (No se sube automáticamente, vive en memoria del navegador)
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewScenePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Guardar nueva escena
  const handleSaveNewScene = () => {
    if (!newSceneTitle.trim() || !newScenePreview) return;

    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      order: config.scenes.length + 1,
      title: newSceneTitle,
      panorama: newScenePreview, // Se guarda en Base64 / Blob URL en local
      thumb: newScenePreview,
      enabled: newSceneEnabled,
      approved: newSceneApproved,
      initialView: {
        yaw: 0,
        pitch: 0,
        hfov: 100
      },
      hotspots: []
    };

    addScene(newScene);
    setActiveSceneId(newScene.id);
    
    // Limpiar formulario modal
    setNewSceneTitle('');
    setNewSceneFile(null);
    setNewScenePreview('');
    setValidationError(null);
    setShowAddSceneModal(false);
  };

  // Copiar configuración al portapapeles
  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Descargar archivo JSON
  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${config.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Cargar archivo JSON para restaurar
  const handleUploadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultString = event.target?.result as string;
      if (resultString) {
        const success = importJSONConfig(resultString);
        if (success) {
          alert('Configuración importada exitosamente.');
        } else {
          alert('Error al importar la configuración. Verifica el formato del archivo.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#080a08] text-gray-200 font-sans">
      {/* Barra de Control Superior */}
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#121713] border-b border-green-900/30">
        <div className="flex items-center gap-3">
          <Sparkles className="text-yellow-600" size={24} />
          <div>
            <h1 className="text-lg font-semibold text-white">Dashboard Recorrido Virtual 360°</h1>
            <p className="text-xs text-gray-400">StreetBoss Proyecto Aislado</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Switch de modo */}
          <div className="flex items-center bg-[#080a08] rounded-lg p-1 border border-green-900/20">
            <button 
              onClick={() => setIsEditMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                isEditMode ? 'bg-[#c3a479] text-[#1e3224]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Settings size={14} />
              Editor
            </button>
            <button 
              onClick={() => {
                setIsEditMode(false);
                setSelectedHotspot(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                !isEditMode ? 'bg-[#c3a479] text-[#1e3224]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye size={14} />
              Visitante
            </button>
          </div>

          <button 
            onClick={handleCopyConfig} 
            className="flex items-center gap-1.5 px-3 py-2 bg-green-900/20 border border-green-800/30 hover:border-green-600/50 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Copiado!' : 'Copiar Config'}
          </button>

          <button 
            onClick={handleDownloadJSON} 
            className="flex items-center gap-1.5 px-3 py-2 bg-green-900/20 border border-green-800/30 hover:border-green-600/50 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition"
          >
            <Download size={14} />
            Descargar JSON
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2 bg-green-900/20 border border-green-800/30 hover:border-green-600/50 rounded-lg text-xs font-medium text-gray-300 hover:text-white cursor-pointer transition">
            <Upload size={14} />
            Restaurar
            <input type="file" accept=".json" onChange={handleUploadJSON} className="hidden" />
          </label>

          <button 
            onClick={restoreOriginalConfig} 
            className="flex items-center gap-1.5 px-3 py-2 bg-red-950/20 border border-red-900/30 hover:border-red-600/50 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 transition"
          >
            <RefreshCw size={14} />
            Restaurar Config Original
          </button>
        </div>
      </header>

      {/* Workspace Principal */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Panel Izquierdo: Gestión de Escenas (solo visible en modo editor) */}
        {isEditMode && (
          <aside className="w-full lg:w-80 bg-[#121713] border-r border-green-900/30 p-4 flex flex-col gap-4 overflow-y-auto max-h-[50vh] lg:max-h-none">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Escenas ({config.scenes.length})</h2>
              <button 
                onClick={() => setShowAddSceneModal(true)} 
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#c3a479] hover:bg-[#b09166] text-[#1e3224] rounded-md text-xs font-bold transition"
              >
                <Plus size={14} />
                Agregar 360°
              </button>
            </div>

            {/* Listado de escenas */}
            <div className="flex flex-col gap-2.5">
              {config.scenes.map((scene, idx) => (
                <div 
                  key={scene.id}
                  onClick={() => {
                    setActiveSceneId(scene.id);
                    setSelectedHotspot(null);
                  }}
                  className={`group relative flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition ${
                    activeSceneId === scene.id 
                      ? 'bg-green-950/20 border-[#c3a479]' 
                      : 'bg-[#080a08] border-green-900/10 hover:border-green-800/30'
                  }`}
                >
                  <img src={scene.thumb} alt={scene.title} className="w-12 h-9 object-cover rounded border border-green-900/30" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-white truncate">{scene.title}</p>
                      {scene.approved && <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Aprobado" />}
                      {!scene.enabled && <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="Desactivado" />}
                    </div>
                    <p className="text-[10px] text-gray-500">Orden: {scene.order} • {scene.hotspots.length} hotspots</p>
                  </div>

                  {/* Acciones de reordenamiento e info */}
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (idx > 0) reorderScenes(idx, idx - 1);
                      }} 
                      disabled={idx === 0}
                      className="text-gray-500 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (idx < config.scenes.length - 1) reorderScenes(idx, idx + 1);
                      }} 
                      disabled={idx === config.scenes.length - 1}
                      className="text-gray-500 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  {/* Botón de configuración/edición rápida */}
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-[#121713]/90 px-1 py-0.5 rounded shadow">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSceneInfo(scene);
                      }} 
                      className="text-gray-400 hover:text-white p-1"
                      title="Editar metadatos"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateScene(scene.id);
                      }} 
                      className="text-gray-400 hover:text-green-400 p-1"
                      title="Duplicar"
                    >
                      <CopyPlus size={12} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('¿Eliminar esta escena? Se borrarán todos sus hotspots.')) {
                          deleteScene(scene.id);
                        }
                      }} 
                      className="text-gray-400 hover:text-red-400 p-1"
                      title="Eliminar"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Visor 360° Central */}
        <main className="flex-1 relative flex flex-col bg-black min-h-[50vh] lg:min-h-0">
          {activeScene ? (
            <div className="absolute inset-0 flex flex-col">
              {/* Botón de Agregar Hotspot (solo en Editor) */}
              {isEditMode && (
                <div className="absolute top-20 left-4 z-10">
                  <button 
                    onClick={() => {
                      setIsAddingPoint(!isAddingPoint);
                      setSelectedHotspot(null);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold shadow-lg transition ${
                      isAddingPoint 
                        ? 'bg-yellow-600 hover:bg-yellow-500 text-white' 
                        : 'bg-[#c3a479] hover:bg-[#b09166] text-[#1e3224]'
                    }`}
                  >
                    <Plus size={16} />
                    {isAddingPoint ? 'Cancelar Selección' : 'Agregar Hotspot'}
                  </button>
                </div>
              )}

              <PanoramaViewer
                config={config}
                activeScene={activeScene}
                scenes={config.scenes}
                onSceneChange={setActiveSceneId}
                mode={isEditMode ? 'editor' : 'standalone'}
                onAddHotspotClick={handleAddHotspotClick}
                isAddingPoint={isAddingPoint}
                onMoveHotspot={handleMoveHotspot}
                activeEditHotspotId={selectedHotspot?.id}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={setSelectedHotspot}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <HelpCircle size={48} className="mb-2" />
              <p>No hay escenas configuradas. Agrega una imagen 360° para comenzar.</p>
            </div>
          )}
        </main>

        {/* Panel Derecho: Propiedades de Hotspot (solo visible en modo editor) */}
        {isEditMode && (
          <aside className="w-full lg:w-80 bg-[#121713] border-l border-green-900/30 p-4 flex flex-col gap-4 overflow-y-auto max-h-[50vh] lg:max-h-none">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Propiedades del Hotspot</h2>

            {selectedHotspot && activeScene ? (
              <div className="flex flex-col gap-4">
                {/* Tipo de Hotspot */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Tipo</label>
                  <select 
                    value={selectedHotspot.tipo}
                    onChange={(e) => {
                      const tipo = e.target.value as HotspotType;
                      editHotspot(activeScene.id, selectedHotspot.id, { tipo });
                      setSelectedHotspot({ ...selectedHotspot, tipo });
                    }}
                    className="bg-[#080a08] border border-green-900/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#c3a479]"
                  >
                    <option value="info">Información (Info Popup)</option>
                    <option value="navigation">Navegación (Cambiar Escena)</option>
                    <option value="link">Enlace Externo (URL)</option>
                    <option value="whatsapp">Enlace a WhatsApp</option>
                  </select>
                </div>

                {/* Título */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Título</label>
                  <input 
                    type="text" 
                    value={selectedHotspot.titulo}
                    onChange={(e) => {
                      const titulo = e.target.value;
                      editHotspot(activeScene.id, selectedHotspot.id, { titulo });
                      setSelectedHotspot({ ...selectedHotspot, titulo });
                    }}
                    className="bg-[#080a08] border border-green-900/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#c3a479]"
                  />
                </div>

                {/* Descripción */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Descripción</label>
                  <textarea 
                    value={selectedHotspot.descripcion}
                    onChange={(e) => {
                      const descripcion = e.target.value;
                      editHotspot(activeScene.id, selectedHotspot.id, { descripcion });
                      setSelectedHotspot({ ...selectedHotspot, descripcion });
                    }}
                    rows={3}
                    className="bg-[#080a08] border border-green-900/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#c3a479] resize-none"
                  />
                </div>

                {/* Destino (solo para navegación) */}
                {selectedHotspot.tipo === 'navigation' && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Escena de Destino</label>
                    <select 
                      value={selectedHotspot.destino || ''}
                      onChange={(e) => {
                        const destino = e.target.value;
                        editHotspot(activeScene.id, selectedHotspot.id, { destino });
                        setSelectedHotspot({ ...selectedHotspot, destino });
                      }}
                      className="bg-[#080a08] border border-green-900/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#c3a479]"
                    >
                      <option value="">Selecciona destino...</option>
                      {config.scenes.filter(s => s.id !== activeScene.id).map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* URL (para Enlaces o WhatsApp) */}
                {(selectedHotspot.tipo === 'link' || selectedHotspot.tipo === 'whatsapp') && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Enlace / URL</label>
                    <input 
                      type="text" 
                      value={selectedHotspot.url || ''}
                      placeholder={selectedHotspot.tipo === 'whatsapp' ? 'https://wa.me/...' : 'https://...'}
                      onChange={(e) => {
                        const url = e.target.value;
                        editHotspot(activeScene.id, selectedHotspot.id, { url });
                        setSelectedHotspot({ ...selectedHotspot, url });
                      }}
                      className="bg-[#080a08] border border-green-900/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#c3a479]"
                    />
                  </div>
                )}

                {/* Selector de Icono */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Icono</label>
                  <select 
                    value={selectedHotspot.icono}
                    onChange={(e) => {
                      const icono = e.target.value;
                      editHotspot(activeScene.id, selectedHotspot.id, { icono });
                      setSelectedHotspot({ ...selectedHotspot, icono });
                    }}
                    className="bg-[#080a08] border border-green-900/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#c3a479]"
                  >
                    <option value="info">Información (Info)</option>
                    <option value="navigation">Navegación (Brújula)</option>
                    <option value="link">Enlace (Vínculo)</option>
                    <option value="whatsapp">Llamar / WhatsApp</option>
                    <option value="image">Galería / Foto</option>
                    <option value="home">Casa / Terreno</option>
                    <option value="sparkles">Estrellas / Destacado</option>
                    <option value="dollar-sign">Precios / Moneda</option>
                  </select>
                </div>

                {/* Selector de Color */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Color del Hotspot</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={selectedHotspot.color}
                      onChange={(e) => {
                        const color = e.target.value;
                        editHotspot(activeScene.id, selectedHotspot.id, { color });
                        setSelectedHotspot({ ...selectedHotspot, color });
                      }}
                      className="bg-transparent border border-green-900/20 w-8 h-8 rounded cursor-pointer"
                    />
                    <span className="text-xs text-gray-300 font-mono">{selectedHotspot.color}</span>
                  </div>
                </div>

                {/* Habilitado / Aprobado */}
                <div className="flex flex-col gap-3 py-2 border-t border-b border-green-900/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Habilitado</span>
                    <input 
                      type="checkbox"
                      checked={selectedHotspot.enabled}
                      onChange={(e) => {
                        const enabled = e.target.checked;
                        editHotspot(activeScene.id, selectedHotspot.id, { enabled });
                        setSelectedHotspot({ ...selectedHotspot, enabled });
                      }}
                      className="accent-[#c3a479]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Aprobado</span>
                    <input 
                      type="checkbox"
                      checked={selectedHotspot.approved}
                      onChange={(e) => {
                        const approved = e.target.checked;
                        editHotspot(activeScene.id, selectedHotspot.id, { approved });
                        setSelectedHotspot({ ...selectedHotspot, approved });
                      }}
                      className="accent-[#c3a479]"
                    />
                  </div>
                </div>

                {/* Coordenadas */}
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                  <span>Yaw: {selectedHotspot.yaw.toFixed(4)} rad</span>
                  <span>Pitch: {selectedHotspot.pitch.toFixed(4)} rad</span>
                </div>

                {/* Botón de Eliminar */}
                <button 
                  onClick={() => {
                    if (confirm('¿Eliminar este hotspot?')) {
                      deleteHotspot(activeScene.id, selectedHotspot.id);
                      setSelectedHotspot(null);
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 rounded-lg text-xs font-semibold transition"
                >
                  <Trash2 size={14} />
                  Eliminar Hotspot
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 text-xs">
                Haz clic en un hotspot existente en el visor para editarlo, o activa &quot;Agregar Hotspot&quot; para colocar uno nuevo en la esfera.
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Modal: Agregar Escena / Imagen 360 */}
      {showAddSceneModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#121713] border border-green-900/30 w-full max-w-md rounded-xl p-6 shadow-2xl flex flex-col gap-4 animate-scaleUp">
            <h3 className="text-base font-bold text-white border-b border-green-900/20 pb-2 flex items-center gap-2">
              <Upload size={18} className="text-[#c3a479]" />
              Agregar Imagen 360°
            </h3>

            {/* Campo: Título de la escena */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Título de la escena</label>
              <input 
                type="text"
                placeholder="Ej. Alberca, Casa Club, Recámara..."
                value={newSceneTitle}
                onChange={e => setNewSceneTitle(e.target.value)}
                className="bg-[#080a08] border border-green-900/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#c3a479]"
              />
            </div>

            {/* Campo: Selector de Imagen */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">Archivo de Imagen 360° (Equirectangular 2:1)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-950/40 file:text-gray-300 hover:file:bg-green-900/60 file:cursor-pointer"
              />
            </div>

            {/* Alertas de error de validación */}
            {validationError && (
              <div className="bg-red-950/20 border border-red-900/40 text-red-400 p-3 rounded-lg text-xs leading-relaxed">
                <strong>Error de Validación:</strong> {validationError}
              </div>
            )}

            {/* Vista previa local */}
            {newScenePreview && !validationError && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-green-400 font-semibold">✓ Imagen validada correctamente en formato 2:1</span>
                <img src={newScenePreview} alt="Preview 360" className="w-full h-32 object-cover rounded border border-green-900/30" />
              </div>
            )}

            {/* Opciones adicionales */}
            {newScenePreview && !validationError && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-green-900/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Habilitada</span>
                  <input 
                    type="checkbox" 
                    checked={newSceneEnabled}
                    onChange={e => setNewSceneEnabled(e.target.checked)}
                    className="accent-[#c3a479]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Aprobada</span>
                  <input 
                    type="checkbox" 
                    checked={newSceneApproved}
                    onChange={e => setNewSceneApproved(e.target.checked)}
                    className="accent-[#c3a479]"
                  />
                </div>
              </div>
            )}

            {/* Acciones de Modal */}
            <div className="flex justify-end gap-3 mt-2 border-t border-green-900/10 pt-4">
              <button 
                onClick={() => {
                  setNewSceneTitle('');
                  setNewSceneFile(null);
                  setNewScenePreview('');
                  setValidationError(null);
                  setShowAddSceneModal(false);
                }}
                className="px-4 py-2 border border-green-900/20 hover:bg-green-950/20 rounded-lg text-xs font-semibold text-gray-400 hover:text-white transition"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveNewScene}
                disabled={!newSceneTitle.trim() || !newScenePreview || !!validationError}
                className="px-4 py-2 bg-[#c3a479] disabled:opacity-40 hover:bg-[#b09166] text-[#1e3224] rounded-lg text-xs font-bold transition"
              >
                Agregar Escena
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Metadatos de Escena */}
      {editingSceneInfo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#121713] border border-green-900/30 w-full max-w-md rounded-xl p-6 shadow-2xl flex flex-col gap-4 animate-scaleUp">
            <h3 className="text-base font-bold text-white border-b border-green-900/20 pb-2 flex items-center gap-2">
              <Settings size={18} className="text-[#c3a479]" />
              Configurar Escena
            </h3>

            {/* Editar Título */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Título de la escena</label>
              <input 
                type="text"
                value={editingSceneInfo.title}
                onChange={e => setEditingSceneInfo({ ...editingSceneInfo, title: e.target.value })}
                className="bg-[#080a08] border border-green-900/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#c3a479]"
              />
            </div>

            {/* Habilitado / Aprobado */}
            <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-green-900/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Habilitada</span>
                <input 
                  type="checkbox" 
                  checked={editingSceneInfo.enabled}
                  onChange={e => setEditingSceneInfo({ ...editingSceneInfo, enabled: e.target.checked })}
                  className="accent-[#c3a479]"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Aprobada</span>
                <input 
                  type="checkbox" 
                  checked={editingSceneInfo.approved}
                  onChange={e => setEditingSceneInfo({ ...editingSceneInfo, approved: e.target.checked })}
                  className="accent-[#c3a479]"
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setEditingSceneInfo(null)}
                className="px-4 py-2 border border-green-900/20 hover:bg-green-950/20 rounded-lg text-xs font-semibold text-gray-400 hover:text-white transition"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  editScene(editingSceneInfo.id, {
                    title: editingSceneInfo.title,
                    enabled: editingSceneInfo.enabled,
                    approved: editingSceneInfo.approved
                  });
                  setEditingSceneInfo(null);
                }}
                className="px-4 py-2 bg-[#c3a479] text-[#1e3224] rounded-lg text-xs font-bold transition"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
