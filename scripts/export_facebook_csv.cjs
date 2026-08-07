const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const file_path = path.join(__dirname, '../data/MASTER_RESTAURANTS.xlsx');
const workbook = xlsx.readFile(file_path);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
let data = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

let exportData = [];

data.forEach((row, idx) => {
    let fb = (row['facebook'] || row['facebook_url'] || '').toString().trim();
    if (fb) {
        let prospect_id = (row.id || `prospect_master_${idx + 1}`).toString().trim();
        let name = (row['nombre'] || row['business_name'] || row['Nombre original'] || '').toString().trim();
        exportData.push({ id: prospect_id, nombre: name, facebook: fb });
    }
});

const exportWorksheet = xlsx.utils.json_to_sheet(exportData);
const exportWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(exportWorkbook, exportWorksheet, 'Facebook Pages');

const csvPath = path.join(__dirname, '../scratch/facebook-enrichment/facebook_pages_to_check.csv');
xlsx.writeFile(exportWorkbook, csvPath, { bookType: 'csv' });

console.log(`Exported ${exportData.length} records to ${csvPath}`);
