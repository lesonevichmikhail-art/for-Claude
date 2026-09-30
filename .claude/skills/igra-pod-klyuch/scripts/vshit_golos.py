"""Вшить mp3 в ZVUK. python3 vshit_golos.py game.html папка_с_mp3  (имя файла = ключ VOICE)."""
import sys,glob,os,re,base64
html,folder=sys.argv[1],sys.argv[2]; s=open(html,encoding='utf-8').read()
for p in sorted(glob.glob(os.path.join(folder,'*.mp3'))):
    k=os.path.basename(p)[:-4]; d="data:audio/mpeg;base64,"+base64.b64encode(open(p,'rb').read()).decode()
    s=re.sub(r"^  '"+k+r"': \"data:audio[^\"]*\",?\n",'',s,flags=re.M)
    s=s.replace('const ZVUK = {\n',"const ZVUK = {\n  '"+k+"': \""+d+"\",\n",1); print('ok',k)
open(html,'w',encoding='utf-8').write(s)
