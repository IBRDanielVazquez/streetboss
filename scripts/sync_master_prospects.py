#!/usr/bin/env python3
"""
Script de sincronización y minificación extrema de la Base Maestra de Restaurantes para StreetBoss.
Lee data/MASTER_RESTAURANTS.xlsx y genera src/data/master_prospects.json
exportando ÚNICAMENTE las propiedades indispensables para el CRM en formato compacto.
"""

import sys
import os
import json
import pandas as pd

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXCEL_PATH = os.path.join(PROJECT_ROOT, "data", "MASTER_RESTAURANTS.xlsx")
OUTPUT_JSON_PATH = os.path.join(PROJECT_ROOT, "src", "data", "master_prospects.json")

def sync_master_prospects():
    if not os.path.exists(EXCEL_PATH):
        print(f"❌ Error: No se encontró el archivo maestro en {EXCEL_PATH}")
        sys.exit(1)

    print(f"📖 Leyendo base maestra desde {EXCEL_PATH}...")
    df = pd.read_excel(EXCEL_PATH)
    df = df.fillna("")

    records = df.to_dict(orient="records")

    cleaned_records = []
    for idx, row in enumerate(records):
        prospect_id = str(row.get("id") or f"prospect_master_{idx + 1}").strip()
        name = str(row.get("business_name") or row.get("nombre") or "").strip()
        cat = str(row.get("category") or row.get("giro") or "Restaurante").strip()
        city = str(row.get("city") or row.get("ciudad") or "Tuxtla Gutiérrez").strip()
        
        phone = str(row.get("phone") or "").replace(".0", "").strip()
        whatsapp = str(row.get("whatsapp") or "").replace(".0", "").strip()
        if not whatsapp and phone:
            whatsapp = phone

        fb = str(row.get("facebook") or row.get("facebook_url") or "").strip()
        ig = str(row.get("instagram") or row.get("instagram_url") or "").strip()
        web = str(row.get("website") or row.get("website_url") or "").strip()
        maps = str(row.get("maps_url") or "").strip()
        addr = str(row.get("address") or row.get("direccion") or "").strip()
        
        rating = str(row.get("rating") or "").strip()
        reviews = str(row.get("reviews_count") or "").strip()
        score = row.get("completeness_score") or row.get("calidad_pct") or 50

        status = str(row.get("status") or "Nuevo").strip()
        demo = str(row.get("assigned_demo") or "").strip()
        notes = str(row.get("notes") or "").strip()

        # Construir objeto minificado omitiendo claves vacías
        item = {
            "id": prospect_id,
            "name": name,
            "category": cat,
            "city": city,
        }

        if addr: item["address"] = addr
        if whatsapp: item["whatsapp"] = whatsapp
        if phone and phone != whatsapp: item["phone"] = phone
        if fb: item["facebook"] = fb
        if ig: item["instagram"] = ig
        if web: item["website"] = web
        if maps: item["maps_url"] = maps
        if rating: item["rating"] = rating
        if reviews and reviews != "0": item["reviews_count"] = reviews
        if score: item["completeness_score"] = int(score)

        if status and status != "Nuevo": item["status"] = status
        if demo: item["assigned_demo"] = demo
        if notes: item["notes"] = notes

        # Nuevos campos de prospeccion
        estado_actividad = str(row.get("estado_actividad") or "SIN DATOS").strip()
        score_op = row.get("score_oportunidad")
        prioridad = str(row.get("prioridad_prospeccion") or "D").strip()

        item["estado_actividad"] = estado_actividad
        if pd.notna(score_op) and str(score_op).strip() != "":
            item["score_oportunidad"] = int(score_op)
        item["prioridad_prospeccion"] = prioridad

        cleaned_records.append(item)

    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(cleaned_records, f, ensure_ascii=False, separators=(',', ':'))

    size_kb = round(os.path.getsize(OUTPUT_JSON_PATH) / 1024, 2)
    print(f"✅ Sincronización y minificación exitosa: {len(cleaned_records)} registros exportados a {OUTPUT_JSON_PATH} ({size_kb} KB)")

if __name__ == "__main__":
    sync_master_prospects()
