import { useState } from 'react';
import { add, pd, diff, today, wkS, moS, moE } from '../core/dates.js';
import { isPaused } from '../core/engine.js';
import { siteName } from '../core/links.js';
const DN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// Day-by-day list with notes + links shown inline. Browse any week, month or custom range back to the habit's start.
export default function DaysPanel({ h, onCheckIn }) {
  const T = today(), f = h.versions.at(-1).cfg;
  const [mode, setMode] = useState('week');
  const [anchor, setAnchor] = useState(T);
  const [from, setFrom] = useState(add(T, -13)), [to, setTo] = useState(T);
  let a, b;
  if (mode === 'week') { a = wkS(anchor); b = add(a, 6) }
  else if (mode === 'month') { a = moS(anchor); b = moE(anchor) }
  else { a = from <= to ? from : to; b = from <= to ? to : from; if (diff(a, b) > 365) b = add(a, 365) }
  const lo = a > h.start ? a : h.start;
  let hi = b < T ? b : T; if (h.end && h.end < hi) hi = h.end;
  const rows = []; for (let d = hi; d >= lo; d = add(d, -1)) rows.push(d);
  const step = dir => setAnchor(mode === 'week' ? add(a, dir * 7) : dir < 0 ? add(a, -1) : add(b, 1));
  const label = mode === 'week' ? `${a} → ${b}` : pd(a).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const canNext = (mode === 'week' ? add(a, 7) : add(b, 1)) <= T;
  return (
    <div>
      <div className="lbl">Days & notes</div>
      <div className="dnav">
        <div className="tabs" style={{ margin: 0 }}>{[['week', 'Week'], ['month', 'Month'], ['range', 'Custom']].map(([m, t]) =>
          <button key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>{t}</button>)}</div>
        {mode !== 'range' ? <>
          <button onClick={() => step(-1)} aria-label="Previous">◀</button><b>{label}</b>
          <button onClick={() => step(1)} disabled={!canNext} aria-label="Next">▶</button>
          <button onClick={() => setAnchor(T)}>Today</button></>
          : <><input type="date" value={from} max={T} onChange={e => e.target.value && setFrom(e.target.value)} />
            <span>→</span><input type="date" value={to} max={T} onChange={e => e.target.value && setTo(e.target.value)} /></>}
      </div>
      <div className="dpanel">
        {rows.length ? rows.map(d => {
          const on = h.log[d] > 0, n = h.notes?.[d], blocked = isPaused(h, d), dow = pd(d).getDay();
          const sch = f.type === 'daily' || (f.type === 'days' && f.days.includes(dow));
          return (
            <div key={d} className={`drow ${on ? 'on' : ''} ${blocked ? 'pz' : ''}`} role="button" tabIndex={0}
              onClick={() => !blocked && onCheckIn(d)} onKeyDown={e => { if (e.key === 'Enter' && !blocked) onCheckIn(d) }}>
              <div className="dhead"><b>{DN[dow]} {d}</b>{d === T && <span className="tag">today</span>}
                <span className="meta">{on ? '✓ Done' : blocked ? 'Paused' : sch ? 'Scheduled' : ''}</span></div>
              {n?.note && <div className="dnote">{n.note}</div>}
              {n?.links?.map(l => <a key={l.url} className="dlink" href={l.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>🔗 {l.title || siteName(l.url)}</a>)}
            </div>);
        }) : <div className="meta" style={{ padding: 10 }}>No days in this range.</div>}
      </div>
    </div>
  );
}
