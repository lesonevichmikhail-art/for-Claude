// node tools/robot_luchik.js games/drafts/zvezdochka-luchik.html [папка_снимков] — полное прохождение «Звёздочки Лучика»
const pw=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const path=require('path');const out=process.argv[3]||'.';
(async()=>{for(const [W,H] of [[390,844],[844,390]]){
 const b=await pw.chromium.launch();const p=await b.newPage({viewport:{width:W,height:H},hasTouch:true});const errs=[];p.on('pageerror',x=>errs.push(x.message));
 await p.goto('file://'+path.resolve(process.argv[2]));
 await p.evaluate(()=>{A.on=false;SET.cycles=10;DATA.levels.forEach(l=>{l.inS=1.2;l.outS*=0.3});DATA.supportSlow=0.2;DATA.judge.skipS=0.15;});
 const snap=async n=>{await p.screenshot({path:`${out}/${W}_${n}.png`});if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))errs.push('скролл вбок: '+n)};
 await snap('intro');
 const tapEl=async id=>{const r=await p.evaluate(id=>{const el=document.getElementById(id);el.scrollIntoView({block:'center'});const e=el.getBoundingClientRect();return [e.x+e.width/2,e.y+e.height/2,e.width,e.height]},id);
   if(r[2]<60||r[3]<60)errs.push('мелкая кнопка '+id+' '+r[2]+'x'+r[3]);await p.touchscreen.tap(r[0],r[1]);};
 await tapEl('btnPlay');await p.waitForTimeout(300);await snap('vhod');
 let shots={},log=[],held=false,missLeft=2,cyc=-1;
 const box=await p.evaluate(()=>{const e=document.getElementById('starBox').getBoundingClientRect();return [e.x+e.width/2,e.y+e.height/2]});
 for(let i=0;i<1200;i++){
  const s=await p.evaluate(()=>({cur:current,st:G.stage,ph:G.phase,pl:G.played,sup:G.support,lv:G.level,burst:G.burst}));
  if(s.cur==='finish')break;
  if(s.cur==='tropa'){await snap('tropa');log.push('тропа: выбираю горную');await tapEl('btnMountain');continue;}
  if(s.st==='play'&&s.pl!==cyc){cyc=s.pl;log.push(`цикл ${s.pl} опора=${s.sup} ур=${s.lv} горная=${s.burst}`);if(s.sup&&!shots.sup){shots.sup=1;await p.waitForTimeout(400);await snap('opora');}if(s.burst&&!shots.b){shots.b=1;await snap('gornaya');}}
  const want=s.st==='play'&&s.pl>=2&&s.ph==='in'||s.st==='learn'&&s.ph==='in';   // первые 2 цикла не трогаем: должна прийти опора
  if(want&&!held){await p.mouse.move(box[0],box[1]);await p.mouse.down();held=true;}
  if(!want&&held){await p.mouse.up();held=false;}
  await p.waitForTimeout(60);
 }
 await p.waitForTimeout(300);await snap('finish');
 const r=await p.evaluate(()=>({cur:current,obs:{...OBS},chosen:G.chosen}));
 await tapEl('bridgeAdult');await snap('finish_vzrosly');
 await tapEl('btnAdult');await p.waitForTimeout(200);await snap('adult');
 const scr=await p.evaluate(()=>{const a=document.getElementById('adult');return a.scrollHeight>a.clientHeight});
 await tapEl('closeAdult');
 // отдых: имитируем 45 с без касаний
 await tapEl('btnAgain');await p.waitForTimeout(200);
 await p.evaluate(()=>{G.stage='idle';G.lastTouch=Date.now()-60000;startStage('play',0,null);});
 await p.waitForTimeout(400);const rest=await p.evaluate(()=>current);await snap('rest');
 await tapEl('restCircle');await p.waitForTimeout(200);const rb=await p.evaluate(()=>[current,G.stage]);
 await p.waitForTimeout(6000);const ra=await p.evaluate(()=>current);await tapEl('btnRestGo');const rg=await p.evaluate(()=>[current,G.stage]);
 // пауза при сворачивании
 await p.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});
 const pz=await p.evaluate(()=>G.paused);
 await p.evaluate(()=>{Object.defineProperty(document,'hidden',{value:false,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});
 const pz2=await p.evaluate(()=>G.paused);
 await tapEl('btnAdult');await p.waitForTimeout(100);const aOpen=await p.evaluate(()=>document.getElementById('adult').classList.contains('on'));await tapEl('closeAdult');
 console.log(`${W}x${H}`,log.join(' | '));
 console.log('финал:',r.cur,'тропа:',r.chosen,'OBS',JSON.stringify(r.obs),'| окно взрослого листается:',scr);
 console.log('отдых:',rest,'→ нос:',rb,'→ после дыхания:',ra,'→ стрелка:',rg,'| пауза при скрытии:',pz,'после:',pz2,'| окно после касания открыто:',aOpen);
 console.log('ошибки:',errs.length?errs:'нет');await b.close();}})();
