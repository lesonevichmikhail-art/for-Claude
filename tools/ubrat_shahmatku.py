"""Убирает нарисованную «шахматку» (фальшивую прозрачность) с картинки генератора.
Заливка от краёв по светлым серым пикселям; тёмный контур её останавливает,
поэтому светлые места внутри рисунка (белки глаз, парус) не трогаются.
Запуск: python3 tools/ubrat_shahmatku.py вход.jpg выход.png"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage
im = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(int)
mx, mn = im.max(2), im.min(2)
bg_like = (mn > 175) & (mx - mn < 22)            # светлый и почти без цвета
lab, _ = ndimage.label(bg_like)
edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bg = np.isin(lab, list(edge))
# замкнутые карманы шахматки (между мачтой и парусом и т.п.): есть и белые, и серые клетки
for k in range(1, lab.max() + 1):
    if k in edge: continue
    m = lab == k
    n = m.sum()
    if n < 150: continue
    v = mn[m]
    if (v > 238).mean() > 0.2 and ((v > 190) & (v < 232)).mean() > 0.2:
        bg |= m
bg = ndimage.binary_opening(bg, iterations=1)
# мелкие непрозрачные крошки на фоне (остатки клеток) — убрать
opq, _ = ndimage.label(~bg)
sizes = ndimage.sum(np.ones_like(opq), opq, range(1, opq.max() + 1))
for k, sz in enumerate(sizes, 1):
    if sz < 40: bg[opq == k] = True
alpha = np.where(bg, 0, 255).astype(np.uint8)
alpha = np.asarray(Image.fromarray(alpha).filter(__import__('PIL.ImageFilter', fromlist=['x']).GaussianBlur(0.7)))
out = np.dstack([im.astype(np.uint8), alpha])
Image.fromarray(out, 'RGBA').save(sys.argv[2])
print(sys.argv[2], 'фон убран: %.0f%%' % (bg.mean() * 100))
