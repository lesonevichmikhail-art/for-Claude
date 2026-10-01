// Полное прохождение «Больше, меньше, равно» v04: node tools/robot_03.js games/drafts/bolshe-menshe-ravno-04.html [профиль] [возраст] [missRate]
// Голос ускорен (V.say → 40 мс), звук выкл. Жмёт касанием (pointerdown), делает промахи, проходит тропу, сон, стук, отдых.
const pw=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const path=require('path'); const file=path.resolve(process.argv[2]); const prof=process.argv[3]||'calm', age=process.argv[4]||'junior', missRate=+(process.argv[5]||0.2);
const outDir=process.env.SNAP||'.';
(async()=>{let bad=0;
for(const [W,H] of [[390,844],[844,390]]){
  const b=await pw.chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>pw.chromium.launch());
  const p=await b.newPage({viewport:{width:W,height:H},hasTouch:true}); const err=[]; p.on('pageerror',x=>err.push(x.message)); p.on('console',m=>{if(m.type()==='error')err.push(m.text())});
  await p.addInitScript(([prof,age])=>{localStorage.setItem('bmr03_set',JSON.stringify({profile:prof,age,rounds:4}));},[prof,age]);
  await p.goto('file://'+file);
  await p.evaluate(()=>{A.on=false; window.__said=[]; V.say=function(k){ __said.push(k); this.busy=true; return new Promise(r=>setTimeout(()=>{this.busy=false;r();},40)); };
    Object.assign(CONFIG.breath,{inMs:250,outMs:250}); CONFIG.count.stepMs=20; CONFIG.count.slowStepMs=40; CONFIG.sleep.waitMs=500; CONFIG.sleep.chance=.5; CONFIG.stuk.chance=.5;
    CONFIG.stuk.beatMs=300; CONFIG.stuk.minGap=150; CONFIG.idle1=1500; CONFIG.idle2=2500; CONFIG.restCycles=1; });
  const snaps=new Set(); const snap=async n=>{ if(snaps.has(n)) return; snaps.add(n); await p.screenshot({path:`${outDir}/r_${W}_${n}.png`}); };
  const tap=s=>p.tap(s,{force:true,timeout:3000}).catch(e=>err.push('tap '+s+': '+e.message.split('\n')[0]));
  const over=[]; let steps=0, idleTested=false, adultTested=false, adultOpen=false;
  await snap('intro'); await tap('#playBtn');
  while(steps++<2500){
    await p.waitForTimeout(60);
    const st=await p.evaluate(()=>({scr:S.screen,w:S.waiting,T:S.T&&{kind:S.T.kind,ans:S.T.ans},
      offer:!$('#offer').classList.contains('hide'),stuk:!$('#stuk').classList.contains('hide'),rest:!$('#rest').classList.contains('hide'),
      sleeping:!!S.sleeping,count:$$('.pile.countMe').map(e=>e.dataset.side),filled:$$('#chain .cs:not(.empty)').length,
      slotHidden:$('#slot').classList.contains('hide'),scroll:document.documentElement.scrollWidth>innerWidth}));
    if(st.scroll) over.push(st.scr);
    if(st.scr==='bridge'){ await p.waitForTimeout(400); await snap('bridge'); break; }
    if(st.scr==='breath'){ await snap('breath'); continue; }
    if(st.scr==='finish'){ await snap('finish'); continue; }
    if(st.rest){ await snap('rest'); await tap('#restC'); await p.waitForTimeout(1300); continue; }
    if(st.offer){ await snap('offer'); if(st.w) await tap('#offHill'); continue; }
    if(st.stuk){ await snap('stuk'); await tap('#stukBtn'); await tap('#stukBtn'); await p.waitForTimeout(200); continue; }
    if(st.sleeping){ await snap('sleep'); if(Math.random()<.3) await tap('#pileL'); continue; }
    if(!st.w) continue;
    if(st.scr==='learn'){ await snap('world'); await tap(`.wbtn[data-w="${process.env.WORLD||"zhuk"}"]`); continue; }
    if(st.scr!=='play') continue;
    if(!adultTested && steps>300){ adultTested=true; await tap('#infoBtn'); await p.waitForTimeout(400); adultOpen=await p.evaluate(()=>$('#adult').classList.contains('on')); await snap('adult'); await tap('#sheet .tbtn.main'); await p.waitForTimeout(300); continue; }
    if(!idleTested && steps>200){ idleTested=true; await p.waitForTimeout(3200); continue; }   // 45 с без действий → окно отдыха
    if(st.count.length){ await snap('count'); await tap('#pile'+(st.count[0]==='l'?'L':'R')); continue; }
    await snap('task_'+st.T.kind);
    const miss=Math.random()<missRate;
    const T=st.T;
    if(T.kind==='chain'){ const a=T.ans[st.filled]; const s=miss?(a==='gt'?'lt':'gt'):a; await tap(`#signs .sbtn[data-s="${s}"]`); continue; }
    if(T.kind==='pile'){
      if(T.ans==='eq'){ if(miss) await tap('#pileL'); else await tap('#signs .sbtn[data-s="eq"]'); }
      else { const side=T.ans==='gt'?'L':'R', other=side==='L'?'R':'L'; await tap('#pile'+(miss?other:side)); }
      continue; }
    const s=miss?(T.ans==='eq'?'gt':'eq'):T.ans; await tap(`#signs .sbtn[data-s="${s}"]`);
  }
  // окно взрослого: открыть касанием — не должно закрыться «призрачным» click
  const log=await p.evaluate(()=>({lv:S.log.levels.join(' → '),tasks:S.log.tasks,sleep:S.log.sleepN,stuk:S.log.stukN,rests:S.log.rests,offers:S.log.offers,bursts:S.log.bursts,counted:S.log.counted,early:S.log.signEarly,supports:S.log.supports,
    noVoice:[...new Set(__said)].filter(k=>!ZVUK[k]).length, said:[...new Set(__said)].length}));
  const fin=await p.evaluate(()=>S.screen);
  console.log(`${W}x${H} [${prof},${age}] экран: ${fin} шагов:${steps} | скролл вбок: ${[...new Set(over)].join(',')||'нет'} | ошибки: ${err.length?err.join(' / '):'нет'} | окно взрослого открылось: ${adultOpen}`);
  console.log('   ',JSON.stringify(log));
  if(err.length||over.length||fin!=='bridge'||!adultOpen) bad++;
  await b.close();
}
process.exit(bad?1:0);})();
