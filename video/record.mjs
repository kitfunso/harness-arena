// Records the 90s demo video: scripted tour of the live arena with caption overlays.
// Uses the playwright bundled inside the global @playwright/mcp install.
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
const wait = ms => page.waitForTimeout(ms);
const tab = name => page.evaluate(n => {
  [...document.querySelectorAll('nav button')].find(b => b.textContent.trim() === n).click();
}, name);
const pickRace = (sel, harness, task) => page.evaluate(([id, h, t]) => {
  const s = document.getElementById(id);
  s.selectedIndex = [...s.options].findIndex(o => o.text.includes(h) && o.text.includes(t));
}, [sel, harness, task]);

await page.goto(URL, { waitUntil: 'networkidle' });
await wait(1200);

// 1. hero
await cap('Every leaderboard ranks models. Nobody ranks the harness.');
await wait(4800);
await cap('Same task. Same hidden test suite. Different harness setup.');
await wait(4500);

// 2. podium + board
await page.evaluate(() => window.scrollTo({ top: 520, behavior: 'smooth' }));
await cap('Real recorded agent runs only. No synthetic rows.');
await wait(5500);
await cap('Same model, gpt-5.5: the low-effort config cleared every task. XHigh just took longer.');
await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'smooth' }));
await wait(7000);

// 3. race 1: codex low vs xhigh on csv-parser (defaults), 16x => ~8.3s
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
await tab('RACE REPLAY');
await wait(900);
await cap('Every number has a receipt: replay any two runs head to head.');
await page.click('#raceGo');
await wait(5200);
await cap('10/10 both. But low effort finished in 67s. XHigh needed 133s.');
await wait(5600);
await cap('The harness made the difference, not the model.');
await wait(4200);

// 4. race 2: claude vs codex on rate-limiter, 16x => ~3.6s
await pickRace('raceA', 'claude-code-haiku', 'rate-limiter');
await pickRace('raceB', 'codex-low-effort', 'rate-limiter');
await cap('Cross-vendor: Claude Code races Codex in the same arena.');
await page.click('#raceGo');
await wait(6500);

// 5. tasks
await tab('TASKS');
await wait(600);
await cap('Hidden test suites the agent never sees. Bring your own harness: one command to enter.');
await wait(6500);

// 6. close on hero
await tab('ARENA');
await page.evaluate(() => window.scrollTo({ top: 0 }));
await wait(400);
await cap('HarnessArena. Race what ships.');
await wait(4500);
await cap('');
await wait(800);

await ctx.close();
const v = await page.video().path();
console.log('VIDEO:', v);
await browser.close();
