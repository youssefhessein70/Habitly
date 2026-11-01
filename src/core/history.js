// Per-habit activity log (like an order timeline): every change appends an event.
export const ev = (type, text, changes) => ({ at: new Date().toISOString(), type, text, ...(changes?.length ? { changes } : {}) });
export const log = (h, type, text, changes) => { (h.history ??= []).push(ev(type, text, changes)) };
