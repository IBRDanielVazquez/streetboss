const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const MASTER_PATH = path.join(__dirname, '../data/MASTER_RESTAURANTS.xlsx');
// CSV exported from apify:
const APIFY_CSV_PATH = path.join(__dirname, '../scratch/facebook-enrichment/apify_results.csv');

if (!fs.existsSync(APIFY_CSV_PATH)) {
    console.error(`❌ Archivo no encontrado: ${APIFY_CSV_PATH}`);
    process.exit(1);
}

const apifyData = xlsx.utils.sheet_to_json(xlsx.readFile(APIFY_CSV_PATH).Sheets[xlsx.readFile(APIFY_CSV_PATH).SheetNames[0]], { defval: "" });
const workbook = xlsx.readFile(MASTER_PATH);
const sheetName = workbook.SheetNames[0];
let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

const dateStr = new Date().toISOString().split('T')[0];
const currentDate = new Date();

// Map apify results by id and facebook url for matching
const apifyMap = new Map();
apifyData.forEach(row => {
    if (row.id) apifyMap.set(row.id.toString(), row);
    if (row.facebook) apifyMap.set(row.facebook.toString().trim(), row);
    // If apify outputs url as 'url'
    if (row.url) apifyMap.set(row.url.toString().trim(), row);
});

data = data.map((row, idx) => {
    let prospect_id = (row.id || `prospect_master_${idx + 1}`).toString().trim();
    let fb = (row['facebook'] || row['facebook_url'] || '').toString().trim();
    
    let apifyResult = apifyMap.get(prospect_id) || (fb ? apifyMap.get(fb) : null);
    
    if (apifyResult) {
        // extract date: assumes apify outputs lastPostDate or similar
        let dateVal = apifyResult.lastPostDate || apifyResult.ultima_publicacion || apifyResult.date;
        let ultima = dateVal ? new Date(dateVal) : null;
        
        if (ultima && !isNaN(ultima)) {
            row.ultima_publicacion_facebook = ultima.toISOString().split('T')[0];
            const diff = Math.floor((currentDate - ultima) / (1000 * 60 * 60 * 24));
            row.dias_desde_ultima_publicacion = diff;
            
            if (diff <= 30) row.estado_actividad = 'ACTIVO';
            else if (diff <= 90) row.estado_actividad = 'PROBABLEMENTE ACTIVO';
            else if (diff <= 180) row.estado_actividad = 'ACTIVIDAD BAJA';
            else row.estado_actividad = 'INACTIVO / REVISAR';
        } else {
            row.ultima_publicacion_facebook = null;
            row.dias_desde_ultima_publicacion = null;
            row.estado_actividad = 'SIN DATOS';
        }
    } else {
        if (!fb) {
            row.estado_actividad = 'SIN FACEBOOK';
        } else {
            row.estado_actividad = 'SIN DATOS';
        }
    }
    
    row.fecha_ultima_validacion = dateStr;
    
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
    
    let prioridad = 'D';
    if (score >= 85) prioridad = 'A+';
    else if (score >= 70) prioridad = 'A';
    else if (score >= 55) prioridad = 'B';
    else if (score >= 40) prioridad = 'C';
    
    row.prioridad_prospeccion = prioridad;
    
    return row;
});

const newWorksheet = xlsx.utils.json_to_sheet(data);
const newWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
xlsx.writeFile(newWorkbook, MASTER_PATH);

console.log('Import & Recalculate complete.');
