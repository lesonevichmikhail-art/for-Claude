"""Убирает «шахматку», нарисованную прямо в картинке (JPG/PNG без настоящей прозрачности).
1) заливка от краёв по светлым серым пикселям; 2) замкнутые пятна, где перемешаны светлые и серые клетки.
Запуск: python3 tools/ubrat_shakhmatku.py вход.jpg assets/images/имя.png   (нужны pillow, numpy, scipy)"""
import sys
from collections import deque
import numpy as np
from PIL import Image
from scipy import ndimage

def clean(src):
    im = np.array(Image.open(src).convert('RGB')).astype(int); h, w, _ = im.shape
    mx, mn = im.max(2), im.min(2)
    bgish = (mx - mn < 24) & (mx > 165)
    seen = np.zeros((h, w), bool)
    q = deque([(0, x) for x in range(w)] + [(h - 1, x) for x in range(w)] + [(y, 0) for y in range(h)] + [(y, w - 1) for y in range(h)])
    while q:
        y, x = q.popleft()
        if seen[y, x] or not bgish[y, x]: continue
        seen[y, x] = True
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not seen[ny, nx]: q.append((ny, nx))
    alpha = np.where(seen, 0, 255)
    lab, n = ndimage.label(bgish & (alpha > 0))
    for i in range(1, n + 1):
        m = lab == i
        if m.sum() < 30: continue
        v = mx[m]
        if (v > 232).mean() > 0.2 and (v < 222).mean() > 0.2: alpha[m] = 0
    return Image.fromarray(np.dstack([im, alpha]).astype(np.uint8), 'RGBA')

if __name__ == '__main__':
    clean(sys.argv[1]).save(sys.argv[2]); print('готово:', sys.argv[2])
