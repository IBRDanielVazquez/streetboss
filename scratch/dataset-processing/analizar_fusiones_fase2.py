#!/usr/bin/env python3
"""
Script de evaluación estricta de fusiones de alta confianza para StreetBoss (v3 - Normalización de Flotantes de Teléfono).
Analiza los grupos candidatos sin modificar data/MASTER_RESTAURANTS.xlsx.
Aplica normalización corregida de teléfonos flotantes de Apify (ej. 5296111396820.0 -> 9611139682).
"""

import os
import re
import pandas as pd
from collections import defaultdict

EXCEL_PATH = "/Users/danielvazquez/Proyectos/StreetBoss/data/MASTER_RESTAURANTS.xlsx"

def normalize_text(text):
    if not text or pd.isna(text):
        return ""
    text = str(text).lower().strip()
    text = re.sub(r'[áàäâ]', 'a', text)
    text = re.sub(r'[éèëê]', 'e', text)
    text = re.sub(r'[íìïî]', 'i', text)
    text = re.sub(r'[óòöô]', 'o', text)
    text = re.sub(r'[úùüû]', 'u', text)
    text = re.sub(r'[ñ]', 'n', text)
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def normalize_phone(phone):
    if not phone or pd.isna(phone):
        return ""
    s = str(phone).replace('.0', '').strip()
    digits = re.sub(r'\D', '', s)
    if digits.startswith('52'):
        if len(digits) == 13 and digits.endswith('0'):
            digits = digits[2:12]
        elif len(digits) == 12:
            digits = digits[2:]
        elif len(digits) == 11 and digits.startswith('521'):
            digits = digits[3:]
    elif digits.startswith('1') and len(digits) == 11:
        digits = digits[1:]
    return digits[-10:] if len(digits) >= 10 else digits

def normalize_fb(url):
    if not url or pd.isna(url):
        return ""
    url = str(url).lower().strip()
    if 'profile.php' in url:
        match = re.search(r'id=(\d+)', url)
        if match:
            return f"facebook.com/profile.php?id={match.group(1)}"
        return ""
    url = re.sub(r'\?locale=.*$', '', url)
    url = re.sub(r'\?.*$', '', url)
    url = re.sub(r'/(mentions|about|photos|videos|posts|events)/?$', '', url)
    url = url.rstrip('/')
    return url

BRANCH_KEYWORDS = [
    'palmas', 'centro', 'teran', 'boulevard', 'blvd', 'poniente', 'oriente', 
    'plaza', 'sucursal', 'cañahueca', 'sumidero', 'san cristobal', 'comitan', 
    'tapachula', 'poliforum', 'patria', 'moctezuma', 'copoya', 'libramiento'
]

