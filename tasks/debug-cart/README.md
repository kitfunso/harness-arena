# Task: Debug the Cart Module (Tier 2)

This workspace contains a small cart module with bugs. The visible tests fail:

    node tests.mjs

Find and fix the bugs. Edit `cart.mjs`, `coupon.mjs`, `format.mjs` only - minimal fixes, do not rewrite modules wholesale. `tests.mjs` is read-only.

## Spec
- `cartTotal(items, coupon, nowMs)` -> `{ subtotal, discount, total }`, all formatted money strings.
- `items`: array of `{ name, unitPrice, qty }`. `unitPrice` is integer cents. `qty` defaults to 1 when omitted.
- A coupon `{ pct, startMs, endMs }` takes `pct`% off the subtotal (rounded with `Math.round`) when valid at `nowMs`. Valid means `1 <= pct <= 90` and the window is INCLUSIVE at both ends: `startMs <= nowMs <= endMs`.
- Bulk bonus: when `(subtotal - coupon discount) >= 10000` cents, an EXTRA 5% of that remainder (rounded) is added to the discount.
- `money(cents)`: `"$1,234.56"` with thousands separators. Negative values render as `"-$0.50"`.

The visible tests are a subset. A hidden suite scores you on the full spec.
