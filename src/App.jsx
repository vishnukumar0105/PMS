import { useState } from 'react';

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
  dashboard: {
    title: 'Dashboard',
    subtitle: 'HR performance command center',
    description:
      'Track review pipeline health, due dates, team completion trends, and actionable risks in one place.'
  },
  'master-list': {
    title: 'Master List',
    subtitle: 'Employee profile index',
    description: 'Search and maintain employee appraisal records, review cycle metadata, and hierarchy mapping.'
  },
  'upcoming-review-list': {
    title: 'Upcoming Review List',
    subtitle: 'Review schedule planner',
    description: 'View upcoming due dates and launch review workflow actions for selected employees.'
  },
  'review-approval-list': {
    title: 'Review Approval List',
    subtitle: 'Approval queue monitor',
    description: 'Manage pending approvals, feedback dispatch status, and escalation timelines.'
  },
  'discussion-list': {
    title: 'Discussion List',
    subtitle: 'Discussion tracking',
    description: 'Schedule review discussions, track outcomes, and capture HR comments and decisions.'
  },
  'appraisal-list': {
    title: 'Appraisal List',
    subtitle: 'Compensation recommendations',
    description: 'Prepare finalized recommendations and send eligible records to CPO for approval.'
  },
  'beneficiary-list': {
    title: 'Beneficiary List',
    subtitle: 'Approved benefit roster',
    description: 'Track approved increments, communication status, and acknowledgement submission.'
  },
  attendance: {
    title: 'Attendance',
    subtitle: 'Attendance intelligence',
    description: 'Monitor attendance trends and identify review-impacting threshold violations.'
  },
  'pa-scores': {
    title: 'PA Scores',
    subtitle: 'Performance trend analysis',
    description: 'Analyze PA trajectory by team, cycle, and employee-level ranking movement.'
  },
  'star-performance-awards': {
    title: 'Star Performance Awards',
    subtitle: 'Recognition ledger',
    description: 'Review monthly recognition awards and their supporting appraisal context.'
  },
  'feedback-forms': {
    title: 'Feedback Forms',
    subtitle: 'Template and submission hub',
    description: 'Manage form templates, completion rates, and reminder actions for active cycles.'
  },
  'review-history': {
    title: 'Review History',
    subtitle: 'Historical review archive',
    description: 'Access complete appraisal chronology with scores, outcomes, and acknowledgement records.'
  },
  configuration: {
    title: 'Configuration',
    subtitle: 'HR policy controls',
    description: 'Configure probation and review-cycle policy settings for future appraisals.'
  }
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const current = pageContent[activePage];

  return (
    <div className="hr-app">
      <aside className="hr-sidebar">
        <div className="hr-brand">
          <div className="hr-logo">IE</div>
          <div>
            <h1>Information Evolution</h1>
            <p>PMS — HR Portal</p>
          </div>
        </div>

        <div className="hr-menu-wrap">
          {menuSections.map((section) => (
            <section key={section.title} className="hr-menu-section">
              <p className="hr-menu-title">{section.title}</p>
              <nav>
                {section.items.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`hr-menu-item ${activePage === item.key ? 'active' : ''}`}
                    onClick={() => setActivePage(item.key)}
                  >
                    <span className="hr-menu-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="hr-menu-label">{item.label}</span>
                    {item.badge ? <span className="hr-menu-badge">{item.badge}</span> : null}
                  </button>
                ))}
              </nav>
            </section>
          ))}
        </div>

        <footer className="hr-user">
          <div className="hr-user-avatar">HR</div>
          <div>
            <h2>Deepa Nair</h2>
            <p>HR Manager</p>
          </div>
        </footer>
      </aside>

      <main className="hr-main">
        <div className="hr-main-inner container-fluid">
          <div className="hr-top-row">
            <div>
              <p className="hr-breadcrumb">Performance Management / HR Module</p>
              <h3>{current.title}</h3>
              <p className="hr-subtitle">{current.subtitle}</p>
            </div>
            <button type="button" className="btn btn-success px-4 rounded-pill">
              + New Action
            </button>
          </div>

          <div className="hr-placeholder-card">
            <h4>{current.title}</h4>
            <p>{current.description}</p>
            <div className="hr-chip-row">
              <span className="hr-chip">Modern UI baseline complete</span>
              <span className="hr-chip">Menu aligned to provided design</span>
              <span className="hr-chip">Ready for page-wise feature build</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
