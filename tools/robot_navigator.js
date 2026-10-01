// Робот «Навигатор»: полное прохождение junior и senior, портрет и альбом. node tools/robot_navigator.js
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const FILE = 'file://' + require('path').resolve(__dirname, '../games/drafts/navigator-levo-pravo.html');
const OUT = process.env.OUT || '/tmp';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const report = [];
  for (const vp of [{ w: 390, h: 844, n: 'portrait' }, { w: 844, h: 390, n: 'landscape' }])
  for (const age of ['junior', 'senior']) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage(); const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(FILE + '?age=' + age); await sleep(400);
    const r = { vp: vp.n, age, errs, screens: {}, scroll: [], tropa: 0, rest: 0, miss: 0 };
    await page.evaluate(() => {
      const fast = ptimer; window.ptimer = (ms, cb) => fast(ms / 6, cb);
      CONFIG.breath.inMs = 250; CONFIG.breath.outMs = 250; CONFIG.liftStepMs = 120; CONFIG.idle1 = 1200; CONFIG.idle2 = 2500;
      S.set.sound = false; A.on = false; S.set.speech = false;
    });
    await page.screenshot({ path: `${OUT}/nav_${vp.n}_${age}_intro.png` });
    await page.tap('#playBtn', { force: true });
    let idleTested = false, t0 = Date.now();
    while (Date.now() - t0 < 240000) {
      const st = await page.evaluate(() => ({ scr: S.screen, waiting: S.waiting, want: S.want, lock: S.lock, mir: $('#mirror').classList.contains('on'),
        tropa: $('#tropa').classList.contains('on'), rest: $('#rest').classList.contains('on'), next: !$('#bNext').classList.contains('vhide'),
        restNext: !$('#restNext').classList.contains('vhide'), lv: S.level,
        sw: document.documentElement.scrollWidth > document.documentElement.clientWidth }));
      if (st.sw) r.scroll.push(st.scr);
      const key = st.scr + (st.mir ? '_mirror' : '') + (st.tropa ? '_tropa' : '') + (st.rest ? '_rest' : '') + (st.scr === 'play' ? '_L' + st.lv : '');
      if (!r.screens[key]) { r.screens[key] = 1; await page.screenshot({ path: `${OUT}/nav_${vp.n}_${age}_${key}.png` }); }
      if (st.scr === 'bridge') { await sleep(300); await page.tap('#adToggle', { force: true }); await sleep(200); await page.screenshot({ path: `${OUT}/nav_${vp.n}_${age}_bridge_open.png` }); break; }
      if (st.tropa) { r.tropa++; await page.tap(r.tropa === 1 ? '#trUp' : '#trSame', { force: true }); await sleep(100); continue; }
      if (st.rest) { if (st.restNext) { r.rest++; await page.tap('#rCircle', { force: true }); await sleep(1500); await page.tap('#restNext', { force: true }); } await sleep(150); continue; }
      if (st.scr === 'breath' && st.next) { await page.tap('#bNext', { force: true }); await sleep(100); continue; }
      if ((st.scr === 'play' || st.scr === 'learn') && st.waiting && !st.lock) {
        if (!idleTested && st.scr === 'play') { idleTested = true; await sleep(3500); continue; }
        let d = st.want; if (Math.random() < 0.18) { d = d === 'L' ? 'R' : 'L'; r.miss++; }
        const sel = st.mir ? (d === 'L' ? '.mzone.zl' : '.mzone.zr') : '#btn' + d;
        if (await page.isVisible(sel)) await page.tap(sel, { force: true });
        await sleep(80); continue;
      }
      await sleep(120);
    }
    r.end = await page.evaluate(() => ({ scr: S.screen, log: S.log && S.log.levels.join(' '), ph: [...document.querySelectorAll('.ph small')].map(x => x.textContent) }));
    r.ph = [...new Set(r.end.ph)]; delete r.end.ph;
    // окно взрослого
    await page.tap('#againBtn', { force: true }); await sleep(300); await page.tap('#infoBtn', { force: true }); await sleep(300);
    r.adultOpen = await page.evaluate(() => $('#adult').classList.contains('on'));
    await page.screenshot({ path: `${OUT}/nav_${vp.n}_${age}_adult.png` });
    report.push(r); await ctx.close();
  }
  console.log(JSON.stringify(report, null, 1)); await browser.close();
})();
