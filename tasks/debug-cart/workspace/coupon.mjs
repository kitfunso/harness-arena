export function couponValid(coupon, nowMs) {
  if (!coupon || typeof coupon.pct !== 'number') return false;
  if (coupon.pct < 1 || coupon.pct > 90) return false;
  return nowMs > coupon.startMs && nowMs < coupon.endMs;
}
