import os
from PIL import Image, ImageDraw, ImageFont

# Define paths
drafts_dir = "/Users/danielvazquez/Proyectos/StreetBoss/brand-assets/05-calendar/week-01/drafts"
source_dir = "/Users/danielvazquez/Proyectos/StreetBoss/brand-assets/05-calendar/week-01/source-images"
oficial_raster_dir = "/Users/danielvazquez/Proyectos/StreetBoss/brand-core/oficial-raster"

os.makedirs(drafts_dir, exist_ok=True)

# Colors
CHARCOAL = (13, 14, 18)        # #0D0E12
ORANGE = (255, 75, 0)         # #FF4B00
ORANGE_LIGHT = (255, 106, 26)  # #FF6A1A
WHITE = (255, 255, 255)
GRAY = (120, 120, 120)

# Recommended source images
tacos_src = os.path.join(source_dir, "SB_W01_P01_SOURCE_V03.webp")
burger_src = os.path.join(source_dir, "SB_W01_P03_SOURCE_V01.webp")

# Logo Paths
logo_horiz_path = os.path.join(oficial_raster_dir, "StreetBoss_Logo_Horizontal_Oficial.png")
logo_circle_path = os.path.join(oficial_raster_dir, "StreetBoss_Avatar_Circular_Oficial.png")
logo_app_path = os.path.join(oficial_raster_dir, "StreetBoss_AppIcon_Oficial.png")

