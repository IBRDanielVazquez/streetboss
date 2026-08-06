#!/usr/bin/env python3
"""
Script de Diagnóstico Local de Fase 1 para StreetBoss.
Analiza la base maestra data/MASTER_RESTAURANTS.xlsx sin realizar ninguna modificación.
"""

import os
import re
import pandas as pd
from collections import defaultdict
from rapidfuzz import fuzz

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
    # Remove emojis and special chars
    text = re.sub(r'[^\w\s]', ' ', text)
    # Generic words to strip
    generics = ['oficial', 'pagina oficial', 'facebook', 'inicio', 'mentions', 'about']
    for g in generics:
        text = text.replace(g, '')
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def normalize_phone(phone):
    if not phone or pd.isna(phone):
        return ""
    digits = re.sub(r'\D', '', str(phone))
    if digits.startswith('52') and len(digits) == 12:
        digits = digits[2:]
    elif digits.startswith('1') and len(digits) == 11:
        digits = digits[1:]
    return digits[-10:] if len(digits) >= 10 else digits

def normalize_fb(url):
    if not url or pd.isna(url):
        return ""
    url = str(url).lower().strip()
    url = re.sub(r'\?locale=.*$', '', url)
    url = re.sub(r'\?.*$', '', url)
    url = re.sub(r'/(mentions|about|photos|videos|posts|events)/?$', '', url)
    url = url.rstrip('/')
    return url

def normalize_ig(url):
    if not url or pd.isna(url):
        return ""
    url = str(url).lower().strip()
    url = re.sub(r'\?.*$', '', url)
    url = url.rstrip('/')
    return url

def normalize_url(url):
    if not url or pd.isna(url):
        return ""
    url = str(url).lower().strip()
    url = re.sub(r'https?://', '', url)
    url = re.sub(r'^www\.', '', url)
    url = re.sub(r'\?.*$', '', url)
    url = url.rstrip('/')
    return url

