import os

review_dir = "/Users/danielvazquez/Proyectos/StreetBoss/brand-assets/05-calendar/week-01/review"
drafts_dir = "/Users/danielvazquez/Proyectos/StreetBoss/brand-assets/05-calendar/week-01/drafts"
os.makedirs(review_dir, exist_ok=True)

# Data for publications (updated to REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO)
pubs = [
    {
        "code": "SB-W01-P01",
        "title": "No eres un renglón",
        "platform": "Instagram Reel / TikTok",
        "res": "1080×1920",
        "v01": "SB_W01_P01_IG_1080x1920_V01.webp",
        "v02": "SB_W01_P01_IG_1080x1920_V02.webp",
        "logo_ver": "LOGO_HORIZONTAL_PRINCIPAL",
        "status": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO",
        "legibility": "Excelente. La tipografía blanca y naranja sobre fondo Charcoal y el degradado oscuro superior e inferior garantizan contraste óptimo.",
        "hierarchy": "Clara. El titular superior domina, la imagen gastronómica ancla el centro, y el cierre/logo firma al pie.",
        "safe_zone": "Acatada. Logo y textos están fuera del área de interfaz de Reels (los 250px inferiores y 220px superiores).",
        "rec": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO"
    },
    {
        "code": "SB-W01-P02",
        "title": "Un menú QR no es un escaparate",
        "platform": "Instagram Carrusel (Slide 1)",
        "res": "1080×1350",
        "v01": "SB_W01_P02_IG_1080x1350_V01.webp",
        "v02": "SB_W01_P02_IG_1080x1350_V02.webp",
        "logo_ver": "LOGO_HORIZONTAL_PRINCIPAL",
        "status": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO",
        "legibility": "Excelente contraste tipográfico. Estilo editorial limpio.",
        "hierarchy": "Muy alta. El contraste 'Menú QR ≠ Escaparate' dirige la vista inmediatamente.",
        "safe_zone": "Márgenes de 96px respetados. Espacio para logo horizontal amplio en la parte inferior.",
        "rec": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO"
    },
    {
        "code": "SB-W01-P03",
        "title": "Así se ve tu menú antes de que lleguen",
        "platform": "Instagram Post / TikTok",
        "res": "1080×1350",
        "v01": "SB_W01_P03_IG_1080x1350_V01.webp",
        "v02": "SB_W01_P03_IG_1080x1350_V02.webp",
        "logo_ver": "LOGO_HORIZONTAL_PRINCIPAL",
        "status": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO",
        "legibility": "La tipografía se integra en la banda oscura lateral izquierda, asegurando máxima legibilidad sobre la foto de fondo.",
        "hierarchy": "Comida como protagonista absoluta. Texto secundario en zona de espacio negativo.",
        "safe_zone": "Completamente libre de elementos en márgenes y áreas de interfaz del post.",
        "rec": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO"
    },
    {
        "code": "SB-W01-P04",
        "title": "El 30% que le regalas a la app",
        "platform": "Instagram Post",
        "res": "1080×1350",
        "v01": "SB_W01_P04_IG_1080x1350_V01.webp",
        "v02": "SB_W01_P04_IG_1080x1350_V02.webp",
        "logo_ver": "LOGO_HORIZONTAL_PRINCIPAL",
        "status": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO",
        "legibility": "El '30%' naranja domina el Charcoal. Muy legible.",
        "hierarchy": "El número naranja dirige la lectura hacia la comparativa por columnas.",
        "safe_zone": "Todo el contenido y el logo están contenidos dentro del área de seguridad.",
        "rec": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO"
    },
    {
        "code": "SB-W01-P05",
        "title": "El WhatsApp de las 2 pm",
        "platform": "TikTok Reel Cover / IG Cover",
        "res": "1080×1920",
        "v01": "SB_W01_P05_TT_1080x1920_V01.webp",
        "v02": "SB_W01_P05_TT_1080x1920_V02.webp",
        "logo_ver": "LOGO_HORIZONTAL_PRINCIPAL",
        "status": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO",
        "legibility": "Tipografía y bloques de chat simulados con alto contraste.",
        "hierarchy": "Simulación visual del caos arriba, y bloque de solución destacado en naranja abajo.",
        "safe_zone": "Zona segura de TikTok respetada (márgenes laterales y área de perfil a la derecha libres).",
        "rec": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO"
    },
    {
        "code": "SB-W01-P06",
        "title": "¿De quién es tu cliente? (B2B)",
        "platform": "LinkedIn Document (Slide 1)",
        "res": "1080×1350",
        "v01": "SB_W01_P06_LI_1080x1350_V01.webp",
        "v02": "SB_W01_P06_LI_1080x1350_V02.webp",
        "logo_ver": "LOGO_HORIZONTAL_PRINCIPAL",
        "status": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO",
        "legibility": "Enfoque sobrio y directo. Legibilidad corporativa impecable.",
        "hierarchy": "Pregunta de gancho en blanco y naranja, seguida por el argumento.",
        "safe_zone": "Márgenes amplios respetados para navegación de LinkedIn.",
        "rec": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO"
    },
    {
        "code": "SB-W01-P07",
        "title": "El que cocina, manda",
        "platform": "Instagram Post",
        "res": "1080×1350",
        "v01": "SB_W01_P07_IG_1080x1350_V01.webp",
        "v02": "SB_W01_P07_IG_1080x1350_V02.webp",
        "logo_ver": "LOGO_HORIZONTAL_PRINCIPAL",
        "status": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO",
        "legibility": "El manifiesto mantiene un ritmo visual perfecto con líneas blancas y acentos en naranja claro.",
        "hierarchy": "El titular principal tiene el mayor peso visual, atrayendo la atención al texto.",
        "safe_zone": "El logo horizontal firma al pie en la zona segura.",
        "rec": "REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO"
    }
]

