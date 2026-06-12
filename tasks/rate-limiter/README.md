# Task: Sliding Window Rate Limiter

Implement class `SlidingWindowLimiter` in `impl.mjs` (the only file you may edit).

## Spec
- `new SlidingWindowLimiter(limit, windowMs)` - allow at most `limit` requests in any sliding window of `windowMs` milliseconds.
- `allow(timestampMs)` -> `true` if the request at that timestamp is admitted, `false` if rejected.
- Rejected requests do NOT count toward the window.
- Timestamps are non-decreasing. The window is inclusive of `now - windowMs + 1` through `now` (i.e. a request at t=0 with windowMs=1000 expires at t=1000).
- Independent instances must not share state.

## Examples
```js
const l = new SlidingWindowLimiter(2, 1000);
l.allow(0);    // true
l.allow(100);  // true
l.allow(500);  // false (2 already in window)
l.allow(1000); // true  (t=0 expired)
```

There is a hidden test suite with additional edge cases. Done when all hidden tests pass.
