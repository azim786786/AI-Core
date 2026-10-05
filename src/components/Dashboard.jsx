import { ArrowUpRight, Bot, BrainCircuit, MessageSquare, ShieldCheck, Sparkles, Zap } from "lucide-react";
import RobotAvatar from "./RobotAvatar";

export default function Dashboard({ user, setActive }) {
  return (
    <div className="page">
      <div className="page-heading">
        <div><p className="eyebrow">OVERVIEW</p><h1>Good to see you, {user.name.split(" ")[0]}.</h1>
        <p>Welcome to your AR-Core intelligent workspace.</p></div>
        <button className="primary-button compact" onClick={() => setActive("assistant")}><Bot size={17}/> Open Assistant</button>
      </div>

      <div className="hero-dashboard">
        <div className="hero-copy">
          <div className="pill"><span/> AR-CORE IS READY</div>
          <h2>Your ideas,<br/><em>amplified by AI.</em></h2>
          <p>Talk naturally with your local AI assistant and turn questions into useful answers, plans, explanations, and code.</p>
          <button className="hero-link" onClick={() => setActive("assistant")}>Start a conversation <ArrowUpRight size={18}/></button>
        </div>
        <div className="hero-robot"><RobotAvatar/></div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon"><MessageSquare/></div><span>CONVERSATIONS</span><strong>Ready</strong><small>Start your first session</small></div>
        <div className="stat-card"><div className="stat-icon"><BrainCircuit/></div><span>AI ENGINE</span><strong>Ollama</strong><small>Local inference</small></div>
        <div className="stat-card"><div className="stat-icon"><ShieldCheck/></div><span>PRIVACY</span><strong>Local-first</strong><small>Your model runs locally</small></div>
      </div>

      <div className="section-title"><div><p className="eyebrow">CAPABILITIES</p><h2>What AR-Core can do</h2></div></div>
      <div className="capability-grid">
        <div><Zap/><h3>Fast Answers</h3><p>Ask questions and get clear responses from your Ollama model.</p></div>
        <div><BrainCircuit/><h3>Explain Concepts</h3><p>Break down technical topics into simple, understandable steps.</p></div>
        <div><Sparkles/><h3>Creative Thinking</h3><p>Brainstorm projects, ideas, content, and practical solutions.</p></div>
      </div>
    </div>
  );
}