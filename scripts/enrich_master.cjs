const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const file_path = path.join(__dirname, '../data/MASTER_RESTAURANTS.xlsx');
const workbook = xlsx.readFile(file_path);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

let data = xlsx.utils.sheet_to_json(worksheet);

const dateStr = new Date().toISOString().split('T')[0];

let stats = {
    total: data.length,
    'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0,
    'Activos': 0, 'Probablemente activos': 0, 'Actividad baja': 0, 
    'Inactivos / revisar': 0, 'Sin Facebook': 0, 'Sin datos': 0
};

data = data.map(row => {
    row.ultima_publicacion_facebook = null;
    row.dias_desde_ultima_publicacion = null;
    row.fecha_ultima_validacion = dateStr;
    
    let score = 0;
    let fb = (row['Facebook'] || '').toString().trim();
    if (fb) {
        score += 20;
        row.estado_actividad = 'SIN DATOS';
        stats['Sin datos']++;
    } else {
        row.estado_actividad = 'SIN FACEBOOK';
        stats['Sin Facebook']++;
    }
    
    let wa = (row['WhatsApp'] || '').toString().trim();
    if (wa) score += 20;
    
    let tel = (row['Teléfono'] || '').toString().trim();
    if (tel) score += 15;
    
    let ig = (row['Instagram'] || '').toString().trim();
    if (ig) score += 15;
    
    let web = (row['Sitio web'] || '').toString().trim();
    if (web) score += 10;
    
    let name1 = (row['Nombre original'] || '').toString().trim();
    let name2 = (row['Nombre normalizado'] || '').toString().trim();
    if (name1 || name2) score += 20;
    
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
