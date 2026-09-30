"""Вшить PNG в игру. python3 vshit_png.py game.html key=file.png[:mirror][:nochecker] ...
Пайплайн: убрать «нарисованную клетку» (если есть), обрезать поля, вписать в 420 px, 64 цвета, base64.
Ключ есть в ASSETS — заменяется, нет — добавляется в начало ASSETS."""
import sys,io,re,base64
from collections import deque
from PIL import Image, ImageOps
def dechecker(im):
    # серо-белая «клетка», вшитая в картинку: заливка от краёв по светлым нейтральным пикселям
    w,h=im.size; p=im.load(); ok=lambda c: c[3]>0 and min(c[:3])>185 and max(c[:3])-min(c[:3])<14
    q=deque([(x,y) for x in range(w) for y in (0,h-1)]+[(x,y) for y in range(h) for x in (0,w-1)]); seen=set()
    while q:
        x,y=q.popleft()
        if (x,y) in seen or not(0<=x<w and 0<=y<h) or not ok(p[x,y]): continue
        seen.add((x,y)); p[x,y]=(0,0,0,0); q.extend(((x+1,y),(x-1,y),(x,y+1),(x,y-1)))
    return im
def enc(path,opts):
    im=Image.open(path).convert('RGBA')
    if 'mirror' in opts: im=ImageOps.mirror(im)          # герой/транспорт должны смотреть по ходу движения (вправо)
    if 'nochecker' not in opts: im=dechecker(im)
    bb=im.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox()
    if bb: im=im.crop(bb)
    im.thumbnail((420,420)); im=im.quantize(64,method=Image.FASTOCTREE)
    b=io.BytesIO(); im.save(b,'PNG',optimize=True); return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
html=sys.argv[1]; s=open(html,encoding='utf-8').read()
for arg in sys.argv[2:]:
    k,rest=arg.split('=',1); parts=rest.split(':'); d=enc(parts[0],parts[1:])
    pat=re.compile(r'^(\s*)'+k+r': *"data:image[^"]*",?',re.M)
    if pat.search(s): s=pat.sub(lambda x:x.group(1)+k+': "'+d+'",',s,1)
    else: s=s.replace('const ASSETS = {\n','const ASSETS = {\n  '+k+': "'+d+'",\n',1)
    print('ok',k)
open(html,'w',encoding='utf-8').write(s)
