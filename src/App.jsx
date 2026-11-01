
import { useAuth } from './context/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const { user, adding } = useAuth();

  return (
    <>
      {user && !adding ? <Dashboard key={user.id} /> : <AuthPage />}
      <Analytics />
    </>
  );
}
