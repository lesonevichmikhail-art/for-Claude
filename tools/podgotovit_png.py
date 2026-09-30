"""Готовит PNG для игры: обрезка по рисунку, квадрат, 320×320, 128 цветов (~10–16 КБ).
Запуск: python3 tools/podgotovit_png.py вход.png assets/images/имя.png"""
import sys, os
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGBA')
bb = im.getchannel('A').point(lambda v: 255 if v > 10 else 0).getbbox()
im = im.crop(bb); w, h = im.size; side = max(w, h) + 16
c = Image.new('RGBA', (side, side), (0, 0, 0, 0)); c.paste(im, ((side - w) // 2, (side - h) // 2))
c.resize((320, 320), Image.LANCZOS).quantize(128, method=Image.FASTOCTREE).save(sys.argv[2], optimize=True)
print(sys.argv[2], os.path.getsize(sys.argv[2]), 'байт')
