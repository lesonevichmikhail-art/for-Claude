// node robot_obshchiy.js game.html — общий дымовой прогон: ошибки JS, скролл вбок, снимки каждого экрана,
// портрет 390x844 и альбом 844x390. Полное прохождение пишется под игру (образец robot_E01_primer.js).
const pw=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{for(const [W,H] of [[390,844],[844,390]]){const b=await pw.chromium.launch();const p=await b.newPage({viewport:{width:W,height:H},hasTouch:true});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file://'+require('path').resolve(process.argv[2]));await p.evaluate(()=>{try{A.on=false}catch(_){}});
const names=await p.evaluate(()=>[...document.querySelectorAll('section.screen')].map(s=>s.id.replace('scr-','')));const over=[];
for(const n of names){await p.evaluate(n=>{try{go(n)}catch(_){}},n);await p.waitForTimeout(700);
 if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) over.push(n);
 await p.screenshot({path:`snap_${W}_${n}.png`});}
console.log(W+'x'+H,'экраны:',names.join(','),'| скролл вбок:',over.join(',')||'нет','| ошибки:',e.length?e:'нет');await b.close();}})();
