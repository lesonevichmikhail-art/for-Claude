"""Сборка «Больше, меньше, равно» v04: шаблон без base64 + всё, что есть в assets/library, вшивается.
python3 tools/sobrat_03.py  → games/drafts/bolshe-menshe-ravno-04.html и список недостающего в консоль."""
import re,base64,glob,os,json
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tpl=open(os.path.join(ROOT,'games/drafts/src/bolshe-menshe-ravno-04.tpl.html'),encoding='utf-8').read()
script=tpl[tpl.index('<script>'):]
png={os.path.basename(p)[:-4]:p for p in glob.glob(os.path.join(ROOT,'assets/library/png/*.png'))}
mp3={os.path.basename(p)[:-4]:p for p in glob.glob(os.path.join(ROOT,'assets/library/golos/*/*.mp3'))}
used=sorted(set(re.findall(r"'((?:geroy|predmet|fon|ikonka)_[a-z0-9_]+)'",script)))
vblock=script[script.index('const VOICE = {'):script.index('for(let n=1;n<=20')]
vkeys=re.findall(r"(?:^|[{,\s])'?([a-z0-9_]+)'?\s*:\s*'",vblock,re.M)
vkeys+=['chislo_%d'%n for n in range(1,21)]
b64=lambda p:base64.b64encode(open(p,'rb').read()).decode()
A=',\n'.join('  %s: "data:image/png;base64,%s"'%(k,b64(png[k])) for k in used if k in png)
Z=',\n'.join("  '%s': \"data:audio/mpeg;base64,%s\""%(k,b64(mp3[k])) for k in vkeys if k in mp3)
out=tpl.replace('const ASSETS = {/*@ASSETS@*/};','const ASSETS = {\n'+A+'\n};').replace('const ZVUK = {/*@ZVUK@*/};','const ZVUK = {\n'+Z+'\n};')
open(os.path.join(ROOT,'games/drafts/bolshe-menshe-ravno-04.html'),'w',encoding='utf-8').write(out)
print('PNG есть:',[k for k in used if k in png]); print('PNG НЕТ:',[k for k in used if k not in png])
print('голос есть:',[k for k in vkeys if k in mp3]); print('голоса НЕТ:',[k for k in vkeys if k not in mp3])
