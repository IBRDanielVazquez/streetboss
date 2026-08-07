const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const https = require('https');

const file_path = path.join(__dirname, '../data/MASTER_RESTAURANTS.xlsx');
const workbook = xlsx.readFile(file_path);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
let data = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

const dateStr = new Date().toISOString().split('T')[0];
const currentDate = new Date();

let stats = {
    revisados: 0,
    con_fecha: 0,
    sin_datos: 0,
    activos: 0,
    probablemente_activos: 0,
    actividad_baja: 0,
    inactivos_revisar: 0,
    posiblemente_cerrados: 0,
    'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0
};

// Helper for HTTP GET with timeout
function fetchFB(url) {
    return new Promise((resolve) => {
        if (!url.startsWith('http')) url = 'https://' + url;
        if (url.startsWith('http://')) url = url.replace('http://', 'https://');
        const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, timeout: 2000 }, (res) => {
            let body = '';
            res.on('data', chunk => {
                body += chunk;
                // If we get enough data, maybe we can abort early, but let's just read a bit
                if (body.length > 50000) {
                    req.destroy();
                }
            });
            res.on('end', () => resolve(body));
            res.on('error', () => resolve(''));
        });
        req.on('timeout', () => req.destroy());
        req.on('error', () => resolve(''));
    });
}

function extractDate(html) {
    // Attempt to find any date in metadata (this is highly unlikely to work for FB without login, but we try)
    const match = html.match(/"datePublished"\s*:\s*"([^"]+)"/i) || html.match(/"modified_time"\s*content="([^"]+)"/i);
    if (match) return new Date(match[1]);
    return null;
}

async function processRow(row) {
    let fb = (row['facebook'] || row['facebook_url'] || '').toString().trim();
    let ultima = null;

    if (fb) {
        stats.revisados++;
        // Try fetching
        const html = await fetchFB(fb);
        const date = extractDate(html);
        if (date && !isNaN(date)) {
            ultima = date;
            stats.con_fecha++;
        } else {
            stats.sin_datos++;
        }
    }

    if (ultima) {
        row.ultima_publicacion_facebook = ultima.toISOString().split('T')[0];
        const diff = Math.floor((currentDate - ultima) / (1000 * 60 * 60 * 24));
        row.dias_desde_ultima_publicacion = diff;
        
        if (diff <= 30) {
            row.estado_actividad = 'ACTIVO';
            stats.activos++;
        } else if (diff <= 90) {
            row.estado_actividad = 'PROBABLEMENTE ACTIVO';
            stats.probablemente_activos++;
        } else if (diff <= 180) {
            row.estado_actividad = 'ACTIVIDAD BAJA';
            stats.actividad_baja++;
        } else {
            row.estado_actividad = 'INACTIVO / REVISAR';
            stats.inactivos_revisar++;
        }
    } else if (fb) {
        row.ultima_publicacion_facebook = null;
        row.dias_desde_ultima_publicacion = null;
        row.estado_actividad = 'SIN DATOS';
    } else {
        row.ultima_publicacion_facebook = null;
        row.dias_desde_ultima_publicacion = null;
        row.estado_actividad = 'SIN FACEBOOK';
    }

    // Recalcular score
    let score = 0;
    
    let nombre = (row['nombre'] || row['business_name'] || row['Nombre original'] || '').toString().trim();
    if (nombre) score += 10;
    let categoria = (row['categoria'] || row['giro'] || row['category'] || '').toString().trim();
    if (categoria) score += 10;
    let direccion = (row['direccion'] || row['address'] || '').toString().trim();
    if (direccion) score += 10;
    
    if (fb) score += 20;
    
    let wa = (row['whatsapp'] || '').toString().trim();
    if (wa) score += 20;
    let tel = (row['telefono'] || row['phone'] || '').toString().trim();
    if (tel) score += 10;
    let ig = (row['instagram'] || row['instagram_url'] || '').toString().trim();
    if (ig) score += 10;
    let web = (row['sitio_web'] || row['website'] || row['website_url'] || '').toString().trim();
    if (web) score += 10;
    
    // BONO ACTIVIDAD
    if (row.estado_actividad === 'ACTIVO') score += 20;
    else if (row.estado_actividad === 'PROBABLEMENTE ACTIVO') score += 15;
    else if (row.estado_actividad === 'ACTIVIDAD BAJA') score += 5;
    
    if (score > 100) score = 100;
    row.score_oportunidad = score;
    
    // Prioridad
    let prioridad = 'D';
    if (score >= 85) prioridad = 'A+';
    else if (score >= 70) prioridad = 'A';
    else if (score >= 55) prioridad = 'B';
    else if (score >= 40) prioridad = 'C';
    
    row.prioridad_prospeccion = prioridad;
    stats[prioridad]++;
    
    return row;
}

async function run() {
    // Process in batches
    for (let i = 0; i < data.length; i += 10) {
        let chunk = data.slice(i, i + 10);
        await Promise.all(chunk.map(r => processRow(r)));
    }

    const newWorksheet = xlsx.utils.json_to_sheet(data);
    const newWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
    xlsx.writeFile(newWorkbook, file_path);

    const statsPath = path.join(__dirname, 'fb_stats.json');
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

    console.log('Enrichment complete.');
}

run();
