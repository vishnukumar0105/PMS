export default function UnderConstruction({ role, onLogout }) {
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
