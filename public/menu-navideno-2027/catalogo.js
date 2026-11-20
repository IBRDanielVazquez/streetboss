export const categories = [
  { id: 'cenas', label: 'Cenas y paquetes' },
  { id: 'tradicionales', label: 'Tradicionales' },
  { id: 'postres', label: 'Postres' },
  { id: 'bebidas', label: 'Bebidas' },
]

const lomo = {
  name: 'Lomo glaseado',
  description: 'Lomo al horno con salsa de frutos rojos · 4 a 6 personas.',
  image: 'img/lomo.webp',
  alt: 'Lomo glaseado en rebanadas con arándanos y romero',
  price: 780,
}
const bacalao = {
  name: 'Bacalao a la vizcaína',
  description: 'Con jitomate, aceitunas, papas y pimientos · 1 kg.',
  image: 'img/bacalao.webp',
  alt: 'Bacalao a la vizcaína con aceitunas y papas',
  price: 640,
}
const cheesecake = {
  name: 'Cheesecake de frutos rojos',
  description: 'Pastel de queso con compota de frutos rojos · 8 porciones.',
  image: 'img/cheesecake.webp',
  alt: 'Cheesecake cubierto con frutos rojos',
  price: 480,
}
const ponche = {
  name: 'Ponche navideño',
  description: 'Con guayaba, caña, naranja y canela · 2 litros.',
  image: 'img/ponche.webp',
  alt: 'Ponche navideño en jarro de barro',
  price: 180,
}

export const demos = [
  {
    name: 'Cenas por encargo',
    description: 'Para quienes venden platos fuertes y cenas familiares.',
    image: lomo.image,
    alt: lomo.alt,
    items: [lomo, bacalao],
  },
  {
    name: 'Repostería navideña',
    description: 'Para quienes preparan postres y pasteles bajo pedido.',
    image: cheesecake.image,
    alt: cheesecake.alt,
    items: [
      cheesecake,
      { ...cheesecake, name: 'Cheesecake mini', description: 'El mismo cheesecake en tamaño individual.', price: 85 },
    ],
  },
  {
    name: 'Posadas y reuniones',
    description: 'Para quienes venden bebidas y paquetes para compartir.',
    image: ponche.image,
    alt: ponche.alt,
    items: [
      ponche,
      { name: 'Paquete de ponche y postre', description: 'Ponche de 2 litros y un cheesecake para 8 personas.', image: cheesecake.image, alt: cheesecake.alt, price: 620 },
    ],
  },
]

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
