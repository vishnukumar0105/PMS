import { useEffect, useState } from 'react';
import { HR_MENU_SECTIONS, HR_PAGE_CONTENT, STORAGE_PAGE_KEY } from '../../shared/constants';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import MasterListPage from './pages/MasterListPage';

export default function HRLayout({ userEmail, onLogout }) {
  const [activePage, setActivePage] = useState(() => localStorage.getItem(STORAGE_PAGE_KEY) || 'dashboard');

  useEffect(() => {
    localStorage.setItem(STORAGE_PAGE_KEY, activePage);
  }, [activePage]);

  const current = HR_PAGE_CONTENT[activePage];

  return (
    <div className="hr-app">
      <Sidebar sections={HR_MENU_SECTIONS} activePage={activePage} onNavigate={setActivePage} />
      <main className="hr-main">
        <div className="hr-main-inner container-fluid">
          <div className="hr-top-row">
            <div><p className="hr-breadcrumb">Performance Management / HR Module</p><h3>{activePage === 'dashboard' ? 'Dashboard' : current.title}</h3><p className="hr-subtitle">{activePage === 'dashboard' ? 'HR performance command center' : current.subtitle}</p></div>
            <div className="d-flex gap-2"><span className="badge text-bg-light align-self-center">{userEmail}</span><button type="button" className="btn btn-outline-success" onClick={onLogout}>Logout</button></div>
          </div>
          {activePage === 'dashboard' ? <DashboardPage /> : activePage === 'master-list' ? <MasterListPage /> : <div className="hr-placeholder-card"><h4>{current.title}</h4><p>{current.description}</p></div>}
        </div>
      </main>
    </div>
  );
}
