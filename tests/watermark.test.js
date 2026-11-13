import test from 'node:test';
import assert from 'node:assert/strict';
import { createWatermark } from '../src/watermark.js';
test('watermark lags by lateness', () => {
  const wm = createWatermark(5);
  assert.equal(wm.observe(20), 15);
  assert.equal(wm.value(), 15);
  assert.equal(wm.allow(15), true);
  assert.equal(wm.allow(16), false);
});
test('isLate relative to watermark', () => {
  const wm = createWatermark(0);
  wm.observe(10);
  assert.equal(wm.isLate(9), true);
  assert.equal(wm.isLate(10), false);
});
