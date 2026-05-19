import { useMemo, useState } from 'react';

const roles = ['HR', 'Employee', 'Team Leader', 'Manager', 'CPO'];

const monthlyWeights = {
  punctuality: 20,
  quality: 25,
  technical: 20,
  innovation: 15,
  eta: 20,
};

const seedEmployees = [
  { id: 'E101', name: 'Rajesh Kumar', team: 'Backend', cycle: 'Yearly', dueMonth: 'May', tl: 'Priya', manager: 'Suresh' },
  { id: 'E102', name: 'Anita Bose', team: 'Frontend', cycle: '6 Months', dueMonth: 'May', tl: 'Vikram', manager: 'Suresh' },
  { id: 'E103', name: 'John Mathews', team: 'QA', cycle: 'Yearly', dueMonth: 'June', tl: 'Priya', manager: 'Lina' },
];

const initialForms = {
  E101: { employee: true, tl: true, manager: false },
  E102: { employee: true, tl: false, manager: false },
  E103: { employee: false, tl: false, manager: false },
};

const initialReviews = {
  E101: 'approved',
  E102: 'pending',
  E103: 'extended',
};

const monthlyRating = {
  E101: { punctuality: 92, quality: 90, technical: 95, innovation: 84, eta: 89 },
  E102: { punctuality: 88, quality: 86, technical: 91, innovation: 90, eta: 85 },
  E103: { punctuality: 78, quality: 80, technical: 84, innovation: 76, eta: 79 },
};

function score(metrics) {
  return Object.entries(metrics).reduce((sum, [key, value]) => sum + (value * monthlyWeights[key]) / 100, 0).toFixed(1);
}

