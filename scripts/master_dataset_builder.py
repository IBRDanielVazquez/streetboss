#!/usr/bin/env python3
"""
STREETBOSS MASTER DATASET BUILDER (SINGLE EXCEL OPERATIONAL SYSTEM)
==================================================================
Automatic discovery, ingestion, cleaning, branch disambiguation,
enrichment, alphabetical sorting, and direct updating of:
/Users/danielvazquez/Proyectos/StreetBoss/data/MASTER_RESTAURANTS.xlsx

Author: Antigravity AI (Google DeepMind team) for StreetBoss
"""

import os
import re
import sys
import uuid
import unicodedata
from datetime import datetime

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


# --- CONFIGURATION & PATHS ---
DOWNLOADS_DIR = os.path.expanduser('~/Downloads')
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, 'data')
os.makedirs(DATA_DIR, exist_ok=True)

MASTER_XLSX = os.path.join(DATA_DIR, 'MASTER_RESTAURANTS.xlsx')

NON_FOOD_KEYWORDS = [
    'escuela', 'colegio', 'universidad', 'instituto', 'hospital', 'clinica', 'medico',
    'farmacia', 'hotel', 'motel', 'hostal', 'cabanas', 'inmobiliaria', 'bienes raices',
    'lotes', 'ventas inmobiliarias', 'terrenos', 'constructora', 'taller', 'mecanico',
    'refaccionaria', 'ferreteria', 'lavanderia', 'dry clean', 'boutique', 'ropa',
    'zapateria', 'estetica', 'salon de belleza', 'barberia', 'spa', 'veterinaria',
    'banco', 'caja popular', 'gobierno', 'municipio', 'oficina', 'renta de autos',
    'gasolinera', 'supermercado', 'oxxo', '7-eleven', 'bodega', 'papeleria', 'imprenta',
    'codigo postal', 'asentamiento', 'colonia'
]

FOOD_KEYWORDS = [
    'restaurante', 'taqueria', 'tacos', 'pizzeria', 'pizza', 'cafeteria', 'cafe',
    'hamburgueseria', 'hamburguesa', 'mariscos', 'marisqueria', 'pollos', 'pollo',
    'sushi', 'bar', 'cantaritos', 'micheladas', 'dark kitchen', 'cocina economica',
    'panaderia', 'pan', 'postres', 'reposteria', 'pasteleria', 'helados', 'heladeria',
    'antojitos', 'comida', 'cenaduria', 'comedor', 'bistro', 'grill', 'wings',
    'alitas', 'tortas', 'loncheria', 'birria', 'carnitas', 'gorditas', 'empanadas',
    'asador', 'buffet', 'snack', 'cocina'
]

GENERIC_NAMES = [
    'el fogon', 'el patio', 'la cabana', 'el buen taco', 'cafe central',
    'los arcos', 'la herradura', 'la parroquia', 'el mariachi', 'la choza',
    'el rincon', 'el portal', 'la tradicion', 'el tizon'
]

BRANCH_KEYWORDS = [
    'sucursal', 'suc.', 'branch', 'plaza', 'teran', 'centro', 'oriente', 'poniente',
    'norte', 'sur', 'san cristobal', 'libramiento', 'moctezuma', 'caña hueca', 'patio'
]


def strip_accents(text: str) -> str:
    if not text:
        return ""
    text = str(text)
    nfkd = unicodedata.normalize('NFKD', text)
    return "".join([c for c in nfkd if not unicodedata.combining(c)]).lower().strip()


def normalize_name_key(name: str) -> str:
    clean = strip_accents(name)
    clean = re.sub(r'[^a-z0-9\s]', ' ', clean)
    clean = re.sub(r'\s+', ' ', clean).strip()
    stop_words = {'restaurante', 'taqueria', 'pizzeria', 'cafeteria', 'sucursal', 'tuxtla', 'gutierrez', 'chiapas', 'mx', 'el', 'la', 'los', 'las', 'de', 'del', 'y'}
    tokens = [w for w in clean.split() if w not in stop_words and len(w) > 1]
    return " ".join(tokens) if tokens else clean


