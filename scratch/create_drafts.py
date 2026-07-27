import os
from PIL import Image, ImageDraw, ImageFont

# Define paths
drafts_dir = "/Users/danielvazquez/Proyectos/StreetBoss/brand-assets/05-calendar/week-01/drafts"
source_dir = "/Users/danielvazquez/Proyectos/StreetBoss/brand-assets/05-calendar/week-01/source-images"
os.makedirs(drafts_dir, exist_ok=True)

# Paleta operativa
CHARCOAL = (13, 14, 18)        # #0D0E12
ORANGE = (255, 75, 0)         # #FF4B00
ORANGE_LIGHT = (255, 106, 26)  # #FF6A1A
WHITE = (255, 255, 255)
GRAY = (120, 120, 120)

# Recommended source images
tacos_src = os.path.join(source_dir, "SB_W01_P01_SOURCE_V03.webp")
burger_src = os.path.join(source_dir, "SB_W01_P03_SOURCE_V01.webp")

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

# ----------------------------------------------------
# P01 - Reel 1080x1920
# ----------------------------------------------------
print("Generating P01...")
p01_img = Image.new("RGB", (1080, 1920), CHARCOAL)
draw = ImageDraw.Draw(p01_img)

# Paste tacos base (9:16 image)
if os.path.exists(tacos_src):
    tacos_img = Image.open(tacos_src)
    # We want tacos to occupy the bottom 70% of the screen
    tacos_resized = tacos_img.resize((1080, 1920))
    p01_img.paste(tacos_resized, (0, 0))

# Redraw a dark gradient or block at the top for legibility
top_overlay = Image.new("RGBA", (1080, 450), (13, 14, 18, 220))
p01_img.paste(top_overlay, (0, 0), top_overlay)

# Add text
title_font = get_font(56, bold=True)
sub_font = get_font(42, bold=False)
cta_font = get_font(38, bold=True)

# Top Text
draw.text((80, 100), "En la app de delivery,", fill=WHITE, font=title_font)
draw.text((80, 180), "tu restaurante es un renglón.", fill=ORANGE, font=title_font)
draw.text((80, 260), "Uno más.", fill=WHITE, font=title_font)

# Bottom overlay block for text
bottom_overlay = Image.new("RGBA", (1080, 300), (13, 14, 18, 220))
p01_img.paste(bottom_overlay, (0, 1620), bottom_overlay)

# Bottom Text
draw.text((80, 1660), "Vende directo. Manda tú.", fill=ORANGE_LIGHT, font=title_font)
draw.text((80, 1750), "Escríbenos por WhatsApp", fill=WHITE, font=cta_font)

p01_img.save(os.path.join(drafts_dir, "SB_W01_P01_IG_1080x1920_V01.webp"), "WEBP", quality=90)


# ----------------------------------------------------
# P02 - Carrusel Cover 1080x1350
# ----------------------------------------------------
print("Generating P02...")
p02_img = Image.new("RGB", (1080, 1350), CHARCOAL)
draw = ImageDraw.Draw(p02_img)

title_huge = get_font(80, bold=True)
draw.text((100, 300), "Menú QR", fill=ORANGE, font=title_huge)
draw.text((100, 420), "≠", fill=ORANGE_LIGHT, font=title_huge)
draw.text((100, 540), "Escaparate digital", fill=WHITE, font=title_huge)

draw.text((100, 800), "Tu menú actual solo muestra.", fill=WHITE, font=sub_font)
draw.text((100, 860), "Un escaparate vende.", fill=ORANGE_LIGHT, font=sub_font)

draw.text((100, 1100), "Vende directo. Manda tú.", fill=WHITE, font=cta_font)

p02_img.save(os.path.join(drafts_dir, "SB_W01_P02_IG_1080x1350_V01.webp"), "WEBP", quality=90)


# ----------------------------------------------------
# P03 - Post 1080x1350 (Burger)
# ----------------------------------------------------
print("Generating P03...")
p03_img = Image.new("RGB", (1080, 1350), CHARCOAL)
if os.path.exists(burger_src):
    burger_img = Image.open(burger_src)
    # Resize and crop to 1080x1350
    burger_resized = burger_img.resize((1080, 1440))
    p03_img.paste(burger_resized, (0, -45))

draw = ImageDraw.Draw(p03_img)
# Left side dark overlay for text
left_overlay = Image.new("RGBA", (500, 1350), (13, 14, 18, 180))
p03_img.paste(left_overlay, (0, 0), left_overlay)

# Text on the left negative space
p03_font = get_font(52, bold=True)
draw.text((60, 200), "Así se ve\ntu menú\nantes de que\nlleguen.", fill=WHITE, font=p03_font)
draw.text((60, 500), "Vitrina visual\npremium.", fill=ORANGE_LIGHT, font=sub_font)

draw.text((60, 1150), "Escríbenos por WhatsApp", fill=WHITE, font=cta_font)

