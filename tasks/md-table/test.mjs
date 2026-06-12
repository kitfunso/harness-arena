import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const ws = process.argv[2] || './workspace';
const { mdTable } = await import(pathToFileURL(join(ws, 'impl.mjs')).href);

let passed = 0, total = 0;
function check(name, got, exp) {
  total++;
  if (got === exp) { passed++; return; }
  console.log(`FAIL: ${name}\n--got--\n${JSON.stringify(got)}\n--exp--\n${JSON.stringify(exp)}`);
}

check('readme example',
  mdTable([{ name: 'ada', age: 36 }, { name: 'bo' }]),
  '| name | age |\n| ---- | --- |\n| ada  | 36  |\n| bo   |     |');

check('empty input', mdTable([]), '');

check('single row single col',
  mdTable([{ x: 1 }]),
  '| x   |\n| --- |\n| 1   |');

check('union of keys first-seen order',
  mdTable([{ b: 'b1' }, { a: 'a1', b: 'b2' }]),
  '| b   | a   |\n| --- | --- |\n| b1  |     |\n| b2  | a1  |');

check('wide value sets width',
  mdTable([{ id: 'abcdef' }, { id: 'x' }]),
  '| id     |\n| ------ |\n| abcdef |\n| x      |');

check('non-string values',
  mdTable([{ ok: true, n: null }]),
  '| ok   | n    |\n| ---- | ---- |\n| true | null |');

console.log(`RESULT ${passed}/${total}`);
process.exit(passed === total ? 0 : 1);
