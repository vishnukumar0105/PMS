import { useMemo, useState } from 'react';
import Login from './features/auth/Login';
import UnderConstruction from './features/shared/UnderConstruction';
import HRLayout from './features/hr/HRLayout';
import { USERS, STORAGE_KEY } from './shared/constants';

export default function App() {
  const [loggedInEmail, setLoggedInEmail] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const currentUser = useMemo(() => (loggedInEmail ? USERS[loggedInEmail] : null), [loggedInEmail]);

  const handleLogin = (email) => {
    localStorage.setItem(STORAGE_KEY, email);
    setLoggedInEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('pms_hr_active_page');
    setLoggedInEmail('');
  };

  if (!currentUser) return <Login onLogin={handleLogin} />;
  if (currentUser.key !== 'hr') return <UnderConstruction role={currentUser.role} onLogout={handleLogout} />;
  return <HRLayout userEmail={loggedInEmail} onLogout={handleLogout} />;
}
