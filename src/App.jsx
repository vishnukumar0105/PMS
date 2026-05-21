import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'pms_auth_email';
const STORAGE_PAGE_KEY = 'pms_hr_active_page';

const USERS = {
  'vishnukumar.j@informationevolution.com': { role: 'Employee', key: 'employee' },
  'hr@informationevolution.com': { role: 'HR', key: 'hr' },
  'mathiselvam@informationevolution.com': { role: 'TL', key: 'tl' },
  'samsul@informationevolution.com': { role: 'Manager', key: 'manager' },
  'arfath@informationevolution.com': { role: 'CPO', key: 'cpo' }
};

const menuSections = [
  {
    title: 'MAIN',
    items: [
      { key: 'dashboard', icon: '⊞', label: 'Dashboard' },
      { key: 'master-list', icon: '☰', label: 'Master List' },
      { key: 'upcoming-review-list', icon: '🗓', label: 'Upcoming Review List', badge: 19 },
      { key: 'review-approval-list', icon: '✓', label: 'Review Approval List', badge: 5 },
      { key: 'discussion-list', icon: '💬', label: 'Discussion List' }
    ]
  },
  {
    title: 'APPRAISAL',
    items: [
      { key: 'appraisal-list', icon: '📋', label: 'Appraisal List' },
      { key: 'beneficiary-list', icon: '🎯', label: 'Beneficiary List' }
    ]
  },
  {
    title: 'RECORDS',
    items: [
      { key: 'attendance', icon: '📊', label: 'Attendance' },
      { key: 'pa-scores', icon: '📈', label: 'PA Scores' },
      { key: 'star-performance-awards', icon: '⭐', label: 'Star Performance Awards' },
      { key: 'feedback-forms', icon: '📝', label: 'Feedback Forms' },
      { key: 'review-history', icon: '🕘', label: 'Review History' }
    ]
  },
  {
    title: 'ADMIN',
    items: [{ key: 'configuration', icon: '⚙', label: 'Configuration' }]
  }
];

