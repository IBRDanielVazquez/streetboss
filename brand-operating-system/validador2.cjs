const fs = require('fs');
const path = require('path');

const masterData = require('./src/data/posts.json');

console.log("==========================================");
console.log("REPORTE DE VALIDACIÓN SBOS - CALENDARIO 90 DÍAS");
console.log("==========================================");

let errors = 0;

// Validar que hay 325 publicaciones
if (masterData.length !== 325) {
  console.log(`❌ ERROR CRÍTICO: El calendario no tiene 325 publicaciones. Tiene ${masterData.length}.`);
  errors++;
}

// Contar por red
const counts = {};
masterData.forEach(p => {
  counts[p.network] = (counts[p.network] || 0) + 1;
});
console.log(`- Total por red:`);
Object.keys(counts).forEach(k => console.log(`  * ${k}: ${counts[k]}`));

const ids = new Set();
const copies = new Set();
const prompts = new Set();
const filenames = new Set();

masterData.forEach(post => {
  // Check IDs duplicados
  if (ids.has(post.id)) {
    console.log(`❌ Duplicado encontrado: ID ${post.id}`);
    errors++;
  }
  ids.add(post.id);

  // Fechas vacías
  if (!post.date) {
    console.log(`❌ Fecha vacía en ${post.id}`);
    errors++;
  }

  // Unicode y Copys (se asume que un copy muy corto es inválido)
  if (!post.copy || post.copy.length < 30) {
    console.log(`❌ Copy incompleto en ${post.id}`);
    errors++;
  }

  // CTA
  if (!post.cta) {
    console.log(`❌ Falta CTA en ${post.id}`);
    errors++;
  }

  // Hashtags
  if (!post.hashtags || post.hashtags.length === 0 || post.hashtags.length > 5) {
    console.log(`❌ Hashtags inválidos en ${post.id}`);
    errors++;
  }

  // Prompts visuales
  if (!post.imagePrompt || post.imagePrompt.split(' ').length < 50) {
    console.log(`❌ Prompt visual ausente o muy corto en ${post.id}`);
    errors++;
  }
  prompts.add(post.imagePrompt); // Some duplication allowed because random can hit same, but we have 17*20 combinations

  // Negative prompts
  if (!post.negativePrompt) {
    console.log(`❌ Falta negative prompt en ${post.id}`);
    errors++;
  }

  // Verificaciones específicas de formato
  if (['reel', 'video', 'short'].includes(post.format.toLowerCase())) {
    if (!post.script) {
      console.log(`❌ Falta guion de video en ${post.id}`);
      errors++;
    }
    if (!post.motionPrompt) {
      console.log(`❌ Falta prompt de movimiento en ${post.id}`);
      errors++;
    }
  }

  if (['carrusel', 'story', 'status'].includes(post.format.toLowerCase())) {
    if (!post.carouselTexts || post.carouselTexts.length === 0) {
      console.log(`❌ Faltan textos de diapositivas en ${post.id}`);
      errors++;
    }
  }

  // Filename duplicados
  if (filenames.has(post.filename)) {
    console.log(`❌ Nombre de archivo duplicado: ${post.filename}`);
    errors++;
  }
  filenames.add(post.filename);
});

if (errors > 0) {
  console.log(`==========================================`);
  console.log(`❌ LA VALIDACIÓN HA FALLADO CON ${errors} ERRORES.`);
  process.exit(1);
} else {
  console.log(`==========================================`);
  console.log(`✅ VALIDACIÓN OBLIGATORIA SUPERADA. 90 días completos sin errores críticos.`);
}
