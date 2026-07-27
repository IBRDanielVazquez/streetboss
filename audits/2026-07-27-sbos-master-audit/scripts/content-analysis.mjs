// Análisis forense de contenido de StreetBoss (NO destructivo, solo lectura).
// Uso: node content-analysis.mjs
// Lee la fuente REAL del dashboard (posts.json) y emite JSON + resumen.
import fs from 'node:fs';
import crypto from 'node:crypto';

const SRC = '/Users/danielvazquez/Proyectos/StreetBoss/brand-operating-system/src/data/posts.json';
const OUT = '/Users/danielvazquez/Proyectos/StreetBoss/audits/2026-07-27-sbos-master-audit/data';

const posts = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const norm = s => (s || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
const hash = s => crypto.createHash('sha1').update(norm(s)).digest('hex').slice(0, 12);

// --- Unicidad exacta por campo ---
function uniq(field) {
  const map = {};
  posts.forEach(p => {
    const v = p[field];
    if (v == null || v === '') return;
    const h = hash(v);
    (map[h] = map[h] || []).push(p.id);
  });
  const present = posts.filter(p => p[field] != null && p[field] !== '').length;
  const uniqueCount = Object.keys(map).length;
  const dups = Object.values(map).filter(a => a.length > 1);
  return { field, present, empty: posts.length - present, uniqueValues: uniqueCount, duplicateGroups: dups.length, duplicatedItems: dups.reduce((s, a) => s + a.length, 0), examples: dups.slice(0, 3).map(a => a.slice(0, 6)) };
}

const fields = ['hook', 'copy', 'cta', 'title', 'imagePrompt', 'negativePrompt', 'motionPrompt', 'motion', 'hashtags', 'imageText', 'alt', 'pinnedComment', 'visualConcept'];
const uniqueness = fields.map(uniq);

// --- Completitud de campos (schema declarado en el prompt vs presente) ---
const declaredFields = ['id','date','time','week','network','format','pilar','campaign','objective','audience','funnel','status','hook','title','copy','cta','hashtags','imageText','alt','pinnedComment','visualConcept','resolution','safeZone','filename','path','imagePrompt','negativePrompt','motionPrompt','cover','productionStatus'];
const completeness = declaredFields.map(f => {
  const present = posts.filter(p => p[f] != null && p[f] !== '').length;
  return { field: f, present, pct: +(100 * present / posts.length).toFixed(1) };
});

// --- Similitud estructural del COPY (shingles de 5-gram por palabra, Jaccard) ---
function shingles(s, n = 5) {
  const w = norm(s).split(' ').filter(Boolean);
  const set = new Set();
  for (let i = 0; i + n <= w.length; i++) set.add(w.slice(i, i + n).join(' '));
  return set;
}
function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0; for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}
function nearDup(field, threshold = 0.6) {
  const items = posts.map(p => ({ id: p.id, network: p.network, sh: shingles(p[field]) })).filter(x => x.sh.size);
  const pairs = [];
  for (let i = 0; i < items.length; i++)
    for (let j = i + 1; j < items.length; j++) {
      const s = jaccard(items[i].sh, items[j].sh);
      if (s >= threshold) pairs.push({ a: items[i].id, b: items[j].id, sim: +s.toFixed(2) });
    }
  return pairs;
}
const copyNear = nearDup('copy', 0.5);
const promptNear = nearDup('imagePrompt', 0.5);

// --- N-gram / párrafo reutilizado en copys (secuencias de 20 palabras) ---
function reusedNgrams(field, n = 20) {
  const counts = {};
  posts.forEach(p => {
    const w = norm(p[field]).split(' ').filter(Boolean);
    for (let i = 0; i + n <= w.length; i++) {
      const g = w.slice(i, i + n).join(' ');
      counts[g] = (counts[g] || 0) + 1;
    }
  });
  const reused = Object.entries(counts).filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1]);
  return { totalNgrams: Object.keys(counts).length, reusedNgrams: reused.length, top: reused.slice(0, 8).map(([g, c]) => ({ count: c, sample: g.slice(0, 80) })) };
}

