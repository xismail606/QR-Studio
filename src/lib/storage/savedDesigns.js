const KEY = 'qr-studio:designs';
const LAST_KEY = 'qr-studio:last-config';

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeAll(designs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(designs));
    return true;
  } catch {
    return false;
  }
}

export function listDesigns() {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveDesign(name, config) {
  const designs = readAll();
  const now = Date.now();
  const entry = {
    id: `d-${now.toString(36)}`,
    name: name.trim() || 'Untitled QR',
    config: JSON.parse(JSON.stringify(config)),
    createdAt: now,
    updatedAt: now,
  };
  designs.push(entry);
  if (!writeAll(designs)) throw new Error('Could not save — storage is full or unavailable.');
  return entry;
}

export function deleteDesign(id) {
  writeAll(readAll().filter((d) => d.id !== id));
}

export function loadLastConfig(fallback) {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

export function persistLastConfig(config) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(config));
  } catch {
    /* private mode — ignore */
  }
}

export function clearLastConfig() {
  try {
    localStorage.removeItem(LAST_KEY);
  } catch {
    /* ignore */
  }
}
