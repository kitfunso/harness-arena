import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const ws = process.argv[2] || './workspace';
const { SlidingWindowLimiter } = await import(pathToFileURL(join(ws, 'impl.mjs')).href);

let passed = 0, total = 0;
function check(name, fn) {
  total++;
  try {
    if (fn()) { passed++; return; }
  } catch { /* fail */ }
  console.log(`FAIL: ${name}`);
}

check('basic admit', () => {
  const l = new SlidingWindowLimiter(2, 1000);
  return l.allow(0) === true && l.allow(100) === true;
});
check('reject over limit', () => {
  const l = new SlidingWindowLimiter(2, 1000);
  l.allow(0); l.allow(100);
  return l.allow(500) === false;
});
check('expiry readmits', () => {
  const l = new SlidingWindowLimiter(2, 1000);
  l.allow(0); l.allow(100); l.allow(500);
  return l.allow(1000) === true;
});
check('rejected does not count', () => {
  const l = new SlidingWindowLimiter(1, 1000);
  l.allow(0);
  l.allow(10); l.allow(20); // rejected, must not extend
  return l.allow(1000) === true;
});
check('limit 1 exact boundary', () => {
  const l = new SlidingWindowLimiter(1, 100);
  l.allow(0);
  return l.allow(99) === false && l.allow(100) === true;
});
check('independent instances', () => {
  const a = new SlidingWindowLimiter(1, 1000);
  const b = new SlidingWindowLimiter(1, 1000);
  a.allow(0);
  return b.allow(0) === true;
});
check('burst at same timestamp', () => {
  const l = new SlidingWindowLimiter(3, 1000);
  return l.allow(5) && l.allow(5) && l.allow(5) && l.allow(5) === false;
});
check('long sequence', () => {
  const l = new SlidingWindowLimiter(2, 100);
  const got = [0, 50, 60, 100, 150, 160, 250, 251, 252].map(t => l.allow(t));
  const exp = [true, true, false, true, true, false, true, true, false];
  return JSON.stringify(got) === JSON.stringify(exp);
});

console.log(`RESULT ${passed}/${total}`);
process.exit(passed === total ? 0 : 1);
