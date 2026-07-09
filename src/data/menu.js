export const MENUS_DEMO = {



  "tacos-don-beto": [
    { id:'cat-t', nombre:'🌮 Tacos', esPlus:false, visible:true, productos:[
      {id:'t1',nombre:'Tacos de Pastor',precio:55,descripcion:'Orden de 3. Cerdo al pastor, piña, cilantro y cebolla',agotado:false,activo:true,foto:'/productos/demo_taco.png'},
      {id:'t2',nombre:'Tacos de Bistec',precio:60,descripcion:'Orden de 3. Bistec de res a la plancha con guacamole',agotado:false,activo:true,foto:null},
      {id:'t3',nombre:'Tacos de Suadero',precio:55,descripcion:'Orden de 3. Suadero jugoso con salsa verde',agotado:false,activo:true,foto:null},
      {id:'t4',nombre:'Tacos de Chorizo',precio:50,descripcion:'Orden de 3. Chorizo artesanal con quesillo fundido',agotado:false,activo:true,foto:null},
      {id:'t5',nombre:'Tacos Campechanos',precio:60,descripcion:'Orden de 3. Mix de bistec con longaniza',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-te', nombre:'🫔 Especialidades', esPlus:true, visible:true, productos:[
      {id:'te1',nombre:'Gringa de Pastor',precio:45,descripcion:'Tortilla de harina con pastor y queso fundido',agotado:false,activo:true,foto:null},
      {id:'te2',nombre:'Volcán de Pastor',precio:50,descripcion:'Tortilla crujiente con pastor, queso y salsa',agotado:false,activo:true,foto:null},
      {id:'te3',nombre:'Quesadilla Especial',precio:55,descripcion:'Tortilla hecha a mano con relleno a elegir',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-tb', nombre:'🥤 Bebidas', esPlus:false, visible:true, productos:[
      {id:'tb1',nombre:'Agua de Horchata',precio:30,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'tb2',nombre:'Agua de Jamaica',precio:30,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'tb3',nombre:'Coca Cola',precio:25,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'tb4',nombre:'Cerveza',precio:40,descripcion:'',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-tc', nombre:'🎁 Combos', esPlus:false, visible:true, productos:[
      {id:'tc1',nombre:'Combo Individual',precio:75,descripcion:'3 Tacos Pastor + Agua Horchata. Ahorras $10',agotado:false,activo:true,foto:null},
      {id:'tc2',nombre:'Combo Pareja',precio:140,descripcion:'6 Tacos Bistec + 2 Aguas. Ahorras $40',agotado:false,activo:true,foto:null},
      {id:'tc3',nombre:'Combo Familiar',precio:260,descripcion:'12 Tacos Surtidos + 4 Aguas. Ahorras $60',agotado:false,activo:true,foto:null},
      {id:'tc4',nombre:'Combo Gringa',precio:60,descripcion:'Gringa de Pastor + Refresco. Ahorras $10',agotado:false,activo:true,foto:null},
    ]},
  ],

  "pizza-rapida": [
    { id:'cat-pi', nombre:'🍕 Pizzas Individuales', esPlus:false, visible:true, productos:[
      {id:'pi1',nombre:'Pepperoni',precio:89,descripcion:'Salsa de tomate, mozzarella y pepperoni',agotado:false,activo:true,foto:'/productos/demo_pizza.png'},
      {id:'pi2',nombre:'Hawaiana',precio:89,descripcion:'Jamón, piña y mozzarella',agotado:false,activo:true,foto:null},
      {id:'pi3',nombre:'Mexicana',precio:99,descripcion:'Chorizo, jalapeño, cebolla y tomate',agotado:false,activo:true,foto:null},
      {id:'pi4',nombre:'Especial de la Casa',precio:109,descripcion:'Pepperoni, champiñones, pimiento y aceitunas',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-pf', nombre:'🍕 Pizzas Familiares', esPlus:true, visible:true, productos:[
      {id:'pf1',nombre:'Pepperoni Familiar',precio:179,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'pf2',nombre:'Hawaiana Familiar',precio:179,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'pf3',nombre:'Mexicana Familiar',precio:199,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'pf4',nombre:'Especial Familiar',precio:219,descripcion:'',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-pc', nombre:'🍟 Complementos', esPlus:false, visible:true, productos:[
      {id:'pc1',nombre:'Breadsticks',precio:49,descripcion:'6 piezas con salsa marinara',agotado:false,activo:true,foto:null},
      {id:'pc2',nombre:'Alitas BBQ',precio:79,descripcion:'6 piezas bañadas en salsa BBQ',agotado:false,activo:true,foto:null},
      {id:'pc3',nombre:'Papas con Queso',precio:59,descripcion:'',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-pb', nombre:'🥤 Bebidas', esPlus:false, visible:true, productos:[
      {id:'pb1',nombre:'Refresco 600ml',precio:25,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'pb2',nombre:'Refresco 2L',precio:45,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'pb3',nombre:'Agua Natural',precio:15,descripcion:'',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-pp', nombre:'🎁 Promos', esPlus:false, visible:true, productos:[
      {id:'pp1',nombre:'Combo Personal',precio:99,descripcion:'Pizza Individual + Refresco. Ahorras $15',agotado:false,activo:true,foto:null},
      {id:'pp2',nombre:'Combo Alitas',precio:149,descripcion:'Pizza Individual + Alitas BBQ. Ahorras $19',agotado:false,activo:true,foto:null},
      {id:'pp3',nombre:'Combo Familiar',precio:249,descripcion:'Pizza Familiar + Breadsticks + Refresco 2L. Ahorras $44',agotado:false,activo:true,foto:null},
    ]},
  ],

  "mariscos-elpuerto": [
    { id:'cat-mc', nombre:'🦐 Cócteles', esPlus:false, visible:true, productos:[
      {id:'mc1',nombre:'Cóctel de Camarón',precio:120,descripcion:'Camarón fresco con aguacate y salsa casera',agotado:false,activo:true,foto:'/productos/demo_coctel.png'},
      {id:'mc2',nombre:'Cóctel Mixto',precio:140,descripcion:'Camarón, pulpo y ostión',agotado:false,activo:true,foto:null},
      {id:'mc3',nombre:'Cóctel de Pulpo',precio:110,descripcion:'Pulpo fresco con pepino y cebolla morada',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-mp', nombre:'🐟 Platillos', esPlus:true, visible:true, productos:[
      {id:'mp1',nombre:'Filete Empanizado',precio:130,descripcion:'Filete de pescado empanizado con ensalada',agotado:false,activo:true,foto:null},
      {id:'mp2',nombre:'Camarones a la Diabla',precio:160,descripcion:'Camarones en salsa roja picante con arroz',agotado:false,activo:true,foto:null},
      {id:'mp3',nombre:'Camarones al Mojo de Ajo',precio:160,descripcion:'Camarones al ajillo con arroz',agotado:false,activo:true,foto:null},
      {id:'mp4',nombre:'Pescado Frito Entero',precio:150,descripcion:'Mojarra frita con ensalada y tortillas',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-mt', nombre:'🌮 Tacos de Mar', esPlus:false, visible:true, productos:[
      {id:'mt1',nombre:'Tacos de Camarón',precio:80,descripcion:'3 pzas. Camarón empanizado con chipotle',agotado:false,activo:true,foto:null},
      {id:'mt2',nombre:'Tacos de Pescado',precio:70,descripcion:'3 pzas. Pescado capeado con pico de gallo',agotado:false,activo:true,foto:null},
      {id:'mt3',nombre:'Tostadas de Ceviche',precio:65,descripcion:'2 pzas. Ceviche fresco de pescado',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-mb', nombre:'🥤 Bebidas', esPlus:false, visible:true, productos:[
      {id:'mb1',nombre:'Limonada Natural',precio:30,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'mb2',nombre:'Michelada',precio:55,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'mb3',nombre:'Cerveza',precio:35,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'mb4',nombre:'Agua de Coco',precio:40,descripcion:'',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-mx', nombre:'🎁 Combos', esPlus:false, visible:true, productos:[
      {id:'mx1',nombre:'Combo Cóctel',precio:189,descripcion:'Cóctel Camarón + Tostada Ceviche + Limonada. Ahorras $26',agotado:false,activo:true,foto:null},
      {id:'mx2',nombre:'Combo Pareja',precio:279,descripcion:'2 Filetes Empanizados + 2 Limonadas. Ahorras $41',agotado:false,activo:true,foto:null},
      {id:'mx3',nombre:'Combo Familiar',precio:370,descripcion:'Pescado Frito + Cóctel Mixto + 4 Limonadas. Ahorras $50',agotado:false,activo:true,foto:null},
    ]},
  ],

  "cafe-laesquina": [
    { id:'cat-cc', nombre:'☕ Cafés', esPlus:false, visible:true, productos:[
      {id:'cc1',nombre:'Americano',precio:35,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'cc2',nombre:'Latte',precio:50,descripcion:'Espresso con leche vaporizada',agotado:false,activo:true,foto:'/productos/demo_cafe.png'},
      {id:'cc3',nombre:'Capuccino',precio:50,descripcion:'Espresso con espuma de leche',agotado:false,activo:true,foto:null},
      {id:'cc4',nombre:'Mocha',precio:60,descripcion:'Espresso con chocolate y leche',agotado:false,activo:true,foto:null},
      {id:'cc5',nombre:'Frappé de Café',precio:65,descripcion:'Café helado cremoso',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-cp', nombre:'🧁 Postres', esPlus:true, visible:true, productos:[
      {id:'cp1',nombre:'Cheesecake de Frutos Rojos',precio:70,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'cp2',nombre:'Brownie con Helado',precio:65,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'cp3',nombre:'Panqué de Plátano',precio:45,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'cp4',nombre:'Galletas',precio:40,descripcion:'3 piezas',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-cs', nombre:'🥐 Snacks', esPlus:false, visible:true, productos:[
      {id:'cs1',nombre:'Croissant Jamón y Queso',precio:55,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'cs2',nombre:'Sándwich Club',precio:75,descripcion:'Pollo, tocino, lechuga y tomate',agotado:false,activo:true,foto:null},
      {id:'cs3',nombre:'Ensalada César',precio:70,descripcion:'',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-cf', nombre:'🥤 Bebidas Frías', esPlus:false, visible:true, productos:[
      {id:'cf1',nombre:'Smoothie de Mango',precio:55,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'cf2',nombre:'Té Helado',precio:35,descripcion:'',agotado:false,activo:true,foto:null},
      {id:'cf3',nombre:'Limonada con Menta',precio:40,descripcion:'',agotado:false,activo:true,foto:null},
    ]},
    { id:'cat-cx', nombre:'🎁 Combos', esPlus:false, visible:true, productos:[
      {id:'cx1',nombre:'Combo Mañanero',precio:75,descripcion:'Americano + Croissant. Ahorras $15',agotado:false,activo:true,foto:null},
      {id:'cx2',nombre:'Combo Dulce',precio:99,descripcion:'Latte + Cheesecake. Ahorras $21',agotado:false,activo:true,foto:null},
      {id:'cx3',nombre:'Combo Frío',precio:110,descripcion:'Frappé + Brownie. Ahorras $20',agotado:false,activo:true,foto:null},
      {id:'cx4',nombre:'Combo Amigos',precio:250,descripcion:'4 Cafés + 4 Galletas. Ahorras $50',agotado:false,activo:true,foto:null},
    ]},
  ],
}

export const MENU_DEFAULT = MENUS_DEMO.lavitola

export default MENU_DEFAULT
