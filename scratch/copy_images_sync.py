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

for src, name in source_images:
    dest_path = os.path.join(dest_dir, name)
    try:
        shutil.copy(src, dest_path)
        print(f"SUCCESS: Copied {src} -> {dest_path}")
    except Exception as e:
        print(f"FAILED to copy {src} -> {dest_path}: {e}")