def clean_facebook_url(url: str) -> str:
    if not url or (pd and pd.isna(url)):
        return ""
    url = str(url).strip()
    if not url or url.lower() in ['nan', 'none']:
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
    if not url or (pd and pd.isna(url)):
        return ""
    url = str(url).strip()
    if not url or url.lower() in ['nan', 'none']:
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
    raw = str(wa_val or "")
    if 'wa.me' in raw or 'whatsapp.com' in raw:
        digits = re.sub(r'\D', '', raw.split('?')[0])
        if digits:
            return f"+{digits}" if not digits.startswith('+') else digits
    clean_p = clean_phone(wa_val) or clean_phone(phone_val)
    return clean_p


def generate_slug(name: str, city: str = "") -> str:
    clean = strip_accents(f"{name} {city}")
    clean = re.sub(r'[^a-z0-9\s-]', '', clean)
    clean = re.sub(r'[\s-]+', '-', clean).strip('-')
    return clean


def classify_restaurant(name: str, category_raw: str, desc: str = "") -> tuple:
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
    has_contact = bool(record.get('whatsapp') or record.get('telefono') or record.get('facebook'))
    if score >= 80 and has_contact:
        return "Completo / Premium"
    elif score >= 50 and has_contact:
        return "Listo para Contacto"
    else:
        return "Requiere Enriquecimiento"


def is_non_food_business(name: str, category: str, address: str = "", file_name: str = "") -> bool:
    full_text = strip_accents(f"{name} {category} {address}")
    if not name or name.lower() in ['nan', 'none']:
        return True
    if "chiapas.xls" in file_name.lower() or "bella_vista_ventas" in file_name.lower():
        return True
    has_non_food = any(k in full_text for k in NON_FOOD_KEYWORDS)
    has_food = any(k in full_text for k in FOOD_KEYWORDS)
    if has_non_food and not has_food:
        return True
    return False


def are_distinct_branches(rec1: dict, rec2: dict) -> bool:
    n1_clean = strip_accents(rec1['nombre'])
    n2_clean = strip_accents(rec2['nombre'])
    
    is_generic = any(g in n1_clean for g in GENERIC_NAMES) or any(g in n2_clean for g in GENERIC_NAMES)
    
    has_b1 = any(b in n1_clean for b in BRANCH_KEYWORDS)
    has_b2 = any(b in n2_clean for b in BRANCH_KEYWORDS)
    if has_b1 or has_b2:
        if n1_clean != n2_clean:
            return True

    addr1 = strip_accents(rec1.get('direccion', ''))
    addr2 = strip_accents(rec2.get('direccion', ''))
    if len(addr1) > 8 and len(addr2) > 8 and addr1 != addr2:
        if fuzz and fuzz.token_sort_ratio(addr1, addr2) < 70:
            return True

    p1 = rec1.get('telefono') or rec1.get('whatsapp')
    p2 = rec2.get('telefono') or rec2.get('whatsapp')
    if p1 and p2 and p1 != p2:
        return True

    fb1 = rec1.get('facebook')
    fb2 = rec2.get('facebook')
    if fb1 and fb2 and fb1 != fb2:
        return True

    ig1 = rec1.get('instagram')
    ig2 = rec2.get('instagram')
    if ig1 and ig2 and ig1 != ig2:
        return True

    if is_generic and (not fb1 or not fb2 or fb1 != fb2) and (not p1 or not p2 or p1 != p2):
        return True

    return False


