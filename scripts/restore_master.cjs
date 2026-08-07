const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const file_path = path.join(__dirname, '../data/MASTER_RESTAURANTS.xlsx');
const workbook = xlsx.readFile(file_path);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
let data = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

data = data.map(row => {
    let fb = (row['facebook'] || row['facebook_url'] || '').toString().trim();
    
    row.ultima_publicacion_facebook = null;
    row.dias_desde_ultima_publicacion = null;
    
    if (fb) {
        row.estado_actividad = 'SIN DATOS';
    } else {
        row.estado_actividad = 'SIN FACEBOOK';
    }
    
    return row;
});

const newWorksheet = xlsx.utils.json_to_sheet(data);
const newWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
xlsx.writeFile(newWorkbook, file_path);

console.log("Restauración completada.");
