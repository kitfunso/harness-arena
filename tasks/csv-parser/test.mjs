import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const ws = process.argv[2] || './workspace';
const { parseCSV } = await import(pathToFileURL(join(ws, 'impl.mjs')).href);

const cases = [
  ['a,b,c', [['a', 'b', 'c']]],
  ['a,b\nc,d', [['a', 'b'], ['c', 'd']]],
  ['a,"b,1",c', [['a', 'b,1', 'c']]],
  ['x,"he said ""hi""",y', [['x', 'he said "hi"', 'y']]],
  ['a,,c', [['a', '', 'c']]],
  ['a,b\r\nc,d', [['a', 'b'], ['c', 'd']]],
  ['a,b\n', [['a', 'b']]],
  ['"multi\nline",b', [['multi\nline', 'b']]],
  ['""', [['']]],
  ['a,"",c\n,,', [['a', '', 'c'], ['', '', '']]],
];

let passed = 0;
for (const [input, expected] of cases) {
  let ok = false;
  try {
    ok = JSON.stringify(parseCSV(input)) === JSON.stringify(expected);
  } catch { /* counts as fail */ }
  if (ok) passed++;
  else console.log(`FAIL: ${JSON.stringify(input)}`);
}
console.log(`RESULT ${passed}/${cases.length}`);
process.exit(passed === cases.length ? 0 : 1);
