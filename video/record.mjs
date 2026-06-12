// Demo video v3: title-card hook, continuous-motion tour, two races, repo proof beat, URL close.
// Paced in chapters so a voiceover can ride on top.
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/skf_s/AppData/Roaming/npm/node_modules/@playwright/mcp/');
const { chromium } = require('playwright');

const URL = process.argv[2] ?? 'https://harness-arena-three.vercel.app';
const OUT = 'C:/Users/skf_s/harness-arena/video';

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: OUT, size: { width: 1280, height: 720 } },
});
const page = await ctx.newPage();

const cap = t => page.evaluate(x => window.arenaCaption(x), t);
const intro = (big, sub) => page.evaluate(([b, s]) => window.arenaIntro(b, s), [big, sub]);
const wait = ms => page.waitForTimeout(ms);
const tab = name => page.evaluate(n => {
  [...document.querySelectorAll('nav button')].find(b => b.textContent.trim() === n).click();
}, name);
const pickRace = (sel, harness, task) => page.evaluate(([id, h, t]) => {
  const s = document.getElementById(id);
  s.selectedIndex = [...s.options].findIndex(o => o.text.includes(h) && o.text.includes(t));
}, [sel, harness, task]);
// slow continuous scroll so the frame is never static
const glide = async (from, to, ms) => {
  const steps = Math.max(1, Math.round(ms / 80));
  for (let i = 1; i <= steps; i++) {
    await page.evaluate(y => window.scrollTo(0, y), from + (to - from) * (i / steps));
    await wait(80);
  }
};

await page.goto(URL, { waitUntil: 'networkidle' });

// CH1 - the hook (0:00-0:12)
await intro('Have you ever wondered...', '');
await wait(2600);
await intro('Have you ever wondered... <em>am I using AI the best way I could?</em>', '');
await wait(4400);
await intro('Same task. Same model. <em>A hundred ways to harness it.</em>', 'WE PUT A NUMBER ON THE DIFFERENCE');
await wait(4400);
await intro('');

// CH2 - masthead + standings above the fold (0:12-0:21)
await wait(2400);
await cap('Real recorded runs. Live board. Built this afternoon.');
await glide(0, 240, 3200);
await wait(1800);

// CH3 - standings + run table (0:21-0:33)
await cap('Every setup gets an Arena Rating: quality, speed, tokens, output.');
await glide(240, 700, 4200);
await wait(2200);
await cap('Your skills, your CLAUDE.md, your hooks. The setup is the competitor.');
await glide(700, 1150, 3800);
await wait(1600);

// CH4 - race 1: same model, two configs (0:33-0:50)
await page.evaluate(() => window.scrollTo(0, 0));
await tab('RACE REPLAY');
await wait(700);
await cap('Same model: gpt-5.5. Two harness configs, head to head.');
await page.click('#raceGo');
await wait(3600);
await cap('');
await wait(4800);
await cap('Both perfect. Low effort: 67 seconds. XHigh: 133. The harness decided.');
await wait(5400);

// CH5 - race 2: the debug tier (0:50-1:01)
await pickRace('raceA', 'claude-code-haiku', 'debug-cart');
await pickRace('raceB', 'codex-low-effort', 'debug-cart');
await cap('Tier 2: debug a real module. Cross-vendor, replayed from the recorded traces.');
await page.click('#raceGo');
await wait(2800);
await cap('');
await wait(4400);
await cap('Every number on the board has a receipt.');
await wait(3400);

// CH6 - tasks + how to enter (1:01-1:10)
await tab('TASKS');
await wait(500);
await cap('Hidden test suites the agents never see.');
await glide(0, 320, 3000);
await cap('Bring your own harness: one command to enter, handles on the board.');
await glide(320, 620, 3200);
await wait(1600);

// CH7 - proof: open repo (1:10-1:16). GitHub has no arenaCaption, inject a bare overlay.
await cap('');
await page.goto('https://github.com/kitfunso/harness-arena', { waitUntil: 'domcontentloaded' });
await wait(1200);
await page.evaluate(txt => {
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;left:50%;bottom:44px;transform:translateX(-50%);z-index:99999;background:rgba(16,15,13,.95);border:1px solid #ff5a1f;color:#ece8df;font:500 19px Georgia,serif;padding:15px 28px;max-width:86vw;text-align:center';
  d.textContent = txt;
  document.body.appendChild(d);
}, 'Open source. Every leaderboard row is a committed, replayable trace.');
await wait(4600);

// CH8 - close (1:16-1:24)
await page.goto(URL, { waitUntil: 'networkidle' });
await intro('<em>HarnessArena.</em> Race what ships.', 'HARNESS-ARENA-THREE.VERCEL.APP');
await wait(4800);

await ctx.close();
const v = await page.video().path();
console.log('VIDEO:', v);
await browser.close();
