const fs = require('fs');
const path = require('path');

const DIR_DATA = path.join(__dirname, 'src', 'data');
let errors = [];

function checkFile(filename) {
  const filepath = path.join(DIR_DATA, filename);
  if (!fs.existsSync(filepath)) {
    errors.push(`Falta el archivo: ${filename}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

const posts = checkFile('posts.json');
const profiles = checkFile('profiles.json');
const highlights = checkFile('highlights.json');

if (!posts || !profiles || !highlights) {
  console.error("Faltan archivos base. Abortando validación.");
  process.exit(1);
}

// 1. Validar Perfiles
const requiredNetworks = ["Instagram", "Facebook", "TikTok", "WhatsApp Business"];
requiredNetworks.forEach(net => {
  const p = profiles.find(x => x.network === net);
  if (!p) {
    errors.push(`Falta perfil completo para la red: ${net}`);
    return;
  }
  if (!p.bios || p.bios.length < 5) {
    errors.push(`El perfil de ${net} no tiene las 5 biografías A/B distintas.`);
  } else {
    const bioTexts = new Set(p.bios.map(b => b.text));
    if (bioTexts.size < p.bios.length) {
      errors.push(`Biografías duplicadas en ${net}.`);
    }
  }
  if (!p.profilePic || !p.profilePic.prompt || !p.profilePic.safeZone) {
    errors.push(`Falta foto de perfil, prompt o zona segura en ${net}.`);
  }
});

// 2. Validar Publicaciones (Posts)
const copies = new Set();
const imagePrompts = new Set();
let placeholders = 0;
let emptyFields = 0;
let noCtas = 0;
let shortPrompts = 0;
let noMotion = 0;
let totalReels = 0;

posts.forEach((post, index) => {
  const pId = post.id || `Índice ${index}`;

  // Check empty
  if (!post.copy || post.copy.trim() === '') emptyFields++;
  if (!post.hook || post.hook.trim() === '') emptyFields++;
  
  // Check placeholders
  const str = JSON.stringify(post).toLowerCase();
  if (str.includes('lorem ipsum') || str.includes('aquí iría') || str.includes('placeholder')) {
    placeholders++;
    errors.push(`Placeholder detectado en post ${pId}`);
  }

  // Check CTA
  if (!post.cta || post.cta.trim() === '') {
    noCtas++;
    errors.push(`Falta CTA en post ${pId}`);
  }

  // Check unique copy
  if (copies.has(post.copy)) {
    errors.push(`Copy duplicado en post ${pId}`);
  } else {
    copies.add(post.copy);
  }

  // Check Prompt Length and uniqueness (10 paragraphs rule)
  if (!post.imagePrompt) {
    errors.push(`Falta prompt visual en post ${pId}`);
  } else {
    const paragraphs = post.imagePrompt.split('\n\n').filter(p => p.trim().length > 0);
    if (paragraphs.length < 10) {
      shortPrompts++;
      errors.push(`Prompt demasiado corto en post ${pId} (${paragraphs.length} párrafos, se requieren 10)`);
    }
    if (imagePrompts.has(post.imagePrompt)) {
      errors.push(`Prompt visual duplicado en post ${pId}`);
    } else {
      imagePrompts.add(post.imagePrompt);
    }
  }

  // Check Video requirements
  const format = post.format.toLowerCase();
  const isVideo = format.includes('reel') || format.includes('video') || format.includes('story') || format.includes('shorts');
  if (isVideo) {
    totalReels++;
    if (!post.motionPrompt || post.motionPrompt.trim() === '') {
      noMotion++;
      errors.push(`Falta motion prompt en video ${pId}`);
    }
    if (!post.script || post.script.trim() === '') {
      errors.push(`Falta guion en video ${pId}`);
    }
  }

  // Dimensiones / Archivo
  if (!post.resolution || !post.filename) {
    errors.push(`Faltan dimensiones o filename en post ${pId}`);
  }
});

// Output results
console.log("==========================================");
console.log("REPORTE DE VALIDACIÓN SBOS");
console.log("==========================================");
console.log(`- Total de redes completas: ${profiles.length}/${requiredNetworks.length}`);
console.log(`- Total de perfiles configurados: ${profiles.length}`);
console.log(`- Total de fotos de perfil (avatares): ${profiles.filter(p => p.profilePic).length}`);
console.log(`- Total de portadas: ${profiles.filter(p => p.coverPhoto).length}`);
console.log(`- Total de destacados: ${highlights.length}`);
console.log(`- Total de publicaciones analizadas: ${posts.length}`);
console.log(`- Total de copys únicos validados: ${copies.size}`);
console.log(`- Total de prompts visuales validados (mínimo 10 párrafos): ${imagePrompts.size}`);
console.log(`- Total de prompts de movimiento (videos): ${totalReels - noMotion}`);
console.log(`- Total de duplicados detectados: ${errors.filter(e => e.includes('duplicado')).length}`);
console.log(`- Total de placeholders encontrados: ${placeholders}`);
console.log(`- Total de fichas incompletas detectadas: ${emptyFields + noCtas + shortPrompts + noMotion}`);
console.log("==========================================");

if (errors.length > 0) {
  console.error("❌ LA VALIDACIÓN HA FALLADO CRÍTICAMENTE.");
  console.error("Se detectaron los siguientes errores de calidad/completitud:");
  errors.slice(0, 30).forEach(e => console.error("  - " + e));
  if (errors.length > 30) console.error(`  ...y ${errors.length - 30} errores más.`);
  process.exit(1);
} else {
  console.log("✅ VALIDACIÓN OBLIGATORIA SUPERADA. 100% contenido único, sin placeholders, prompts >10 párrafos.");
  process.exit(0);
}
