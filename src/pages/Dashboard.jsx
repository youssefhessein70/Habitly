import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useHabits } from '../hooks/useHabits.js';
import { changeCfg, isPaused } from '../core/engine.js';
import { log, ev } from '../core/history.js';
import { add, diff } from '../core/dates.js';
import { useToday } from '../hooks/useToday.js';
import HabitCard, { isFinished, label } from '../components/HabitCard.jsx';
import HabitForm from '../components/HabitForm.jsx';
import CheckInModal from '../components/CheckInModal.jsx';
import HistoryModal from '../components/HistoryModal.jsx';
import PauseModal from '../components/PauseModal.jsx';
import Logo from '../components/Logo.jsx';
import AccountSwitcher from '../components/AccountSwitcher.jsx';
import Confirm from '../components/Confirm.jsx';
const EMPTY = { active: 'No active habits. Add one with “+ New habit”.', paused: 'Nothing is paused right now.', completed: 'No completed habits yet.' };
export default function Dashboard() {
  const { user, logout } = useAuth();
  const { habits, add: addHabit, update, remove } = useHabits(user.id);
  const [tab, setTab] = useState('active');
  const [form, setForm] = useState(null);     // { habit } | null
  const [del, setDel] = useState(null);       // habit | null
  const [pausing, setPausing] = useState(null);
  const [ci, setCi] = useState(null);         // { id, date } check-in modal
  const [hist, setHist] = useState(null);     // habit id (live, so new events show up)
  const T = useToday();
  const saveCheckIn = (h, d, { note, links }) => update(h.id, x => {
    const was = x.log[d] > 0, prev = x.notes?.[d], has = !!note || links.length > 0;
    x.log[d] = 1; x.notes ??= {};
    if (has) x.notes[d] = { note, links }; else delete x.notes[d];
    if (was && !has && !prev) return;
    const ch = []; if (note) ch.push('Note: ' + (note.length > 80 ? note.slice(0, 80) + '…' : note)); links.forEach(l => ch.push('Link: ' + l.url));
    log(x, has ? 'note' : 'checkin', was ? (has ? `Note updated for ${d}` : `Note cleared for ${d}`) : (has ? `Marked done for ${d} with note` : `Marked done for ${d}`), ch);
  });
  const unmark = (h, d) => update(h.id, x => {
    delete x.log[d]; const had = x.notes?.[d]; if (had) delete x.notes[d];
    log(x, 'checkin', `Unmarked ${d}${had ? ' (note removed)' : ''}`);
  });
  const pause = (h, reason) => update(h.id, x => {
    x.pauses.push({ from: T, to: null, ...(reason ? { reason } : {}) });
    log(x, 'paused', reason ? `Paused from ${T} · ${reason}` : `Paused from ${T}`);
  });
  const resume = h => update(h.id, x => {
    const p = x.pauses.find(p => !p.to || p.to >= T); if (!p) return;
    const days = diff(p.from, T);
    p.to = add(T, -1); if (p.to < p.from) x.pauses.splice(x.pauses.indexOf(p), 1);
    log(x, 'resumed', `Resumed on ${T} after ${days} day${days === 1 ? '' : 's'} paused`);
  });
  // completing freezes the habit at today so later periods never count as missed
  const complete = h => update(h.id, x => { x.completed = true; if (!x.end || x.end > T) x.end = T; log(x, 'completed', `Marked as completed (ended ${x.end})`) });
  const reopen = h => update(h.id, x => { x.completed = false; x.end = null; log(x, 'reopened', 'Reopened, end date cleared') });
  const save = d => {
    const h0 = form.habit;
    if (!h0) { addHabit({ ...d, history: [ev('created', `Created · ${label(d.cfg)} · starts ${d.start}`)] }); return setForm(null) }
    const ch = [], oc = h0.versions.at(-1).cfg;
    if (h0.name !== d.name) ch.push(`Name: “${h0.name}” → “${d.name}”`);
    if (h0.start !== d.start) ch.push(`Start date: ${h0.start} → ${d.start}`);
    if ((h0.end || null) !== d.end) ch.push(`End date: ${h0.end || 'none'} → ${d.end || 'none'}`);
    if (label(oc) !== label(d.cfg)) ch.push(`Goal: ${label(oc)} → ${label(d.cfg)}`);
    update(h0.id, h => {
      h.name = d.name; h.end = d.end; h.start = d.start;
      if (h.versions[0].from !== d.start && (!h.versions[1] || d.start < h.versions[1].from)) h.versions[0].from = d.start;
      changeCfg(h, d.cfg);
      if (ch.length) log(h, 'edited', 'Habit edited', ch);
    });
    setForm(null);
  };
  const lists = {
    active: habits.filter(h => !isFinished(h) && !isPaused(h, T)),
    paused: habits.filter(h => !isFinished(h) && isPaused(h, T)),
    completed: habits.filter(isFinished),
  };
  const card = h => <HabitCard key={h.id} h={h} onCheckIn={d => setCi({ id: h.id, date: d })} onEdit={() => setForm({ habit: h })} onDelete={() => setDel(h)}
    onPause={() => isPaused(h, T) ? resume(h) : setPausing(h)} onComplete={() => complete(h)} onReopen={() => reopen(h)} onHistory={() => setHist(h.id)} />;
  return (
    <main>
      <div className="hdr"><div><Logo /><p className="sub" style={{ margin: 0 }}>Signed in as {user.name}</p></div>
        <div className="acts" style={{ margin: 0 }}><AccountSwitcher /><button onClick={logout}>Log out</button></div></div>
      <div className="bar"><button className="p" onClick={() => setForm({ habit: null })}>+ New habit</button></div>
      <div className="tabs">{['active', 'paused', 'completed'].map(t =>
        <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)} ({lists[t].length})</button>)}</div>
      {lists[tab].length ? lists[tab].map(card) : <div className="empty">{EMPTY[tab]}</div>}
      {form && <HabitForm habit={form.habit} onSave={save} onClose={() => setForm(null)} onDelete={() => { setDel(form.habit); setForm(null) }} />}
      {pausing && <PauseModal h={pausing} onClose={() => setPausing(null)} onConfirm={r => { pause(pausing, r); setPausing(null) }} />}
      {hist && habits.find(h => h.id === hist) && <HistoryModal h={habits.find(h => h.id === hist)} onClose={() => setHist(null)} />}
      {ci && habits.find(h => h.id === ci.id) && <CheckInModal key={ci.id + ci.date} h={habits.find(h => h.id === ci.id)} date={ci.date} onClose={() => setCi(null)}
        onSave={d => { saveCheckIn(habits.find(h => h.id === ci.id), ci.date, d); setCi(null) }}
        onUnmark={() => { unmark(habits.find(h => h.id === ci.id), ci.date); setCi(null) }} />}
      {del && <Confirm text={`Delete “${del.name}” and all its history?`} onYes={() => { remove(del.id); setDel(null) }} onNo={() => setDel(null)} />}
    </main>
  );
}
