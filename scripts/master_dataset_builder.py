#!/usr/bin/env python3
"""
STREETBOSS MASTER DATASET BUILDER
=================================
Automatic discovery, ingestion, cleaning, deduplication, consolidation,
normalization, classification, commercial scoring, and exporting of restaurant data.

Author: Antigravity AI (Google DeepMind team) for StreetBoss
"""

import os
import re
import sys
import json
import glob
import uuid
import unicodedata
from datetime import datetime

# Attempt imports
try:
    import pandas as pd
except ImportError:
    pd = None

try:
    import openpyxl
except ImportError:
    openpyxl = None

try:
    import xlrd
except ImportError:
    xlrd = None

try:
    from rapidfuzz import fuzz
except ImportError:
    fuzz = None


# --- CONFIGURATION & CONSTANTS ---
DOWNLOADS_DIR = os.path.expanduser('~/Downloads')
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, 'data')
os.makedirs(DATA_DIR, exist_ok=True)

OUT_XLSX = os.path.join(DATA_DIR, 'MASTER_RESTAURANTS.xlsx')
OUT_CSV = os.path.join(DATA_DIR, 'MASTER_RESTAURANTS.csv')
OUT_JSON = os.path.join(DATA_DIR, 'MASTER_RESTAURANTS.json')
OUT_REPORT = os.path.join(DATA_DIR, 'MASTER_RESTAURANTS_REPORT.md')

NON_FOOD_KEYWORDS = [
    'escuela', 'colegio', 'universidad', 'instituto', 'hospital', 'clinica', 'medico',
    'farmacia', 'hotel', 'motel', 'hostal', 'cabanas', 'inmobiliaria', 'bienes raices',
    'lotes', 'ventas inmobiliarias', 'terrenos', 'constructora', 'taller', 'mecanico',
    'refaccionaria', 'ferreteria', 'lavanderia', 'dry clean', 'boutique', 'ropa',
    'zapateria', 'estetica', 'salon de belleza', 'barberia', 'spa', 'veterinaria',
    'banco', 'caja popular', 'gobierno', 'municipio', 'oficina', 'renta de autos',
    'gasolinera', 'supermercado', 'oxxo', '7-eleven', 'bodega', 'papeleria', 'imprenta'
]

FOOD_KEYWORDS = [
    'restaurante', 'taqueria', 'tacos', 'pizzeria', 'pizza', 'cafeteria', 'cafe',
    'hamburgueseria', 'hamburguesa', 'mariscos', 'marisqueria', 'pollos', 'pollo',
    'sushi', 'bar', 'cantaritos', 'micheladas', 'dark kitchen', 'cocina economica',
    'panaderia', 'pan', 'postres', 'reposteria', 'pasteleria', 'helados', 'heladeria',
    'antojitos', 'comida', 'cenaduria', 'comedor', 'bistro', 'grill', 'wings',
    'alitas', 'tortas', 'loncheria', 'birria', 'carnitas', 'gorditas', 'empanadas',
    'asador', 'buffet', 'mariscos', 'marisqueria'
]


def strip_accents(text: str) -> str:
    """Remove accents and normalize text to lower ascii."""
    if not text:
        return ""
    text = str(text)
    nfkd = unicodedata.normalize('NFKD', text)
    return "".join([c for c in nfkd if not unicodedata.combining(c)]).lower().strip()


def normalize_name_key(name: str) -> str:
    """Generate a clean string key for fuzzy deduplication."""
    clean = strip_accents(name)
    clean = re.sub(r'[^a-z0-9\s]', ' ', clean)
    clean = re.sub(r'\s+', ' ', clean).strip()
    stop_words = {'restaurante', 'taqueria', 'pizzeria', 'cafeteria', 'sucursal', 'tuxtla', 'gutierrez', 'chiapas', 'mx', 'el', 'la', 'los', 'las', 'de', 'del', 'y'}
    tokens = [w for w in clean.split() if w not in stop_words and len(w) > 1]
    return " ".join(tokens) if tokens else clean