const pageContent = {
  'master-list': { title: 'Master List', subtitle: 'Employee profile index', description: 'Search and maintain employee appraisal records.' },
  'upcoming-review-list': { title: 'Upcoming Review List', subtitle: 'Review schedule planner', description: 'View upcoming due dates and launch review workflow actions.' },
  'review-approval-list': { title: 'Review Approval List', subtitle: 'Approval queue monitor', description: 'Manage pending approvals and escalation timelines.' },
  'discussion-list': { title: 'Discussion List', subtitle: 'Discussion tracking', description: 'Schedule review discussions and capture HR comments.' },
  'appraisal-list': { title: 'Appraisal List', subtitle: 'Compensation recommendations', description: 'Prepare recommendations and send to CPO.' },
  'beneficiary-list': { title: 'Beneficiary List', subtitle: 'Approved benefit roster', description: 'Track approved increments and acknowledgement.' },
  attendance: { title: 'Attendance', subtitle: 'Attendance intelligence', description: 'Monitor attendance trends and threshold violations.' },
  'pa-scores': { title: 'PA Scores', subtitle: 'Performance trend analysis', description: 'Analyze PA trajectory by team and employee.' },
  'star-performance-awards': { title: 'Star Performance Awards', subtitle: 'Recognition ledger', description: 'Review monthly recognition awards.' },
  'feedback-forms': { title: 'Feedback Forms', subtitle: 'Template and submission hub', description: 'Manage form templates and completion rates.' },
  'review-history': { title: 'Review History', subtitle: 'Historical review archive', description: 'Access complete appraisal chronology.' },
  configuration: { title: 'Configuration', subtitle: 'HR policy controls', description: 'Configure probation and review-cycle policies.' }
};

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (USERS[normalized]) {
      setError('');
      onLogin(normalized);
      return;
    }
    setError('Email not authorized. Please use one of the 5 allowed Information Evolution IDs.');
  };

  return (
    <div className="login-page">
      <div className="login-card card border-0 shadow">
        <div className="card-body p-4 p-md-5">
          <h1 className="h4 mb-2">PMS Login</h1>
          <p className="text-secondary mb-4">Enter your official email ID to continue.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="form-label">Email ID</label>
            <input id="email" className="form-control form-control-lg" placeholder="name@informationevolution.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {error ? <div className="text-danger small mt-2">{error}</div> : null}
            <button className="btn btn-success w-100 mt-4" type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function UnderConstruction({ role, onLogout }) {
  return (
    <div className="uc-page">
      <div className="card border-0 shadow-sm p-4">
        <h2 className="h4 mb-2">{role} Module</h2>
        <p className="text-secondary mb-3">Under construction. This screen will be available soon.</p>
        <button className="btn btn-outline-success" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

function Dashboard() {
  const attendanceBars = [65, 70, 62, 75, 79, 73, 68, 84, 78, 90, 82, 88];
  const perfLine = [68, 71, 73, 76, 78, 80, 81, 84, 86, 85, 87];

  return (
    <>
      <div className="welcome-row">
        <div className="welcome-avatar">DN</div>
        <div>
          <h2>Welcome, HR Name 1</h2>
          <p>HR Manager · Thu May 21 2026</p>
        </div>
      </div>

      <div className="metric-grid">
        {[
          ['Total Employees', '', '650', ''],
          ['Upcoming Review', 'June', '19', '3 due in 7 days'],
          ['Review Completed', 'May', '10', ''],
          ['Under Review', 'May', '26', ''],
          ['Review In Progress', 'May', '16', ''],
          ['Appraisal Beneficiary', 'May', '16', '']
        ].map(([label, month, value, warning]) => (
          <div className="metric-card" key={label}>
            <p className="mc-label">{label}</p>
            {month ? <p className="mc-month">{month}</p> : null}
            <h3>{value}</h3>
            <button type="button" className="btn btn-link p-0 mc-link">View Detail</button>
            {warning ? <div className="mc-warning">⚠ {warning}</div> : null}
          </div>
        ))}
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h4>Employee allocation</h4>
          <div className="donut-wrap">
            <div className="donut" />
            <ul>
              <li><span className="dot d1" />IR (40%)</li><li><span className="dot d2" />TR (20%)</li><li><span className="dot d3" />IT (15%)</li>
              <li><span className="dot d4" />HR (5%)</li><li><span className="dot d5" />Finance (10%)</li><li><span className="dot d6" />IT-Admin (10%)</li>
            </ul>
          </div>
        </div>

        <div className="chart-card">
          <div className="d-flex justify-content-between align-items-center mb-3"><h4>Overall Employee Attendance</h4><select className="form-select form-select-sm w-auto"><option>2025–26</option></select></div>
          <div className="chart-stat">91.4% <span>▲ +0.8% vs last year</span></div>
          <p className="chart-sub">Min. threshold: 80% <span>(11 employees below threshold)</span></p>
          <div className="bar-line">{attendanceBars.map((v, i) => <div key={`${v}-${i}`} style={{ height: `${v}%` }} />)}</div>
          <div className="months">{['J','F','M','A','M','J','J','A','S','O','N','D'].map((m) => <span key={m}>{m}</span>)}</div>
        </div>

        <div className="chart-card">
          <div className="d-flex justify-content-between align-items-center mb-3"><h4>Overall Employee PA Performance</h4><select className="form-select form-select-sm w-auto"><option>2025–26</option></select></div>
          <div className="chart-stat">88.3% <span>▲ +3.1% vs last year</span></div>
          <p className="chart-sub">Target: 85% <span>(org avg above target)</span></p>
          <svg viewBox="0 0 360 120" className="perf-svg">
            <line x1="0" y1="55" x2="360" y2="55" stroke="#e6a817" strokeDasharray="4 3" />
            <polyline points={perfLine.map((v, i) => `${i * 33},${110 - v}`).join(' ')} fill="none" stroke="#2b8d72" strokeWidth="2" />
          </svg>
          <div className="months">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov'].map((m) => <span key={m}>{m}</span>)}</div>
        </div>
      </div>
    </>
  );
}

function HRLayout({ userEmail, onLogout }) {
  const [activePage, setActivePage] = useState(() => localStorage.getItem(STORAGE_PAGE_KEY) || 'dashboard');

  useEffect(() => {
    localStorage.setItem(STORAGE_PAGE_KEY, activePage);
  }, [activePage]);

  const current = pageContent[activePage];

  return (
    <div className="hr-app">
      <aside className="hr-sidebar">
        <div className="hr-brand"><div className="hr-logo">IE</div><div><h1>Information Evolution</h1><p>PMS — HR Portal</p></div></div>
        <div className="hr-menu-wrap">{menuSections.map((section) => (
          <section key={section.title} className="hr-menu-section"><p className="hr-menu-title">{section.title}</p><nav>{section.items.map((item) => (
            <button key={item.key} type="button" className={`hr-menu-item ${activePage === item.key ? 'active' : ''}`} onClick={() => setActivePage(item.key)}>
              <span className="hr-menu-icon" aria-hidden="true">{item.icon}</span><span className="hr-menu-label">{item.label}</span>{item.badge ? <span className="hr-menu-badge">{item.badge}</span> : null}
            </button>
          ))}</nav></section>
        ))}</div>
        <footer className="hr-user"><div className="hr-user-avatar">HR</div><div><h2>Deepa Nair</h2><p>HR Manager</p></div></footer>
      </aside>

      <main className="hr-main">
        <div className="hr-main-inner container-fluid">
          <div className="hr-top-row">
            <div><p className="hr-breadcrumb">Performance Management / HR Module</p><h3>{activePage === 'dashboard' ? 'Dashboard' : current.title}</h3><p className="hr-subtitle">{activePage === 'dashboard' ? 'HR performance command center' : current.subtitle}</p></div>
            <div className="d-flex gap-2"><span className="badge text-bg-light align-self-center">{userEmail}</span><button type="button" className="btn btn-outline-success" onClick={onLogout}>Logout</button></div>
          </div>
          {activePage === 'dashboard' ? <Dashboard /> : <div className="hr-placeholder-card"><h4>{current.title}</h4><p>{current.description}</p></div>}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [loggedInEmail, setLoggedInEmail] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const currentUser = useMemo(() => (loggedInEmail ? USERS[loggedInEmail] : null), [loggedInEmail]);

  const handleLogin = (email) => {
    localStorage.setItem(STORAGE_KEY, email);
    setLoggedInEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_PAGE_KEY);
    setLoggedInEmail('');
  };

  if (!currentUser) return <Login onLogin={handleLogin} />;
  if (currentUser.key !== 'hr') return <UnderConstruction role={currentUser.role} onLogout={handleLogout} />;
  return <HRLayout userEmail={loggedInEmail} onLogout={handleLogout} />;
}
