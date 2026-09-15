import { mergeConfig } from '../config/mergeConfig.js';
import { defaultQRConfig } from '../../types/qr.js';

const KEY = 'qr-studio:designs';
const LAST_KEY = 'qr-studio:last-config';

function isRecord(candidate) {
  return candidate !== null && typeof candidate === 'object' && !Array.isArray(candidate);
}

function normalizeSavedDesign(candidate) {
  if (!isRecord(candidate)) return null;
  if (typeof candidate.id !== 'string' || typeof candidate.name !== 'string') return null;
  if (typeof candidate.createdAt !== 'number' || typeof candidate.updatedAt !== 'number') return null;
  if (!isRecord(candidate.config)) return null;

  return {
    ...candidate,
    config: mergeConfig(defaultQRConfig(), candidate.config),
  };
}

function readSavedDesigns() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map(normalizeSavedDesign).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function writeSavedDesigns(designs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(designs));
    return true;
  } catch {
    return false;
  }
}

export function listDesigns() {
  return readSavedDesigns().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveDesign(name, config) {
  const designs = readSavedDesigns();
  const now = Date.now();
  const entry = {
    id: `d-${now.toString(36)}`,
    name: name.trim() || 'Untitled QR',
    config: JSON.parse(JSON.stringify(config)),
    createdAt: now,
    updatedAt: now,
  };
  designs.push(entry);
  if (!writeSavedDesigns(designs)) throw new Error('Could not save — storage is full or unavailable.');
  return entry;
}

export function deleteDesign(id) {
  writeSavedDesigns(readSavedDesigns().filter((design) => design.id !== id));
}

export function loadLastConfig(fallback) {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    if (!raw) return fallback;
    const savedConfig = JSON.parse(raw);
    if (!savedConfig || typeof savedConfig !== 'object' || Array.isArray(savedConfig)) return fallback;
    return mergeConfig(fallback, savedConfig);
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
