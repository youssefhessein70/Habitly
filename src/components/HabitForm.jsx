import { useState } from 'react';
import { today } from '../core/dates.js';
import { DN } from './HabitCard.jsx';
export default function HabitForm({ habit, onSave, onDelete, onClose }) {
  const f0 = habit ? habit.versions.at(-1).cfg : { type: 'daily', days: [1, 3, 5], target: 3, every: 10 };
  const [name, setName] = useState(habit?.name || '');
  const [type, setType] = useState(f0.type);
  const [days, setDays] = useState(f0.days || []);
  const [target, setTarget] = useState(f0.target || 3);
  const [every, setEvery] = useState(f0.every || 10);
  const [start, setStart] = useState(habit?.start || today());
  const [end, setEnd] = useState(habit?.end || '');
  const [err, setErr] = useState('');
  const submit = e => {
    e.preventDefault();
    const t = +target, ev = +every;
    if (!name.trim()) return setErr('Give the habit a name.');
    if (!start) return setErr('Pick a start date.');
    if (end && end < start) return setErr('End date must be after the start date.');
    if (type === 'days' && !days.length) return setErr('Select at least one day.');
    if (type === 'weekly' && !(t >= 1 && t <= 7)) return setErr('Weekly target must be 1–7.');
    if (type === 'monthly' && !(t >= 1 && t <= 31)) return setErr('Monthly target must be 1–31.');
    if (type === 'custom' && !(ev >= 1 && t >= 1 && t <= ev)) return setErr('Target must be between 1 and the period length.');
    const cfg = type === 'daily' ? { type } : type === 'days' ? { type, days: [...days].sort() } : type === 'custom' ? { type, target: t, every: ev } : { type, target: t };
    onSave({ name: name.trim(), start, end: end || null, cfg });
  };
  const tl = { weekly: 'Times per week', monthly: 'Times per month', custom: 'Times per period' }[type];
  return (
    <div className="overlay"><form className="card modal" onSubmit={submit}>
      <b>{habit ? 'Edit habit' : 'New habit'}</b>
      <label className="f">Name</label><input value={name} maxLength={60} onChange={e => setName(e.target.value)} autoFocus />
      <label className="f">Frequency</label>
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="daily">Daily</option><option value="days">Specific days</option><option value="weekly">Weekly target</option>
        <option value="monthly">Monthly target</option><option value="custom">Custom schedule</option></select>
      {type === 'days' && <><label className="f">Days</label><div className="chips">
        {[1, 2, 3, 4, 5, 6, 0].map(d => <label key={d}><input type="checkbox" checked={days.includes(d)}
          onChange={e => setDays(e.target.checked ? [...days, d] : days.filter(x => x !== d))} />{DN[d]}</label>)}</div></>}
      <div className="two">
        {type === 'custom' && <div><label className="f">Period length (days)</label><input type="number" min="1" max="365" value={every} onChange={e => setEvery(e.target.value)} /></div>}
        {tl && <div><label className="f">{tl}</label><input type="number" min="1" max="31" value={target} onChange={e => setTarget(e.target.value)} /></div>}
      </div>
      <div className="two">
        <div><label className="f">Start date</label><input type="date" value={start} onChange={e => setStart(e.target.value)} /></div>
        <div><label className="f">End date (optional)</label><input type="date" value={end} onChange={e => setEnd(e.target.value)} /></div>
      </div>
      <div className="err">{err}</div>
      <div className="acts"><button className="p">Save</button><button type="button" onClick={onClose}>Cancel</button>
        {habit && <><span className="sp" /><button type="button" className="danger" onClick={onDelete}>Delete habit</button></>}</div>
    </form></div>
  );
}
