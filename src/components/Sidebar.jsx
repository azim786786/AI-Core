import { Bot, History, LayoutDashboard, LogOut, Settings, Sparkles } from "lucide-react";

export default function Sidebar({ active, setActive, user, onLogout }) {
  const items = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["assistant", "AI Assistant", Bot],
    ["history", "Conversation History", History],
    ["settings", "Settings", Settings]
  ];

  return (
    <aside className="sidebar">
      <div className="side-brand">
        <div className="brand-mark">A<span>R</span></div>
        <div><b>AR-Core</b><small>AI COMMAND CENTER</small></div>
      </div>

      <div className="side-section">
        <span>WORKSPACE</span>
        {items.map(([id, label, Icon]) => (
          <button key={id} className={`nav-item ${active === id ? "active" : ""}`}
            onClick={() => setActive(id)}>
            <Icon size={19} /> {label}
            {id === "assistant" && <span className="live-dot" />}
          </button>
        ))}
      </div>

      <div className="side-ai-card">
        <Sparkles size={18} />
        <b>AR-Core AI</b>
        <p>Powered by your local Ollama model.</p>
      </div>

      <div className="side-user">
        <div className="avatar">{user.name?.slice(0,1).toUpperCase()}</div>
        <div><b>{user.name}</b><small>{user.email}</small></div>
        <button className="icon-button" title="Log out" onClick={onLogout}><LogOut size={17}/></button>
      </div>
    </aside>
  );
}