// --- Detección de tecnicismos forzados en prompts ---
const techTerms = ['ARRI', 'Alexa 65', 'Alexa', 'Zeiss', 'Kodak Portra', 'Portra', 'Master Prime', 'anamorphic', '85mm', '50mm', '35mm', 'Roger Deakins', 'cinematographer'];
const techUse = {};
techTerms.forEach(t => {
  const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  techUse[t] = posts.filter(p => re.test(p.imagePrompt || '')).length;
});

// --- Claims / marca ---
const claims = {
  cero_comision: posts.filter(p => /cero comisi|sin comisi|0 comisi/i.test(p.copy)).length,
  whatsapp: posts.filter(p => /whatsapp/i.test(p.copy)).length,
  venta_directa: posts.filter(p => /venta directa|directo|sin intermediari/i.test(p.copy)).length,
  marketplace_bad: posts.filter(p => /marketplace/i.test(p.copy)).length,
  delivery_bad: posts.filter(p => /\bdelivery\b|reparto|repartidor/i.test(p.copy)).length,
  pos_bad: posts.filter(p => /\bpos\b|punto de venta/i.test(p.copy)).length,
  qr_menu: posts.filter(p => /men[uú] qr|c[oó]digo qr/i.test(p.copy)).length,
  hashtag_over5: posts.filter(p => (String(p.hashtags||'').match(/#/g)||[]).length > 5).length,
};

const report = {
  generatedAt: new Date().toISOString(),
  source: SRC,
  totalPosts: posts.length,
  byNetwork: posts.reduce((a, p) => (a[p.network] = (a[p.network] || 0) + 1, a), {}),
  byStatus: posts.reduce((a, p) => (a[p.status] = (a[p.status] || 0) + 1, a), {}),
  byFormat: posts.reduce((a, p) => (a[p.format] = (a[p.format] || 0) + 1, a), {}),
  uniqueness,
  completeness,
  copyNearDuplicatesPairs: copyNear.length,
  copyNearExamples: copyNear.slice(0, 15),
  promptNearDuplicatesPairs: promptNear.length,
  promptNearExamples: promptNear.slice(0, 15),
  copyReusedNgrams: reusedNgrams('copy', 20),
  promptReusedNgrams: reusedNgrams('imagePrompt', 20),
  forcedTechTerms: techUse,
  claims,
};

fs.writeFileSync(`${OUT}/content-analysis.json`, JSON.stringify(report, null, 2));
console.log('== RESUMEN ==');
console.log('Total posts:', report.totalPosts);
console.log('\nUnicidad por campo (present / uniqueValues / duplicateGroups):');
uniqueness.forEach(u => console.log(`  ${u.field.padEnd(15)} present=${String(u.present).padStart(3)} unique=${String(u.uniqueValues).padStart(3)} dupGroups=${u.duplicateGroups} dupItems=${u.duplicatedItems}`));
console.log('\nCompletitud de campos declarados <100%:');
completeness.filter(c => c.pct < 100).forEach(c => console.log(`  ${c.field.padEnd(16)} ${c.present}/325 (${c.pct}%)`));
console.log('\nCopy near-dup pairs (Jaccard>=0.5):', copyNear.length);
console.log('Prompt near-dup pairs (Jaccard>=0.5):', promptNear.length);
console.log('Copy reused 20-grams:', report.copyReusedNgrams.reusedNgrams);
console.log('Prompt reused 20-grams:', report.promptReusedNgrams.reusedNgrams);
console.log('\nTecnicismos forzados en imagePrompt:'); Object.entries(techUse).forEach(([t,c])=>{ if(c) console.log(`  ${t}: ${c}/325`); });
console.log('\nClaims:', JSON.stringify(claims));
console.log('\nJSON escrito en', `${OUT}/content-analysis.json`);
