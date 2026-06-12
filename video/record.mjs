// Records the demo video: title-card hook, then a scripted tour of the live arena.
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

await page.goto(URL, { waitUntil: 'networkidle' });

// 1. the hook: title cards on black
await intro('Have you ever wondered...', '');
await wait(2800);
await intro('Have you ever wondered... <em>am I using AI the best way I could?</em>', '');
await wait(4200);
await intro('Same task. Same model. <em>A hundred ways to harness it.</em>', 'WE PUT A NUMBER ON THE DIFFERENCE');
await wait(4200);
await intro('');

// 2. hero
await wait(2600);
await cap('HarnessArena: real agent runs on hidden test suites. No synthetic rows.');
await wait(4600);

// 3. standings + board
await page.evaluate(() => window.scrollTo({ top: 620, behavior: 'smooth' }));
await cap('Every setup gets an Arena Rating. Handles on the board. Real runs only.');
await wait(6200);
await page.evaluate(() => window.scrollTo({ top: 1150, behavior: 'smooth' }));
await cap('Quality, speed, tokens, output: scored per run, tier-weighted overall.');
await wait(5600);

// 4. race 1: codex low vs xhigh on csv-parser (defaults), 16x => ~8.3s
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
await tab('RACE REPLAY');
await wait(800);
await cap('Every number has a receipt. Replay any two runs head to head.');
await page.click('#raceGo');
await wait(5400);
await cap('Both perfect: 10/10. But low effort took 67s. XHigh took 133s.');
await wait(5400);
await cap('The harness made the difference. Not the model.');
await wait(4200);

// 5. race 2: claude vs codex on the debug tier, 16x
await pickRace('raceA', 'claude-code-haiku', 'debug-cart');
await pickRace('raceB', 'codex-low-effort', 'debug-cart');
await cap('Tier 2: debug a real module. Different tiers crown different setups.');
await page.click('#raceGo');
await wait(7500);

// 6. tasks
await tab('TASKS');
await wait(600);
await cap('Hidden suites the agent never sees. Bring your own harness: one command to enter.');
await wait(6200);

// 7. close
await tab('ARENA');
await page.evaluate(() => window.scrollTo({ top: 0 }));
await wait(300);
await intro('<em>HarnessArena.</em> Race what ships.', 'BUILT IN LONDON / JUNE 12 2026');
await wait(4200);

await ctx.close();
const v = await page.video().path();
console.log('VIDEO:', v);
await browser.close();
