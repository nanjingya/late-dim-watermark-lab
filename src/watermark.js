export function createWatermark(lateness=0) {
  let maxTs = -Infinity;
  return {
    observe(ts) {
      maxTs = Math.max(maxTs, ts);
      return this.value();
    },
    value() { return maxTs === -Infinity ? -Infinity : maxTs - lateness; },
    allow(ts) { return ts <= this.value(); },
    isLate(ts) { return ts < this.value(); },
  };
}
