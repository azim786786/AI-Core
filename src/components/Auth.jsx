import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    if (mode === "signup" && !form.name) {
      setError("Please enter your name.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const user = {
      name: form.name || form.email.split("@")[0],
      email: form.email
    };
    localStorage.setItem("arcore_user", JSON.stringify(user));
    onLogin(user);
  }

  return (
    <main className="auth-page">
      <div className="auth-orbit orbit-one" />
      <div className="auth-orbit orbit-two" />
      <section className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark">A<span>R</span></div>
          <div><strong>AR-Core</strong><small>Intelligent • Adaptive • Human</small></div>
        </div>

        <div className="auth-copy">
          <p className="eyebrow">AI COMMAND CENTER</p>
          <h1>{mode === "login" ? "Welcome back." : "Build your AI future."}</h1>
          <p>{mode === "login"
            ? "Sign in to continue your conversation with AR-Core."
            : "Create your workspace and meet your personal AI assistant."}</p>
        </div>

        <form onSubmit={submit}>
          {mode === "signup" && (
            <label className="field">
              <UserRound size={18} />
              <input placeholder="Full name" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} />
            </label>
          )}

          <label className="field">
            <Mail size={18} />
            <input type="email" placeholder="Email address" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} />
          </label>

          <label className="field">
            <LockKeyhole size={18} />
            <input type={showPassword ? "text" : "password"} placeholder="Password"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <button type="button" className="icon-button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </label>

          {error && <div className="form-error">{error}</div>}

          <button className="primary-button" type="submit">
            {mode === "login" ? "Enter AR-Core" : "Create account"} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login" ? "New to AR-Core?" : "Already have an account?"}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </div>
        <p className="demo-note">Demo authentication stores the signed-in user in your browser.</p>
      </section>
    </main>
  );
}