def clean_facebook_url(url: str) -> str:
    """Clean Facebook URL to canonical form."""
    if not url or (pd and pd.isna(url)):
        return ""
    url = str(url).strip()
    if not url or url.lower() == 'nan' or url.lower() == 'none':
        return ""
    
    if 'facebook.com' not in url and 'fb.com' not in url and 'fb.me' not in url:
        if url.startswith('http') or url.startswith('www'):
            return ""
        url = f"https://www.facebook.com/{url.lstrip('@/')}"
    
    if not url.startswith('http'):
        url = 'https://' + url.lstrip('/')
    
    url = url.split('?')[0]
    url = re.sub(r'/(about|mentions|photos|videos|events|groups|posts|reviews|services|shop|about_privacy_and_legal_info)/?$', '', url, flags=re.IGNORECASE)
    url = url.rstrip('/')
    
    if url in ['https://www.facebook.com', 'https://facebook.com', 'http://www.facebook.com']:
        return ""
    return url


def clean_instagram_url(url: str) -> str:
    """Clean Instagram URL to canonical form."""
    if not url or (pd and pd.isna(url)):
        return ""
    url = str(url).strip()
    if not url or url.lower() == 'nan' or url.lower() == 'none':
        return ""
    
    if 'instagram.com' not in url and 'instagr.am' not in url:
        if '/' in url or '.' in url:
            return ""
        handle = url.lstrip('@/').strip()
        if handle:
            return f"https://www.instagram.com/{handle}"
        return ""
        
    if not url.startswith('http'):
        url = 'https://' + url.lstrip('/')
        
    url = url.split('?')[0].rstrip('/')
    url = re.sub(r'/(p|reel|reels|stories|tv)/[^/]+', '', url, flags=re.IGNORECASE).rstrip('/')
    if url in ['https://www.instagram.com', 'https://instagram.com']:
        return ""
    return url


def clean_phone(phone_val) -> str:
    """Clean phone number into E.164 format (+52...) or 10 digits."""
    if not phone_val or (pd and pd.isna(phone_val)):
        return ""
    digits = re.sub(r'\D', '', str(phone_val))
    if len(digits) == 10:
        return f"+52{digits}"
    elif len(digits) == 12 and digits.startswith('52'):
        return f"+{digits}"
    elif len(digits) == 13 and digits.startswith('521'):
        return f"+52{digits[3:]}"
    elif len(digits) >= 10:
        return f"+{digits}"
    return ""


def clean_whatsapp(wa_val, phone_val) -> str:
    """Derive clean WhatsApp number or wa.me link."""
    raw = str(wa_val or "")
    if 'wa.me' in raw or 'whatsapp.com' in raw:
        digits = re.sub(r'\D', '', raw.split('?')[0])
        if digits:
            return f"+{digits}" if not digits.startswith('+') else digits
    clean_p = clean_phone(wa_val) or clean_phone(phone_val)
    return clean_p


def generate_slug(name: str, city: str = "") -> str:
    """Generate a URL-friendly slug."""
    clean = strip_accents(f"{name} {city}")
    clean = re.sub(r'[^a-z0-9\s-]', '', clean)
    clean = re.sub(r'[\s-]+', '-', clean).strip('-')
    return clean


