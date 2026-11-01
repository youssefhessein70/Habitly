import { useState } from 'react';
import { normalizeUrl, siteName } from '../core/links.js';
export default function CheckInModal({ h, date, onSave, onUnmark, onClose }) {
  const done = h.log[date] > 0, prev = h.notes?.[date];
  const [note, setNote] = useState(prev?.note || '');
  const [links, setLinks] = useState(prev?.links || []);
  const [url, setUrl] = useState(''); const [title, setTitle] = useState(''); const [err, setErr] = useState('');
  const addLink = () => {
    if (!url.trim()) return links;
    const n = normalizeUrl(url);
    if (!n) { setErr('Enter a valid http(s) link, e.g. https://trello.com/c/…'); return null }
    setErr(''); setUrl(''); setTitle('');
    const next = links.some(l => l.url === n) ? links : [...links, { url: n, title: title.trim() }];
    setLinks(next); return next;
  };
  const submit = e => {
    e.preventDefault();
    const next = addLink(); if (!next) return;      // also picks up a link typed but not yet added
    onSave({ note: note.trim(), links: next });
  };
  return (
    <div className="overlay"><form className="card modal" onSubmit={submit}>
      <b>{h.name} · {date}</b>
      <label className="f">Notes</label>
      <textarea value={note} maxLength={1000} placeholder="What did you do today?" onChange={e => setNote(e.target.value)} autoFocus />
      <label className="f">Task links (Trello, GitHub, Jira…)</label>
      {links.map(l => <div key={l.url} className="lk"><a href={l.url} target="_blank" rel="noopener noreferrer">{l.title || siteName(l.url)}</a>
        <span className="sp" /><button type="button" className="danger" onClick={() => setLinks(links.filter(x => x !== l))}>✕</button></div>)}
      <div className="two"><input value={url} placeholder="trello.com/c/…" onChange={e => setUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLink() } }} />
        <input value={title} placeholder="Title (optional)" onChange={e => setTitle(e.target.value)} /></div>
      <button type="button" style={{ marginTop: 6 }} onClick={addLink}>+ Add link</button>
      <div className="err">{err}</div>
      <div className="acts"><button className="p">{done ? 'Save' : 'Mark done'}</button><button type="button" onClick={onClose}>Cancel</button>
        {done && <><span className="sp" /><button type="button" className="danger" onClick={onUnmark}>Unmark</button></>}</div>
    </form></div>
  );
}
