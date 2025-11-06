let assetCounter = 0;

const store = new Map();

/**
 * Create an asset record from a File and register it.
 * Returns { id, file, filename, path, previewUrl }
 */
export function addFileAsset(file) {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const index = ++assetCounter;           // 1,2,3...
  const filename = `${index}.${ext}`;     // "1.png"
  const path = `i/${filename}`;           // "i/1.png"
  const previewUrl = URL.createObjectURL(file);

  const record = {
    id: `${Date.now()}_${index}`,
    file,
    filename,
    path,
    previewUrl,
  };

  store.set(record.id, record);
  return record;
}

export function getAllAssets() {
  return Array.from(store.values());
}

export function findAssetByPath(path) {
  for (const a of store.values()) if (a.path === path) return a;
  return undefined;
}
