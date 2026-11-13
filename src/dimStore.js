export function createDimStore() {
  const versions = new Map();
  return {
    applyUpdate(key, value, ts) {
      const arr = versions.get(key) || [];
      arr.push({ value, ts });
      versions.set(key, arr);
      return { late: false };
    },
    lookup(key, ts) {
      const arr = versions.get(key) || [];
      let cur = null;
      for (const v of arr) if (v.ts <= ts) cur = v.value;
      return cur;
    },
  };
}
