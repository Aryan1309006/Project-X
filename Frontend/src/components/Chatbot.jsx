import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faPaperPlane,
  faXmark,
  faCommentDots,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

const RASA_URL = "http://localhost:5005/webhooks/rest/webhook";
const SENDER_ID = "ev_user_" + Math.random().toString(36).slice(2, 9);

function Chatbot() {
  const [open,      setOpen]      = useState(false);
  const [msgs,      setMsgs]      = useState([
    {
      from: "bot",
      text: "Hi! I'm EVA ⚡ your EV charging assistant. Ask me about charging stations, tips, or anything EV-related!",
    },
  ]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [online,    setOnline]    = useState(false);
  const [visible,   setVisible]   = useState(false);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // ── Check if Rasa is reachable ──
  useEffect(() => {
    fetch("http://localhost:5005/")
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  // ── FAB entrance animation ──
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  // ── Auto scroll to latest message ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  // ── Focus input when chat opens ──
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // ── Send message to Rasa ──
  const sendMessage = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    // Show user bubble immediately
    setMsgs((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(RASA_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ sender: SENDER_ID, message: text }),
      });

      const data = await res.json(); // Rasa returns an array

      if (!data || data.length === 0) {
        setMsgs((prev) => [
          ...prev,
          { from: "bot", text: "I didn't quite get that. Could you rephrase?" },
        ]);
      } else {
        data.forEach((item) => {
          if (item.text) {
            setMsgs((prev) => [...prev, { from: "bot", text: item.text }]);
          }
          if (item.image) {
            setMsgs((prev) => [...prev, { from: "bot", image: item.image }]);
          }
          if (item.buttons) {
            setMsgs((prev) => [
              ...prev,
              { from: "bot", buttons: item.buttons },
            ]);
          }
        });
      }
    } catch {
      setMsgs((prev) => [
        ...prev,
        {
          from: "bot",
          text: "⚠️ Could not reach EVA. Make sure Rasa is running on port 5005.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ── Enter key to send ──
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Quick reply button click ──
  const handleQuickReply = (payload) => {
    sendMessage(payload);
  };

  // ── Reset conversation ──
  const resetChat = () => {
    setMsgs([
      {
        from: "bot",
        text: "Hi! I'm EVA ⚡ your EV charging assistant. Ask me about charging stations, tips, or anything EV-related!",
      },
    ]);
  };

  return (
    <>
      {/* ═══════════════════════════════
           CHAT WINDOW
      ═══════════════════════════════ */}
      <div
        className={`fixed bottom-24 right-6 z-50
                     w-[360px] max-h-[560px]
                     bg-white rounded-3xl shadow-2xl
                     border border-gray-100 overflow-hidden
                     flex flex-col
                     transition-all duration-400 ease-out
                     origin-bottom-right
                     ${
                       open
                         ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                         : "opacity-0 scale-90 translate-y-4 pointer-events-none"
                     }`}
      >
        {/* ── Header ── */}
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-500
                      px-5 py-4 flex items-center gap-3 shrink-0"
        >
          {/* Bot avatar */}
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full bg-white/20
                          flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faBolt} className="text-white text-sm" />
            </div>
            {/* Online / offline dot */}
            <div
              className={`absolute -bottom-0.5 -right-0.5
                           w-3 h-3 rounded-full border-2 border-white
                           transition-colors duration-300
                           ${online ? "bg-green-400" : "bg-gray-400"}`}
            />
          </div>

          {/* Name + status */}
          <div className="flex-1">
            <p className="text-white font-bold text-sm leading-none mb-0.5">
              EVA
            </p>
            <p className="text-white/70 text-[10px]">
              {online
                ? "Online · EV Charging Assistant"
                : "Connecting..."}
            </p>
          </div>

          {/* Reset button */}
          <button
            onClick={resetChat}
            title="Reset conversation"
            className="w-8 h-8 rounded-full bg-white/10
                       flex items-center justify-center
                       hover:bg-white/20 transition-colors duration-200 mr-1"
          >
            <FontAwesomeIcon
              icon={faRotateRight}
              className="text-white text-xs"
            />
          </button>

          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10
                       flex items-center justify-center
                       hover:bg-white/20 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-sm" />
          </button>
        </div>

        {/* ── Messages area ── */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50"
          style={{ minHeight: 0 }}
        >
          {msgs.map((msg, i) => (
            <div key={i}>

              {/* Text bubble */}
              {msg.text && (
                <div
                  className={`flex items-end gap-2
                               ${msg.from === "user"
                                 ? "justify-end"
                                 : "justify-start"
                               }`}
                >
                  {/* Bot avatar beside message */}
                  {msg.from === "bot" && (
                    <div
                      className="w-6 h-6 rounded-full shrink-0
                                  bg-gradient-to-br from-emerald-500 to-teal-500
                                  flex items-center justify-center mb-0.5"
                    >
                      <FontAwesomeIcon
                        icon={faBolt}
                        className="text-white text-[8px]"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed
                                 ${msg.from === "user"
                                   ? `rounded-2xl rounded-br-sm
                                      bg-gradient-to-br from-emerald-500 to-teal-500
                                      text-white shadow-sm shadow-emerald-200`
                                   : `rounded-2xl rounded-bl-sm
                                      bg-white border border-gray-100
                                      text-gray-800 shadow-sm`
                                 }`}
                  >
                    {msg.text}
                  </div>
                </div>
              )}

              {/* Image from Rasa */}
              {msg.image && (
                <div className="flex justify-start pl-8">
                  <img
                    src={msg.image}
                    alt="response"
                    className="max-w-[75%] rounded-2xl
                               border border-gray-100 shadow-sm"
                  />
                </div>
              )}

              {/* Quick reply buttons from Rasa */}
              {msg.buttons && (
                <div className="flex flex-wrap gap-2 mt-1 pl-8">
                  {msg.buttons.map((btn, j) => (
                    <button
                      key={j}
                      onClick={() => handleQuickReply(btn.payload)}
                      className="px-3 py-1.5 rounded-full
                                 text-xs font-semibold
                                 bg-emerald-50 border border-emerald-200
                                 text-emerald-600
                                 hover:bg-emerald-100
                                 hover:scale-105 active:scale-95
                                 transition-all duration-150"
                    >
                      {btn.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator (3 bouncing dots) */}
          {loading && (
            <div className="flex items-end gap-2">
              <div
                className="w-6 h-6 rounded-full shrink-0
                            bg-gradient-to-br from-emerald-500 to-teal-500
                            flex items-center justify-center"
              >
                <FontAwesomeIcon
                  icon={faBolt}
                  className="text-white text-[8px]"
                />
              </div>
              <div
                className="bg-white border border-gray-100 rounded-2xl
                            rounded-bl-sm px-4 py-3 flex items-center gap-1
                            shadow-sm"
              >
                {[0, 1, 2].map((d) => (
                  <div
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400
                               animate-bounce"
                    style={{ animationDelay: `${d * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* ── Input bar ── */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
          <div
            className="flex items-center gap-2
                        bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2
                        focus-within:border-emerald-400
                        focus-within:ring-2 focus-within:ring-emerald-100
                        transition-all duration-200"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about EV stations..."
              className="flex-1 bg-transparent outline-none
                         text-sm text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-xl shrink-0
                         bg-gradient-to-br from-emerald-500 to-teal-500
                         flex items-center justify-center
                         hover:scale-110 active:scale-95
                         disabled:opacity-40 disabled:cursor-not-allowed
                         disabled:hover:scale-100
                         transition-all duration-200"
            >
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="text-white text-xs"
              />
            </button>
          </div>
          <p className="text-center text-gray-300 text-[9px] mt-2 tracking-wide">
            Powered by EV Bharat · Rasa AI
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════
           FLOATING ACTION BUTTON (FAB)
      ═══════════════════════════════ */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-50
                     w-14 h-14 rounded-full
                     bg-gradient-to-br from-emerald-500 to-teal-500
                     text-white shadow-xl shadow-emerald-300/50
                     flex items-center justify-center
                     hover:scale-110 active:scale-95
                     transition-all duration-300
                     ${
                       visible
                         ? "opacity-100 translate-y-0"
                         : "opacity-0 translate-y-6"
                     }`}
      >
        {/* Ping ring — only when chat is closed */}
        {!open && (
          <div
            className="absolute inset-0 rounded-full
                        bg-emerald-400/30 animate-ping"
          />
        )}

        <FontAwesomeIcon
          icon={open ? faXmark : faCommentDots}
          className={`text-xl transition-all duration-300
                       ${open ? "rotate-90" : "rotate-0"}`}
        />
      </button>
    </>
  );
}

export default Chatbot;