def classify_restaurant(name: str, category_raw: str, desc: str = "") -> tuple:
    """Determine main category and subcategory based on text signals."""
    text = strip_accents(f"{name} {category_raw} {desc}")
    
    subcat = "Restaurante General"
    cat = "Restaurante"
    
    if any(k in text for k in ['taco', 'taqueria', 'tacos', 'birria', 'carnitas', 'pastor']):
        subcat = "Taquería"
        cat = "Taquería"
    elif any(k in text for k in ['pizza', 'pizzeria']):
        subcat = "Pizzería"
        cat = "Pizzería"
    elif any(k in text for k in ['hamburguesa', 'hamburgueseria', 'burger']):
        subcat = "Hamburguesería"
        cat = "Comida Rápida"
    elif any(k in text for k in ['marisco', 'mariscos', 'marisqueria', 'ceviche', 'cocteleria']):
        subcat = "Mariscos"
        cat = "Mariscos"
    elif any(k in text for k in ['pollo', 'pollos', 'rosticeria', 'asador de pollos', 'kfc']):
        subcat = "Pollos"
        cat = "Pollos"
    elif any(k in text for k in ['sushi', 'ramen', 'teriyaki', 'oriental', 'japones']):
        subcat = "Sushi & Comida Japonesa"
        cat = "Comida Internacional"
    elif any(k in text for k in ['cafe', 'cafeteria', 'coffee', 'espresso', 'frappe']):
        subcat = "Cafetería"
        cat = "Cafetería"
    elif any(k in text for k in ['bar', 'cantaritos', 'cerveza', 'michelada', 'pub', 'cantarito', 'bistro', 'cantina']):
        subcat = "Bar & Bares"
        cat = "Bar"
    elif any(k in text for k in ['pan', 'panaderia', 'reposteria', 'pasteleria', 'pan dulce']):
        subcat = "Panadería"
        cat = "Postres & Repostería"
    elif any(k in text for k in ['helado', 'heladeria', 'paleta', 'nieve', 'frappes']):
        subcat = "Helados & Postres"
        cat = "Postres & Repostería"
    elif any(k in text for k in ['dark kitchen', 'virtual kitchen', 'ghost kitchen', 'solo domicilio']):
        subcat = "Dark Kitchen"
        cat = "Dark Kitchen"
    elif any(k in text for k in ['mexicana', 'antojitos', 'cenaduria', 'gorditas', 'empanadas', 'chilaquiles']):
        subcat = "Comida Mexicana"
        cat = "Restaurante"
    elif any(k in text for k in ['italiana', 'pasta']):
        subcat = "Comida Italiana"
        cat = "Comida Internacional"

    return cat, subcat


def calculate_score(record: dict) -> int:
    """Calculate Commercial Score (0-100)."""
    score = 0
    if record.get('whatsapp') or record.get('telefono'):
        score += 25
    if record.get('facebook'):
        score += 20
    if record.get('instagram'):
        score += 15
    if record.get('sitio_web'):
        score += 15
    if record.get('correo'):
        score += 10
    if record.get('direccion') or (record.get('latitud') and record.get('longitud')):
        score += 10
    if record.get('horario') or record.get('categoria'):
        score += 5
    return min(100, score)


def determine_commercial_status(score: int, record: dict) -> str:
    """Determine lead state."""
    has_contact = bool(record.get('whatsapp') or record.get('telefono') or record.get('facebook'))
    if score >= 80 and has_contact:
        return "Completo / Premium"
    elif score >= 50 and has_contact:
        return "Listo para Contacto"
    else:
        return "Requiere Enriquecimiento"


def is_non_food_business(name: str, category: str, address: str = "") -> bool:
    """Check if record should be filtered out as non-restaurant/garbage."""
    full_text = strip_accents(f"{name} {category} {address}")
    has_non_food = any(k in full_text for k in NON_FOOD_KEYWORDS)
    has_food = any(k in full_text for k in FOOD_KEYWORDS)
    if has_non_food and not has_food:
        return True
    return False


