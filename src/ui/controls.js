async function readJsonl(url) {
  const text = await (await fetch(url)).text();
  return text.trim().split(/\n+/).filter(Boolean).map(l => JSON.parse(l));
}
export function bindControls({ engine, els }) {
  els.btnLoad.onclick = async () => {
    try {
      const events = await readJsonl('fixtures/events.jsonl');
      const dims = await readJsonl('fixtures/dim.jsonl');
      engine.load({ events, dims });
      els.status.textContent = 'ready';
    } catch (e) { els.status.textContent = String(e.message||e); }
  };
  els.btnRun.onclick = () => {
    try {
      engine.lateness = Number(els.lateness.value);
      const r = engine.run();
      els.out.textContent = JSON.stringify(r.outputs, null, 2);
      els.stats.textContent = `joined=${r.joined} lateDimFixes=${r.lateDimFixes} watermark=${r.watermark}`;
      els.status.textContent = 'ready';
      els._last = r;
    } catch (e) { els.status.textContent = String(e.message||e); }
  };
  els.btnExport.onclick = () => { els.out.textContent = JSON.stringify(els._last || {}, null, 2); };
}
