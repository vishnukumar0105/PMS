export default function Sidebar({ sections, activePage, onNavigate }) {
  return (
    <aside className="hr-sidebar">
      <div className="hr-brand"><div className="hr-logo">IE</div><div><h1>Information Evolution</h1><p>PMS — HR Portal</p></div></div>
      <div className="hr-menu-wrap">{sections.map((section) => (
        <section key={section.title} className="hr-menu-section"><p className="hr-menu-title">{section.title}</p><nav>{section.items.map((item) => (
          <button key={item.key} type="button" className={`hr-menu-item ${activePage === item.key ? 'active' : ''}`} onClick={() => onNavigate(item.key)}>
            <span className="hr-menu-icon" aria-hidden="true">{item.icon}</span><span className="hr-menu-label">{item.label}</span>{item.badge ? <span className="hr-menu-badge">{item.badge}</span> : null}
          </button>
        ))}</nav></section>
      ))}</div>
      <footer className="hr-user"><div className="hr-user-avatar">HR</div><div><h2>Deepa Nair</h2><p>HR Manager</p></div></footer>
    </aside>
  );
}
