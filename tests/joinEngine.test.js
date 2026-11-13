import test from 'node:test';
import assert from 'node:assert/strict';
import { JoinEngine } from '../src/joinEngine.js';
test('late dim update can fix earlier join', () => {
  const eng = new JoinEngine(5);
  eng.load({
    events: [
      { id: 'e1', key: 'u1', ts: 10, amt: 1 },
      { id: 'e2', key: 'u1', ts: 20, amt: 2 }
    ],
    dims: [
      { key: 'u1', value: 'A', ts: 1 },
      { key: 'u1', value: 'A2', ts: 15 }
    ]
  });
  const r = eng.run();
  assert.equal(r.joined, 2);
  assert.ok(r.lateDimFixes >= 1);
  const e1 = r.outputs.find(o => o.id === 'e1');
  const e2 = r.outputs.find(o => o.id === 'e2');
  assert.equal(e1.dim, 'A');
  assert.equal(e2.dim, 'A2');
  assert.equal(r.watermark, 15);
});
