#!/usr/bin/env python3
"""
Script de Pre-Auditoría de Duplicados para StreetBoss (Versión Corregida para FB Profile IDs).
Genera scratch/dataset-processing/POSSIBLE_DUPLICATES_REVIEW.xlsx
y presenta el resumen estadístico solicitado sin modificar MASTER_RESTAURANTS.xlsx.
"""

import os
import re
import pandas as pd
from collections import defaultdict

EXCEL_PATH = "/Users/danielvazquez/Proyectos/StreetBoss/data/MASTER_RESTAURANTS.xlsx"
OUTPUT_EXCEL = "/Users/danielvazquez/Proyectos/StreetBoss/scratch/dataset-processing/POSSIBLE_DUPLICATES_REVIEW.xlsx"

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
    # Si es profile.php, conservar id=123456789
    if 'profile.php' in url:
        match = re.search(r'id=(\d+)', url)
        if match:
            return f"facebook.com/profile.php?id={match.group(1)}"
        return "" # Ignore generic profile.php without ID
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

def build_pre_audit():
    df = pd.read_excel(EXCEL_PATH)
    rows = df.to_dict(orient='records')

    fb_map = defaultdict(set)
    wa_map = defaultdict(set)
    phone_map = defaultdict(set)
    name_city_map = defaultdict(set)

    for r in rows:
        rid = r.get('id')
        bname = normalize_text(r.get('nombre') or r.get('business_name'))
        city = normalize_text(r.get('ciudad') or r.get('city'))
        fb = normalize_fb(r.get('facebook') or r.get('facebook_url'))
        wa = normalize_phone(r.get('whatsapp'))
        phone = normalize_phone(r.get('telefono') or r.get('phone'))

        if fb:
            fb_map[fb].add(rid)
        if wa:
            wa_map[wa].add(rid)
        if phone:
            phone_map[phone].add(rid)
        if bname and city:
            name_city_map[f"{bname} || {city}"].add(rid)

    parent = {}
    def find(i):
        if parent[i] == i:
            return i
        parent[i] = find(parent[i])
        return parent[i]

    def union(i, j):
        root_i = find(i)
        root_j = find(j)
        if root_i != root_j:
            parent[root_i] = root_j

    for r in rows:
        rid = r.get('id')
        parent[rid] = rid

    for fb, rids in fb_map.items():
        rid_list = list(rids)
        for k in range(1, len(rid_list)):
            union(rid_list[0], rid_list[k])

    for wa, rids in wa_map.items():
        rid_list = list(rids)
        for k in range(1, len(rid_list)):
            union(rid_list[0], rid_list[k])

    for ph, rids in phone_map.items():
        rid_list = list(rids)
        for k in range(1, len(rid_list)):
            union(rid_list[0], rid_list[k])

    for nc, rids in name_city_map.items():
        rid_list = list(rids)
        for k in range(1, len(rid_list)):
            union(rid_list[0], rid_list[k])

    grouped_ids = defaultdict(list)
    for r in rows:
        rid = r.get('id')
        root = find(rid)
        grouped_ids[root].append(r)

    multi_groups = [g for g in grouped_ids.values() if len(g) > 1]
    multi_groups.sort(key=lambda g: (-len(g), normalize_text(g[0].get('nombre') or g[0].get('business_name'))))

    count_fb_merge = 0
    count_wa_merge = 0
    count_phone_merge = 0
    count_name_only = 0
    count_human_review = 0

    excel_rows = []

    for idx, group in enumerate(multi_groups):
        group_id_str = f"Grupo {idx + 1:03d}"
        
        fbs = set(normalize_fb(r.get('facebook')) for r in group if normalize_fb(r.get('facebook')))
        was = set(normalize_phone(r.get('whatsapp')) for r in group if normalize_phone(r.get('whatsapp')))
        phs = set(normalize_phone(r.get('telefono')) for r in group if normalize_phone(r.get('telefono')))
        addrs = set(normalize_text(r.get('direccion')) for r in group if normalize_text(r.get('direccion')))
        cities = set(normalize_text(r.get('ciudad')) for r in group if normalize_text(r.get('ciudad')))

        same_fb = len(fbs) == 1 and len(group) == len([r for r in group if normalize_fb(r.get('facebook'))])
        same_wa = len(was) == 1 and len(group) == len([r for r in group if normalize_phone(r.get('whatsapp'))])
        same_phone = len(phs) == 1 and len(group) == len([r for r in group if normalize_phone(r.get('telefono'))])
        diff_addrs = len(addrs) > 1
        diff_cities = len(cities) > 1

        if same_fb:
            count_fb_merge += 1
            if diff_addrs:
                rec = "SUCURSALES"
                motivo = "Mismo Facebook pero Direcciones distintas"
            else:
                rec = "FUSIONAR"
                motivo = "Mismo Facebook"
        elif same_wa:
            count_wa_merge += 1
            if diff_addrs:
                rec = "SUCURSALES"
                motivo = "Mismo WhatsApp pero Direcciones distintas"
            else:
                rec = "FUSIONAR"
                motivo = "Mismo WhatsApp"
        elif same_phone:
            count_phone_merge += 1
            if diff_addrs:
                rec = "SUCURSALES"
                motivo = "Mismo teléfono pero Direcciones distintas"
            else:
                rec = "FUSIONAR"
                motivo = "Mismo teléfono"
        elif diff_cities or diff_addrs:
            rec = "SUCURSALES"
            motivo = "Direcciones o Ciudades distintas"
            count_human_review += 1
        else:
            count_name_only += 1
            rec = "REVISIÓN MANUAL"
            motivo = "Coinciden únicamente en Nombre + Ciudad (verificar si son duplicados o sucursales)"

        for r in group:
            excel_rows.append({
                'GRUPO_ID': group_id_str,
                'ID': r.get('id'),
                'NOMBRE_ORIGINAL': r.get('nombre') or r.get('business_name'),
                'NOMBRE_NORMALIZADO': normalize_text(r.get('nombre') or r.get('business_name')),
                'CIUDAD': r.get('ciudad') or r.get('city'),
                'DIRECCIÓN': r.get('direccion') or r.get('address'),
                'TELÉFONO': r.get('telefono') or r.get('phone'),
                'WHATSAPP': r.get('whatsapp'),
                'FACEBOOK': r.get('facebook'),
                'INSTAGRAM': r.get('instagram'),
                'SITIO_WEB': r.get('sitio_web') or r.get('website'),
                'CATEGORÍA': r.get('categoria') or r.get('category'),
                'ARCHIVO_ORIGEN': r.get('archivo_origen') or r.get('source'),
                'RECOMENDACIÓN': rec,
                'MOTIVO': motivo
            })

    df_out = pd.DataFrame(excel_rows)
    os.makedirs(os.path.dirname(OUTPUT_EXCEL), exist_ok=True)
    df_out.to_excel(OUTPUT_EXCEL, index=False)

    print(f"=== PRE-AUDITORÍA MEJORADA FINALIZADA ===")
    print(f"Total Grupos Candidatos: {len(multi_groups)}")
    print(f"Total Filas Involucradas: {len(excel_rows)}")
    print(f"Grupos fusionables por Facebook idéntico (con ID de perfil): {count_fb_merge}")
    print(f"Grupos fusionables por WhatsApp idéntico: {count_wa_merge}")
    print(f"Grupos fusionables por Teléfono idéntico: {count_phone_merge}")
    print(f"Grupos que coinciden SOLO por nombre + ciudad: {count_name_only}")
    print(f"Grupos de posibles sucursales o revisión humana: {count_human_review}")
    print(f"Archivo de evidencia generado en: {OUTPUT_EXCEL}")

if __name__ == '__main__':
    build_pre_audit()
