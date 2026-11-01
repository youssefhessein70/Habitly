import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
export default function AccountSwitcher() {
  const { user, accounts, switchTo, removeAccount, startAdd } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <div className="rel">
      <button onClick={() => setOpen(!open)} aria-expanded={open}>Switch account ▾</button>
      {open && <div className="card menu">
        {accounts.map(a => (
          <div key={a.id} className="acc">
            <button className="accmain" onClick={() => { setOpen(false); if (a.id !== user.id) switchTo(a.id) }}>
              <b>{a.name}{a.id === user.id ? ' ✓' : ''}</b><span className="meta">{a.email}</span>
            </button>
            <button className="danger" title="Sign out of this account on this device" onClick={() => removeAccount(a.id)}>✕</button>
          </div>))}
        <button className="p" style={{ width: '100%', marginTop: 6 }} onClick={() => { setOpen(false); startAdd() }}>+ Add another account</button>
      </div>}
    </div>
  );
}