def evaluate_high_confidence_merges():
    df = pd.read_excel(EXCEL_PATH)
    rows = df.to_dict(orient='records')
    total_before = len(rows)

    fb_map = defaultdict(list)
    for r in rows:
        fb = normalize_fb(r.get('facebook') or r.get('facebook_url'))
        if fb:
            fb_map[fb].append(r)

    candidate_groups = [group for fb, group in fb_map.items() if len(group) > 1]
    
    reviewed_groups = len(candidate_groups)
    merged_groups = 0
    branch_kept_groups = 0
    doubt_kept_groups = 0
    rows_eliminated = 0

    merge_examples = []
    
    for group in candidate_groups:
        names = [str(r.get('nombre') or r.get('business_name') or '') for r in group]
        addrs = [normalize_text(r.get('direccion') or r.get('address') or '') for r in group]
        phones = [normalize_phone(r.get('telefono') or r.get('phone') or r.get('whatsapp') or '') for r in group]
        cities = [normalize_text(r.get('ciudad') or r.get('city') or '') for r in group]

        # 1. Checar palabras explícitas de sucursales distintas entre los nombres
        branch_kws_per_record = []
        for name in names:
            norm_n = normalize_text(name)
            kws = [kw for kw in BRANCH_KEYWORDS if re.search(r'\b' + kw + r'\b', norm_n)]
            branch_kws_per_record.append(set(kws))

        all_kws = set.union(*branch_kws_per_record) if branch_kws_per_record else set()
        # Si dos registros tienen palabras de sucursal diferentes (ej. palmas vs centro)
        if len(all_kws) > 1:
            branch_kept_groups += 1
            continue

        # 2. Checar conflicto de direcciones válidas no vacías distintas
        valid_addrs = set(a for a in addrs if a)
        if len(valid_addrs) > 1:
            branch_kept_groups += 1
            continue

        # 3. Checar conflicto de ciudades distintas válidas
        valid_cities = set(c for c in cities if c)
        if len(valid_cities) > 1:
            branch_kept_groups += 1
            continue

        # 4. Checar conflicto de teléfonos distintos válidos no vacíos
        valid_phones = set(p for p in phones if p)
        if len(valid_phones) > 1:
            doubt_kept_groups += 1
            continue

        # Aprobado para fusión de alta confianza
        merged_groups += 1
        rows_eliminated += (len(group) - 1)

        # Construir el registro consolidado combinando información válida sin sobrescribir
        cleanest_name = sorted(names, key=lambda n: len(n), reverse=True)[0]
        primary_rec = group[0]

        def get_valid_val(field_names):
            for f in field_names:
                for r in group:
                    val = r.get(f)
                    if val and not pd.isna(val) and str(val).strip() != '' and str(val).strip() != 'nan':
                        return str(val).strip()
            return ''

        best_address = get_valid_val(['direccion', 'address'])
        raw_phone = get_valid_val(['telefono', 'phone'])
        best_phone = normalize_phone(raw_phone)
        best_wa = normalize_phone(get_valid_val(['whatsapp'])) or best_phone
        best_city = get_valid_val(['ciudad', 'city']) or 'Tuxtla Gutiérrez'
        best_cat = get_valid_val(['categoria', 'category']) or 'Restaurante'
        best_subcat = get_valid_val(['subcategoria'])
        best_fb = get_valid_val(['facebook', 'facebook_url'])
        best_ig = get_valid_val(['instagram', 'instagram_url'])
        best_web = get_valid_val(['sitio_web', 'website', 'website_url'])
        best_desc = get_valid_val(['descripcion'])
        best_horario = get_valid_val(['horario'])

        sources = set()
        for r in group:
            src = r.get('archivo_origen') or r.get('source')
            if src and not pd.isna(src):
                sources.add(str(src).strip())

        consolidated = {
            'id': primary_rec.get('id'),
            'nombre': cleanest_name,
            'slug': primary_rec.get('slug'),
            'categoria': best_cat,
            'subcategoria': best_subcat,
            'facebook': best_fb,
            'instagram': best_ig,
            'whatsapp': best_wa,
            'telefono': best_phone,
            'sitio_web': best_web,
            'direccion': best_address,
            'ciudad': best_city,
            'descripcion': best_desc,
            'horario': best_horario,
            'archivo_origen': ", ".join(sorted(sources)),
            'ultima_actualizacion': max(str(r.get('ultima_actualizacion') or '') for r in group)
        }

        if len(merge_examples) < 25:
            merge_examples.append({
                'originales': [{
                    'id': r.get('id'),
                    'nombre': r.get('nombre') or r.get('business_name'),
                    'direccion': r.get('direccion') or r.get('address'),
                    'telefono': normalize_phone(r.get('telefono') or r.get('phone') or r.get('whatsapp')),
                    'origen': r.get('archivo_origen') or r.get('source')
                } for r in group],
                'consolidado': consolidated,
                'motivo': "Mismo Facebook, misma dirección/ciudad (o vacía), teléfonos de 10 dígitos idénticos y sin sucursales distintas."
            })

    total_after = total_before - rows_eliminated

    print("==================================================")
    print("      REPORTE DE EVALUACIÓN DE FUSIONES DE ALTA CONFIANZA")
    print("==================================================")
    print(f"• Total filas antes:                   {total_before}")
    print(f"• Grupos candidatos revisados (FB):     {reviewed_groups}")
    print(f"• Grupos APROBADOS para fusión:         {merged_groups}")
    print(f"• Grupos CONSERVADOS (Sucursales):      {branch_kept_groups}")
    print(f"• Grupos CONSERVADOS (Por duda/tel):    {doubt_kept_groups}")
    print(f"• Filas que se eliminarán por fusión:  {rows_eliminated}")
    print(f"• Total filas propuesto después:       {total_after}")
    print("==================================================\n")

    print(f"=== MUESTREO DE {len(merge_examples)} EJEMPLOS DE FUSIÓN SEGURA ===\n")
    for idx, ex in enumerate(merge_examples, 1):
        print(f"--- EJEMPLO #{idx:02d} ---")
        print("REGISTROS ORIGINALES:")
        for orig in ex['originales']:
            print(f"  [ID: {orig['id']}] {orig['nombre']} | Dir: {orig['direccion']} | Tel: {orig['telefono']} | Origen: {orig['origen']}")
        print("REGISTRO CONSOLIDADO PROPUESTO:")
        c = ex['consolidado']
        print(f"  [ID: {c['id']}] {c['nombre']} | Dir: {c['direccion']} | Tel: {c['telefono']} | Orígenes combinados: {c['archivo_origen']}")
        print(f"MOTIVO: {ex['motivo']}\n")

if __name__ == '__main__':
    evaluate_high_confidence_merges()
