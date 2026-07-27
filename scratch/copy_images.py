import shutil
import os

source_images = [
    ("/Users/danielvazquez/.gemini/antigravity/brain/9cf855eb-98d5-4671-81aa-bdf7a1324ea1/tacos_pastor_base_1784739070570.jpg", "SB_W01_P01_SOURCE_V01.webp"),
    ("/Users/danielvazquez/.gemini/antigravity/brain/9cf855eb-98d5-4671-81aa-bdf7a1324ea1/tacos_pastor_v2_1784739787103.jpg", "SB_W01_P01_SOURCE_V02.webp"),
    ("/Users/danielvazquez/.gemini/antigravity/brain/9cf855eb-98d5-4671-81aa-bdf7a1324ea1/tacos_pastor_v3_1784739808494.jpg", "SB_W01_P01_SOURCE_V03.webp"),
    ("/Users/danielvazquez/.gemini/antigravity/brain/9cf855eb-98d5-4671-81aa-bdf7a1324ea1/burger_hero_base_1784739087547.jpg", "SB_W01_P03_SOURCE_V01.webp"),
    ("/Users/danielvazquez/.gemini/antigravity/brain/9cf855eb-98d5-4671-81aa-bdf7a1324ea1/burger_hero_v2_1784739831797.jpg", "SB_W01_P03_SOURCE_V02.webp"),
    ("/Users/danielvazquez/.gemini/antigravity/brain/9cf855eb-98d5-4671-81aa-bdf7a1324ea1/burger_hero_v3_1784739862779.jpg", "SB_W01_P03_SOURCE_V03.webp")
]

dest_dir = "/Users/danielvazquez/Proyectos/StreetBoss/brand-assets/05-calendar/week-01/source-images"

os.makedirs(dest_dir, exist_ok=True)

try:
    from PIL import Image
    has_pil = True
except ImportError:
    has_pil = False

for src, name in source_images:
    dest_path = os.path.join(dest_dir, name)
    print(f"Processing {src} -> {dest_path}")
    if has_pil:
        try:
            im = Image.open(src)
            im.save(dest_path, "WEBP", quality=90)
            print(f"Saved as WEBP using Pillow: {dest_path}")
            continue
        except Exception as e:
            print(f"Pillow save failed: {e}. Falling back to copy...")
    
    # Fallback to copy (will copy the jpg data into a .webp extension, which is usually readable but not ideal, or we rename to .jpg)
    shutil.copy(src, dest_path)
    print(f"Copied raw file: {dest_path}")
