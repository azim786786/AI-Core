import { History as HistoryIcon, MessageCircle } from "lucide-react";

export default function History() {
  return (
    <div className="page narrow-page">
      <p className="eyebrow">MEMORY</p><h1>Conversation History</h1>
      <p className="muted">Saved conversations can be connected here in the next version.</p>
      <div className="empty-state"><HistoryIcon size={42}/><h3>No saved conversations</h3><p>Your current chat is kept in the active session.</p></div>
    </div>
  );
}