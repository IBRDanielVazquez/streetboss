const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const file_path = path.join(__dirname, '../data/MASTER_RESTAURANTS.xlsx');
const workbook = xlsx.readFile(file_path);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

let data = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

const dateStr = new Date().toISOString().split('T')[0];

let stats = {
    total: data.length,
    'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0,
    'Con Facebook': 0, 'Sin Facebook': 0,
    'Con WhatsApp': 0, 'Con teléfono': 0,
    'Con Instagram': 0, 'Con sitio web': 0
};

data = data.map(row => {
    row.ultima_publicacion_facebook = null;
    row.dias_desde_ultima_publicacion = null;
    row.fecha_ultima_validacion = dateStr;
    
    let score = 0;
    
    // nombre = 10
    let nombre = (row['nombre'] || row['business_name'] || row['Nombre original'] || '').toString().trim();
    if (nombre) score += 10;
    
    // categoria = 10
    let categoria = (row['categoria'] || row['giro'] || row['category'] || '').toString().trim();
    if (categoria) score += 10;
    
    // direccion = 10
    let direccion = (row['direccion'] || row['address'] || '').toString().trim();
    if (direccion) score += 10;
    
    // facebook = 20
    let fb = (row['facebook'] || row['facebook_url'] || '').toString().trim();
    if (fb) {
        score += 20;
        row.estado_actividad = 'SIN DATOS';
        stats['Con Facebook']++;
    } else {
        row.estado_actividad = 'SIN FACEBOOK';
        stats['Sin Facebook']++;
    }
    
    // whatsapp = 20
    let wa = (row['whatsapp'] || '').toString().trim();
    if (wa) {
        score += 20;
        stats['Con WhatsApp']++;
    }
    
    // telefono = 10
    let tel = (row['telefono'] || row['phone'] || '').toString().trim();
    if (tel) {
        score += 10;
        stats['Con teléfono']++;
    }
    
    // instagram = 10
    let ig = (row['instagram'] || row['instagram_url'] || '').toString().trim();
    if (ig) {
        score += 10;
        stats['Con Instagram']++;
    }
    
    // sitio_web = 10
    let web = (row['sitio_web'] || row['website'] || row['website_url'] || '').toString().trim();
    if (web) {
        score += 10;
        stats['Con sitio web']++;
    }
    
    row.score_oportunidad = score;
    
    let prioridad = 'D';
    if (score >= 85) prioridad = 'A+';
    else if (score >= 70) prioridad = 'A';
    else if (score >= 55) prioridad = 'B';
    else if (score >= 40) prioridad = 'C';
    
    row.prioridad_prospeccion = prioridad;
    stats[prioridad]++;
    
    return row;
});

const newWorksheet = xlsx.utils.json_to_sheet(data);
const newWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

xlsx.writeFile(newWorkbook, file_path);

const statsPath = path.join(__dirname, 'enrich_stats.json');
fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

console.log('Enrichment complete.');
