import { useEffect, useRef, useState } from "react";
import { Bot, Copy, Mic, MicOff, RotateCcw, Send, Sparkles, UserRound, Volume2, VolumeX } from "lucide-react";
import { sendMessage } from "../services/api";
import RobotAvatar from "./RobotAvatar";

const starter = [
  { role: "assistant", content: "Hello! I’m AR-Core. What would you like to explore today?" }
];

export default function Chat() {
  const [messages, setMessages] = useState(starter);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState("");
  const bottom = useRef(null);
  const recognition = useRef(null);
  const shouldSubmitVoice = useRef(false);
  const voiceTranscript = useRef("");

  useEffect(() => {
    const element = bottom.current;
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  async function submit(e, textOverride) {
    e?.preventDefault();
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const data = await sendMessage(text, next.slice(-12));
      setMessages([...next, { role: "assistant", content: data.message }]);
      if (speechEnabled && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(data.message));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus("Voice input is not supported in this browser.");
      return;
    }

    if (listening) {
      shouldSubmitVoice.current = true;
      recognition.current?.stop();
      return;
    }

    const recognizer = new SpeechRecognition();
    recognizer.continuous = false;
    recognizer.interimResults = true;
    recognizer.lang = navigator.language || "en-US";
    shouldSubmitVoice.current = false;
    voiceTranscript.current = "";
    recognition.current = recognizer;

    recognizer.onstart = () => {
      setListening(true);
      setVoiceStatus("Listening...");
      setError("");
    };
    recognizer.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join("");
      voiceTranscript.current = transcript;
      setInput(transcript);
      if (event.results[event.results.length - 1].isFinal) {
        shouldSubmitVoice.current = true;
      }
    };
    recognizer.onerror = event => {
      shouldSubmitVoice.current = false;
      setVoiceStatus(event.error === "not-allowed" ? "Microphone permission was denied." : "Voice input failed.");
    };
    recognizer.onend = () => {
      setListening(false);
      setVoiceStatus("");
      if (shouldSubmitVoice.current) {
        shouldSubmitVoice.current = false;
        submit(null, voiceTranscript.current);
      }
    };
    recognizer.start();
  }

  useEffect(() => () => {
    recognition.current?.abort();
    window.speechSynthesis?.cancel();
  }, []);

  function reset() {
    setMessages(starter);
    setError("");
  }

  async function copy(text) {
    await navigator.clipboard?.writeText(text);
  }

  return (
    <section className="chat-panel">
      <div className="chat-header">
        <div className="chat-title">
          <div className="mini-robot"><RobotAvatar small /></div>
          <div><h2>AR-Core Assistant</h2><p><span className="status-dot" /> Online • Local AI</p></div>
        </div>
        <button className="ghost-button" onClick={reset}><RotateCcw size={16}/> New chat</button>
      </div>

      <div className="messages">
        <div className="welcome-card">
          <RobotAvatar />
          <div>
            <p className="eyebrow">YOUR AI COMPANION</p>
            <h3>Ask. Think. Create.</h3>
            <p>AR-Core can explain concepts, help write code, brainstorm ideas, summarize text, and answer everyday questions.</p>
          </div>
        </div>

        {messages.map((m, i) => (
          <div className={`message-row ${m.role}`} key={i}>
            <div className="message-avatar">{m.role === "assistant" ? <Bot size={17}/> : <UserRound size={17}/>}</div>
            <div className="message-content">
              <span className="message-name">{m.role === "assistant" ? "AR-Core" : "You"}</span>
              <div className="bubble">{m.content}</div>
              {m.role === "assistant" && (
                <button className="copy-button" onClick={() => copy(m.content)}><Copy size={13}/> Copy</button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-row assistant">
            <div className="message-avatar"><Bot size={17}/></div>
            <div className="message-content"><span className="message-name">AR-Core</span>
              <div className="bubble typing"><i/><i/><i/></div>
            </div>
          </div>
        )}

        <div ref={bottom}/>
      </div>

      {error && <div className="chat-error">{error}</div>}

      {voiceStatus && <div className="voice-status">{voiceStatus}</div>}

      <form className="chat-input" onSubmit={submit}>
        <Sparkles size={19}/>
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="Ask AR-Core anything..." disabled={loading}/>
        <button type="button" className={`voice-button ${listening ? "listening" : ""}`} onClick={toggleListening} disabled={loading} aria-label={listening ? "Stop listening" : "Start voice input"} title={listening ? "Stop listening" : "Start voice input"}>
          {listening ? <MicOff size={17}/> : <Mic size={17}/>}
        </button>
        <button type="button" className={`voice-button ${speechEnabled ? "active" : ""}`} onClick={() => setSpeechEnabled(value => !value)} aria-label={speechEnabled ? "Mute voice output" : "Enable voice output"} title={speechEnabled ? "Mute voice output" : "Enable voice output"}>
          {speechEnabled ? <Volume2 size={17}/> : <VolumeX size={17}/>}
        </button>
        <button type="submit" disabled={!input.trim() || loading}><Send size={18}/></button>
      </form>
      <p className="input-hint">Speak with the microphone or type a message. Voice output is {speechEnabled ? "on" : "off"}.</p>
    </section>
  );
}