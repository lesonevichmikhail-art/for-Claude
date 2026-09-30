const {chromium}=require(process.argv[2]);const [W,H]=process.argv[3].split('x').map(Number);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:H},hasTouch:true});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file://'+__dirname+'/zvonkiy-gluhoy-motor-E01.html');
await p.evaluate(()=>{A.on=false;S.set.rounds=2;});
const seen=[],over=[];let checkedFor=new Set(),n=0,last='',wrongDone=new Set();
const t0=Date.now();
while(Date.now()-t0<400000){
  const st=await p.evaluate(()=>({scr:S.screen,w:S.waiting,lock:S.lock,care:!$('#care').classList.contains('hide'),chk:!$('#checkBtn').classList.contains('hide'),L:S.lastLs[S.lastLs.length-1],sw:document.documentElement.scrollWidth,iw:innerWidth,task:S.lastLs.length,rest:$('#rest').classList.contains('on')}));
  if(st.scr!==last){last=st.scr;seen.push(st.scr);await p.waitForTimeout(400);await p.screenshot({path:`bot_${W}_${seen.length}_${st.scr}.png`});}
  if(st.sw>st.iw) over.push(st.scr);
  if(st.scr==='bridge'){await p.waitForTimeout(1500);break;}
  if(st.rest) await p.evaluate(()=>$('#rBack').dispatchEvent(new Event('pointerdown')));
  else if(st.scr==='intro') await p.evaluate(()=>$('#playBtn').click());
  else if(st.scr==='gear'&&st.w) await p.evaluate(()=>{for(const id of ['#gHelmet','#gGloves']){const el=$(id);const r=el.getBoundingClientRect();const pr=$('#gPilot').getBoundingClientRect();el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:r.x+5,clientY:r.y+5,pointerId:1}));document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:r.x+5,clientY:r.y+5,pointerId:1}));}});
  else if(st.scr==='learn'&&st.w) await p.evaluate(()=>$('#skazalBtn').click());
  else if(st.scr==='play'&&st.w&&!st.lock){
    n++;
    if(st.care) await p.evaluate(k=>$('#ch'+k).click(), n%2);
    else if(st.chk && !checkedFor.has(st.task)){ checkedFor.add(st.task); await p.evaluate(()=>$('#checkBtn').click()); }
    else { const wrong = n%4===0 && !wrongDone.has(n); wrongDone.add(n);
      const l = wrong ? (st.L==='d'?'t':'d') : st.L; {const bb=await p.locator(l==='d'?'#motD':'#motT').boundingBox(); await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2);} }
  }
  await p.waitForTimeout(250);
}
const log=await p.evaluate(()=>({levels:S.log&&S.log.levels,tasks:S.log&&S.log.tasks,miss:S.log&&S.log.miss,badges:S.badges}));
console.log(W+'x'+H,'screens:',seen.join('>'),'| overflow:',[...new Set(over)].join(',')||'none','| errors:',e.length?e:'none','|',JSON.stringify(log),'| sec',Math.round((Date.now()-t0)/1000));
await b.close()})()