def run_diagnostics():
    if not os.path.exists(EXCEL_PATH):
        print(f"Error: {EXCEL_PATH} no existe")
        return

    df = pd.read_excel(EXCEL_PATH)
    total_records = len(df)
    total_columns = len(df.columns)
    column_names = list(df.columns)

    # 1. Duplicados exactos (todas las columnas idénticas excepto id)
    cols_no_id = [c for c in df.columns if c != 'id']
    exact_dupes = df.duplicated(subset=cols_no_id, keep=False).sum()

    # 2. Normalización de campos para conteo de repeticiones
    fb_counts = defaultdict(list)
    ig_counts = defaultdict(list)
    wa_counts = defaultdict(list)
    phone_counts = defaultdict(list)
    web_counts = defaultdict(list)
    name_city_counts = defaultdict(list)
    identical_info_counts = defaultdict(list)

    for idx, row in df.iterrows():
        rec_id = row.get('id', idx)
        b_name = str(row.get('business_name') or row.get('nombre') or '')
        norm_name = normalize_text(b_name)
        city = normalize_text(str(row.get('city') or row.get('ciudad') or ''))
        
        fb = normalize_fb(row.get('facebook') or row.get('facebook_url'))
        ig = normalize_ig(row.get('instagram') or row.get('instagram_url'))
        wa = normalize_phone(row.get('whatsapp'))
        phone = normalize_phone(row.get('phone'))
        web = normalize_url(row.get('website') or row.get('website_url'))
        addr = normalize_text(row.get('address') or row.get('direccion'))

        if fb:
            fb_counts[fb].append(rec_id)
        if ig:
            ig_counts[ig].append(rec_id)
        if wa:
            wa_counts[wa].append(rec_id)
        if phone:
            phone_counts[phone].append(rec_id)
        if web:
            web_counts[web].append(rec_id)
        if norm_name and city:
            name_city_counts[f"{norm_name} || {city}"].append(rec_id)

        # Informacion idéntica clave (nombre norm + ciudad + direccion/telefono)
        key_info = f"{norm_name}|{city}|{phone}|{addr}"
        identical_info_counts[key_info].append(rec_id)

    dup_fb = sum(1 for ids in fb_counts.values() if len(ids) > 1)
    dup_fb_rows = sum(len(ids) for ids in fb_counts.values() if len(ids) > 1)

    dup_ig = sum(1 for ids in ig_counts.values() if len(ids) > 1)
    dup_ig_rows = sum(len(ids) for ids in ig_counts.values() if len(ids) > 1)

    dup_wa = sum(1 for ids in wa_counts.values() if len(ids) > 1)
    dup_wa_rows = sum(len(ids) for ids in wa_counts.values() if len(ids) > 1)

    dup_phone = sum(1 for ids in phone_counts.values() if len(ids) > 1)
    dup_phone_rows = sum(len(ids) for ids in phone_counts.values() if len(ids) > 1)

    dup_web = sum(1 for ids in web_counts.values() if len(ids) > 1)
    dup_web_rows = sum(len(ids) for ids in web_counts.values() if len(ids) > 1)

    dup_name_city = sum(1 for ids in name_city_counts.values() if len(ids) > 1)
    dup_name_city_rows = sum(len(ids) for ids in name_city_counts.values() if len(ids) > 1)

    dup_identical_info = sum(1 for ids in identical_info_counts.values() if len(ids) > 1)
    dup_identical_info_rows = sum(len(ids) for ids in identical_info_counts.values() if len(ids) > 1)

    # 3. Fuzzy name matching para detectar nombres muy similares en la misma ciudad
    similar_names = []
    branches_detected = []
    
    rows_list = df.to_dict(orient='records')
    for i in range(len(rows_list)):
        for j in range(i + 1, len(rows_list)):
            r1 = rows_list[i]
            r2 = rows_list[j]
            
            n1 = normalize_text(r1.get('business_name') or r1.get('nombre'))
            n2 = normalize_text(r2.get('business_name') or r2.get('nombre'))
            c1 = normalize_text(r1.get('city') or r1.get('ciudad'))
            c2 = normalize_text(r2.get('city') or r2.get('ciudad'))

            if not n1 or not n2:
                continue

            ratio = fuzz.ratio(n1, n2)
            if ratio >= 85 and ratio < 100:
                # Checar si es misma ciudad o diferente
                similar_names.append({
                    'id1': r1.get('id'), 'name1': r1.get('business_name'), 'city1': c1,
                    'id2': r2.get('id'), 'name2': r2.get('business_name'), 'city2': c2,
                    'ratio': ratio
                })

            # Detectar si son sucursales reales (mismo nombre o similar, pero dif direccion / sucursal / ciudad / whatsapp)
            if ratio >= 80:
                addr1 = normalize_text(r1.get('address') or r1.get('direccion'))
                addr2 = normalize_text(r2.get('address') or r2.get('direccion'))
                p1 = normalize_phone(r1.get('phone'))
                p2 = normalize_phone(r2.get('phone'))
                w1 = normalize_phone(r1.get('whatsapp'))
                w2 = normalize_phone(r2.get('whatsapp'))

                # Si difieren en dirección o teléfono o ciudad
                diffs = []
                if c1 and c2 and c1 != c2:
                    diffs.append(f"Ciudad distinta: {c1} vs {c2}")
                if addr1 and addr2 and addr1 != addr2:
                    diffs.append(f"Dirección distinta: {addr1[:30]} vs {addr2[:30]}")
                if p1 and p2 and p1 != p2:
                    diffs.append(f"Teléfono distinto: {p1} vs {p2}")
                if w1 and w2 and w1 != w2:
                    diffs.append(f"WhatsApp distinto: {w1} vs {w2}")

                if diffs:
                    branches_detected.append({
                        'name1': r1.get('business_name'),
                        'name2': r2.get('business_name'),
                        'diffs': diffs
                    })

    print(f"=== RESULTADOS DE DIAGNÓSTICO FASE 1 ===")
    print(f"Total Registros: {total_records}")
    print(f"Total Columnas: {total_columns}")
    print(f"Columnas: {column_names}")
    print(f"Duplicados Exactos (filas idénticas): {exact_dupes}")
    print(f"Facebook repetidos (grupos / filas afectadas): {dup_fb} grupos ({dup_fb_rows} filas)")
    print(f"Instagram repetidos (grupos / filas afectadas): {dup_ig} grupos ({dup_ig_rows} filas)")
    print(f"WhatsApp repetidos (grupos / filas afectadas): {dup_wa} grupos ({dup_wa_rows} filas)")
    print(f"Teléfonos repetidos (grupos / filas afectadas): {dup_phone} grupos ({dup_phone_rows} filas)")
    print(f"Sitios web repetidos (grupos / filas afectadas): {dup_web} grupos ({dup_web_rows} filas)")
    print(f"Nombre norm + Ciudad repetidos (grupos / filas): {dup_name_city} grupos ({dup_name_city_rows} filas)")
    print(f"Registros con info clave idéntica (dif ID): {dup_identical_info} grupos ({dup_identical_info_rows} filas)")
    print(f"Parejas con nombres muy similares (85-99% similitud): {len(similar_names)}")
    print(f"Sucursales reales con diferencias claras detectadas: {len(branches_detected)}")

if __name__ == '__main__':
    run_diagnostics()
