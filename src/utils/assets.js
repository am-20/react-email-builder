// Keeps an assets registry in localStorage so exports can include files after reloads.

const LSK = 'emailBuilderAssets'; // map: { [path]: { dataUrl, mime, name, ts } }
const LSK_COUNTER = 'assetCounter'; // integer for filenames

function loadMap() {
  try {
    return JSON.parse(localStorage.getItem(LSK)) || {};
  } catch {
    return {};
  }
}
function saveMap(map) {
  try {
    localStorage.setItem(LSK, JSON.stringify(map));
  } catch {
    /* empty */
  }
}
function nextCounter() {
  const n = (parseInt(localStorage.getItem(LSK_COUNTER) || '0', 10) || 0) + 1;
  localStorage.setItem(LSK_COUNTER, String(n));
  return n;
}
function extFromMime(mime, fallback = 'png') {
  if (!mime) return fallback;
  const m = mime.toLowerCase();
  if (m.includes('png')) return 'png';
  if (m.includes('jpeg') || m.includes('jpg')) return 'jpg';
  if (m.includes('gif')) return 'gif';
  if (m.includes('webp')) return 'webp';
  if (m.includes('svg')) return 'svg';
  return fallback;
}

// PUBLIC: used by components already
export function addFileAsset(file) {
  const map = loadMap();
  const ext = (
    file.name?.split('.').pop() || extFromMime(file.type)
  ).toLowerCase();
  const path = `i/${nextCounter()}.${ext}`;

  // Preview URL for editor right away
  const previewUrl = URL.createObjectURL(file);

  // Persist base64 in the background (so it survives reloads and is exportable)
  const reader = new FileReader();
  reader.onload = () => {
    map[path] = {
      dataUrl: reader.result, // "data:image/png;base64,...."
      mime: file.type || 'application/octet-stream',
      name: file.name || path.split('/').pop(),
      ts: Date.now(),
    };
    saveMap(map);
  };
  reader.readAsDataURL(file);

  return { path, previewUrl };
}

// PUBLIC: used by exporter
export function listAssets() {
  const map = loadMap();
  return Object.entries(map).map(([path, v]) => ({ path, ...v }));
}

// PUBLIC: used to re-hydrate preview URLs after reload
export function getAssetDataUrl(path) {
  const map = loadMap();
  return map[path]?.dataUrl || null;
}

// Optional helper for a reset button somewhere
export function clearAllAssets() {
  localStorage.removeItem(LSK);
  localStorage.removeItem(LSK_COUNTER);
}
