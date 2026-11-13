export function createWatermark(lateness=0) {
  let wm = -Infinity;
  return {
    observe(ts) { wm = Math.max(wm, ts); return wm; },
    value() { return wm; },
    allow(ts) { return ts <= wm; },
    isLate(ts) { return ts < wm; },
  };
}
