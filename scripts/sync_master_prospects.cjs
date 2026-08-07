const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const EXCEL_PATH = path.join(PROJECT_ROOT, "data", "MASTER_RESTAURANTS.xlsx");
const OUTPUT_JSON_PATH = path.join(PROJECT_ROOT, "src", "data", "master_prospects.json");

if (!fs.existsSync(EXCEL_PATH)) {
    console.error(`❌ Error: No se encontró el archivo maestro en ${EXCEL_PATH}`);
    process.exit(1);
}

console.log(`📖 Leyendo base maestra desde ${EXCEL_PATH}...`);
const workbook = xlsx.readFile(EXCEL_PATH);
const sheetName = workbook.SheetNames[0];
const records = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

const cleaned_records = [];

records.forEach((row, idx) => {
    let prospect_id = (row.id || `prospect_master_${idx + 1}`).toString().trim();
    let name = (row.business_name || row.nombre || row['Nombre normalizado'] || row['Nombre original'] || "").toString().trim();
    let cat = (row.category || row.giro || row['Categoría'] || "Restaurante").toString().trim();
    let city = (row.city || row.ciudad || row['Ciudad'] || "Tuxtla Gutiérrez").toString().trim();
    
    let phone = (row.phone || row['Teléfono'] || "").toString().replace(".0", "").trim();
    let whatsapp = (row.whatsapp || row['WhatsApp'] || "").toString().replace(".0", "").trim();
    if (!whatsapp && phone) whatsapp = phone;

    let fb = (row.facebook || row.facebook_url || row['Facebook'] || "").toString().trim();
    let ig = (row.instagram || row.instagram_url || row['Instagram'] || "").toString().trim();
    let web = (row.website || row.website_url || row['Sitio web'] || "").toString().trim();
    let maps = (row.maps_url || row['Maps'] || "").toString().trim();
    let addr = (row.address || row.direccion || row['Dirección'] || "").toString().trim();
    
    let rating = (row.rating || "").toString().trim();
    let reviews = (row.reviews_count || "").toString().trim();
    let score = row.completeness_score || row.calidad_pct || 50;

    let status = (row.status || "Nuevo").toString().trim();
    let demo = (row.assigned_demo || "").toString().trim();
    let notes = (row.notes || "").toString().trim();

    let item = {
        id: prospect_id,
        name: name,
        category: cat,
        city: city
    };

    if (addr) item.address = addr;
    if (whatsapp) item.whatsapp = whatsapp;
    if (phone && phone !== whatsapp) item.phone = phone;
    if (fb) item.facebook = fb;
    if (ig) item.instagram = ig;
    if (web) item.website = web;
    if (maps) item.maps_url = maps;
    if (rating) item.rating = rating;
    if (reviews && reviews !== "0") item.reviews_count = reviews;
    if (score) item.completeness_score = parseInt(score, 10);

    if (status && status !== "Nuevo") item.status = status;
    if (demo) item.assigned_demo = demo;
    if (notes) item.notes = notes;

    let estado_actividad = (row.estado_actividad || "SIN DATOS").toString().trim();
    let score_op = row.score_oportunidad;
    let prioridad = (row.prioridad_prospeccion || "D").toString().trim();

    item.estado_actividad = estado_actividad;
    if (score_op !== "" && score_op !== undefined && score_op !== null) {
        item.score_oportunidad = parseInt(score_op, 10);
    }
    item.prioridad_prospeccion = prioridad;

    cleaned_records.push(item);
});

fs.mkdirSync(path.dirname(OUTPUT_JSON_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(cleaned_records));

const size_kb = (fs.statSync(OUTPUT_JSON_PATH).size / 1024).toFixed(2);
console.log(`✅ Sincronización y minificación exitosa: ${cleaned_records.length} registros exportados a ${OUTPUT_JSON_PATH} (${size_kb} KB)`);
