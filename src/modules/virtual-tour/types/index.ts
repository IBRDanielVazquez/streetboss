export type HotspotType = 
  | 'navigation' 
  | 'info' 
  | 'link' 
  | 'whatsapp' 
  | 'galeria';

export interface Hotspot {
  id: string;
  sceneId: string; // ID de la escena a la que pertenece
  yaw: number;     // Posición horizontal en radianes
  pitch: number;   // Posición vertical en radianes
  tipo: HotspotType;
  titulo: string;
  descripcion: string;
  color: string;
  icono: string;   // Nombre del icono de Lucide
  url?: string;    // Para enlaces externos, WhatsApp, etc.
  destino?: string; // ID de la escena de destino (para tipo navigation)
  approved: boolean;
  enabled: boolean;
}

export interface Scene {
  id: string;
  order: number;
  title: string;
  panorama: string; // URL de la imagen 360 equirectangular
  thumb: string;     // URL de la miniatura 400x300
  enabled: boolean;  // Activo / Desactivado
  approved: boolean; // Aprobado / Pendiente
  initialView: {
    yaw: number;     // Radianes
    pitch: number;   // Radianes
    hfov: number;    // Campo de visión
  };
  hotspots: Hotspot[];
}

export interface TourConfig {
  id: string;
  nombre: string;
  rutas: {
    landing: string;
    tour: string;
    editor: string;
  };
  colores: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
  };
  SEO: {
    title: string;
    description: string;
  };
  OG: {
    title: string;
    description: string;
    image: string;
  };
  WhatsApp: {
    number: string;
    message: string;
  };
  Portada: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  Links: {
    label: string;
    url: string;
  }[];
  scenes: Scene[];
}
