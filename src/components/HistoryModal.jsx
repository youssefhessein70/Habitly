import { useState } from 'react';
const NAMES = { created: 'Created', edited: 'Edited', paused: 'Paused', resumed: 'Resumed', completed: 'Completed', reopened: 'Reopened', checkin: 'Check-in', note: 'Note' };
export default function HistoryModal({ h, onClose }) {
  const [all, setAll] = useState(false);
  const events = [...(h.history || [])].reverse().filter(e => all || e.type !== 'checkin');
  return (
    <div className="overlay"><div className="card modal">
      <div className="top"><b>History · {h.name}</b><button onClick={onClose}>Close</button></div>
      <label className="meta" style={{ display: 'block', margin: '10px 0' }}><input type="checkbox" checked={all} onChange={e => setAll(e.target.checked)} /> Show daily check-ins</label>
      {events.length ? events.map((e, i) => (
        <div key={i} className={'ev ' + e.type}>
          <b>{NAMES[e.type] || e.type}</b> <small>{new Date(e.at).toLocaleString()}</small>
          <div>{e.text}</div>
          {e.changes && <ul>{e.changes.map((c, j) => <li key={j}>{c}</li>)}</ul>}
        </div>)) : <div className="meta">No history recorded yet.</div>}
    </div></div>
  );
}
