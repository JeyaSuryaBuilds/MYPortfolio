import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, SendHorizontal, Sparkles, X } from 'lucide-react';
import { suggestedQuestions, welcomeMessage } from '../data/portfolio';
import { askSuryaAI } from '../services/api';
import { useReducedMotion } from '../utils/hooks';

const WELCOME = { id: 'welcome', role: 'assistant', text: welcomeMessage, animate: false };
let counter = 0;
const nextId = () => `m${++counter}`;

/** Reveals assistant text progressively. */
function Typewriter({ text, onTick, instant }) {
  const [n, setN] = useState(instant ? text.length : 0);
  useEffect(() => {
    if (instant) return undefined;
    const t = setInterval(() => {
      setN((v) => {
        if (v >= text.length) { clearInterval(t); return v; }
        return Math.min(text.length, v + 3);
      });
    }, 16);
    return () => clearInterval(t);
  }, [text, instant]);
  useEffect(() => { onTick?.(); }, [n, onTick]);
  return <>{text.slice(0, n)}</>;
}

export default function SuryaAI() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const scrollDown = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(scrollDown, [messages, busy, scrollDown]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    inputRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async (raw) => {
    const text = raw.trim();
    if (!text || busy) return;
    const userMsg = { id: nextId(), role: 'user', text };
    const history = [...messages.filter((m) => m.id !== 'welcome' && !m.error), userMsg];
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setBusy(true);
    try {
      const { reply } = await askSuryaAI(history.slice(-12).map(({ role, text: t }) => ({ role, text: t })));
      setMessages((m) => [...m, { id: nextId(), role: 'assistant', text: reply, animate: true }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { id: nextId(), role: 'assistant', error: true, text: err.message || 'I could not reach the assistant service. Please try again in a moment.' },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setMessages([WELCOME]);
    setInput('');
  };

  const showChips = messages.length === 1;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            className="chat"
            role="dialog"
            aria-label="SURYA AI chat"
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            style={{ transformOrigin: 'bottom right' }}
          >
            <header className="chat-head">
              <span className="chat-avatar" aria-hidden="true"><Sparkles size={18} /></span>
              <div>
                <h2>SURYA AI</h2>
                <p>Answers only from verified portfolio information</p>
              </div>
              <button className="chat-icon" onClick={reset} aria-label="Start a new conversation" title="New conversation"><RotateCcw size={17} /></button>
              <button className="chat-icon" onClick={() => setOpen(false)} aria-label="Close chat"><X size={19} /></button>
            </header>

            <div className="chat-list" ref={listRef} data-lenis-prevent aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={`bubble bubble-${m.role} ${m.error ? 'bubble-error' : ''}`}>
                  {m.role === 'assistant' && m.animate ? (
                    <Typewriter text={m.text} onTick={scrollDown} instant={reduced} />
                  ) : (
                    m.text
                  )}
                </div>
              ))}
              {busy && (
                <div className="bubble bubble-assistant typing" aria-label="SURYA AI is typing">
                  <span /><span /><span />
                </div>
              )}
              {showChips && (
                <ul className="suggestions">
                  {suggestedQuestions.map((q) => (
                    <li key={q}><button onClick={() => send(q)}>{q}</button></li>
                  ))}
                </ul>
              )}
            </div>

            <form className="chat-form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, projects, contact..."
                maxLength={500}
                aria-label="Message to SURYA AI"
                disabled={busy}
              />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Send message"><SendHorizontal size={19} /></button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        className={`chat-fab ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close SURYA AI' : 'Open SURYA AI assistant'}
        aria-expanded={open}
        whileHover={reduced ? undefined : { scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
      >
        <span className="fab-ring" aria-hidden="true" />
        <span className="fab-core">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={open ? 'x' : 's'} initial={{ rotate: -80, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 80, opacity: 0 }} transition={{ duration: 0.18 }}>
              {open ? <X size={24} /> : <Sparkles size={24} />}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
    </>
  );
}