# Font search helper
def get_font(size, bold=False):
    font_paths = [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFNS.ttf",
        "arial.ttf"
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except:
                pass
    return ImageFont.load_default()

# Transparency Keying Helper (converts black to transparent)
def load_logo_transparent(img_path, threshold=20):
    if not os.path.exists(img_path):
        print(f"ERROR: Logo not found at {img_path}")
        return None
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    newData = []
    for item in datas:
        # Check if the pixel is close to black
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            newData.append((0, 0, 0, 0)) # transparent
        else:
            newData.append(item)
    img.putdata(newData)
    return img

print("Loading logos...")
logo_horiz = load_logo_transparent(logo_horiz_path, threshold=30)
logo_circle = load_logo_transparent(logo_circle_path, threshold=30)
logo_app = load_logo_transparent(logo_app_path, threshold=30)

# Helper to paste logo resized
def paste_logo(background, logo_img, position, target_width):
    if logo_img is None:
        return
    aspect_ratio = logo_img.height / logo_img.width
    target_height = int(target_width * aspect_ratio)
    logo_resized = logo_img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    background.paste(logo_resized, position, logo_resized)

# Fonts
title_font = get_font(56, bold=True)
sub_font = get_font(42, bold=False)
cta_font = get_font(38, bold=True)

# ----------------------------------------------------
# P01 - Reel 1080x1920
# ----------------------------------------------------
print("Composing P01 V02...")
p01_img = Image.new("RGB", (1080, 1920), CHARCOAL)
draw = ImageDraw.Draw(p01_img)

if os.path.exists(tacos_src):
    tacos_img = Image.open(tacos_src)
    tacos_resized = tacos_img.resize((1080, 1920))
    p01_img.paste(tacos_resized, (0, 0))

# Top overlay
top_overlay = Image.new("RGBA", (1080, 450), (13, 14, 18, 220))
p01_img.paste(top_overlay, (0, 0), top_overlay)

# Top Text
draw.text((80, 100), "En la app de delivery,", fill=WHITE, font=title_font)
draw.text((80, 180), "tu restaurante es un renglón.", fill=ORANGE, font=title_font)
draw.text((80, 260), "Uno más.", fill=WHITE, font=title_font)

# Bottom overlay
bottom_overlay = Image.new("RGBA", (1080, 360), (13, 14, 18, 220))
p01_img.paste(bottom_overlay, (0, 1560), bottom_overlay)

# Bottom Text & Logo Horizontal
draw.text((80, 1600), "Vende directo. Manda tú.", fill=ORANGE_LIGHT, font=title_font)
draw.text((80, 1680), "Escríbenos por WhatsApp", fill=WHITE, font=cta_font)

# Paste horizontal logo in the bottom center
paste_logo(p01_img, logo_horiz, (340, 1780), 400)

p01_img.save(os.path.join(drafts_dir, "SB_W01_P01_IG_1080x1920_V02.webp"), "WEBP", quality=90)


# ----------------------------------------------------
# P02 - Carrusel Cover 1080x1350
# ----------------------------------------------------
print("Composing P02 V02...")
p02_img = Image.new("RGB", (1080, 1350), CHARCOAL)
draw = ImageDraw.Draw(p02_img)

title_huge = get_font(80, bold=True)
draw.text((100, 250), "Menú QR", fill=ORANGE, font=title_huge)
draw.text((100, 370), "≠", fill=ORANGE_LIGHT, font=title_huge)
draw.text((100, 490), "Escaparate digital", fill=WHITE, font=title_huge)

draw.text((100, 750), "Tu menú actual solo muestra.", fill=WHITE, font=sub_font)
draw.text((100, 810), "Un escaparate vende.", fill=ORANGE_LIGHT, font=sub_font)

draw.text((100, 1020), "Vende directo. Manda tú.", fill=WHITE, font=cta_font)

# Logo Horizontal at bottom
paste_logo(p02_img, logo_horiz, (100, 1140), 380)

p02_img.save(os.path.join(drafts_dir, "SB_W01_P02_IG_1080x1350_V02.webp"), "WEBP", quality=90)


# ----------------------------------------------------
# P03 - Post 1080x1350 (Burger)
# ----------------------------------------------------
print("Composing P03 V02...")
p03_img = Image.new("RGB", (1080, 1350), CHARCOAL)
if os.path.exists(burger_src):
    burger_img = Image.open(burger_src)
    burger_resized = burger_img.resize((1080, 1440))
    p03_img.paste(burger_resized, (0, -45))

draw = ImageDraw.Draw(p03_img)
left_overlay = Image.new("RGBA", (500, 1350), (13, 14, 18, 180))
p03_img.paste(left_overlay, (0, 0), left_overlay)

p03_font = get_font(52, bold=True)
draw.text((60, 180), "Así se ve\ntu menú\nantes de que\nlleguen.", fill=WHITE, font=p03_font)
draw.text((60, 460), "Vitrina visual\npremium.", fill=ORANGE_LIGHT, font=sub_font)

draw.text((60, 1040), "Escríbenos por WhatsApp", fill=WHITE, font=cta_font)

# Paste logo in left overlay area
paste_logo(p03_img, logo_horiz, (60, 1150), 360)

p03_img.save(os.path.join(drafts_dir, "SB_W01_P03_IG_1080x1350_V02.webp"), "WEBP", quality=90)


# ----------------------------------------------------
# P04 - Post 1080x1350 (30% App)
# ----------------------------------------------------
print("Composing P04 V02...")
p04_img = Image.new("RGB", (1080, 1350), CHARCOAL)
draw = ImageDraw.Draw(p04_img)

num_font = get_font(180, bold=True)
draw.text((100, 180), "30%", fill=ORANGE, font=num_font)
draw.text((100, 390), "que le regalas a la app de delivery", fill=WHITE, font=title_font)

draw.text((100, 520), "A tu cliente nuevo, la app.", fill=WHITE, font=sub_font)
draw.text((100, 580), "A tu cliente de siempre... ¿por qué regalar el 30%?", fill=ORANGE_LIGHT, font=sub_font)

# Columns
draw.rectangle([100, 720, 480, 970], fill=(25, 26, 30))
draw.text((120, 740), "App de Terceros", fill=GRAY, font=get_font(28, bold=True))
draw.text((120, 800), "- Margen: -30%\n- Cliente: De ellos\n- Datos: Ninguno", fill=WHITE, font=get_font(26))

draw.rectangle([540, 720, 920, 970], fill=(40, 20, 20), outline=ORANGE, width=2)
draw.text((560, 740), "StreetBoss", fill=ORANGE, font=get_font(28, bold=True))
draw.text((560, 800), "- Margen: 100% tuyo\n- Cliente: Tuyo\n- Datos: Base propia", fill=WHITE, font=get_font(26))

draw.text((100, 1080), "Vende directo. Manda tú.", fill=WHITE, font=cta_font)

# Horizontal Logo at bottom right
paste_logo(p04_img, logo_horiz, (540, 1180), 380)

p04_img.save(os.path.join(drafts_dir, "SB_W01_P04_IG_1080x1350_V02.webp"), "WEBP", quality=90)


# ----------------------------------------------------
# P05 - Reel 1080x1920 (WhatsApp Caos)
# ----------------------------------------------------
print("Composing P05 V02...")
p05_img = Image.new("RGB", (1080, 1920), CHARCOAL)
draw = ImageDraw.Draw(p05_img)

draw.text((80, 200), "POV: son las 2 pm", fill=WHITE, font=title_font)
draw.text((80, 280), "y tu WhatsApp", fill=ORANGE, font=title_font)
draw.text((80, 360), "es un caos.", fill=WHITE, font=title_font)

# Caos text box representations
draw.rectangle([100, 550, 600, 670], fill=(25, 26, 30))
draw.text((120, 570), "Cliente: '¿Ya sumaste?'\nCliente: 'Era sin cebolla!'", fill=GRAY, font=get_font(26))

draw.rectangle([200, 720, 700, 840], fill=(25, 26, 30))
draw.text((220, 740), "[Audio de 2:15 min con ruido]", fill=GRAY, font=get_font(26))

draw.rectangle([100, 900, 650, 1020], fill=(25, 26, 30))
draw.text((120, 920), "Cocina: '¿Qué decía el audio?'", fill=GRAY, font=get_font(26))

# Solution box
draw.rectangle([100, 1150, 980, 1350], fill=(40, 20, 20), outline=ORANGE, width=3)
draw.text((150, 1190), "Con un Escaparate Digital:", fill=ORANGE, font=get_font(36, bold=True))
draw.text((150, 1260), "El pedido llega armado, sumado y ordenado.", fill=WHITE, font=get_font(32))

draw.text((80, 1540), "Ordena tus pedidos.", fill=ORANGE_LIGHT, font=title_font)
draw.text((80, 1620), "Escríbenos por WhatsApp", fill=WHITE, font=cta_font)

# Logo Horizontal at bottom
paste_logo(p05_img, logo_horiz, (340, 1750), 400)

p05_img.save(os.path.join(drafts_dir, "SB_W01_P05_TT_1080x1920_V02.webp"), "WEBP", quality=90)


# ----------------------------------------------------
# P06 - LinkedIn B2B 1080x1350
# ----------------------------------------------------
print("Composing P06 V02...")
p06_img = Image.new("RGB", (1080, 1350), CHARCOAL)
draw = ImageDraw.Draw(p06_img)

draw.text((100, 200), "Vendes miles de pedidos", fill=WHITE, font=title_font)
draw.text((100, 280), "al mes por plataformas.", fill=WHITE, font=title_font)

draw.text((100, 420), "Pregunta incómoda:", fill=ORANGE, font=title_font)
draw.text((100, 500), "¿Tienes los datos de un solo cliente?", fill=WHITE, font=title_font)

draw.text((100, 680), "En el marketplace, el cliente es de la app.", fill=GRAY, font=sub_font)
draw.text((100, 750), "Sin datos, no hay recompra dirigida ni control.", fill=GRAY, font=sub_font)
draw.text((100, 820), "La venta directa te devuelve tu negocio.", fill=ORANGE_LIGHT, font=sub_font)

draw.text((100, 990), "Recupera el control de tus clientes.", fill=WHITE, font=cta_font)

# App icon or logo horizontal at bottom
paste_logo(p06_img, logo_horiz, (100, 1100), 380)

p06_img.save(os.path.join(drafts_dir, "SB_W01_P06_LI_1080x1350_V02.webp"), "WEBP", quality=90)


# ----------------------------------------------------
# P07 - Post 1080x1350 (Manifiesto)
# ----------------------------------------------------
print("Composing P07 V02...")
p07_img = Image.new("RGB", (1080, 1350), CHARCOAL)
draw = ImageDraw.Draw(p07_img)

huge_title = get_font(72, bold=True)
draw.text((100, 150), "El que cocina,", fill=ORANGE, font=huge_title)
draw.text((100, 250), "manda.", fill=WHITE, font=huge_title)

manifiesto_lines = [
    "Tú te levantas temprano.",
    "Tú cuidas el sazón.",
    "Tú le pones la cara al negocio.",
    "",
    "Entonces, ¿por qué otro se queda",
    "con tu cliente y con tu margen?",
    "",
    "Tu comida, tu marca, tu venta.",
    "En tus propios términos."
]

y_pos = 400
line_font = get_font(34, bold=False)
for line in manifiesto_lines:
    color = ORANGE_LIGHT if "Tu comida" in line or "tus propios" in line else WHITE
    draw.text((100, y_pos), line, fill=color, font=line_font)
    y_pos += 48

# Logo horizontal at bottom
paste_logo(p07_img, logo_horiz, (100, 1100), 400)

p07_img.save(os.path.join(drafts_dir, "SB_W01_P07_IG_1080x1350_V02.webp"), "WEBP", quality=90)

print("V02 drafts with official logo created successfully!")
