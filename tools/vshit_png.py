"""Вшивает PNG из assets/images в игру: заполняет строку `const ASSETS = {...};`.
Запуск: python3 tools/vshit_png.py games/drafts/najdi-paru_v2.0.html
Берутся только файлы, имена которых упомянуты в игре."""
import base64, json, os, re, sys
game = sys.argv[1]
s = open(game, encoding='utf-8').read()
assets = {}
for f in sorted(os.listdir('assets/images')):
    if f.endswith('.png') and "'" + f + "'" in s:
        assets[f] = 'data:image/png;base64,' + base64.b64encode(open('assets/images/' + f, 'rb').read()).decode()
s = re.sub(r'const ASSETS = \{.*?\};', lambda m: 'const ASSETS = ' + json.dumps(assets) + ';', s, count=1, flags=re.S)
open(game, 'w', encoding='utf-8').write(s)
print('вшито:', ', '.join(assets) or 'ничего')
