import { createContext, useContext, useState } from 'react';
import * as auth from '../core/auth.js';
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => auth.currentUser());
  const [accounts, setAccounts] = useState(() => auth.listAccounts());
  const [adding, setAdding] = useState(false);
  const sync = () => { setUser(auth.currentUser()); setAccounts(auth.listAccounts()); setAdding(false) };
  const value = {
    user, accounts, adding,
    startAdd: () => setAdding(true), cancelAdd: () => setAdding(false),
    register: async d => { await auth.register(d); sync() },
    login: async d => { await auth.login(d); sync() },
    logout: () => { auth.logout(); sync() },
    switchTo: id => { auth.switchTo(id); sync() },
    removeAccount: id => { auth.removeAccount(id); sync() },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
