// Content types registry — add wifi/email/phone later as new entries.

function validateUrl(value) {
  if (!value.trim()) return 'Enter a URL to generate your QR code.';
  try {
    const withProto = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const u = new URL(withProto);
    if (!u.hostname.includes('.')) return 'That URL looks incomplete — add a domain like example.com.';
    return null;
  } catch {
    return 'Enter a valid URL, e.g. https://example.com.';
  }
}

function validateText(value) {
  if (!value.trim()) return 'Enter some text to generate your QR code.';
  if (value.length > 4000) return `Text is too long (${value.length}/4000). Shorten it.`;
  return null;
}

export const CONTENT_TYPES = {
  url: {
    id: 'url',
    label: 'URL',
    placeholder: 'https://example.com',
    validate: validateUrl,
    encode: (v) => (/^https?:\/\//i.test(v.trim()) ? v.trim() : `https://${v.trim()}`),
  },
  text: {
    id: 'text',
    label: 'Text',
    placeholder: 'Hello from QR Studio…',
    validate: validateText,
    encode: (v) => v,
  },
};

export function validateContent(config) {
  return CONTENT_TYPES[config.content.type].validate(config.content.value);
}

export function encodeContent(config) {
  const raw = config.content.value.trim();
  if (!raw) return '';
  return CONTENT_TYPES[config.content.type].encode(raw);
}
