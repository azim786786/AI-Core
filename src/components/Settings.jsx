import { useState, useEffect } from "react";
import { Server, SlidersHorizontal, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { checkHealth } from "../services/api";

export default function Settings() {
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem("arcore_api_url") || "http://localhost:5000");
  const [status, setStatus] = useState(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  async function testConnection() {
    setTesting(true);
    const ok = await checkHealth();
    setStatus(ok);
    setTesting(false);
  }

  function saveUrl(e) {
    e.preventDefault();
    localStorage.setItem("arcore_api_url", apiUrl);
    testConnection();
  }

  return (
    <div className="page narrow-page">
      <p className="eyebrow">CONFIGURATION</p>
      <h1>Settings</h1>
      <p className="muted">Manage the AR-Core interface and local AI connection.</p>

      <div className="settings-card">
        <div className="setting-row">
          <div><b>AI Provider</b><p>Google Gemini AI (via Express proxy)</p></div>
          <span className="setting-value"><Server size={15}/> Gemini</span>
        </div>

        <form onSubmit={saveUrl} className="setting-form" style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ marginBottom: 8 }}>
            <b>Backend API Endpoint</b>
            <p className="muted" style={{ fontSize: 13 }}>For Android USB devices, ensure <code style={{ color: "#818cf8" }}>adb reverse tcp:5000 tcp:5000</code> is run.</p>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              type="text"
              value={apiUrl}
              onChange={e => setApiUrl(e.target.value)}
              placeholder="http://localhost:5000"
              style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", color: "#fff" }}
            />
            <button type="submit" className="primary-button" style={{ padding: "8px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Save</button>
          </div>
        </form>

        <div className="setting-row" style={{ alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <b>Connection Status</b>
            <p>{status === true ? "Connected to backend successfully" : status === false ? "Cannot reach backend server" : "Checking..."}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {status === true && <span style={{ color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={16}/> Online</span>}
            {status === false && <span style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={16}/> Offline</span>}
            <button type="button" onClick={testConnection} disabled={testing} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 10px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <RefreshCw size={14} className={testing ? "spinning" : ""}/> Test
            </button>
          </div>
        </div>

        <div className="setting-row">
          <div><b>Model</b><p>Configured in server .env file (GEMINI_MODEL)</p></div>
          <span className="setting-value"><SlidersHorizontal size={15}/> Gemini Flash</span>
        </div>
      </div>

      <div className="info-box" style={{ marginTop: 24, padding: 16, background: "rgba(99, 102, 241, 0.1)", borderRadius: 12, border: "1px solid rgba(99, 102, 241, 0.2)" }}>
        <b style={{ color: "#818cf8" }}>Quick Troubleshooting for "Failed to fetch":</b>
        <ol style={{ margin: "8px 0 0 16px", padding: 0, fontSize: 13, lineHeight: 1.6, color: "#cbd5e1" }}>
          <li>Start the backend server on your PC: <code style={{ color: "#f87171" }}>npm run server</code></li>
          <li>If testing on a physical Android phone via USB, enable USB debugging and run: <code style={{ color: "#f87171" }}>adb reverse tcp:5000 tcp:5000</code></li>
          <li>If using an Android Emulator, ensure endpoint is <code style={{ color: "#818cf8" }}>http://10.0.2.2:5000</code> or <code style={{ color: "#818cf8" }}>http://localhost:5000</code> with adb reverse.</li>
        </ol>
      </div>
    </div>
  );
}