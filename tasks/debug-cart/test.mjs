import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const ws = process.argv[2] || './workspace';
const { cartTotal } = await import(pathToFileURL(join(ws, 'cart.mjs')).href);
const { money } = await import(pathToFileURL(join(ws, 'format.mjs')).href);

let passed = 0, total = 0;
function eq(name, got, exp) {
  total++;
  if (JSON.stringify(got) === JSON.stringify(exp)) { passed++; return; }
  console.log(`FAIL: ${name}\n  got ${JSON.stringify(got)}\n  want ${JSON.stringify(exp)}`);
}

eq('money large separators', money(123456789), '$1,234,567.89');
eq('money zero', money(0), '$0.00');
eq('money negative', money(-50), '-$0.50');
eq('money sub-dollar', money(7), '$0.07');
eq('qty defaults to 1', cartTotal([{ name: 'a', unitPrice: 500 }], null, 0),
  { subtotal: '$5.00', discount: '$0.00', total: '$5.00' });
eq('coupon inclusive start', cartTotal([{ name: 'a', unitPrice: 1000, qty: 1 }], { pct: 10, startMs: 100, endMs: 200 }, 100),
  { subtotal: '$10.00', discount: '$1.00', total: '$9.00' });
eq('coupon inclusive end', cartTotal([{ name: 'a', unitPrice: 1000, qty: 1 }], { pct: 10, startMs: 100, endMs: 200 }, 200),
  { subtotal: '$10.00', discount: '$1.00', total: '$9.00' });
eq('coupon expired', cartTotal([{ name: 'a', unitPrice: 1000, qty: 1 }], { pct: 10, startMs: 100, endMs: 200 }, 201),
  { subtotal: '$10.00', discount: '$0.00', total: '$10.00' });
eq('coupon pct over cap invalid', cartTotal([{ name: 'a', unitPrice: 1000, qty: 1 }], { pct: 95, startMs: 0, endMs: 9 }, 5),
  { subtotal: '$10.00', discount: '$0.00', total: '$10.00' });
eq('bulk bonus on remainder', cartTotal([{ name: 'a', unitPrice: 10000, qty: 2 }], { pct: 10, startMs: 0, endMs: 9 }, 5),
  { subtotal: '$200.00', discount: '$29.00', total: '$171.00' });
eq('bulk bonus at exact boundary', cartTotal([{ name: 'a', unitPrice: 12500, qty: 1 }], { pct: 20, startMs: 0, endMs: 9 }, 5),
  { subtotal: '$125.00', discount: '$30.00', total: '$95.00' });
eq('no coupon large order still gets bulk bonus', cartTotal([{ name: 'a', unitPrice: 5000, qty: 3 }], null, 0),
  { subtotal: '$150.00', discount: '$7.50', total: '$142.50' });

console.log(`RESULT ${passed}/${total}`);
process.exit(passed === total ? 0 : 1);
