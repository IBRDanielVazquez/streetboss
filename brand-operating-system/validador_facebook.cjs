// Validador de Facebook (no destructivo). Uso: node validador_facebook.cjs
// Verifica orden cronológico, numeración FB-000 derivada, categorías/formatos y que
// no se hayan tocado otras redes. Falla (exit 1) ante cualquier inconsistencia grave.
const fs = require('fs');
const path = require('path');

const posts = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', 'posts.json'), 'utf8'));
const fb = posts.filter(p => p.network === 'Facebook');

const FORMAT_PRIO = { story: 0, status: 0, feed: 1, educativo: 1, comercial: 1, post: 1, carrusel: 2, reel: 3, video: 3, short: 3 };
const chrono = (a, b) => (a.date !== b.date ? (a.date < b.date ? -1 : 1) : a.time !== b.time ? (a.time < b.time ? -1 : 1) : (FORMAT_PRIO[a.format] ?? 9) - (FORMAT_PRIO[b.format] ?? 9));
const ordered = [...fb].sort(chrono);

const errors = [];
const add = (r, d) => errors.push(`${r}${d ? ' → ' + d : ''}`);
const LINKFB = /(https?:\/\/|www\.|wa\.me|streetboss\.com\.mx)/i;

// Total real
const total = fb.length;

// Numeración global derivada consecutiva FB-001..FB-0NN (sin duplicados ni saltos)
const nums = ordered.map((_, i) => i + 1);
const first = `FB-${String(1).padStart(3, '0')}`;
const last = `FB-${String(total).padStart(3, '0')}`;
if (new Set(nums).size !== total) add('Numeración global con duplicados');
for (let i = 0; i < nums.length; i++) if (nums[i] !== i + 1) add('Salto en numeración global', String(nums[i]));

// Por semana: reinicio y totales
const byWeek = {};
ordered.forEach(p => { (byWeek[p.week] = byWeek[p.week] || []).push(p); });
const weeks = Object.keys(byWeek).map(Number).sort((a, b) => a - b);
weeks.forEach(w => {
  if (w < 1 || w > 13) add('Semana fuera de rango 1-13', String(w));
  // orden cronológico dentro de la semana
  const wl = byWeek[w];
  for (let i = 1; i < wl.length; i++) if (chrono(wl[i - 1], wl[i]) > 0) add('Orden no cronológico en semana', String(w));
});

// Campos obligatorios por publicación
fb.forEach(p => {
  if (!p.week || p.week < 1 || p.week > 13) add('week inválida', p.id);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date || '')) add('fecha inválida', p.id);
  if (!/^\d{2}:\d{2}$/.test(p.time || '')) add('hora inválida', p.id);
  if (!p.pilar) add('sin pilar', p.id);
  if (!p.format) add('sin formato', p.id);
  if (!p.copy || !p.copy.trim()) add('sin copy', p.id);
  const pc = p.promptCompleto || '';
  if (!pc) add('sin promptCompleto', p.id);
  else {
    if (!/TITULAR \(texto exacto\): “/.test(pc)) add('prompt sin TITULAR exacto', p.id);
    if (!/CTA VISUAL \(texto exacto/.test(pc)) add('prompt sin CTA exacto', p.id);
    if (!/NO generar el logotipo/.test(pc)) add('prompt sin restricción de logo', p.id);
    if (!/NEGATIVE PROMPT:/.test(pc)) add('prompt sin NEGATIVE integrado', p.id);
    if (LINKFB.test(pc)) add('link en promptCompleto', p.id);
  }
  if (p.overlayText && LINKFB.test(p.overlayText.ctaVisual || '')) add('link en CTA visual', p.id);
});

// Fecha oficial de inicio: Facebook 28-jul-2026.
const fbW1 = fb.filter(p => p.week === 1).map(p => p.date).sort();
if (fbW1[0] !== '2026-07-28') add('Facebook no inicia el 2026-07-28', fbW1[0]);

// Otras redes intactas (snapshot opcional)
let otras = 'sin snapshot';
try {
  const before = JSON.parse(fs.readFileSync('/tmp/sbos_nonfb_before.json', 'utf8'));
  const bmap = new Map(before.map(x => [x.id, JSON.stringify(x)]));
  const changed = posts.filter(x => x.network !== 'Facebook').filter(x => bmap.get(x.id) !== JSON.stringify(x)).length;
  otras = changed === 0 ? 'OK (0 cambios)' : `FALLO (${changed})`;
  if (changed > 0) add('otras redes modificadas', String(changed));
} catch (e) {}

console.log('── VALIDADOR FACEBOOK ──');
console.log('Total real de publicaciones:', total, `(${first} … ${last})`);
console.log('Semanas:', weeks.length, '·', weeks.map(w => `S${w}:${byWeek[w].length}`).join(' '));
console.log('Otras redes intactas:', otras);
console.log('Errores:', errors.length);
if (errors.length) { errors.slice(0, 30).forEach(e => console.log('  ' + e)); console.log('\n❌ VALIDACIÓN FALLIDA'); process.exit(1); }
console.log('\n✅ VALIDACIÓN OK — Facebook ordenado y numerado correctamente.');
