import { couponValid } from './coupon.mjs';
import { money } from './format.mjs';

export function cartTotal(items, coupon, nowMs) {
  let subtotal = 0;
  for (const it of items) subtotal += it.unitPrice * (it.qty ?? 1);
  let discount = 0;
  if (coupon && couponValid(coupon, nowMs)) {
    discount = Math.round(subtotal * coupon.pct / 100);
  }
  const remainder = subtotal - discount;
  if (remainder >= 10000) discount += Math.round(remainder * 0.05);
  return { subtotal: money(subtotal), discount: money(discount), total: money(subtotal - discount) };
}
