import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defaultQRConfig } from '@/types/qr.js';
import { loadLastConfig, persistLastConfig, clearLastConfig } from '@/lib/storage/savedDesigns.js';
import { applyPreset } from '@/lib/presets/presets.js';
import { randomizeVisuals } from '@/lib/presets/randomize.js';

const HISTORY_LIMIT = 50;
const SLIDER_DEBOUNCE_MS = 200;

function mergeDeep(base, patch) {
  const out = { ...base };
  for (const k of Object.keys(patch)) {
    const v = patch[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = { ...(base[k] ?? {}), ...v };
    else out[k] = v;
  }
  return out;
}

export function useQRConfig() {
  const [config, setConfig] = useState(() => loadLastConfig(defaultQRConfig()));
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // Mirrors keep history ops pure (no setState-inside-updater, StrictMode-safe).
  const configRef = useRef(config);
  const pastRef = useRef([]);
  const futureRef = useRef([]);
  configRef.current = config;
  const timer = useRef(null);

  useEffect(() => {
    persistLastConfig(config);
  }, [config]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const pushHistory = useCallback(() => {
    pastRef.current = [...pastRef.current.slice(-(HISTORY_LIMIT - 1)), configRef.current];
    futureRef.current = [];
    setPast(pastRef.current);
    setFuture([]);
  }, []);

  const commit = useCallback((next) => {
    pushHistory();
    configRef.current = next;
    setConfig(next);
  }, [pushHistory]);

  // Debounced: sliders, text inputs, color drags.
  const update = useCallback((patch) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      pushHistory();
      const next = mergeDeep(configRef.current, patch);
      configRef.current = next;
      setConfig(next);
    }, SLIDER_DEBOUNCE_MS);
  }, [pushHistory]);

  // Immediate: segmented picks, toggles, file ops.
  const updateNow = useCallback((patch) => {
    if (timer.current) clearTimeout(timer.current);
    pushHistory();
    const next = mergeDeep(configRef.current, patch);
    configRef.current = next;
    setConfig(next);
  }, [pushHistory]);

  const undo = useCallback(() => {
    const p = pastRef.current;
    if (!p.length) return;
    const prev = p[p.length - 1];
    pastRef.current = p.slice(0, -1);
    futureRef.current = [configRef.current, ...futureRef.current].slice(0, HISTORY_LIMIT);
    configRef.current = prev;
    setPast(pastRef.current);
    setFuture(futureRef.current);
    setConfig(prev);
  }, []);

  const redo = useCallback(() => {
    const f = futureRef.current;
    if (!f.length) return;
    const [next, ...rest] = f;
    pastRef.current = [...pastRef.current.slice(-(HISTORY_LIMIT - 1)), configRef.current];
    futureRef.current = rest;
    configRef.current = next;
    setPast(pastRef.current);
    setFuture(futureRef.current);
    setConfig(next);
  }, []);

  const applyPresetById = useCallback((id) => {
    commit(applyPreset(configRef.current, id));
  }, [commit]);

  const randomize = useCallback(() => {
    commit(randomizeVisuals(configRef.current));
  }, [commit]);

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    clearLastConfig();
    pastRef.current = [];
    futureRef.current = [];
    setPast([]);
    setFuture([]);
    const fresh = defaultQRConfig();
    configRef.current = fresh;
    setConfig(fresh);
  }, []);

  const loadConfig = useCallback((next) => {
    commit(JSON.parse(JSON.stringify(next)));
  }, [commit]);

  return useMemo(() => ({
    config,
    update,
    updateNow,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    applyPresetById,
    randomize,
    reset,
    loadConfig,
  }), [config, update, updateNow, undo, redo, past.length, future.length, applyPresetById, randomize, reset, loadConfig]);
}
