import { useMemo, useState } from 'react';

const menu = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'master', label: 'Master List' },
  { key: 'upcoming', label: 'Upcoming Review List' },
  { key: 'approval', label: 'Review Approval List' },
  { key: 'discussion', label: 'Discussion List' },
  { key: 'appraisal', label: 'Appraisal List' },
  { key: 'beneficiary', label: 'Beneficiary List' }
];

const metrics = [
  ['Total Employees', '650'],
  ['Upcoming Review (June)', '19'],
  ['Review Completed (May)', '10'],
  ['Under Review (May)', '26'],
  ['Review in Progress (May)', '16'],
  ['Appraisal Beneficiary (May)', '16']
];

function Placeholder({ title }) {
  return (
    <div className="card p-4 shadow-sm border-0">
      <h5 className="mb-2">{title}</h5>
      <p className="text-secondary mb-0">
        This page is scaffolded and ready. Next step: migrate the full HTML table/cards and attach API/state.
      </p>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('dashboard');
  const title = useMemo(() => menu.find((m) => m.key === page)?.label ?? 'Dashboard', [page]);

  return (
    <div className="app-shell d-flex">
      <aside className="sidebar p-3 d-flex flex-column">
        <div className="brand mb-3 pb-3 border-bottom border-light-subtle">
          <div className="fw-bold text-white">Information Evolution</div>
          <small className="text-light opacity-75">PMS — HR Portal</small>
        </div>

        <nav className="d-grid gap-1">
          {menu.map((item) => (
            <button
              key={item.key}
              className={`btn text-start sidebar-btn ${item.key === page ? 'active' : ''}`}
              onClick={() => setPage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto text-light small pt-3 border-top border-light-subtle">Deepa Nair · HR Manager</div>
      </aside>

      <main className="main-panel flex-grow-1 d-flex flex-column">
        <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
          <div>
            <div className="text-secondary small">Performance Management</div>
            <div className="fw-semibold">{title}</div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary btn-sm">🔔</button>
            <div className="avatar">DN</div>
          </div>
        </header>

        <section className="p-4 overflow-auto">
          {page === 'dashboard' ? (
            <>
              <div className="alert alert-warning py-2">5 feedback forms pending submission.</div>
              <div className="row g-3 mb-3">
                {metrics.map(([label, val]) => (
                  <div key={label} className="col-md-4 col-xl-2">
                    <div className="card border-0 shadow-sm p-3 h-100">
                      <div className="small text-secondary">{label}</div>
                      <div className="display-6 text-success fw-semibold">{val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row g-3">
                <div className="col-lg-6"><Placeholder title="Employee Allocation by Department" /></div>
                <div className="col-lg-6"><Placeholder title="Department PA Completion Status" /></div>
              </div>
            </>
          ) : (
            <Placeholder title={title} />
          )}
        </section>
      </main>
    </div>
  );
}
