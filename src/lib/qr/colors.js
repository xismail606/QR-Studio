export function getContrastTextColor(hex) {
  if (!hex || hex === 'transparent') return '#ffffff';

  let normalizedHex = hex.replace('#', '');
  if (normalizedHex.length === 3) {
    normalizedHex = normalizedHex.split('').map((channel) => channel + channel).join('');
  }

  const red = parseInt(normalizedHex.substring(0, 2), 16) || 0;
  const green = parseInt(normalizedHex.substring(2, 4), 16) || 0;
  const blue = parseInt(normalizedHex.substring(4, 6), 16) || 0;
  const yiq = (red * 299 + green * 587 + blue * 114) / 1000;
  return yiq >= 140 ? '#0f172a' : '#ffffff';
}
