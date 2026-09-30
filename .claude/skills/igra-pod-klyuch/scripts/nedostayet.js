// node nedostayet.js game.html — какие ключи VOICE без mp3 и какие PNG без картинки (через Playwright).
const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+require('path').resolve(process.argv[2]));
const r=await p.evaluate(()=>{const html=document.documentElement.outerHTML;
 const used=[...new Set((html.match(/'(geroy|predmet|fon|ikonka|scena|deystvie)_[a-z0-9_]+'/g)||[]).map(s=>s.slice(1,-1)))];
 return {golos:Object.keys(VOICE).filter(k=>!ZVUK[k]).map(k=>k+'\t'+VOICE[k]), png:used.filter(k=>!ASSETS[k])};});
console.log('ГОЛОС нет:',r.golos.length);r.golos.forEach(x=>console.log(x));console.log('PNG нет:',r.png.join(' ')||'0');await b.close()})();
