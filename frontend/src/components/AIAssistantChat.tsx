"use client";
import React, { useState, useRef, useEffect } from "react";
import { chatWithAgent, AgentToolStep } from "../lib/api";
import { EntrepreneurProfile } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  tools?: AgentToolStep[];
  engine?: string;
}

interface AIAssistantChatProps {
  /** Current beneficiary profile so agent answers are personalized */
  profile?: EntrepreneurProfile | null;
}

const QUICK_PROMPTS = [
  "Which schemes am I eligible for?",
  "EMI for a ₹15 lakh loan",
  "Where do I apply near me?",
  "What documents do I need?",
];

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ profile }) => {
  const { lang } = useLanguage();
  const [open, setOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Namaste! 🙏 I'm Sahayak, your AI scheme advisor. Ask me which government schemes you qualify for, EMI estimates, where to apply, or what documents you need.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async (text: string) => {
    const msg = text.trim();
    if (!msg || busy) return;

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setBusy(true);

    try {
      const res = await chatWithAgent(msg, profile ?? null, history, lang);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply, tools: res.tools_used, engine: res.engine },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that right now. Please try again, or call the national helpline 14566.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        style={{
          position: "fixed",
          bottom: "1.4rem",
          right: "1.4rem",
          zIndex: 2000,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "2px solid var(--border-highlight, #3ec6d8)",
          background: "linear-gradient(135deg, #0ea5b7 0%, #6366f1 100%)",
          color: "#fff",
          fontSize: "1.6rem",
          cursor: "pointer",
          boxShadow: "0 8px 28px rgba(14, 165, 183, 0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.15s ease",
        }}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Sahayak AI assistant"
          style={{
            position: "fixed",
            bottom: "5.6rem",
            right: "1.4rem",
            zIndex: 2001,
            width: "min(400px, calc(100vw - 2rem))",
            height: "min(560px, calc(100vh - 8rem))",
            display: "flex",
            flexDirection: "column",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-surface, #101623)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "0.85rem 1rem",
              background: "linear-gradient(135deg, #0ea5b7 0%, #6366f1 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>🤖</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: "0.92rem" }}>Sahayak — AI Scheme Advisor</div>
              <div style={{ fontSize: "0.68rem", opacity: 0.85 }}>
                Grounded in 12 live govt schemes • EMI • Partners
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.9rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              background: "var(--bg-app, #0b0f19)",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  background: m.role === "user" ? "var(--brand-primary, #0ea5b7)" : "var(--bg-card, #161d2e)",
                  color: m.role === "user" ? "#fff" : "var(--text-primary, #e6ebf4)",
                  padding: "0.6rem 0.8rem",
                  borderRadius: m.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                  fontSize: "0.82rem",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  border: m.role === "user" ? "none" : "1px solid var(--border-subtle)",
                }}
              >
                {m.content}
                {m.tools && m.tools.length > 0 && (
                  <div
                    style={{
                      marginTop: "0.45rem",
                      paddingTop: "0.45rem",
                      borderTop: "1px dashed var(--border-subtle)",
                      fontSize: "0.66rem",
                      color: "var(--text-muted, #8b95a8)",
                    }}
                  >
                    {m.tools.map((t, ti) => (
                      <div key={ti}>🔧 {t.tool}: {t.detail}</div>
                    ))}
                    {m.engine === "llm" && <div>✨ phrased with LLM</div>}
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "var(--bg-card, #161d2e)",
                  color: "var(--text-muted, #8b95a8)",
                  padding: "0.6rem 0.8rem",
                  borderRadius: "12px 12px 12px 3px",
                  fontSize: "0.8rem",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                Sahayak is checking schemes…
              </div>
            )}
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", padding: "0 0.9rem 0.5rem" }}>
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  style={{
                    background: "var(--bg-card, #161d2e)",
                    color: "var(--brand-accent, #3ec6d8)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "999px",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "0.35rem 0.6rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            style={{
              display: "flex",
              gap: "0.5rem",
              padding: "0.7rem 0.9rem",
              borderTop: "1px solid var(--border-subtle)",
              background: "var(--bg-surface, #101623)",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about schemes, EMI, documents…"
              aria-label="Message to Sahayak"
              disabled={busy}
              style={{
                flex: 1,
                background: "var(--bg-card, #161d2e)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary, #e6ebf4)",
                borderRadius: "8px",
                padding: "0.55rem 0.7rem",
                fontSize: "0.82rem",
                fontFamily: "inherit",
                outline: "none",
                minHeight: "42px",
              }}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              style={{
                background: "linear-gradient(135deg, #0ea5b7 0%, #6366f1 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                width: "42px",
                cursor: busy || !input.trim() ? "not-allowed" : "pointer",
                fontSize: "1rem",
                opacity: busy || !input.trim() ? 0.5 : 1,
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
};
