import { useState, useEffect, useCallback } from 'react';
import { TourConfig, Scene, Hotspot } from '../types';
import { defaultTourConfig } from '../config/project-tour.config';

const STORAGE_KEY = 'streetboss-360-tour-draft-v1';

export function useTourState() {
  const [config, setConfig] = useState<TourConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as TourConfig;
          if (parsed && parsed.scenes && parsed.scenes.length > 0) {
            console.log('[Virtual Tour] Borrador cargado exitosamente desde localStorage.');
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error al cargar borrador de localStorage', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return defaultTourConfig;
  });

  const [activeSceneId, setActiveSceneId] = useState<string>(() => {
    return config.scenes[0]?.id ?? '';
  });

  // Guardar borrador en localStorage
  const saveDraft = useCallback((currentConfig: TourConfig) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
      } catch (e) {
        console.error('Error al guardar borrador en localStorage', e);
      }
    }
  }, []);

  // Actualizar config y guardar borrador
  const updateConfig = useCallback((newConfig: TourConfig) => {
    setConfig(newConfig);
    saveDraft(newConfig);
  }, [saveDraft]);

  // Restaurar configuración original
  const restoreOriginalConfig = useCallback(() => {
    updateConfig(defaultTourConfig);
    if (defaultTourConfig.scenes.length > 0) {
      setActiveSceneId(defaultTourConfig.scenes[0].id);
    }
  }, [updateConfig]);

  // Importar JSON completo
  const importJSONConfig = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString) as TourConfig;
      if (parsed && parsed.id && parsed.scenes && Array.isArray(parsed.scenes)) {
        updateConfig(parsed);
        if (parsed.scenes.length > 0) {
          setActiveSceneId(parsed.scenes[0].id);
        }
        return true;
      }
    } catch (e) {
      console.error('Error al importar archivo JSON', e);
    }
    return false;
  }, [updateConfig]);

  // ESCENAS
  const addScene = useCallback((newScene: Scene) => {
    const updatedScenes = [...config.scenes, newScene];
    const updatedConfig = { ...config, scenes: updatedScenes };
    updateConfig(updatedConfig);
  }, [config, updateConfig]);

  const editScene = useCallback((sceneId: string, updatedFields: Partial<Scene>) => {
    const updatedScenes = config.scenes.map(scene => {
      if (scene.id === sceneId) {
        return { ...scene, ...updatedFields };
      }
      return scene;
    });
    updateConfig({ ...config, scenes: updatedScenes });
  }, [config, updateConfig]);

  const deleteScene = useCallback((sceneId: string) => {
    const updatedScenes = config.scenes.filter(scene => scene.id !== sceneId);
    
    // Si borramos la escena activa, cambiar a la primera disponible
    if (activeSceneId === sceneId && updatedScenes.length > 0) {
      setActiveSceneId(updatedScenes[0].id);
    }
    
    // Limpiar hotspots de navegación en otras escenas que apuntaban a esta
    const cleanedScenes = updatedScenes.map(scene => {
      const cleanedHotspots = scene.hotspots.filter(hs => hs.destino !== sceneId);
      return { ...scene, hotspots: cleanedHotspots };
    });

    updateConfig({ ...config, scenes: cleanedScenes });
  }, [config, activeSceneId, updateConfig]);

  const duplicateScene = useCallback((sceneId: string) => {
    const sceneToDup = config.scenes.find(s => s.id === sceneId);
    if (!sceneToDup) return;

    const newId = `${sceneId}-dup-${Date.now()}`;
    const duplicated: Scene = {
      ...sceneToDup,
      id: newId,
      title: `${sceneToDup.title} (Copia)`,
      order: config.scenes.length + 1,
      // Duplicar hotspots pero con el nuevo parent sceneId
      hotspots: sceneToDup.hotspots.map(hs => ({
        ...hs,
        id: `hs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sceneId: newId
      }))
    };

    updateConfig({ ...config, scenes: [...config.scenes, duplicated] });
  }, [config, updateConfig]);

  const reorderScenes = useCallback((startIndex: number, endIndex: number) => {
    const result = Array.from(config.scenes);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    // Actualizar campo order de forma secuencial
    const updated = result.map((scene, index) => ({
      ...scene,
      order: index + 1
    }));

    updateConfig({ ...config, scenes: updated });
  }, [config, updateConfig]);

  // HOTSPOTS
  const addHotspot = useCallback((sceneId: string, hotspot: Omit<Hotspot, 'id' | 'sceneId'>) => {
    const newHotspot: Hotspot = {
      ...hotspot,
      id: `hs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sceneId
    };

    const updatedScenes = config.scenes.map(scene => {
      if (scene.id === sceneId) {
        return {
          ...scene,
          hotspots: [...scene.hotspots, newHotspot]
        };
      }
      return scene;
    });

    updateConfig({ ...config, scenes: updatedScenes });
    return newHotspot;
  }, [config, updateConfig]);

  const editHotspot = useCallback((sceneId: string, hotspotId: string, updatedFields: Partial<Hotspot>) => {
    const updatedScenes = config.scenes.map(scene => {
      if (scene.id === sceneId) {
        const updatedHotspots = scene.hotspots.map(hs => {
          if (hs.id === hotspotId) {
            return { ...hs, ...updatedFields };
          }
          return hs;
        });
        return { ...scene, hotspots: updatedHotspots };
      }
      return scene;
    });

    updateConfig({ ...config, scenes: updatedScenes });
  }, [config, updateConfig]);

  const deleteHotspot = useCallback((sceneId: string, hotspotId: string) => {
    const updatedScenes = config.scenes.map(scene => {
      if (scene.id === sceneId) {
        return {
          ...scene,
          hotspots: scene.hotspots.filter(hs => hs.id !== hotspotId)
        };
      }
      return scene;
    });

    updateConfig({ ...config, scenes: updatedScenes });
  }, [config, updateConfig]);

  return {
    config,
    activeSceneId,
    setActiveSceneId,
    activeScene: config.scenes.find(s => s.id === activeSceneId),
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
  };
}
export type UseTourStateReturn = ReturnType<typeof useTourState>;
