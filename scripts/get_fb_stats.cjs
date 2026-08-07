const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const file_path = path.join(__dirname, '../data/MASTER_RESTAURANTS.xlsx');
const workbook = xlsx.readFile(file_path);
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

let stats = {
    revisados: 460,
    con_fecha: 0,
    sin_datos: 0,
    activos: 0,
    probablemente_activos: 0,
    actividad_baja: 0,
    inactivos_revisar: 0,
    posiblemente_cerrados: 0,
    'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0
};

data.forEach(row => {
    let fb = (row['facebook'] || row['facebook_url'] || '').toString().trim();
    if (fb) {
        if (row.estado_actividad === 'SIN DATOS') stats.sin_datos++;
        else if (row.estado_actividad === 'ACTIVO') { stats.activos++; stats.con_fecha++; }
        else if (row.estado_actividad === 'PROBABLEMENTE ACTIVO') { stats.probablemente_activos++; stats.con_fecha++; }
        else if (row.estado_actividad === 'ACTIVIDAD BAJA') { stats.actividad_baja++; stats.con_fecha++; }
        else if (row.estado_actividad === 'INACTIVO / REVISAR') { stats.inactivos_revisar++; stats.con_fecha++; }
        else if (row.estado_actividad === 'POSIBLEMENTE CERRADO') { stats.posiblemente_cerrados++; stats.con_fecha++; }
    }
    
    let p = row.prioridad_prospeccion;
    if (stats[p] !== undefined) stats[p]++;
});

fs.writeFileSync(path.join(__dirname, 'fb_final_stats.json'), JSON.stringify(stats, null, 2));
