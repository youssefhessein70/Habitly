// Only http(s) links are accepted (blocks javascript:, data:, etc.)
export const normalizeUrl = u => {
  const s = (u || '').trim(); if (!s) return null;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(s) ? s : 'https://' + s);
    return ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.') ? url.href : null;
  } catch { return null }
};
export const siteName = u => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return u } };
