import { useState } from 'react';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
export default function AuthPage() {
  const { login, register, user, cancelAdd } = useAuth();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const reg = mode === 'register';
  const submit = async e => {
    e.preventDefault(); setErr('');
    if (reg && !f.name.trim()) return setErr('Enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr('Enter a valid email.');
    if (f.password.length < 6) return setErr('Password must be at least 6 characters.');
    if (reg && f.password !== f.confirm) return setErr('Passwords do not match.');
    setBusy(true);
    try { await (reg ? register(f) : login(f)) } catch (x) { setErr(x.message); setBusy(false) }
  };
  return (
    <main><form className="card auth" onSubmit={submit}>
      <Logo size={48} />
      <h1 style={{ marginTop: 14 }}>{reg ? 'Create account' : 'Welcome back'}</h1>
      <p className="sub">{reg ? 'Each account keeps its own habits.' : 'Sign in to your habits.'}</p>
      {reg && <><label className="f">Name</label><input value={f.name} onChange={set('name')} autoComplete="name" /></>}
      <label className="f">Email</label><input type="email" name="email" value={f.email} onChange={set('email')} autoComplete="username" />
      <label className="f">Password</label><input type="password" name="password" value={f.password} onChange={set('password')} autoComplete={reg ? 'new-password' : 'current-password'} />
      {reg && <><label className="f">Confirm password</label><input type="password" value={f.confirm} onChange={set('confirm')} autoComplete="new-password" /></>}
      <div className="err">{err}</div>
      <div className="acts"><button className="p" disabled={busy}>{reg ? 'Register' : 'Log in'}</button>
        <button type="button" className="link" onClick={() => { setMode(reg ? 'login' : 'register'); setErr('') }}>
          {reg ? 'Have an account? Log in' : 'No account? Register'}</button>
        {user && <button type="button" onClick={cancelAdd}>Cancel</button>}</div>
    </form></main>
  );
}