p03_img.save(os.path.join(drafts_dir, "SB_W01_P03_IG_1080x1350_V01.webp"), "WEBP", quality=90)


# ----------------------------------------------------
# P04 - Post 1080x1350 (30% App)
# ----------------------------------------------------
print("Generating P04...")
p04_img = Image.new("RGB", (1080, 1350), CHARCOAL)
draw = ImageDraw.Draw(p04_img)

num_font = get_font(180, bold=True)
draw.text((100, 150), "30%", fill=ORANGE, font=num_font)
draw.text((100, 360), "que le regalas a la app de delivery", fill=WHITE, font=title_font)

draw.text((100, 500), "A tu cliente nuevo, la app.", fill=WHITE, font=sub_font)
draw.text((100, 560), "A tu cliente de siempre... ¿por qué regalar el 30%?", fill=ORANGE_LIGHT, font=sub_font)

# Columns representation
draw.rectangle([100, 700, 480, 950], fill=(25, 26, 30))
draw.text((120, 720), "App de Terceros", fill=GRAY, font=get_font(28, bold=True))
draw.text((120, 780), "- Margen: -30%\n- Cliente: De ellos\n- Datos: Ninguno", fill=WHITE, font=get_font(26))

draw.rectangle([540, 700, 920, 950], fill=(40, 20, 20), outline=ORANGE, width=2)
draw.text((560, 720), "StreetBoss", fill=ORANGE, font=get_font(28, bold=True))
draw.text((560, 780), "- Margen: 100% tuyo\n- Cliente: Tuyo\n- Datos: Base propia", fill=WHITE, font=get_font(26))

draw.text((100, 1100), "Vende directo. Manda tú.", fill=WHITE, font=cta_font)

p04_img.save(os.path.join(drafts_dir, "SB_W01_P04_IG_1080x1350_V01.webp"), "WEBP", quality=90)


# ----------------------------------------------------
# P05 - Reel 1080x1920 (WhatsApp 2pm Caos)
# ----------------------------------------------------
print("Generating P05...")
p05_img = Image.new("RGB", (1080, 1920), CHARCOAL)
draw = ImageDraw.Draw(p05_img)

draw.text((80, 200), "POV: son las 2 pm", fill=WHITE, font=title_font)
draw.text((80, 280), "y tu WhatsApp", fill=ORANGE, font=title_font)
draw.text((80, 360), "es un caos.", fill=WHITE, font=title_font)

# Caos text box representations (conceptual tickets)
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

draw.text((80, 1600), "Ordena tus pedidos.", fill=ORANGE_LIGHT, font=title_font)
draw.text((80, 1700), "Escríbenos por WhatsApp", fill=WHITE, font=cta_font)

p05_img.save(os.path.join(drafts_dir, "SB_W01_P05_TT_1080x1920_V01.webp"), "WEBP", quality=90)


# ----------------------------------------------------
# P06 - LinkedIn Cover 1080x1350 (B2B)
# ----------------------------------------------------
print("Generating P06...")
p06_img = Image.new("RGB", (1080, 1350), CHARCOAL)
draw = ImageDraw.Draw(p06_img)

draw.text((100, 250), "Vendes miles de pedidos", fill=WHITE, font=title_font)
draw.text((100, 330), "al mes por plataformas.", fill=WHITE, font=title_font)

draw.text((100, 480), "Pregunta incómoda:", fill=ORANGE, font=title_font)
draw.text((100, 560), "¿Tienes los datos de un solo cliente?", fill=WHITE, font=title_font)

draw.text((100, 750), "En el marketplace, el cliente es de la app.", fill=GRAY, font=sub_font)
draw.text((100, 820), "Sin datos, no hay recompra dirigida ni control.", fill=GRAY, font=sub_font)
draw.text((100, 890), "La venta directa te devuelve tu negocio.", fill=ORANGE_LIGHT, font=sub_font)

draw.text((100, 1100), "Recupera el control de tus clientes.", fill=WHITE, font=cta_font)
draw.text((100, 1170), "Vende directo. Manda tú.", fill=ORANGE, font=cta_font)

p06_img.save(os.path.join(drafts_dir, "SB_W01_P06_LI_1080x1350_V01.webp"), "WEBP", quality=90)


# ----------------------------------------------------
# P07 - Post 1080x1350 (Manifiesto)
# ----------------------------------------------------
print("Generating P07...")
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

y_pos = 420
line_font = get_font(34, bold=False)
for line in manifiesto_lines:
    color = ORANGE_LIGHT if "Tu comida" in line or "tus propios" in line else WHITE
    draw.text((100, y_pos), line, fill=color, font=line_font)
    y_pos += 50

draw.text((100, 1000), "StreetBoss", fill=WHITE, font=title_font)
draw.text((100, 1120), "Escríbenos por WhatsApp", fill=WHITE, font=cta_font)

p07_img.save(os.path.join(drafts_dir, "SB_W01_P07_IG_1080x1350_V01.webp"), "WEBP", quality=90)

print("All composition drafts generated successfully!")
