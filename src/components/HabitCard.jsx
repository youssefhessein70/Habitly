import { periods, stats, isPaused } from '../core/engine.js';
import DaysPanel from './DaysPanel.jsx';
import { add, pd, diff, today } from '../core/dates.js';
export const DN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const unit = t => ({ daily: 'day', days: 'day', weekly: 'week', monthly: 'month', custom: 'period' }[t]);
export const label = f => f.type === 'daily' ? 'Every day' : f.type === 'days' ? f.days.map(d => DN[d]).join(', ') : f.type === 'weekly' ? `${f.target}× per week` : f.type === 'monthly' ? `${f.target}× per month` : `${f.target}× every ${f.every} days`;

export const isFinished = h => !!h.completed || !!(h.end && h.end < today());

export default function HabitCard({ h, onCheckIn, onPause, onEdit, onDelete, onComplete, onReopen, onHistory }) {
  const T = today(), ps = periods(h), st = stats(h, ps), f = h.versions.at(-1).cfg;
  const fin = isFinished(h), paused = !fin && isPaused(h, T), u = unit(f.type), c = st.cur;
  const cp = h.pauses.find(p => !p.to || (p.from <= T && T <= p.to));
  const pauseInfo = cp ? `Paused since ${cp.from} · ${diff(cp.from, T) + 1} day(s)${cp.reason ? ' · ' + cp.reason : ''}` : 'Paused';
  let prog;
  if (fin) prog = <div className="meta" style={{ marginTop: 8 }}>Completed{h.end ? ' · ended ' + h.end : ''}</div>;
  else if (c) {
    const pct = Math.min(100, Math.round(100 * c.count / c.target)), left = c.target - c.count, dl = diff(T, c.e) + 1;
    const note = c.status === 'done' ? `Goal met for this ${u}` : left > dl ? `Needs ${left}, only ${dl} day${dl > 1 ? 's' : ''} left` : `${left} more in ${dl} day${dl > 1 ? 's' : ''}`;
    prog = <><div className="prog"><i className={c.status === 'done' ? 'd' : ''} style={{ width: pct + '%' }} /></div>
      <div className="row"><span>This {u}: <b>{c.count}/{c.target}</b> · {pct}% · in progress</span><span>{note}</span></div></>;
  } else prog = <div className="meta" style={{ marginTop: 8 }}>{paused ? pauseInfo : f.type === 'days' ? 'Not scheduled today' : h.start > T ? 'Starts ' + h.start : 'No active period'}</div>;
  return (
    <div className={'card' + (paused || fin ? ' off' : '')}>
      <div className="top"><div>
        <span className="name">{h.name}</span>{paused && <span className="tag">paused</span>}{fin && <span className="tag">completed</span>}
        <div className="meta">{label(f)} · from {h.start}{h.end ? ' to ' + h.end : ''}{h.versions.length > 1 ? ` · ${h.versions.length} goal versions` : ''}</div></div>
        <button className={h.log[T] > 0 ? 'p' : ''} disabled={paused || fin} onClick={() => onCheckIn(T)}>{h.log[T] > 0 ? '✓ Done today' : 'Mark today'}</button></div>
      {prog}
      <div className="stats">
        <div><b>{st.streak}</b><span>{u} goal streak</span></div><div><b>{st.best}</b><span>best {u} streak</span></div>
        <div><b>{st.rate == null ? '—' : st.rate + '%'}</b><span>{st.done}/{st.done + st.missed} periods hit</span></div><div><b>{st.dayStreak}</b><span>day streak</span></div></div>
      <DaysPanel h={h} onCheckIn={onCheckIn} />
      <div className="lbl">Recent periods</div>
      <div className="dots">{ps.length ? ps.slice(-14).map((p, i) => <span key={i} className={'dot ' + p.status} title={`${p.s}${p.s !== p.e ? ' → ' + p.e : ''}: ${p.count}/${p.target} (${p.status})`} />) : <span className="meta">No periods yet</span>}</div>
      <div className="acts"><button onClick={onEdit}>Edit goal</button><button onClick={onHistory}>History</button>{fin ? <button onClick={onReopen}>Reopen</button> : <><button onClick={onPause}>{paused ? 'Resume' : 'Pause'}</button><button onClick={onComplete}>Complete</button></>}<button className="danger" onClick={onDelete}>Delete</button></div>
    </div>
  );
}
