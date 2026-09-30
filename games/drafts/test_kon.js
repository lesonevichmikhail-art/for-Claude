const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const FILE = 'file:///home/user/for-Claude/games/drafts/kon-bezhit-po-taige-v2.html';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
  const out = {};
  for (const vp of [{ w: 390, h: 844, n: 'portrait' }, { w: 844, h: 390, n: 'landscape' }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    await page.goto(FILE);
    await sleep(600);
    // горизонтальный скролл и размеры кнопок
    const geo = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
      brand: !$('brand').classList.contains('gone'), ph: document.querySelectorAll('.ph').length }));
    out[vp.n] = { geo, errs };
    // бот: идеальные нажатия на каждом звуковом ударе
    await page.evaluate(() => {
      localStorage.clear();
      SET.support = 'AUTO'; SET.autoLevel = 'L2'; SET.legs = 2; SET.bpm = 90; saveSettings();
      window.__log = [];
      const orig = Road.onSched.bind(Road);
      Road.onSched = function (b) {
        orig(b);
        if (window.__mode === 'perfect' && !b.silent && (this.phase === 'play')) {
          const need = this.need();
          at(b.T + 0.02, () => { if (this.phase === 'play' && !this.stop) this.tap(null, need); });
        }
      };
      window.__mode = 'perfect';
      setInterval(() => { if (Road.phase === 'probe' && Road.probe) Road.tap(null, Road.probe); }, 300);
      go('challenge');
    });
    // ждём предложение тропы
    let offered = false;
    for (let i = 0; i < 120 && !offered; i++) { await sleep(250); offered = await page.evaluate(() => Road.phase === 'offer'); }
    const offerInfo = await page.evaluate(() => ({ open: $('offer').classList.contains('open'), lvl: Road.level(), obs: JSON.stringify(OBS),
      vis: getComputedStyle($('offer')).display, rect: JSON.stringify($('offer').getBoundingClientRect()), sw: document.documentElement.scrollWidth }));
    out[vp.n].offered = offered; out[vp.n].offerInfo = offerInfo;
    if (offered) {
      await page.screenshot({ path: `offer_${vp.n}.png` });
      await page.click('#pathMountain');
      await sleep(800);
      out[vp.n].afterChoose = await page.evaluate(() => ({ burst: JSON.stringify(Road.burst), lvl: Road.level(), phase: Road.phase, pathOn: $('sceneChallenge').querySelector('.sc-path').classList.contains('on') }));
      // ждём конец захода и финал
      let done = false;
      for (let i = 0; i < 240 && !done; i++) { await sleep(250); done = await page.evaluate(() => current === 'result'); }
      await sleep(14000);
      out[vp.n].final = await page.evaluate(() => ({ cur: current, obs: JSON.stringify(OBS), autoLevel: SET.autoLevel,
        badge: !$('restPath').classList.contains('gone'), voice: $('voiceStrip').textContent, voiceHidden: $('voiceStrip').classList.contains('hide'),
        sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      await page.screenshot({ path: `final_${vp.n}.png` });
      // окно взрослого
      await page.click('#btnAdult'); await sleep(300);
      out[vp.n].adult = await page.evaluate(() => $('obsBox').innerText);
      await page.screenshot({ path: `adult_${vp.n}.png` });
    }
    out[vp.n].errs = errs;
    await ctx.close();
  }
  // сценарий «ленивый»: не нажимает вообще
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage(); const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.goto(FILE); await sleep(500);
    await page.evaluate(() => { localStorage.clear(); SET.support = 'AUTO'; SET.autoLevel = 'L1'; SET.legs = 1; SET.bpm = 90; saveSettings(); go('challenge'); });
    await sleep(14000);
    out.lazy = await page.evaluate(() => ({ tact: Road.tact, u: Road.sc.u, guideRuns: Road.guideRuns, guideLeft: Road.guideLeft, autoLevel: SET.autoLevel, obs: JSON.stringify(OBS), phase: Road.phase }));
    out.lazy.errs = errs;
    await ctx.close();
  }
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