def map_row_to_standard(row: dict, file_name: str) -> dict:
    """Map arbitrary dict from CSV/XLSX into canonical StreetBoss schema."""
    keys = {k.lower().strip('\ufeff" '): v for k, v in row.items()}
    
    name = keys.get('nombre_negocio') or keys.get('nombre') or keys.get('title') or keys.get('name') or keys.get('place_name') or ""
    name = str(name).strip()
    if not name or name.lower() == 'nan' or name.lower() == 'none':
        return None
    
    city = keys.get('ciudad') or keys.get('city') or keys.get('municipio') or "Tuxtla Gutiérrez"
    city = str(city).strip()
    # Normalize city variations
    if re.search(r'tuxtla', city, re.IGNORECASE):
        city = "Tuxtla Gutiérrez"
    elif re.search(r'san cristobal', strip_accents(city)):
        city = "San Cristóbal de las Casas"
    elif re.search(r'copoya', city, re.IGNORECASE):
        city = "Copoya"
    elif re.search(r'tapachula', city, re.IGNORECASE):
        city = "Tapachula"

    state = keys.get('estado') or keys.get('state') or "Chiapas"
    state = str(state).strip()
    # Normalize state variations
    if re.search(r'(chiapas|chis)', state, re.IGNORECASE):
        state = "Chiapas"
    elif re.search(r'(mex|edomex)', state, re.IGNORECASE):
        state = "Estado de México"
    
    address = keys.get('direccion') or keys.get('address') or keys.get('street') or keys.get('location') or ""
    cat_raw = keys.get('categoria_google') or keys.get('categoria_busqueda') or keys.get('categoria') or keys.get('categoryname') or keys.get('subcategories') or ""
    
    fb = clean_facebook_url(keys.get('facebook_url') or keys.get('facebook') or keys.get('facebook_detectado') or keys.get('fb_url'))
    ig = clean_instagram_url(keys.get('instagram_url') or keys.get('instagram') or keys.get('instagram_detectado') or keys.get('ig_url'))
    
    phone = clean_phone(keys.get('telefono') or keys.get('telefono_e164') or keys.get('phone') or keys.get('phone_number'))
    wa = clean_whatsapp(keys.get('whatsapp') or keys.get('whatsapp_link'), phone)
    
    messenger = keys.get('messenger_url') or keys.get('messenger') or ""
    if not messenger and fb:
        fb_username = fb.rstrip('/').split('/')[-1]
        if fb_username:
            messenger = f"https://m.me/{fb_username}"
            
    email = keys.get('email') or keys.get('correo') or keys.get('email_detectado') or ""
    email = str(email).strip().lower() if email and str(email).lower() != 'nan' else ""
    
    website = keys.get('website') or keys.get('sitio_web') or keys.get('menu_url') or keys.get('google_maps_url') or ""
    website = str(website).strip() if website and str(website).lower() != 'nan' else ""
    
    lat = keys.get('latitud') or keys.get('latitude') or keys.get('lat')
    lng = keys.get('longitud') or keys.get('longitude') or keys.get('lng') or keys.get('lon')
    
    try:
        lat = float(lat) if lat and str(lat) != 'nan' else None
        lng = float(lng) if lng and str(lng) != 'nan' else None
    except (ValueError, TypeError):
        lat, lng = None, None
        
    desc = keys.get('descripcion') or keys.get('description') or keys.get('notes') or keys.get('notas') or ""
    hours = keys.get('horario') or keys.get('openinghours') or keys.get('hours') or ""
    
    cat, subcat = classify_restaurant(name, cat_raw, desc)
    slug = generate_slug(name, city)
    now_iso = datetime.now().isoformat()
    
    record = {
        'id': f"SB-REST-{uuid.uuid4().hex[:8].upper()}",
        'nombre': name,
        'slug': slug,
        'categoria': cat,
        'subcategoria': subcat,
        'facebook': fb,
        'instagram': ig,
        'whatsapp': wa,
        'messenger': messenger,
        'telefono': phone,
        'correo': email,
        'sitio_web': website,
        'ciudad': city,
        'estado': state,
        'pais': "México",
        'direccion': str(address) if address and str(address) != 'nan' else "",
        'latitud': lat,
        'longitud': lng,
        'descripcion': str(desc) if desc and str(desc) != 'nan' else "",
        'horario': str(hours) if hours and str(hours) != 'nan' else "",
        'score_comercial': 0,
        'estado_comercial': "",
        'origen': "Downloads Batch Ingestion",
        'archivo_origen': file_name,
        'fecha_creacion': now_iso,
        'ultima_actualizacion': now_iso,
        'observaciones': f"Ingestado desde {file_name}"
    }
    
    if is_non_food_business(name, cat_raw, address):
        return None
        
    record['score_comercial'] = calculate_score(record)
    record['estado_comercial'] = determine_commercial_status(record['score_comercial'], record)
    return record


