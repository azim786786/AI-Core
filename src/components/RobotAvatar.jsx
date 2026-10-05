import { Bot, Sparkles } from "lucide-react";

export default function RobotAvatar({ small = false }) {
  return (
    <div className={`robot-wrap ${small ? "robot-small" : ""}`}>
      <div className="robot-glow" />
      <div className="robot-head">
        <div className="robot-antenna"><span /></div>
        <div className="robot-ear left" />
        <div className="robot-ear right" />
        <div className="robot-face">
          <div className="robot-eyes"><i /><i /></div>
          <div className="robot-mouth" />
        </div>
      </div>
      {!small && (
        <div className="robot-body">
          <div className="robot-chest"><Bot size={24} /><Sparkles size={13} /></div>
        </div>
      )}
    </div>
  );
}