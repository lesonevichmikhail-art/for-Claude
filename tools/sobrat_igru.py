"""Сборщик игры: берёт PNG из assets/images/ и голос из assets/audio/<папка>/,
вшивает base64 в объекты IMG и VOICE и кладёт готовый файл рядом с именем *_sobrano.html.

Запуск: python3 tools/sobrat_igru.py games/drafts/ptichka-pi-i-mishka-bu.html ptichka
Голос m4a/wav перекодируется в mp3 через ffmpeg (если он есть)."""
import base64, io, re, subprocess, sys, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = Path(sys.argv[1]); voice_dir = ROOT / 'assets' / 'audio' / (sys.argv[2] if len(sys.argv) > 2 else src.stem)
html = src.read_text(encoding='utf-8')

def keys(obj):
    m = re.search(r'const ' + obj + r' = \{(.*?)\n\};', html, re.S)
    return m, re.findall(r'(\w+): \'', m.group(1))

def png_b64(path):
    try:
        from PIL import Image
        im = Image.open(path).convert('RGBA'); im.thumbnail((512, 512))
        b = io.BytesIO(); im.save(b, 'PNG', optimize=True); data = b.getvalue()
    except ImportError:
        data = path.read_bytes()
    return 'data:image/png;base64,' + base64.b64encode(data).decode()

def mp3_b64(path):
    if path.suffix != '.mp3' and shutil.which('ffmpeg'):
        data = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', str(path), '-ac', '1', '-b:a', '64k', '-f', 'mp3', '-'],
                              capture_output=True, check=True).stdout
    else:
        data = path.read_bytes()
    return 'data:audio/mpeg;base64,' + base64.b64encode(data).decode()

report = []
for obj, folder, exts, enc in [('IMG', ROOT / 'assets' / 'images', ['.png'], png_b64),
                               ('VOICE', voice_dir, ['.mp3', '.m4a', '.wav', '.ogg'], mp3_b64)]:
    m, names = keys(obj)
    if not m: continue
    body = m.group(1)
    for n in names:
        f = next((folder / (n + e) for e in exts if (folder / (n + e)).exists()), None)
        if f:
            body = re.sub(n + r": '[^']*'", lambda _: n + ": '" + enc(f) + "'", body, count=1); report.append('есть   ' + obj + ' ' + n)
        else:
            report.append('НЕТ    ' + obj + ' ' + n)
    html = html[:m.start(1)] + body + html[m.end(1):]

out = src.with_name(src.stem + '_sobrano.html'); out.write_text(html, encoding='utf-8')
print('\n'.join(report)); print('Готово:', out, round(out.stat().st_size / 1024), 'КБ')
