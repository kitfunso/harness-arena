// Visible smoke tests (read-only). The hidden grading suite covers the full spec.
import { cartTotal } from './cart.mjs';
import { money } from './format.mjs';

let pass = 0, total = 0;
const eq = (name, got, exp) => {
  total++;
  if (JSON.stringify(got) === JSON.stringify(exp)) { pass++; return; }
  console.log('FAIL', name, '\n  got ', JSON.stringify(got), '\n  want', JSON.stringify(exp));
};

eq('money separators', money(123456), '$1,234.56');
eq('money negative', money(-50), '-$0.50');
eq('qty defaults to 1', cartTotal([{ name: 'a', unitPrice: 500 }], null, 0),
  { subtotal: '$5.00', discount: '$0.00', total: '$5.00' });
eq('coupon inclusive at start', cartTotal([{ name: 'a', unitPrice: 1000, qty: 1 }], { pct: 10, startMs: 100, endMs: 200 }, 100),
  { subtotal: '$10.00', discount: '$1.00', total: '$9.00' });

console.log(`${pass}/${total} visible tests pass`);
process.exit(pass === total ? 0 : 1);
