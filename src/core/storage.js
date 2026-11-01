// ht:{userId}:idx  and  ht:{userId}:h:{habitId}  → each habit stored independently
const ld = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f } catch { return f } };
const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} };
export const loadHabits = uid => ld(`ht:${uid}:idx`, []).map(id => ld(`ht:${uid}:h:${id}`, null)).filter(Boolean);
export const saveHabit = (uid, h) => sv(`ht:${uid}:h:${h.id}`, h);
export const saveIndex = (uid, hs) => sv(`ht:${uid}:idx`, hs.map(h => h.id));
export const removeHabit = (uid, id) => { try { localStorage.removeItem(`ht:${uid}:h:${id}`) } catch {} };
