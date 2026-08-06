import { DEMO_CONTACTS } from './demoFixtures'
export const WHATSAPP_VENTAS = DEMO_CONTACTS.SALES_WHATSAPP

const prod = (id, nombre, precio, descripcion = '', foto = null) =>
  ({ id, nombre, precio, descripcion, agotado: false, activo: true, foto })
const cat = (id, nombre, productos, extra = {}) =>
  ({ id, nombre, visible: true, tipo: 'normal', esPlus: false, icono: '', bannerCategoria: '', ...extra, productos })

export const DEMOS_OFICIALES = [
  {
    id: 'tacos-el-guero', clave: 'guero', nombre: 'Tacos El Güero', emoji: '🌮', giro: 'Taquería',
    menu: [
      cat('guero-c1', '🌮 Tacos', [
        prod('guero-p1', 'Taco de pastor', 20, 'Con piña, cilantro y cebolla'),
        prod('guero-p2', 'Taco de suadero', 20, 'Suadero suave con salsa verde'),
        prod('guero-p3', 'Taco de bistec', 22, 'Bistec a la plancha'),
        prod('guero-p4', 'Taco campechano', 24, 'Bistec con longaniza'),
      ]),
      cat('guero-c2', '🫓 Especiales', [
        prod('guero-p5', 'Gringa de pastor', 45, 'Tortilla de harina con queso fundido'),
        prod('guero-p6', 'Volcán', 38, 'Tostada con queso gratinado y carne'),
        prod('guero-p7', 'Quesadilla con carne', 40, 'Hecha a mano, con la carne que elijas'),
      ]),
      cat('guero-c3', '🥤 Bebidas', [
        prod('guero-p8', 'Agua de horchata', 25),
        prod('guero-p9', 'Agua de jamaica', 25),
        prod('guero-p10', 'Refresco', 22),
      ]),
    ],
  },
  {
    id: 'burger-house', clave: 'burger', nombre: 'Burger House', emoji: '🍔', giro: 'Hamburguesas',
    menu: [
      cat('burger-c1', '🍔 Hamburguesas', [
        prod('burger-p1', 'Clásica', 85, 'Carne artesanal, queso y vegetales'),
        prod('burger-p2', 'Doble Bacon', 125, 'Doble carne, tocino crujiente y BBQ'),
        prod('burger-p3', 'Mushroom Swiss', 110, 'Champiñones y queso suizo'),
      ]),
      cat('burger-c2', '🍟 Extras', [
        prod('burger-p4', 'Papas Francesas', 45, 'Papas corte regular'),
        prod('burger-p5', 'Aros de Cebolla', 55, 'Con aderezo ranch'),
      ]),
      cat('burger-c3', '🥤 Bebidas', [
        prod('burger-p6', 'Malteada Fresa', 65),
        prod('burger-p7', 'Malteada Chocolate', 65),
        prod('burger-p8', 'Refresco', 30),
      ]),
    ],
  },
  {
    id: 'pizza-house', clave: 'pizza', nombre: 'Pizza House', emoji: '🍕', giro: 'Pizzería',
    menu: [
      cat('pizza-c1', '🍕 Pizzas', [
        prod('pizza-p1', 'Pepperoni', 120, 'Clásica con queso mozzarella'),
        prod('pizza-p2', 'Hawaiana', 130, 'Jamón, piña y extra queso'),
        prod('pizza-p3', 'Meat Lovers', 160, 'Pepperoni, salchicha, jamón y tocino'),
      ]),
      cat('pizza-c2', '🍗 Entradas', [
        prod('pizza-p4', 'Alitas BBQ', 99, '8 piezas con aderezo'),
        prod('pizza-p5', 'Pan de Ajo', 45, 'Con queso fundido'),
      ]),
      cat('pizza-c3', '🥤 Bebidas', [
        prod('pizza-p6', 'Refresco 2L', 55),
        prod('pizza-p7', 'Té Helado', 35),
      ]),
    ],
  },
  {
    id: 'cafe-central', clave: 'cafe', nombre: 'Café Central', emoji: '☕', giro: 'Cafetería',
    menu: [
      cat('cafe-c1', '☕ Bebidas Calientes', [
        prod('cafe-p1', 'Americano', 40, 'Café de especialidad'),
        prod('cafe-p2', 'Latte', 55, 'Espresso con leche cremada'),
        prod('cafe-p3', 'Mocha', 65, 'Espresso, leche y chocolate'),
      ]),
      cat('cafe-c2', '🥐 Pan y Postres', [
        prod('cafe-p4', 'Croissant', 45, 'Mantequilla 100%'),
        prod('cafe-p5', 'Pastel de Zanahoria', 75, 'Con betún de queso'),
      ]),
      cat('cafe-c3', '🍳 Brunch', [
        prod('cafe-p6', 'Chilaquiles', 95, 'Verdes o rojos con huevo'),
        prod('cafe-p7', 'Toast de Aguacate', 85, 'Pan masa madre con aguacate'),
      ]),
    ],
  },
  {
    id: 'pollos-el-rey', clave: 'rey', nombre: 'Pollos El Rey', emoji: '🍗', giro: 'Rosticería',
    menu: [
      cat('rey-c1', '🍗 Pollo Rostizado', [
        prod('rey-p1', 'Pollo Entero', 150, 'Incluye salsa y tortillas'),
        prod('rey-p2', 'Medio Pollo', 85, 'Incluye salsa y tortillas'),
      ]),
      cat('rey-c2', '📦 Paquetes', [
        prod('rey-p3', 'Paquete Familiar', 220, '1 Pollo y medio, arroz, frijoles y tortillas'),
        prod('rey-p4', 'Paquete Rey', 300, '2 Pollos, arroz, frijoles, ensalada y refresco'),
      ]),
      cat('rey-c3', '🥗 Complementos', [
        prod('rey-p5', 'Arroz', 35),
        prod('rey-p6', 'Frijoles Charros', 40),
        prod('rey-p7', 'Ensalada de Codito', 35),
      ]),
    ],
  },
  {
    id: 'parrilla-el-carbon', clave: 'carbon', nombre: 'Parrilla El Carbón', emoji: '🥩', giro: 'Parrilla',
    menu: [
      cat('carbon-c1', '🥩 Cortes', [
        prod('carbon-p1', 'Arrachera (300g)', 220, 'Corte suave con guacamole'),
        prod('carbon-p2', 'Rib Eye (350g)', 350, 'Corte premium jugoso'),
        prod('carbon-p3', 'Sirloin (300g)', 200, 'Acompañado de papa asada'),
      ]),
      cat('carbon-c2', '🌮 Tacos y Entradas', [
        prod('carbon-p4', 'Tacos de Arrachera', 120, 'Orden de 3 tacos'),
        prod('carbon-p5', 'Queso Fundido', 95, 'Con chorizo o champiñones'),
        prod('carbon-p6', 'Choripán', 85, 'Chorizo argentino en pan artesanal'),
      ]),
      cat('carbon-c3', '🍺 Bebidas', [
        prod('carbon-p7', 'Cerveza Nacional', 45),
        prod('carbon-p8', 'Limonada', 35),
      ]),
    ],
  },
  {
    id: 'tortas-el-barrio', clave: 'tortas', nombre: 'Tortas El Barrio', emoji: '🥪', giro: 'Tortería',
    menu: [
      cat('tortas-c1', '🥪 Tortas Clásicas', [
        prod('tortas-p1', 'Milanesa', 65, 'Milanesa de res, frijoles y aguacate'),
        prod('tortas-p2', 'Pierna Horneada', 70, 'Pierna de cerdo preparada'),
        prod('tortas-p3', 'Cubana', 95, 'Milanesa, pierna, jamón, queso y salchicha'),
      ]),
      cat('tortas-c2', '🥤 Combos', [
        prod('tortas-p4', 'Combo Barrio', 110, 'Torta Cubana + Refresco'),
        prod('tortas-p5', 'Combo Sencillo', 85, 'Torta de Milanesa + Refresco'),
      ]),
      cat('tortas-c3', '🍟 Extras', [
        prod('tortas-p6', 'Papas a la francesa', 35),
        prod('tortas-p7', 'Agua de sabor', 25),
      ]),
    ],
  },
  {
    id: 'birrieria-jalisco', clave: 'birria', nombre: 'Birriería Jalisco', emoji: '🥣', giro: 'Birriería',
    menu: [
      cat('birria-c1', '🥣 Birria', [
        prod('birria-p1', 'Plato de Birria', 120, 'Servido con tortillas hechas a mano'),
        prod('birria-p2', 'Taco de Birria', 30, 'Tortilla suave con carne jugosa'),
        prod('birria-p3', 'Quesabirria', 45, 'Tortilla grande con queso y birria'),
        prod('birria-p4', 'Consomé', 35, 'Caldo caliente preparado'),
      ]),
      cat('birria-c2', '📦 Paquetes', [
        prod('birria-p5', 'Paquete Jalisco', 150, '3 Quesabirrias + Consomé'),
        prod('birria-p6', 'Kilo de Birria', 400, 'Para compartir en familia'),
      ]),
      cat('birria-c3', '🥤 Bebidas', [
        prod('birria-p7', 'Agua de Horchata', 25),
        prod('birria-p8', 'Refresco de Vidrio', 25),
      ]),
    ],
  },
  {
    id: 'mariscos-el-puerto', clave: 'puerto', nombre: 'Mariscos El Puerto', emoji: '🦐', giro: 'Marisquería',
    menu: [
      cat('puerto-c1', '🦐 Ceviches y Aguachiles', [
        prod('puerto-p1', 'Tostada de Ceviche', 45, 'Ceviche de pescado fresco'),
        prod('puerto-p2', 'Aguachile Verde', 160, 'Camarón curtido al limón con chile serrano'),
        prod('puerto-p3', 'Coctel de Camarón', 130, 'Receta tradicional veracruzana'),
      ]),
      cat('puerto-c2', '🐟 Platos Fuertes', [
        prod('puerto-p4', 'Filete Empanizado', 140, 'Con arroz y ensalada'),
        prod('puerto-p5', 'Camarones al Mojo de Ajo', 160, 'Con arroz y ensalada'),
        prod('puerto-p6', 'Mojarra Frita', 180, 'Pescado entero frito'),
      ]),
      cat('puerto-c3', '🍺 Bebidas', [
        prod('puerto-p7', 'Michelada', 85),
        prod('puerto-p8', 'Limonada Mineral', 40),
      ]),
    ],
  },
  {
    id: 'china-express', clave: 'china', nombre: 'China Express', emoji: '🥡', giro: 'Comida China',
    menu: [
      cat('china-c1', '🥡 Combos', [
        prod('china-p1', 'Combo 1', 110, 'Arroz frito, 1 guiso a elegir y rollo primavera'),
        prod('china-p2', 'Combo 2', 140, 'Arroz frito, 2 guisos a elegir y rollo primavera'),
        prod('china-p3', 'Combo Familiar', 250, 'Charola de arroz y 3 medios litros de guisos'),
      ]),
      cat('china-c2', '🍜 Especialidades', [
        prod('china-p4', 'Pollo Agridulce', 85, 'Porción de medio litro'),
        prod('china-p5', 'Res con Brócoli', 95, 'Porción de medio litro'),
        prod('china-p6', 'Chow Mein', 80, 'Fideos con vegetales'),
      ]),
      cat('china-c3', '🥟 Entradas', [
        prod('china-p7', 'Rollos Primavera', 35, '2 piezas'),
        prod('china-p8', 'Wantan Frito', 45, '5 piezas'),
      ]),
    ],
  }
]