def run_master_dataset_builder():
    print("==================================================")
    print("🚀 STREETBOSS MASTER DATASET INCREMENTAL BUILDER")
    print("==================================================")
    
    # 1. Load existing MASTER_RESTAURANTS.xlsx
    master_records = []
    if os.path.exists(MASTER_XLSX) and pd:
        df_master = pd.read_excel(MASTER_XLSX)
        master_records = df_master.to_dict(orient='records')
        print(f"Loaded existing master: {len(master_records)} records.")

    # 2. Discover new data files in Downloads
    files_found = []
    for root, dirs, files in os.walk(DOWNLOADS_DIR):
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in ['.csv', '.xlsx', '.xls']:
                files_found.append(os.path.join(root, f))
                
    if not files_found:
        print("No new data files found in Downloads. Master remains up to date.")
        return

    print(f"Found {len(files_found)} new source files in Downloads to ingest.\n")
    
    new_raw_records = []
    processed_filepaths = []
    
    for filepath in sorted(files_found):
        rel_name = os.path.relpath(filepath, DOWNLOADS_DIR)
        ext = os.path.splitext(filepath)[1].lower()
        rows = []
        try:
            if ext == '.xlsx':
                wb = openpyxl.load_workbook(filepath, read_only=True)
                for sname in wb.sheetnames:
                    df = pd.read_excel(filepath, sheet_name=sname)
                    rows.extend(df.to_dict(orient='records'))
            elif ext == '.xls':
                if xlrd and pd:
                    excel_file = pd.ExcelFile(filepath)
                    for sname in excel_file.sheet_names:
                        df = pd.read_excel(filepath, sheet_name=sname)
                        rows.extend(df.to_dict(orient='records'))
            elif ext == '.csv':
                for enc in ['utf-8', 'latin-1', 'cp1252']:
                    try:
                        df = pd.read_csv(filepath, encoding=enc, low_memory=False)
                        rows = df.to_dict(orient='records')
                        break
                    except Exception:
                        continue

            for r in rows:
                keys = {str(k).lower().strip('\ufeff" '): v for k, v in r.items()}
                name = str(keys.get('nombre_negocio') or keys.get('nombre') or keys.get('title') or keys.get('name') or "").strip()
                cat_raw = str(keys.get('categoria_google') or keys.get('categoria_busqueda') or keys.get('categoria') or "")
                address = str(keys.get('direccion') or keys.get('address') or "")
                
                if not is_non_food_business(name, cat_raw, address, rel_name):
                    rec = map_row_to_standard(keys, rel_name, name, address, cat_raw)
                    if rec:
                        new_raw_records.append(rec)
            
            processed_filepaths.append(filepath)
            print(f"Processed: {rel_name}")
        except Exception as e:
            print(f"Error reading {rel_name}: {e}")

    print(f"\nExtracted {len(new_raw_records)} candidate records from new files.")

    # 3. Merge new records into Master
    fb_map = {r['facebook']: idx for idx, r in enumerate(master_records) if r.get('facebook')}
    ig_map = {r['instagram']: idx for idx, r in enumerate(master_records) if r.get('instagram')}
    phone_map = {r['telefono']: idx for idx, r in enumerate(master_records) if r.get('telefono')}
    name_map = {normalize_name_key(r['nombre']): idx for idx, r in enumerate(master_records)}

    for rec in new_raw_records:
        target_idx = None
        
        if rec.get('facebook') and rec['facebook'] in fb_map:
            c_idx = fb_map[rec['facebook']]
            if not are_distinct_branches(master_records[c_idx], rec):
                target_idx = c_idx
        if target_idx is None and rec.get('instagram') and rec['instagram'] in ig_map:
            c_idx = ig_map[rec['instagram']]
            if not are_distinct_branches(master_records[c_idx], rec):
                target_idx = c_idx
        p_val = rec.get('telefono') or rec.get('whatsapp')
        if target_idx is None and p_val and p_val in phone_map:
            c_idx = phone_map[p_val]
            if not are_distinct_branches(master_records[c_idx], rec):
                target_idx = c_idx
        n_key = normalize_name_key(rec['nombre'])
        if target_idx is None and n_key and n_key in name_map:
            c_idx = name_map[n_key]
            if not are_distinct_branches(master_records[c_idx], rec):
                target_idx = c_idx

        if target_idx is not None:
            # Complete missing fields
            target = master_records[target_idx]
            for field, val in rec.items():
                if field in ['id', 'fecha_creacion']:
                    continue
                if val and not target.get(field):
                    target[field] = val
                elif field == 'archivo_origen' and val and val not in str(target.get('archivo_origen', '')):
                    target['archivo_origen'] = f"{target.get('archivo_origen', '')}, {val}".strip(', ')
            target['score_comercial'] = calculate_score(target)
            target['estado_comercial'] = determine_commercial_status(target['score_comercial'], target)
            target['ultima_actualizacion'] = datetime.now().isoformat()
        else:
            master_records.append(rec)
            new_idx = len(master_records) - 1
            if rec.get('facebook'):
                fb_map[rec['facebook']] = new_idx
            if rec.get('instagram'):
                ig_map[rec['instagram']] = new_idx
            if p_val:
                phone_map[p_val] = new_idx
            if n_key:
                name_map[n_key] = new_idx

    # Sort alphabetically
    master_records.sort(key=lambda x: strip_accents(x.get('nombre', '')))

    # 4. Save directly to MASTER_RESTAURANTS.xlsx
    df_out = pd.DataFrame(master_records)
    for col in df_out.select_dtypes(include=['object']).columns:
        df_out[col] = df_out[col].astype(str).str.strip().replace({'nan': '', 'None': '', 'NONE': ''})

    df_out.to_excel(MASTER_XLSX, index=False, engine='openpyxl')
    print(f"✅ Successfully updated {MASTER_XLSX} ({len(master_records)} total records).")

    # 5. Automatically delete processed source files
    for fp in processed_filepaths:
        if os.path.exists(fp):
            os.remove(fp)
            print(f"🗑️ Deleted processed source file: {os.path.basename(fp)}")


