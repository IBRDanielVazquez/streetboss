#!/usr/bin/env font
"""
Script de sincronización de la Base Maestra de Restaurantes a JSON para el Frontend de StreetBoss.
Lee directamente data/MASTER_RESTAURANTS.xlsx (la única fuente oficial)
y genera src/data/master_prospects.json.
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

    # Reemplazar NaNs por cadenas vacías o None
    df = df.fillna("")

    records = df.to_dict(orient="records")

    cleaned_records = []
    for idx, row in enumerate(records):
        # Asegurar ID único
        prospect_id = str(row.get("id") or f"prospect_master_{idx + 1}")
        
        # Formatear teléfono / whatsapp
        phone = str(row.get("phone") or row.get("whatsapp") or "").replace(".0", "").strip()
        whatsapp = str(row.get("whatsapp") or phone).replace(".0", "").strip()

        cleaned_item = {
            "id": prospect_id,
            "business_name": str(row.get("business_name") or row.get("nombre") or "Sin Nombre").strip(),
            "category": str(row.get("category") or row.get("giro") or "Restaurante").strip(),
            "contact_name": str(row.get("contact_name") or "").strip(),
            "phone": phone,
            "whatsapp": whatsapp,
            "email": str(row.get("email") or "").strip(),
            "address": str(row.get("address") or row.get("direccion") or "").strip(),
            "colonia": str(row.get("colonia") or "").strip(),
            "city": str(row.get("city") or row.get("ciudad") or "Tuxtla Gutiérrez").strip(),
            "state": str(row.get("state") or row.get("estado") or "Chiapas").strip(),
            "facebook": str(row.get("facebook") or row.get("facebook_url") or "").strip(),
            "instagram": str(row.get("instagram") or row.get("instagram_url") or "").strip(),
            "tiktok": str(row.get("tiktok") or row.get("tiktok_url") or "").strip(),
            "website": str(row.get("website") or row.get("website_url") or "").strip(),
            "maps_url": str(row.get("maps_url") or "").strip(),
            "rating": str(row.get("rating") or "").strip(),
            "reviews_count": str(row.get("reviews_count") or "").strip(),
            "completeness_score": row.get("completeness_score") or row.get("calidad_pct") or 50,
            "source": str(row.get("source") or "Base Maestra Official").strip(),
            "status": str(row.get("status") or "Nuevo").strip(),
            "assigned_demo": str(row.get("assigned_demo") or "").strip(),
            "notes": str(row.get("notes") or "").strip()
        }
        cleaned_records.append(cleaned_item)

    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(cleaned_records, f, ensure_ascii=False, indent=2)

    print(f"✅ Sincronización exitosa: {len(cleaned_records)} registros exportados a {OUTPUT_JSON_PATH}")

if __name__ == "__main__":
    sync_master_prospects()
