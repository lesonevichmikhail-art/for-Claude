const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const FILE = 'file:///home/user/for-Claude/games/drafts/kon-bezhit-po-taige-v3.html';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
  const out = {};
  for (const vp of [{ w: 390, h: 844, n: 'portrait' }, { w: 844, h: 390, n: 'landscape' }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage(); const errs = [];
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    await page.goto(FILE); await sleep(600);
    const r = { errs };
    r.gate = await page.evaluate(() => ({ gateVisible: !$('gate').classList.contains('gone'), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, ph: document.querySelectorAll('.ph').length }));
    await page.screenshot({ path: `v3_gate_${vp.n}.png` });
    await page.evaluate(() => {
      localStorage.clear(); SET.support = 'AUTO'; SET.autoLevel = 'L2'; SET.legs = 2; SET.bpm = 90; saveSettings();
      const orig = Road.onSched.bind(Road);
      Road.onSched = function (b) { orig(b); if (!b.silent && this.phase === 'play') { const need = this.need(); at(b.T + 0.02, () => { if (this.phase === 'play' && !this.stop) this.tap(null, need); }); } };
      setInterval(() => { if (Road.phase === 'probe' && Road.probe) Road.tap(null, Road.probe); }, 300);
      window.__seen = new Set(); const d = $('draft'); new MutationObserver(() => { if (d.textContent) window.__seen.add(d.textContent.split(' ')[0]); }).observe(d, { childList: true, characterData: true, subtree: true });
    });
    await page.click('#btnPlayGate');
    await sleep(1200);
    r.afterGate = await page.evaluate(() => ({ gateGone: $('gate').classList.contains('gone'), draft: $('draft').textContent, speech: Voice.last }));
    // ждём конец дыхания → «Поехали»
    let ok = false;
    for (let i = 0; i < 160 && !ok; i++) { await sleep(250); ok = await page.evaluate(() => !$('btnGo').classList.contains('ghost')); }
    r.breathDone = ok;
    if (ok) await page.click('#btnGo');
    let fin = false, offered = false;
    for (let i = 0; i < 700 && !fin; i++) {
      await sleep(250);
      const st = await page.evaluate(() => ({ cur: current, ph: Road.phase }));
      if (st.ph === 'offer' && !offered) { offered = true; await page.screenshot({ path: `v3_offer_${vp.n}.png` }); await page.click('#pathMountain'); }
      fin = st.cur === 'result';
    }
    r.reachedResult = fin; r.offered = offered;
    await sleep(16000);
    r.final = await page.evaluate(() => ({ cur: current, obs: JSON.stringify(OBS), draftsSeen: [...window.__seen], sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
      bridgeImg: !!document.querySelector('#transferRow img[data-img=bridge_adult], #transferRow img:not([data-img])') }));
    await page.screenshot({ path: `v3_final_${vp.n}.png` });
    // ухо и настройка речи
    await page.click('#btnEar'); await sleep(500);
    r.ear = await page.evaluate(() => ({ tok: Voice.tok, last: Voice.last }));
    await page.click('#btnAdult'); await sleep(300);
    await page.screenshot({ path: `v3_adult_${vp.n}.png` });
    await page.click('#segSpeech button:last-child'); await sleep(200);
    r.speechOff = await page.evaluate(() => SET.speech);
    out[vp.n] = r; await ctx.close();
  }
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
