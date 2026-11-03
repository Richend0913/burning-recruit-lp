// Sectioned SP screenshots: node shot-sections.js <baseUrl> <outDir> <tag> [paths...]
// Uses plain headless shell (for localhost targets).
const { chromium } = require('/home/hatch/workspace/agent-browser/node_modules/playwright-core');
const fs = require('fs'); const path = require('path');
(async () => {
  const [base, outDir, tag, ...rest] = process.argv.slice(2);
  const targets = rest.length ? rest : ['/'];
  fs.mkdirSync(outDir, { recursive: true });
  const exe = '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell';
  const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ja-JP', isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  for (const p of targets) {
    const url = base.replace(/\/$/, '') + p;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => console.log('goto warn', p, e.message));
    await page.waitForTimeout(1500);
    // scroll through to trigger lazy loads, back to top
    await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); }
      window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));
    });
    await page.waitForTimeout(600);
    const slug = p === '/' ? 'home' : p.replace(/\//g, '_').replace(/^_/, '').replace(/\.html$/, '');
    await page.screenshot({ path: path.join(outDir, `${slug}-sp-${tag}-full.png`), fullPage: true });
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const step = 780;
    let i = 0;
    for (let y = 0; y < total; y += step, i++) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(outDir, `${slug}-sp-${tag}-s${i}.png`) });
    }
    console.log('done', p, 'height', total, 'sections', i);
    const txt = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(path.join(outDir, `${slug}-${tag}-text.txt`), txt);
  }
  await browser.close();
})();
