"""Вшивает PNG из assets/images и mp3 из assets/audio (VOICE_B64) в игру: заполняет строку `const ASSETS = {...};`.
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
voice = {}
for f in sorted(os.listdir('assets/audio')):
    if f.endswith('.mp3') and "'" + f + "'" in s:
        voice[f] = 'data:audio/mpeg;base64,' + base64.b64encode(open('assets/audio/' + f, 'rb').read()).decode()
s = re.sub(r'const VOICE_B64 = \{.*?\};', lambda m: 'const VOICE_B64 = ' + json.dumps(voice) + ';', s, count=1, flags=re.S)
print('голос:', len(voice), 'mp3')
open(game, 'w', encoding='utf-8').write(s)
print('вшито:', ', '.join(assets) or 'ничего')
