function isRecord(candidate) {
  return candidate !== null && typeof candidate === 'object' && !Array.isArray(candidate);
}

function mergeRecord(baseConfig, patch) {
  const mergedConfig = { ...baseConfig };

  for (const key of Object.keys(patch)) {
    if (!(key in baseConfig)) continue;

    const baseValue = baseConfig[key];
    const patchValue = patch[key];

    if (isRecord(baseValue)) {
      if (!isRecord(patchValue)) continue;
      mergedConfig[key] = mergeRecord(baseValue, patchValue);
      continue;
    }

    if (patchValue !== null && typeof patchValue === 'object') continue;
    mergedConfig[key] = patchValue;
  }

  return mergedConfig;
}

export function mergeConfig(baseConfig, patch) {
  if (!isRecord(baseConfig) || !isRecord(patch)) return baseConfig;
  return mergeRecord(baseConfig, patch);
}