def map_row_to_standard(keys: dict, file_label: str, name: str, address: str, cat_raw: str) -> dict:
    city = keys.get('ciudad') or keys.get('city') or keys.get('municipio') or "Tuxtla Gutiérrez"
    city = str(city).strip()
    if re.search(r'tuxtla', city, re.IGNORECASE):
        city = "Tuxtla Gutiérrez"
    elif re.search(r'san cristobal', strip_accents(city)):
        city = "San Cristóbal de las Casas"

    state = keys.get('estado') or keys.get('state') or "Chiapas"
    state = str(state).strip()
    if re.search(r'(chiapas|chis)', state, re.IGNORECASE):
        state = "Chiapas"

    fb = clean_facebook_url(keys.get('facebook_url') or keys.get('facebook') or keys.get('fb_url'))
    ig = clean_instagram_url(keys.get('instagram_url') or keys.get('instagram') or keys.get('ig_url'))
    phone = clean_phone(keys.get('telefono') or keys.get('telefono_e164') or keys.get('phone'))
    wa = clean_whatsapp(keys.get('whatsapp') or keys.get('whatsapp_link'), phone)
    
    messenger = keys.get('messenger_url') or keys.get('messenger') or ""
    if not messenger and fb:
        fb_u = fb.rstrip('/').split('/')[-1]
        if fb_u:
            messenger = f"https://m.me/{fb_u}"
            
    email = keys.get('email') or keys.get('correo') or ""
    email = str(email).strip().lower() if email and str(email).lower() not in ['nan', 'none'] else ""
    
    website = keys.get('website') or keys.get('sitio_web') or keys.get('menu_url') or ""
    website = str(website).strip() if website and str(website).lower() not in ['nan', 'none'] else ""
    
    lat = keys.get('latitud') or keys.get('latitude') or keys.get('lat')
    lng = keys.get('longitud') or keys.get('longitude') or keys.get('lng') or keys.get('lon')
    try:
        lat = float(lat) if lat and str(lat) != 'nan' else None
        lng = float(lng) if lng and str(lng) != 'nan' else None
    except (ValueError, TypeError):
        lat, lng = None, None
        
    desc = keys.get('descripcion') or keys.get('description') or keys.get('notas') or ""
    hours = keys.get('horario') or keys.get('openinghours') or keys.get('hours') or ""
    
    cat, subcat = classify_restaurant(name, str(cat_raw), str(desc))
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
        'origen': "Incremental Ingestion",
        'archivo_origen': file_label,
        'fecha_creacion': now_iso,
        'ultima_actualizacion': now_iso,
        'observaciones': f"Ingestado desde {file_label}"
    }
    record['score_comercial'] = calculate_score(record)
    record['estado_comercial'] = determine_commercial_status(record['score_comercial'], record)
    return record


if __name__ == '__main__':
    run_master_dataset_builder()