export default function App() {
  const [role, setRole] = useState('HR');
  const [forms, setForms] = useState(initialForms);
  const [reviewState, setReviewState] = useState(initialReviews);
  const [selectedIds, setSelectedIds] = useState([]);

  const upcoming = useMemo(() => seedEmployees.filter((e) => e.dueMonth === 'May'), []);

  const cardStatus = (id) => {
    const row = forms[id];
    const done = Object.values(row).filter(Boolean).length;
    return `${done}/3 completed`;
  };

  const toggleForm = (id, actor) => {
    setForms((prev) => ({ ...prev, [id]: { ...prev[id], [actor]: !prev[id][actor] } }));
  };

  const hrView = (
    <>
      <div className="card-panel">
        <h5>Dashboard</h5>
        <div className="grid-4 mt-3">
          <Stat title="Total Employees" value={seedEmployees.length} />
          <Stat title="Upcoming Appraisals" value={upcoming.length} />
          <Stat title="TL Pending" value={Object.values(reviewState).filter((s) => s === 'pending').length} />
          <Stat title="Ready for CPO" value={Object.values(reviewState).filter((s) => s === 'approved').length} />
        </div>
      </div>

      <div className="card-panel">
        <h5>Master Employee List</h5>
        <EmployeeTable rows={seedEmployees} reviewState={reviewState} />
      </div>

      <div className="card-panel">
        <h5>Upcoming Employee List (Current Month)</h5>
        <EmployeeTable rows={upcoming} reviewState={reviewState} />
      </div>

      <div className="card-panel">
        <h5>Review Approval List</h5>
        <StatusTabs reviewState={reviewState} />
      </div>

      <div className="card-panel">
        <h5>Feedback Form Cards</h5>
        <div className="row g-3 mt-1">
          {seedEmployees.map((emp) => (
            <div className="col-md-4" key={emp.id}>
              <div className="employee-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{emp.name}</strong>
                    <div className="small text-secondary">{emp.id} • {emp.team}</div>
                  </div>
                  <span className="badge text-bg-light">{cardStatus(emp.id)}</span>
                </div>
                <div className="form-check mt-2"><input checked={forms[emp.id].employee} onChange={() => toggleForm(emp.id, 'employee')} className="form-check-input" type="checkbox" /> Employee form</div>
                <div className="form-check"><input checked={forms[emp.id].tl} onChange={() => toggleForm(emp.id, 'tl')} className="form-check-input" type="checkbox" /> TL form</div>
                <div className="form-check"><input checked={forms[emp.id].manager} onChange={() => toggleForm(emp.id, 'manager')} className="form-check-input" type="checkbox" /> Manager form</div>
                <button className="btn btn-outline-success btn-sm mt-3" onClick={() => setReviewState((p) => ({ ...p, [emp.id]: 'approved' }))}>Intimate Manager</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-panel">
        <h5>Beneficiary List (HR to send mail)</h5>
        <table className="table table-hover align-middle mt-2">
          <thead><tr><th></th><th>Name</th><th>PA Score</th><th>Status</th></tr></thead>
          <tbody>
            {seedEmployees.map((e) => (
              <tr key={e.id}>
                <td><input type="checkbox" checked={selectedIds.includes(e.id)} onChange={() => setSelectedIds((prev) => prev.includes(e.id) ? prev.filter((x) => x !== e.id) : [...prev, e.id])} /></td>
                <td>{e.name}</td>
                <td>{score(monthlyRating[e.id])}%</td>
                <td><span className={`badge ${reviewState[e.id] === 'approved' ? 'text-bg-success' : 'text-bg-warning'}`}>{reviewState[e.id]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const managerView = (
    <div className="card-panel">
      <h5>Manager Review List</h5>
      {seedEmployees.map((emp) => (
        <details key={emp.id} className="review-block">
          <summary>{emp.name} ({emp.id}) — PA Score {score(monthlyRating[emp.id])}%</summary>
          <div className="mt-2 small text-secondary">TL: {emp.tl} | Manager: {emp.manager}</div>
          <div className="grid-2 mt-3">
            {Object.entries(monthlyRating[emp.id]).map(([k, v]) => <Metric key={k} name={k} val={v} />)}
          </div>
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-success btn-sm" onClick={() => setReviewState((p) => ({ ...p, [emp.id]: 'approved' }))}>Approve</button>
            <button className="btn btn-danger btn-sm" onClick={() => setReviewState((p) => ({ ...p, [emp.id]: 'rejected' }))}>Reject</button>
            <button className="btn btn-warning btn-sm" onClick={() => setReviewState((p) => ({ ...p, [emp.id]: 'extended' }))}>Extend</button>
          </div>
        </details>
      ))}
    </div>
  );

  const paView = (
    <div className="card-panel">
      <h5>Monthly PA Score</h5>
      <p className="text-secondary">Monthly trigger form with weighted parameters used by manager in appraisal review meetings.</p>
      <table className="table table-bordered">
        <thead><tr><th>Employee</th><th>Punctuality</th><th>Quality</th><th>Technical</th><th>Innovation</th><th>ETA Deadline</th><th>Final PA</th></tr></thead>
        <tbody>
          {seedEmployees.map((e) => (
            <tr key={e.id}>
              <td>{e.name}</td>
              {Object.values(monthlyRating[e.id]).map((v, idx) => <td key={idx}>{v}</td>)}
              <td><strong>{score(monthlyRating[e.id])}%</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h4>Information Evolution</h4>
        <p className="small">PMS — Employee Portal</p>
        <div className="menu-title">MENU</div>
        <ul>
          <li className="active">Dashboard</li>
          <li>Attendance</li>
          <li>PA Scores</li>
          <li>Self Appraisal</li>
          <li>Review History</li>
        </ul>
      </aside>

      <main className="content">
        <header className="top-bar">
          <h3>Employee Performance System</h3>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select role-select">
            {roles.map((r) => <option key={r}>{r}</option>)}
          </select>
        </header>

        <section className="hero card-panel">
          <h4>Welcome, Rajesh Kumar</h4>
          <p className="mb-1">Annual/6-month appraisal workflow + monthly PA scoring.</p>
          <span className="badge rounded-pill text-bg-warning me-2">Annual Review</span>
          <span className="badge rounded-pill text-bg-info">Next Review: 20-Sep-2026</span>
        </section>

        {role === 'HR' && hrView}
        {role === 'Manager' && managerView}
        {(role === 'Employee' || role === 'Team Leader') && paView}
        {role === 'CPO' && (
          <div className="card-panel">
            <h5>CPO Final Approval</h5>
            <p>Employees selected by HR are listed here for final confirmation.</p>
            <ul>{selectedIds.map((id) => <li key={id}>{id} - {seedEmployees.find((e) => e.id === id)?.name}</li>)}</ul>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ title, value }) {
  return <div className="stat"><div className="small text-secondary">{title}</div><div className="display-6 fw-semibold">{value}</div></div>;
}

function EmployeeTable({ rows, reviewState }) {
  return (
    <table className="table table-striped table-hover mt-2">
      <thead><tr><th>ID</th><th>Name</th><th>Team</th><th>Cycle</th><th>Status</th></tr></thead>
      <tbody>
        {rows.map((r) => <tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.team}</td><td>{r.cycle}</td><td><span className="badge text-bg-light">{reviewState[r.id]}</span></td></tr>)}
      </tbody>
    </table>
  );
}

function StatusTabs({ reviewState }) {
  const statuses = ['pending', 'approved', 'rejected', 'extended'];
  return (
    <ul className="nav nav-pills gap-2 mt-2">
      {statuses.map((s) => <li key={s} className="nav-item"><span className="badge rounded-pill text-bg-dark p-2">{s}: {Object.values(reviewState).filter((v) => v === s).length}</span></li>)}
    </ul>
  );
}

function Metric({ name, val }) {
  return <div className="metric"><div className="text-capitalize">{name}</div><div className="progress"><div className="progress-bar" style={{ width: `${val}%` }}>{val}%</div></div></div>;
}
