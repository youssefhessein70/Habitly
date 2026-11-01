import { useEffect, useState } from 'react';
import { today } from '../core/dates.js';
// Returns today's date and re-renders at midnight (and when the tab/app comes back into view).
export function useToday() {
  const [t, setT] = useState(today());
  useEffect(() => {
    let id;
    const check = () => setT(today());
    const schedule = () => {
      const n = new Date(), next = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 0, 0, 1);
      id = setTimeout(() => { check(); schedule() }, next - n);
    };
    const vis = () => { if (document.visibilityState === 'visible') check() };
    schedule();
    document.addEventListener('visibilitychange', vis); window.addEventListener('focus', check);
    return () => { clearTimeout(id); document.removeEventListener('visibilitychange', vis); window.removeEventListener('focus', check) };
  }, []);
  return t;
}
