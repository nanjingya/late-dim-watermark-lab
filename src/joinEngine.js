import { createWatermark } from './watermark.js';
import { createDimStore } from './dimStore.js';
export class JoinEngine {
  constructor(lateness=5) {
    this.lateness = lateness;
    this.wm = createWatermark(lateness);
    this.dim = createDimStore();
    this.events = [];
    this.outputs = [];
    this.lateDimFixes = 0;
  }
  load({ events, dims }) { this.events = events; this.dims = dims; }
  run() {
    this.outputs = [];
    this.lateDimFixes = 0;
    this.wm = createWatermark(this.lateness);
    this.dim = createDimStore();
    for (const d of this.dims) this.dim.applyUpdate(d.key, d.value, d.ts);
    for (const e of this.events) {
      this.wm.observe(e.ts);
      this.outputs.push({ ...e, dim: this.dim.lookup(e.key, e.ts) });
    }
    return { joined: this.outputs.length, lateDimFixes: this.lateDimFixes, watermark: this.wm.value(), outputs: this.outputs };
  }
}
