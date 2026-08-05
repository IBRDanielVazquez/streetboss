// Validador de Instagram (no destructivo). Uso: node validador_instagram.cjs
// Falla (exit 1) si encuentra cualquier URL en el contenido publicable de Instagram
// o si alguna publicación no cumple la estructura requerida.
const fs = require('fs');
const path = require('path');

const posts = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', 'posts.json'), 'utf8'));
const ig = posts.filter(p => p.network === 'Instagram');
const others = posts.filter(p => p.network !== 'Instagram');

const LINK = /(https?:\/\/|www\.|wa\.me|streetboss\.com\.mx)/i;
const errors = [];
const add = (id, rule, detail) => errors.push({ id, rule, detail });

for (const p of ig) {
  // 1-4, 19: links en contenido publicable
  if (LINK.test(p.copy || '')) add(p.id, 'R1 link en copy', p.copy.match(LINK)[0]);
  if (LINK.test(p.cta || '')) add(p.id, 'R2 link en cta', p.cta);
  if (p.overlayText && LINK.test(p.overlayText.ctaVisual || '')) add(p.id, 'R2 link en cta visual', p.overlayText.ctaVisual);
  if (LINK.test(p.imageText || '')) add(p.id, 'R3 link en texto imagen', p.imageText);
  if (LINK.test(p.pinnedComment || '')) add(p.id, 'R4 link en comentario fijado', p.pinnedComment);
  if (LINK.test(p.promptCompleto || '')) add(p.id, 'R3 link en prompt completo', 'promptCompleto');

  // 5-6: repetición título interno / hook / primera línea
  const firstLine = (p.copy || '').split('\n')[0].trim();
  if (p.title && firstLine && p.title.trim() === firstLine) add(p.id, 'R5 título interno = 1ª línea copy', firstLine);
  if (p.hook && firstLine && p.hook.trim() !== firstLine) { /* hook debe ser la 1ª línea del copy */ add(p.id, 'R6 hook no es la 1ª línea del copy', firstLine); }

  // 7: repetición innecesaria dentro del copy (misma línea no vacía dos veces)
  const lines = (p.copy || '').split('\n').map(s => s.trim()).filter(Boolean);
  const seen = new Set();
  for (const l of lines) { if (seen.has(l)) { add(p.id, 'R7 línea repetida en copy', l.slice(0, 40)); break; } seen.add(l); }

  // Prompt COMPLETO listo para generar: texto exacto + logo manual + negative integrado.
  const pc = p.promptCompleto || '';
  if (!pc) add(p.id, 'R9 falta promptCompleto', '');
  else {
    if (!/NEGATIVE PROMPT:/.test(pc)) add(p.id, 'R8 sin NEGATIVE integrado', '');
    if (!/TITULAR \(texto exacto\): “/.test(pc)) add(p.id, 'R10 sin TITULAR exacto', '');
    if (!/CTA VISUAL \(texto exacto/.test(pc)) add(p.id, 'R10 sin CTA exacto', '');
    if (!/JERARQUÍA TIPOGRÁFICA/.test(pc)) add(p.id, 'R15 sin jerarquía tipográfica', '');
    if (!/NO generar el logotipo/.test(pc)) add(p.id, 'R16 sin restricción de logo', '');
    if (/agregar.{0,20}después|reservar.{0,20}espacio|se añadirá en diseño/i.test(pc)) add(p.id, 'R10 lenguaje "agregar después"', '');
  }

  // 11-12: CTA visual corto y sin URL
  if (p.overlayText) {
    const words = (p.overlayText.ctaVisual || '').split(/\s+/).filter(Boolean).length;
    if (words > 6) add(p.id, 'R11 CTA visual > 6 palabras', p.overlayText.ctaVisual);
  }

  // 18: campos vacíos requeridos
  ['copy', 'cta', 'promptCompleto', 'hook', 'title'].forEach(f => {
    if (!p[f] || String(p[f]).trim() === '') add(p.id, 'R18 campo vacío', f);
  });
}

// Fecha oficial de inicio: Instagram 27-jul-2026.
const igW1 = ig.filter(p => p.week === 1).map(p => p.date).sort();
if (igW1[0] !== '2026-07-27') add('CALENDAR', 'Instagram no inicia el 2026-07-27', igW1[0]);

// 20: otras redes no deben haber sido tocadas (compara con snapshot si existe)
let otrasIntactas = 'sin snapshot';
try {
  const before = JSON.parse(fs.readFileSync('/tmp/sbos_others_before.json', 'utf8'));
  const bmap = new Map(before.map(x => [x.id, JSON.stringify(x)]));
  const changed = others.filter(x => bmap.get(x.id) !== JSON.stringify(x)).length;
  otrasIntactas = changed === 0 ? 'OK (0 cambios)' : `FALLO (${changed} cambiaron)`;
  if (changed > 0) add('OTHERS', 'R20 otras redes modificadas', String(changed));
} catch (e) { /* snapshot opcional */ }

console.log('── VALIDADOR INSTAGRAM ──');
console.log('Publicaciones Instagram revisadas:', ig.length);
console.log('Otras redes intactas:', otrasIntactas);
console.log('Errores encontrados:', errors.length);
if (errors.length) {
  errors.slice(0, 30).forEach(e => console.log(`  [${e.id}] ${e.rule} ${e.detail ? '→ ' + e.detail : ''}`));
  console.log('\n❌ VALIDACIÓN FALLIDA');
  process.exit(1);
} else {
  console.log('\n✅ VALIDACIÓN OK — Instagram sin links y con estructura correcta.');
}
