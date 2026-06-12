// Demo video v4 (final): 1080p, hook cards, tabbed leaderboard demo, two races, repo proof, URL close.
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/skf_s/AppData/Roaming/npm/node_modules/@playwright/mcp/');
const { chromium } = require('playwright');

const URL = process.argv[2] ?? 'https://harness-arena-three.vercel.app';
const OUT = 'C:/Users/skf_s/harness-arena/video';

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: OUT, size: { width: 1920, height: 1080 } },
});
const page = await ctx.newPage();

const cap = t => page.evaluate(x => window.arenaCaption(x), t);
const intro = (big, sub) => page.evaluate(([b, s]) => window.arenaIntro(b, s), [big, sub]);
const wait = ms => page.waitForTimeout(ms);
const tab = name => page.evaluate(n => {
  [...document.querySelectorAll('nav button')].find(b => b.textContent.trim() === n).click();
}, name);
const lbTab = t => page.evaluate(x => document.querySelector(`[data-t="${x}"]`).click(), t);
const pickRace = (sel, harness, task) => page.evaluate(([id, h, t]) => {
  const s = document.getElementById(id);
  s.selectedIndex = [...s.options].findIndex(o => o.text.includes(h) && o.text.includes(t));
}, [sel, harness, task]);
const glide = async (from, to, ms) => {
  const steps = Math.max(1, Math.round(ms / 80));
  for (let i = 1; i <= steps; i++) {
    await page.evaluate(y => window.scrollTo(0, y), from + (to - from) * (i / steps));
    await wait(80);
  }
};

// ?intro=1 boots the page with the black overlay already up: no board flash on frame zero
await page.goto(URL + '?intro=1', { waitUntil: 'commit' });
await page.waitForFunction(() => window.arenaIntro);

// CH0 - brand card (0:00-0:03)
await intro('<span style="background:#ff4b1f;color:#fff;padding:10px 26px;border:2px solid #d9d6c8;letter-spacing:2px">HARNESSARENA</span>', 'RACE YOUR AI SETUP');
await page.waitForLoadState('networkidle');
await wait(3000);

// CH1 - the hook (0:03-0:14)
await intro('Have you ever wondered...', '');
await wait(2600);
await intro('Have you ever wondered... <em>am I using AI the best way I could?</em>', '');
await wait(4400);
await intro('Same task. Same model. <em>A hundred ways to harness it.</em>', 'WE PUT A NUMBER ON THE DIFFERENCE');
await wait(4400);
await intro('');

// CH2 - leaderboard above the fold (0:12-0:22)
await wait(2200);
await cap('Real recorded runs. A live, tier-weighted leaderboard. Built this afternoon.');
await wait(4600);
await cap('Quality, speed, tokens, output: one Arena Rating per setup. Handles on the board.');
await wait(4600);

// CH3 - tab into the debug tier (0:22-0:32)
await cap('Tab into any task for its own ranking.');
await lbTab('debug-cart');
await wait(3600);
await cap('Tier 2: debug a real module. Weighs 1.5x. Different tiers crown different setups.');
await wait(4400);
await lbTab('all');
await glide(0, 520, 3200);
await wait(1200);

// CH4 - race 1: same model, two configs (0:32-0:50)
await page.evaluate(() => window.scrollTo(0, 0));
await tab('RACE REPLAY');
await wait(700);
await cap('Same model: gpt-5.5. Two harness configs, head to head, from the recorded traces.');
await page.click('#raceGo');
await wait(3600);
await cap('');
await wait(4800);
await cap('Both perfect. Low effort: 67 seconds. XHigh: 133. The harness decided.');
await wait(5400);

// CH5 - race 2: the debug tier, cross-vendor (0:50-1:01)
await pickRace('raceA', 'claude-code-haiku', 'debug-cart');
await pickRace('raceB', 'codex-low-effort', 'debug-cart');
await cap('Cross-vendor on the debug tier: Claude Code vs Codex.');
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
await wait(3400);
await cap('One command to enter. Your run lands on the live board via Supabase.');
await wait(4600);

// CH7 - proof: open repo (1:10-1:17)
await cap('');
await page.goto('https://github.com/kitfunso/harness-arena', { waitUntil: 'domcontentloaded' });
await wait(1200);
await page.evaluate(txt => {
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;left:50%;bottom:44px;transform:translateX(-50%);z-index:99999;background:#0c0d0a;border:2px solid #ffd60a;color:#d9d6c8;font:700 17px JetBrains Mono,monospace;padding:14px 26px;max-width:86vw;text-align:center';
  d.textContent = 'Open source. Every leaderboard row is a committed, replayable trace.';
  document.body.appendChild(d);
}, '');
await wait(4800);

// CH8 - close (1:17-1:24)
await page.goto(URL, { waitUntil: 'networkidle' });
await intro('<em>HARNESSARENA.</em> Race what ships.', 'HARNESS-ARENA-THREE.VERCEL.APP');
await wait(4800);

await ctx.close();
const v = await page.video().path();
console.log('VIDEO:', v);
await browser.close();