# Generate Markdown
md_content = """# 📋 TABLERO DE REVISIÓN OFICIAL · StreetBoss · Semana 1

**Estado General:** `SEMANA 1 REQUIERE REDISEÑO DEMOSTRATIVO`  
*Este piloto de branding genérico (V02) ha sido rechazado debido a que no demuestra el producto real. Se mantiene como histórico.*

---

"""

for p in pubs:
    md_content += f"""## 📌 {p['code']} — "{p['title']}"
* **Plataforma:** {p['platform']} ({p['res']})
* **Estado:** `{p['status']}` | **Recomendación:** `{p['rec']}`
* **Versión de Logo Usada:** `{p['logo_ver']}`

### Comparativa Visual

| V01 (Sin Logo) | V02 (Con Logo Oficial) |
|:---:|:---:|
| ![V01](file://{os.path.join(drafts_dir, p['v01'])}) | ![V02](file://{os.path.join(drafts_dir, p['v02'])}) |

* **Legibilidad:** {p['legibility']}
* **Jerarquía:** {p['hierarchy']}
* **Zona Segura:** {p['safe_zone']}

---
"""

# Write MD
with open(os.path.join(review_dir, "REVIEW_DASHBOARD.md"), "w") as f:
    f.write(md_content)

# Generate HTML
html_content = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Tablero de Revisión - StreetBoss Semana 1</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #0D0E12;
            color: #FFFFFF;
            margin: 0;
            padding: 40px;
        }
        h1 {
            color: #FF4B00;
            border-bottom: 2px solid #FF6A1A;
            padding-bottom: 15px;
        }
        .summary-card {
            background-color: #16171D;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 5px solid #FF4B00;
        }
        .pub-block {
            background-color: #16171D;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 40px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }
        .pub-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #2A2B35;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .pub-title {
            font-size: 24px;
            font-weight: bold;
            color: #FF6A1A;
            margin: 0;
        }
        .pub-meta {
            font-size: 14px;
            color: #A0A0A0;
        }
        .badge {
            background-color: #FF4B00;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .comparative-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .img-container {
            text-align: center;
            background-color: #0A0A0D;
            padding: 10px;
            border-radius: 6px;
        }
        .img-container img {
            max-width: 100%;
            max-height: 450px;
            object-fit: contain;
            border-radius: 4px;
        }
        .img-label {
            margin-top: 10px;
            font-weight: bold;
            color: #FF6A1A;
            font-size: 14px;
        }
        .details-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .details-list li {
            margin-bottom: 8px;
            font-size: 15px;
        }
        .details-list strong {
            color: #FF4B00;
        }
    </style>
</head>
<body>
    <h1>📋 TABLERO DE REVISIÓN VISUAL · StreetBoss</h1>
    <div class="summary-card">
        <h3>RECHAZADO: SEMANA 1 REQUIERE REDISEÑO DEMOSTRATIVO</h3>
        <p><strong>Decisión Ejecutiva:</strong> El enfoque de branding genérico (V02) no es suficiente. Se requiere rediseñar la Semana 1 para demostrar interacciones reales de producto.</p>
    </div>
"""

for p in pubs:
    v01_path = f"file://{os.path.join(drafts_dir, p['v01'])}"
    v02_path = f"file://{os.path.join(drafts_dir, p['v02'])}"
    html_content += f"""
    <div class="pub-block">
        <div class="pub-header">
            <h2 class="pub-title">{p['code']} — "{p['title']}"</h2>
            <div class="pub-meta">
                <span class="badge" style="background-color: #B22222;">{p['status']}</span> | {p['platform']} | {p['res']}
            </div>
        </div>
        <div class="comparative-grid">
            <div class="img-container">
                <img src="{v01_path}" alt="{p['v01']}">
                <div class="img-label">V01 - Sin Logo</div>
            </div>
            <div class="img-container">
                <img src="{v02_path}" alt="{p['v02']}">
                <div class="img-label">V02 - Con Logo Oficial</div>
            </div>
        </div>
        <ul class="details-list">
            <li><strong>Versión de Logo Utilizada:</strong> <code>{p['logo_ver']}</code></li>
            <li><strong>Legibilidad:</strong> {p['legibility']}</li>
            <li><strong>Jerarquía:</strong> {p['hierarchy']}</li>
            <li><strong>Zona Segura:</strong> {p['safe_zone']}</li>
            <li><strong>Recomendación:</strong> <code>{p['rec']}</code></li>
        </ul>
    </div>
    """

html_content += """
</body>
</html>
"""

# Write HTML
with open(os.path.join(review_dir, "REVIEW_DASHBOARD.html"), "w") as f:
    f.write(html_content)

print("Dashboard MD and HTML generated successfully with new statuses!")
