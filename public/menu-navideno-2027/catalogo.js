export const categories = [
  { id: 'cenas', label: 'Cenas y paquetes' },
  { id: 'tradicionales', label: 'Tradicionales' },
  { id: 'postres', label: 'Postres' },
  { id: 'bebidas', label: 'Bebidas' },
]

export const sample = {
  name: 'Menú navideño StreetBoss',
  items: [
    {
      name: 'Lomo glaseado',
      category: 'cenas',
      description: 'Lomo horneado con glaseado de frutos rojos y romero. El centro de mesa para una cena de celebración.',
      image: 'img/lomo.webp',
      alt: 'Lomo glaseado en rebanadas con arándanos y romero',
    },
    {
      name: 'Bacalao a la vizcaína',
      category: 'tradicionales',
      description: 'Bacalao desmenuzado en salsa de jitomate, con aceitunas, papas y pimientos.',
      image: 'img/bacalao.webp',
      alt: 'Bacalao a la vizcaína con jitomate, aceitunas y papas',
    },
    {
      name: 'Cheesecake de frutos rojos',
      category: 'postres',
      description: 'Pastel cremoso de queso sobre base crujiente, con compota de frutos rojos y un toque de canela.',
      image: 'img/cheesecake.webp',
      alt: 'Cheesecake cubierto con frutos rojos',
    },
    {
      name: 'Ponche navideño',
      category: 'bebidas',
      description: 'Ponche caliente con guayaba, naranja, caña y canela, ideal para servir en la posada.',
      image: 'img/ponche.webp',
      alt: 'Taza de ponche navideño con frutas y canela',
    },
  ],
}

/*
 * Agrega únicamente negocios y menús confirmados. Cada entrada admite:
 * {
 *   id: 'slug-unico',
 *   name: 'Nombre del negocio',
 *   city: 'Ciudad',
 *   description: 'Resumen del menú',
 *   categories: ['cenas'],
 *   image: 'img/negocio-portada.webp',
 *   alt: 'Descripción de la foto',
 *   whatsapp: '52…', // Código de país y número, solo dígitos
 *   menuUrl: '/menu/slug', // Opcional: menú público existente
 *   sheets: [{ image: 'img/negocio-menu.webp', alt: 'Descripción de la carta' }],
 *   items: [{ name: 'Platillo', category: 'cenas', description: 'Detalle',
 *             price: 450, image: 'img/platillo.webp', alt: 'Descripción' }],
 * }
 * Incluye al menos una carta, un platillo o un enlace al menú.
 * price es opcional y se expresa en MXN.
 */
export const businesses = []
