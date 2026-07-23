import { TourConfig } from '../types';

export const defaultTourConfig: TourConfig = {
  id: 'streetboss-demo-tour',
  nombre: 'StreetBoss Virtual Tour',
  rutas: {
    landing: '/tour',
    tour: '/tour/360',
    editor: '/tour/editor'
  },
  colores: {
    primary: '#1e3224',    // Verde premium
    secondary: '#c3a479',  // Dorado sutil
    accent: '#B8924A',     // Dorado acento
    background: '#080a08', // Negro bosque profundo
    card: '#121713'        // Verde oscuro card
  },
  SEO: {
    title: 'STREETBOSS | Recorrido Virtual 360°',
    description: 'Explora los terrenos y el desarrollo comercial de StreetBoss en un recorrido inmersivo 360°.'
  },
  OG: {
    title: 'STREETBOSS | Recorrido Virtual Inmersivo',
    description: 'Conoce cada rincón del desarrollo como si estuvieras ahí.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&h=630&q=80'
  },
  WhatsApp: {
    number: '529612466204',
    message: 'Hola! Vi el recorrido virtual 360° de StreetBoss y me interesa recibir información sobre los terrenos.'
  },
  Portada: {
    title: 'Experiencia Inmersiva StreetBoss',
    subtitle: 'Gira, explora y recorre el desarrollo en 360° desde cualquier lugar.',
    backgroundImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80'
  },
  Links: [
    { label: 'Página Web', url: 'https://streetboss.com' },
    { label: 'Ubicación en Maps', url: 'https://maps.google.com' }
  ],
  scenes: [
    {
      id: 'vista-aerea-regional',
      order: 1,
      title: 'Vista Aérea Regional',
      panorama: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg', // Demo panorámica equirectangular 2:1
      thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=300&q=80',
      enabled: true,
      approved: true,
      initialView: {
        yaw: 0,
        pitch: 0,
        hfov: 100
      },
      hotspots: [
        {
          id: 'hs-1',
          sceneId: 'vista-aerea-regional',
          yaw: 0.5,
          pitch: -0.1,
          tipo: 'navigation',
          titulo: 'Entrar al Acceso Principal',
          descripcion: 'Ir a la escena del acceso del desarrollo.',
          color: '#c3a479',
          icono: 'navigation',
          destino: 'acceso-principal',
          approved: true,
          enabled: true
        },
        {
          id: 'hs-2',
          sceneId: 'vista-aerea-regional',
          yaw: -0.8,
          pitch: -0.2,
          tipo: 'info',
          titulo: 'Área Comercial',
          descripcion: 'Zona designada para locales comerciales y oficinas de StreetBoss.',
          color: '#c3a479',
          icono: 'info',
          approved: true,
          enabled: true
        }
      ]
    },
    {
      id: 'acceso-principal',
      order: 2,
      title: 'Acceso Principal',
      panorama: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere-fixtures.jpg',
      thumb: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&h=300&q=80',
      enabled: true,
      approved: true,
      initialView: {
        yaw: 0,
        pitch: 0,
        hfov: 100
      },
      hotspots: [
        {
          id: 'hs-3',
          sceneId: 'acceso-principal',
          yaw: 3.14,
          pitch: 0,
          tipo: 'navigation',
          titulo: 'Volver a Vista Aérea',
          descripcion: 'Subir a la vista de pájaro.',
          color: '#c3a479',
          icono: 'navigation',
          destino: 'vista-aerea-regional',
          approved: true,
          enabled: true
        }
      ]
    }
  ]
};
