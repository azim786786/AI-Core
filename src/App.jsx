import { useState } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import Auth from "./components/Auth";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat";
import History from "./components/History";
import Settings from "./components/Settings";

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("arcore_user")) || null; } catch { return null; }
  });
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return <Auth onLogin={setUser} />;

  function logout() {
    localStorage.removeItem("arcore_user");
    setUser(null);
  }

  return (
    <div className="app-shell">
      <div className={`mobile-overlay ${mobileOpen ? "show" : ""}`} onClick={() => setMobileOpen(false)} />
      <div className={`sidebar-mobile ${mobileOpen ? "show" : ""}`}>
        <Sidebar active={active} setActive={(x) => { setActive(x); setMobileOpen(false); }} user={user} onLogout={logout}/>
      </div>
      <div className="desktop-sidebar"><Sidebar active={active} setActive={setActive} user={user} onLogout={logout}/></div>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu/></button>
          <div className="top-search"><Search size={17}/><input placeholder="Search AR-Core..." /></div>
          <div className="top-actions"><button className="icon-button"><Bell size={19}/></button><div className="top-avatar">{user.name.slice(0,1).toUpperCase()}</div></div>
        </header>

        {active === "dashboard" && <Dashboard user={user} setActive={setActive}/>}
        {active === "assistant" && <Chat/>}
        {active === "history" && <History/>}
        {active === "settings" && <Settings/>}
      </main>
    </div>
  );
}