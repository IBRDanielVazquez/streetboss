export const TUTORIALS = [
  { id: '01', order: 1, title: 'Inicio / Apertura', file: '01.mp4', videoUrl: '/tutoriales/01.mp4', publicUrl: '/tutoriales/01', duration: '0:29' },
  { id: '02', order: 2, title: 'Configuración del menú', file: '02.mp4', videoUrl: '/tutoriales/02.mp4', publicUrl: '/tutoriales/02', duration: '1:39' },
  { id: '03', order: 3, title: 'Datos del negocio', file: '03.mp4', videoUrl: '/tutoriales/03.mp4', publicUrl: '/tutoriales/03', duration: '0:30' },
  { id: '04', order: 4, title: 'Zonas de reparto', file: '04.mp4', videoUrl: '/tutoriales/04.mp4', publicUrl: '/tutoriales/04', duration: '0:54' },
  { id: '05', order: 5, title: 'Formas de pago', file: '05.mp4', videoUrl: '/tutoriales/05.mp4', publicUrl: '/tutoriales/05', duration: '1:05' },
  { id: '06', order: 6, title: 'Redes sociales', file: '06.mp4', videoUrl: '/tutoriales/06.mp4', publicUrl: '/tutoriales/06', duration: '0:57' },
  { id: '07', order: 7, title: 'Reportes', file: '07.mp4', videoUrl: '/tutoriales/07.mp4', publicUrl: '/tutoriales/07', duration: '0:58' },
]

export function getTutorialById(id) {
  return TUTORIALS.find(tutorial => tutorial.id === String(id).padStart(2, '0')) || null
}
