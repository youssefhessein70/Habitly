import { useState } from 'react';
export default function PauseModal({ h, onConfirm, onClose }) {
  const [reason, setReason] = useState('');
  return (
    <div className="overlay"><form className="card modal" onSubmit={e => { e.preventDefault(); onConfirm(reason.trim()) }}>
      <b>Pause “{h.name}”</b>
      <p className="meta">Paused days won’t count as missed. You can resume anytime.</p>
      <label className="f">Reason (optional)</label>
      <input value={reason} maxLength={80} placeholder="e.g. busy at work" onChange={e => setReason(e.target.value)} autoFocus />
      <div className="acts"><button className="p">Pause from today</button><button type="button" onClick={onClose}>Cancel</button></div>
    </form></div>
  );
}
