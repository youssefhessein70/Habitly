import { useState } from 'react';
import { loadHabits, saveHabit, saveIndex, removeHabit } from '../core/storage.js';
export function useHabits(uid) {
  const [habits, setHabits] = useState(() => loadHabits(uid));
  const commit = next => { saveIndex(uid, next); setHabits(next) };
  const create = ({ name, start, end, cfg, history }) => ({ id: crypto.randomUUID(), name, start, end, completed: false, history: history || [], pauses: [], log: {}, versions: [{ from: start, cfg }] });
  return {
    habits,
    add: d => { const h = create(d); saveHabit(uid, h); commit([...habits, h]) },
    update: (id, fn) => {
      const h = structuredClone(habits.find(x => x.id === id)); fn(h); saveHabit(uid, h);
      setHabits(hs => hs.map(x => x.id === id ? h : x));
    },
    remove: id => { removeHabit(uid, id); commit(habits.filter(h => h.id !== id)) },
  };
}