const showcaseMeta = {
  'tacos-el-guero': { foodType: 'Tacos · Quesadillas · Bebidas', img: '/demos/img/tacos-el-guero.jpg', badge: 'Más pedido', color: 'from-orange-500/20 to-amber-500/5' },
  'burger-house': { foodType: 'Burgers · Papas · Malteadas', img: '/demos/img/burger-house.jpg', badge: 'Burgers', color: 'from-red-600/20 to-orange-600/5' },
  'pizza-house': { foodType: 'Pizza · Promos · Alitas', img: '/demos/img/pizza-house.jpg', badge: 'Pizza', color: 'from-red-500/20 to-rose-500/5' },
  'cafe-central': { foodType: 'Café · Panadería · Brunch', img: '/demos/img/cafe-central.jpg', badge: 'Café', color: 'from-amber-600/20 to-yellow-600/5' },
  'pollos-el-rey': { foodType: 'Pollo rostizado · Carbón · Paquetes', img: '/demos/img/pollos-el-rey.jpg', badge: 'Pollo', color: 'from-yellow-500/20 to-orange-500/5' },
  'parrilla-el-carbon': { foodType: 'Cortes · Brasas · Carne asada', img: '/demos/img/parrilla-el-carbon.jpg', badge: 'Parrilla', color: 'from-orange-700/20 to-red-700/5' },
  'tortas-el-barrio': { foodType: 'Tortas mexicanas · Combos', img: '/demos/img/tortas-el-barrio.jpg', badge: 'Tortas', color: 'from-orange-600/20 to-amber-600/5' },
  'birrieria-jalisco': { foodType: 'Birria · Consomé · Quesabirrias', img: '/demos/img/birrieria-jalisco.jpg', badge: 'Birria', color: 'from-red-600/20 to-orange-600/5' },
  'mariscos-el-puerto': { foodType: 'Camarones · Ceviches · Aguachiles', img: '/demos/img/mariscos-el-puerto.jpg', badge: 'Mariscos', color: 'from-blue-500/20 to-cyan-500/5' },
  'china-express': { foodType: 'Arroz frito · Noodles · Pollo agridulce', img: '/demos/img/china-express.jpg', badge: 'China', color: 'from-red-600/20 to-red-800/5' },
}

export const DEMO_SHOWCASE = DEMOS_OFICIALES.map((demo) => {
  const meta = showcaseMeta[demo.id] || {}
  const trialId = `${demo.id}-${demo.clave}-2026`
  return {
    ...demo,
    name: demo.nombre,
    slug: demo.id,
    trialId,
    menuUrl: `/menu/${trialId}`,
    whatsappUrl: `https://wa.me/${WHATSAPP_VENTAS}?text=${encodeURIComponent(`Hola, me interesa este demo: ${demo.nombre}`)}`,
    ...meta,
  }
})
