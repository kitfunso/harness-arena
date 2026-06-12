export class SlidingWindowLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.admitted = [];
  }
  allow(timestampMs) {
    while (this.admitted.length && this.admitted[0] <= timestampMs - this.windowMs) this.admitted.shift();
    if (this.admitted.length < this.limit) {
      this.admitted.push(timestampMs);
      return true;
    }
    return false;
  }
}