def run_master_dataset_builder():
    print("==================================================")
    print("🚀 STREETBOSS MASTER DATASET BUILDER STARTING...")
    print(f"Scanning directory: {DOWNLOADS_DIR}")
    print("==================================================")
    
    files_found = []
    for root, dirs, files in os.walk(DOWNLOADS_DIR):
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in ['.csv', '.xlsx', '.xls']:
                files_found.append(os.path.join(root, f))
                
    total_files_found = len(files_found)
    print(f"Found {total_files_found} compatible data files in Downloads.\n")
    
    stats = {
        'total_files_found': total_files_found,
        'total_files_processed': 0,
        'total_records_read': 0,
        'total_discarded': 0,
        'total_duplicates_removed': 0,
        'total_urls_normalized': 0,
        'total_errors': 0
    }
    
    all_raw_records = []
    
    for filepath in sorted(files_found):
        rel_name = os.path.relpath(filepath, DOWNLOADS_DIR)
        ext = os.path.splitext(filepath)[1].lower()
        print(f"📄 Processing [{ext.upper()}] {rel_name}...")
        
        records_in_file = 0
        try:
            rows = []
            if ext == '.csv':
                if pd:
                    df = pd.read_csv(filepath, low_memory=False, encoding_errors='ignore')
                    rows = df.to_dict(orient='records')
                else:
                    import csv
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        rows = list(csv.DictReader(f))
            elif ext in ['.xlsx', '.xls']:
                if pd:
                    df = pd.read_excel(filepath)
                    rows = df.to_dict(orient='records')
            
            stats['total_files_processed'] += 1
            for r in rows:
                stats['total_records_read'] += 1
                rec = map_row_to_standard(r, rel_name)
                if rec:
                    records_in_file += 1
                    all_raw_records.append(rec)
                    if rec['facebook'] or rec['instagram']:
                        stats['total_urls_normalized'] += 1
                else:
                    stats['total_discarded'] += 1
                    
            print(f"   -> Retained {records_in_file} valid restaurant records.")
        except Exception as e:
            stats['total_errors'] += 1
            print(f"   ⚠️ ERROR reading {rel_name}: {e}")
            
    print(f"\nTotal raw valid records extracted: {len(all_raw_records)}")
    print("Starting Intelligent Deduplication & Consolidation...")
    
    existing_master = {}
    if os.path.exists(OUT_JSON):
        try:
            with open(OUT_JSON, 'r', encoding='utf-8') as f:
                old_list = json.load(f)
                for item in old_list:
                    k = normalize_name_key(item['nombre'])
                    existing_master[k] = item
            print(f"Loaded {len(existing_master)} existing master records for cumulative merging.")
        except Exception as e:
            print(f"Notice: Could not load existing master JSON ({e}). Starting fresh.")
            
    master_records = list(existing_master.values())
    fb_index = {r['facebook']: idx for idx, r in enumerate(master_records) if r.get('facebook')}
    ig_index = {r['instagram']: idx for idx, r in enumerate(master_records) if r.get('instagram')}
    phone_index = {r['telefono']: idx for idx, r in enumerate(master_records) if r.get('telefono')}
    name_index = {normalize_name_key(r['nombre']): idx for idx, r in enumerate(master_records)}

    def merge_records(target: dict, source: dict):
        for field, val in source.items():
            if field in ['id', 'fecha_creacion']:
                continue
            if val and not target.get(field):
                target[field] = val
            elif field == 'archivo_origen' and val and val not in target['archivo_origen']:
                target['archivo_origen'] += f", {val}"
            elif field == 'observaciones' and val and val not in target['observaciones']:
                target['observaciones'] += f" | {val}"
                
        target['score_comercial'] = calculate_score(target)
        target['estado_comercial'] = determine_commercial_status(target['score_comercial'], target)
        target['ultima_actualizacion'] = datetime.now().isoformat()

    for rec in all_raw_records:
        match_idx = None
        
        if rec.get('facebook') and rec['facebook'] in fb_index:
            match_idx = fb_index[rec['facebook']]
        elif rec.get('instagram') and rec['instagram'] in ig_index:
            match_idx = ig_index[rec['instagram']]
        elif rec.get('telefono') and rec['telefono'] in phone_index:
            match_idx = phone_index[rec['telefono']]
        else:
            n_key = normalize_name_key(rec['nombre'])
            if n_key in name_index:
                match_idx = name_index[n_key]
            elif fuzz:
                for existing_k, idx in name_index.items():
                    if len(n_key) > 4 and len(existing_k) > 4 and fuzz.token_sort_ratio(n_key, existing_k) >= 90:
                        match_idx = idx
                        break
                        
        if match_idx is not None:
            stats['total_duplicates_removed'] += 1
            merge_records(master_records[match_idx], rec)
        else:
            master_records.append(rec)
            new_idx = len(master_records) - 1
            if rec.get('facebook'):
                fb_index[rec['facebook']] = new_idx
            if rec.get('instagram'):
                ig_index[rec['instagram']] = new_idx
            if rec.get('telefono'):
                phone_index[rec['telefono']] = new_idx
            name_index[normalize_name_key(rec['nombre'])] = new_idx

    master_records.sort(key=lambda x: strip_accents(x['nombre']))

    print("\nWriting final Master Datasets...")
    
    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(master_records, f, ensure_ascii=False, indent=2)
    print(f"✅ Generated: {OUT_JSON}")

    if pd:
        df_master = pd.DataFrame(master_records)
        df_master.to_csv(OUT_CSV, index=False, encoding='utf-8-sig')
        print(f"✅ Generated: {OUT_CSV}")
        df_master.to_excel(OUT_XLSX, index=False, engine='openpyxl')
        print(f"✅ Generated: {OUT_XLSX}")
    else:
        import csv
        if master_records:
            keys = master_records[0].keys()
            with open(OUT_CSV, 'w', newline='', encoding='utf-8-sig') as f:
                dict_writer = csv.DictWriter(f, fieldnames=keys)
                dict_writer.writeheader()
                dict_writer.writerows(master_records)
            print(f"✅ Generated: {OUT_CSV}")

    cat_counts = {}
    city_counts = {}
    state_counts = {}
    
    for r in master_records:
        c = r.get('categoria', 'Otros')
        cat_counts[c] = cat_counts.get(c, 0) + 1
        
        ci = r.get('ciudad', 'Desconocido')
        city_counts[ci] = city_counts.get(ci, 0) + 1
        
        st = r.get('estado', 'Desconocido')
        state_counts[st] = state_counts.get(st, 0) + 1

    report_content = f"""# STREETBOSS MASTER DATASET REPORT

> Generado el: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Resumen de Ejecución

- **Total de archivos encontrados en Downloads**: {stats['total_files_found']}
- **Total de archivos procesados exitosamente**: {stats['total_files_processed']}
- **Total de registros leídos**: {stats['total_records_read']}
- **Total de restaurantes únicos consolidados**: {len(master_records)}
- **Total de duplicados eliminados / fusionados**: {stats['total_duplicates_removed']}
- **Total de registros no-restaurante descartados**: {stats['total_discarded']}
- **Total de URLs de redes sociales normalizadas**: {stats['total_urls_normalized']}
- **Total de errores de lectura**: {stats['total_errors']}

---

## Distribución por Categoría

| Categoría | Total Restaurantes |
| :--- | :--- |
"""
    for cat, count in sorted(cat_counts.items(), key=lambda x: x[1], reverse=True):
        report_content += f"| {cat} | {count} |\n"

    report_content += """
---

## Distribución por Ciudad

| Ciudad | Total Restaurantes |
| :--- | :--- |
"""
    for city, count in sorted(city_counts.items(), key=lambda x: x[1], reverse=True):
        report_content += f"| {city} | {count} |\n"

    report_content += """
---

## Distribución por Estado

| Estado | Total Restaurantes |
| :--- | :--- |
"""
    for st, count in sorted(state_counts.items(), key=lambda x: x[1], reverse=True):
        report_content += f"| {st} | {count} |\n"

    with open(OUT_REPORT, 'w', encoding='utf-8') as f:
        f.write(report_content)
    print(f"✅ Generated: {OUT_REPORT}")
    
    print("\n==================================================")
    print(f"🎉 MASTER DATASET BUILD COMPLETE!")
    print(f"TOTAL UNIQUE RESTAURANTS: {len(master_records)}")
    print("==================================================")


if __name__ == '__main__':
    run_master_dataset_builder()
