export function createDimStore() {
  const versions = new Map();
  return {
    applyUpdate(key, value, ts, late = false) {
      const arr = versions.get(key) || [];
      const record = { key, value, ts, late: Boolean(late) };
      let i = 0;
      while (i < arr.length && arr[i].ts <= ts) i += 1;
      arr.splice(i, 0, record);
      versions.set(key, arr);
      return record;
    },
    lookup(key, ts) {
      const record = this.lookupVersion(key, ts);
      return record ? record.value : null;
    },
    lookupVersion(key, ts) {
      const arr = versions.get(key);
      if (!arr) return null;
      let cur = null;
      for (const v of arr) {
        if (v.ts > ts) break;
        cur = v;
      }
      return cur;
    },
    versions(key) {
      const arr = versions.get(key);
      return arr ? arr.slice() : [];
    },
  };
}
