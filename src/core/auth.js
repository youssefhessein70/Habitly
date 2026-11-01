// Client-side accounts (localStorage). Passwords are salted + SHA-256 hashed.
// Demo-grade only: real security needs a backend.
// ht:accounts = ids signed in on this device, ht:session = the active one.
const ld = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f } catch { return f } };
const sv = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const hash = async (pw, salt) => {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + pw));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
};
const pub = u => ({ id: u.id, name: u.name, email: u.email });
const users = () => ld('ht:users', []);
const ids = () => ld('ht:accounts', []);
const remember = id => { const a = ids(); if (!a.includes(id)) sv('ht:accounts', [...a, id]) };
export function currentUser() {
  const u = users().find(x => x.id === ld('ht:session', null));
  if (!u) return null;
  remember(u.id); return pub(u);
}
export const listAccounts = () => ids().map(id => users().find(u => u.id === id)).filter(Boolean).map(pub);
export async function register({ name, email, password }) {
  const all = users(); email = email.trim().toLowerCase();
  if (all.some(u => u.email === email)) throw new Error('This email is already registered.');
  const salt = crypto.randomUUID();
  const u = { id: crypto.randomUUID(), name: name.trim(), email, salt, hash: await hash(password, salt) };
  sv('ht:users', [...all, u]); sv('ht:session', u.id); remember(u.id); return pub(u);
}
export async function login({ email, password }) {
  const u = users().find(x => x.email === email.trim().toLowerCase());
  if (!u || u.hash !== await hash(password, u.salt)) throw new Error('Wrong email or password.');
  sv('ht:session', u.id); remember(u.id); return pub(u);
}
export function switchTo(id) { if (ids().includes(id)) sv('ht:session', id) }
export function removeAccount(id) {
  const rest = ids().filter(x => x !== id); sv('ht:accounts', rest);
  if (ld('ht:session', null) === id) { if (rest.length) sv('ht:session', rest[0]); else localStorage.removeItem('ht:session') }
}
export const logout = () => removeAccount(ld('ht:session', null));
