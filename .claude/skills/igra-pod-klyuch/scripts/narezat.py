"""Нарезать ОДНУ запись Михаила на mp3 по паузам.
python3 narezat.py запись.m4a keys.txt папка_выхода [порог_дБ=-45] [склейка_с=0.7]
keys.txt — ключи по порядку строк записи (по одному в строке, можно «ключ<TAB>текст»).
Печатает таблицу «№ старт длина пауза ключ текст». Число кусков ≠ число ключей — НЕ режет, а показывает таблицу:
сверить по длинам (фраза 2–7 с, слог ~0.5 с, слово ~0.7 с), найти где фраза распалась (короткая пауза < 0.9 с внутри)
или два слова слились (кусок ~2× длиннее соседей), поправить вручную через --plan.
Пауза ≥ 4 с = «брак»: предыдущий кусок выбрасывается (так договорились с Михаилом: слово «брак» не говорит).
Мягкая обрезка: 0.2 с запаса до и 0.3 с после, фейды 30/50 мс — иначе съедается тихое «в» (урок «Вдох»)."""
import sys,array,math,subprocess,imageio_ffmpeg,os
F=imageio_ffmpeg.get_ffmpeg_exe(); src,keysf,out=sys.argv[1:4]
th=float(sys.argv[4]) if len(sys.argv)>4 else -45; gap=float(sys.argv[5]) if len(sys.argv)>5 else 0.7
raw=subprocess.run([F,'-v','error','-i',src,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
a=array.array('h',raw); w=320; fr=0.02
db=[20*math.log10(math.sqrt(sum(x*x for x in a[i:i+w])/w)/32768+1e-9) for i in range(0,len(a)-w,w)]
on=[d>th for d in db]; seg=[]; i=0
while i<len(on):
    if on[i]:
        j=i
        while j<len(on) and on[j]: j+=1
        seg.append([i,j]); i=j
    else: i+=1
m=[]
for s_ in seg:
    if m and (s_[0]-m[-1][1])*fr<gap: m[-1][1]=s_[1]
    else: m.append(s_)
m=[s_ for s_ in m if (s_[1]-s_[0])*fr>=0.12]
clean=[]
for s_ in m:
    if clean and (s_[0]-clean[-1][1])*fr>=4.0: clean.pop()      # длинная пауза = брак предыдущего
    clean.append(s_)
keys=[l.rstrip('\n').split('\t') for l in open(keysf,encoding='utf-8') if l.strip()]
prev=0
for n,s_ in enumerate(clean):
    k=keys[n] if n<len(keys) else ['?']
    print(n+1,f'{s_[0]*fr:6.1f} len {(s_[1]-s_[0])*fr:4.2f} gap {(s_[0]-prev)*fr:4.2f}',k[0],(k[1] if len(k)>1 else '')[:30]); prev=s_[1]
if len(clean)!=len(keys): sys.exit(f'СТОП: кусков {len(clean)}, ключей {len(keys)} — сверить таблицу, не резать вслепую')
os.makedirs(out,exist_ok=True)
for n,(k,(s_,e)) in enumerate(zip(keys,clean)):
    lo=clean[n-1][1] if n else 0; hi=clean[n+1][0] if n+1<len(clean) else e+10**6
    st=max(s_*fr-0.2,(lo+s_)*fr/2); en=min(e*fr+0.3,(e+hi)*fr/2)
    subprocess.run([F,'-v','error','-y','-ss',f'{st:.3f}','-to',f'{en:.3f}','-i',src,'-af','afade=t=in:d=0.03,areverse,afade=t=in:d=0.05,areverse','-ac','1','-ar','44100','-b:a','96k',f'{out}/{k[0]}.mp3'],check=True)
print('нарезано',len(keys))
