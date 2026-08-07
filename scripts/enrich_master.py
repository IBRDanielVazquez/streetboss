import pandas as pd
from datetime import datetime
import json

file_path = '/Users/danielvazquez/Proyectos/StreetBoss/data/MASTER_RESTAURANTS.xlsx'
df = pd.read_excel(file_path)

df['ultima_publicacion_facebook'] = None
df['dias_desde_ultima_publicacion'] = None
df['estado_actividad'] = 'SIN DATOS'
df['score_oportunidad'] = 0
df['prioridad_prospeccion'] = 'D'
df['fecha_ultima_validacion'] = datetime.now().strftime('%Y-%m-%d')

for index, row in df.iterrows():
    score = 0
    has_fb = pd.notna(row.get('Facebook')) and str(row.get('Facebook')).strip() != ''
    if has_fb:
        score += 20
        df.at[index, 'estado_actividad'] = 'SIN DATOS'
    else:
        df.at[index, 'estado_actividad'] = 'SIN FACEBOOK'
        
    has_wa = pd.notna(row.get('WhatsApp')) and str(row.get('WhatsApp')).strip() != ''
    if has_wa:
        score += 20
        
    has_tel = pd.notna(row.get('Teléfono')) and str(row.get('Teléfono')).strip() != ''
    if has_tel:
        score += 15
        
    has_ig = pd.notna(row.get('Instagram')) and str(row.get('Instagram')).strip() != ''
    if has_ig:
        score += 15
        
    has_web = pd.notna(row.get('Sitio web')) and str(row.get('Sitio web')).strip() != ''
    if has_web:
        score += 10
        
    has_name = pd.notna(row.get('Nombre original')) or pd.notna(row.get('Nombre normalizado'))
    if has_name:
        score += 20
        
    df.at[index, 'score_oportunidad'] = score
    
    if score >= 85:
        prioridad = 'A+'
    elif score >= 70:
        prioridad = 'A'
    elif score >= 55:
        prioridad = 'B'
    elif score >= 40:
        prioridad = 'C'
    else:
        prioridad = 'D'
        
    df.at[index, 'prioridad_prospeccion'] = prioridad

df.to_excel(file_path, index=False)

stats = {
    'total': len(df),
    'A+': len(df[df['prioridad_prospeccion'] == 'A+']),
    'A': len(df[df['prioridad_prospeccion'] == 'A']),
    'B': len(df[df['prioridad_prospeccion'] == 'B']),
    'C': len(df[df['prioridad_prospeccion'] == 'C']),
    'D': len(df[df['prioridad_prospeccion'] == 'D']),
    'Activos': len(df[df['estado_actividad'] == 'ACTIVO']),
    'Probablemente activos': len(df[df['estado_actividad'] == 'PROBABLEMENTE ACTIVO']),
    'Actividad baja': len(df[df['estado_actividad'] == 'ACTIVIDAD BAJA']),
    'Inactivos / revisar': len(df[df['estado_actividad'] == 'INACTIVO / REVISAR']),
    'Sin Facebook': len(df[df['estado_actividad'] == 'SIN FACEBOOK']),
    'Sin datos': len(df[df['estado_actividad'] == 'SIN DATOS']),
}

with open('/Users/danielvazquez/Proyectos/StreetBoss/scripts/enrich_stats.json', 'w') as f:
    json.dump(stats, f)

print("Enrichment complete.")
