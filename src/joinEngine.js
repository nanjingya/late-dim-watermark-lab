import { createWatermark } from './watermark.js';
import { createDimStore } from './dimStore.js';

export class JoinEngine {
  constructor(lateness = 5) {
    this.lateness = lateness;
    this.wm = createWatermark(lateness);
    this.dim = createDimStore();
    this.events = [];
    this.dims = [];
    this.outputs = [];
    this.lateDimFixes = 0;
  }

  load({ events, dims }) {
    this.events = events;
    this.dims = dims;
  }

  run() {
    this.outputs = [];
    this.lateDimFixes = 0;
    this.wm = createWatermark(this.lateness);
    this.dim = createDimStore();
    const dims = this.dims || [];

    // Phase 1: consume events in arrival order, advancing the event-time
    // watermark and joining against whatever dim versions are known so far.
    for (const e of this.events || []) {
      this.wm.observe(e.ts);
      this.outputs.push({
        ...e,
        dim: this.dim.lookup(e.key, e.ts),
        lateEvent: this.wm.isLate(e.ts),
        dimFixed: false,
      });
    }

    // Phase 2: dim updates may arrive after the watermark already passed
    // their event time. Watermark-covered updates are late and retroactively
    // fix the already-emitted join outputs.
    for (const d of dims) {
      const late = this.wm.allow(d.ts);
      this.dim.applyUpdate(d.key, d.value, d.ts, late);
      if (!late) continue;

      let fixed = false;
      for (const out of this.outputs) {
        if (out.key !== d.key || out.ts < d.ts) continue;
        const asOf = this.dim.lookup(d.key, out.ts);
        if (asOf !== out.dim) {
          out.dim = asOf;
          out.dimFixed = true;
          fixed = true;
        }
      }
      if (fixed) this.lateDimFixes += 1;
    }

    return {
      joined: this.outputs.length,
      lateDimFixes: this.lateDimFixes,
      watermark: this.wm.value(),
      outputs: this.outputs,
    };
  }
}
