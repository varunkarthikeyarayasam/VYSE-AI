import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, AlertCircle, CheckCircle2, ChevronDown, Maximize2, Minimize2, X, Clock, ExternalLink } from "lucide-react";
import { Button, Card, Badge, VyseLogo } from "../../ui";
import { sendChatMessage } from "../../../lib/api/ai";
import { confirmOdRequest } from "../../../lib/api/od";
import { useAuth } from "../../../store/authContext";
import type { ActionCardData } from "../../../types/database";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: Array<{ tool: string; status: string; query?: string }>;
  actionCard?: ActionCardData | null;
  citations?: Array<{ id: string; title: string; category: string; source?: string }>;
  timestamp: string;
}

export function VyseChatDrawer({
  isOpen,
  onClose,
  initialQuery,
  onOdConfirmed,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onOdConfirmed?: () => void;
}) {
  const { student, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello ${student?.name || "there"}! I am **VYSE**, your autonomous campus intelligence system. I can check your OD eligibility, prepare and submit leave requests, resolve live bus transit from Tambaram, look up your timetable, or answer academic regulations questions.`,
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "ta" | "hi">("en");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [confirmingCard, setConfirmingCard] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeTool, loading]);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSend(initialQuery);
    }
  }, [initialQuery, isOpen]);

  async function handleSend(textToSend?: string) {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    // Provide visual indicator of tool execution
    const lower = query.toLowerCase();
    if (lower.includes("od") || lower.includes("hackathon")) {
      setActiveTool("Evaluating deterministic OD eligibility rules...");
    } else if (lower.includes("bus") || lower.includes("tambaram")) {
      setActiveTool("Resolving optimal campus bus schedule...");
    } else if (lower.includes("class") || lower.includes("schedule")) {
      setActiveTool("Querying today's academic timetable...");
    } else {
      setActiveTool("Scanning verified institutional knowledge...");
    }

    try {
      const res = await sendChatMessage({
        message: query,
        studentId: student?.id || user?.id,
        language,
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.reply,
        toolCalls: res.tool_calls,
        actionCard: res.action_card,
        citations: res.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚠️ Error executing request: ${err.message}`,
          timestamp: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
      setActiveTool(null);
    }
  }

  async function handleConfirmActionCard(card: ActionCardData) {
    if (!card.draft_token) return;
    setConfirmingCard(card.draft_token);

    try {
      if (card.action === "confirm_od_request") {
        await confirmOdRequest(card.draft_token);

        // Update card in local message state to confirmed
        setMessages((prev) =>
          prev.map((m) => {
            if (m.actionCard?.draft_token === card.draft_token) {
              return {
                ...m,
                actionCard: {
                  ...m.actionCard,
                  status: "CONFIRMED_SUBMITTED",
                },
              };
            }
            return m;
          })
        );

        if (onOdConfirmed) onOdConfirmed();
      }
    } catch (err: any) {
      alert(`Execution failed: ${err.message}`);
    } finally {
      setConfirmingCard(null);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 bg-[#090B10] border-l border-[#212738] shadow-2xl flex flex-col transition-all duration-300 ${
        isFullscreen
          ? "inset-0 w-full h-full"
          : "right-0 bottom-0 top-0 w-full sm:w-[520px] md:w-[560px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <VyseLogo size={36} showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-[var(--text-primary)] text-base tracking-wide">VYSE AI</h2>
              <Badge variant="glow" size="sm">AUTONOMOUS</Badge>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Deterministic Campus Agent</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-[#1A2030] text-xs text-slate-300 border border-[#2B3550] rounded-lg px-2 py-1 outline-none focus:border-indigo-500"
          >
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
          </select>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1A2030] transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1A2030] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <VyseLogo size={28} showText={false} className="shrink-0 mt-0.5" />
            )}

            <div
              className={`max-w-[85%] rounded-md p-4 text-sm leading-relaxed border-hairline ${
                msg.role === "user"
                  ? "bg-[var(--bg-surface)] text-[var(--text-bright)] border-hairline-strong rounded-br-none"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] rounded-tl-none"
              }`}
            >
              {/* Tool Execution Badges */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2.5 pb-2 border-b border-[#212738]">
                  {msg.toolCalls.map((tc, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono"
                    >
                      <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                      {tc.tool}
                    </span>
                  ))}
                </div>
              )}

              {/* Message Content */}
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#212738]">
                  <p className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Verified Citations
                  </p>
                  <div className="space-y-1">
                    {msg.citations.map((c) => (
                      <div
                        key={c.id}
                        className="text-xs bg-[#090B10]/60 p-2 rounded-lg border border-[#212738] flex items-center justify-between"
                      >
                        <span className="font-medium text-indigo-300">{c.title}</span>
                        <span className="text-[10px] text-slate-500">{c.source}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PREPARE ACTION CARD (Consequential Action Pattern) */}
              {msg.actionCard && (
                <div className="mt-4 rounded-xl border border-indigo-500/40 bg-gradient-to-b from-[#181D2E] to-[#121624] p-4 shadow-xl shadow-indigo-950/40">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      PREPARED CONFLICT-FREE ACTION
                    </div>
                    <Badge variant={msg.actionCard.status === "CONFIRMED_SUBMITTED" ? "success" : "warning"}>
                      {msg.actionCard.status === "CONFIRMED_SUBMITTED" ? "SUBMITTED" : "CONFIRMATION REQUIRED"}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-slate-100 text-base mb-1">
                    {msg.actionCard.event_title}
                  </h4>
                  <p className="text-xs text-slate-400 mb-3">
                    Date: {msg.actionCard.event_date} | Reason: {msg.actionCard.reason}
                  </p>

                  <div className="bg-[#090B10]/70 p-2.5 rounded-lg border border-[#212738] mb-3 text-xs text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Attendance Status:</span>
                      <span className="font-semibold text-emerald-400">
                        {msg.actionCard.attendance_percent}% (Eligible)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Faculty:</span>
                      <span className="text-slate-200">Dept. Academic Committee</span>
                    </div>
                  </div>

                  {msg.actionCard.status === "CONFIRMED_SUBMITTED" ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                      Submitted successfully to faculty review queue!
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="glow"
                        className="flex-1"
                        loading={confirmingCard === msg.actionCard.draft_token}
                        onClick={() => handleConfirmActionCard(msg.actionCard!)}
                      >
                        Confirm & Submit to Faculty
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          setMessages((prev) =>
                            prev.filter((m) => m.id !== msg.id)
                          )
                        }
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <span className="block text-[10px] text-slate-500 text-right mt-1.5">
                {msg.timestamp}
              </span>
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Live Active Tool Stream Indicator */}
        {activeTool && (
          <div className="flex items-center gap-2.5 text-xs text-indigo-400 bg-[#141926] border border-indigo-500/30 p-3 rounded-xl animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
            <span>{activeTool}</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Queries */}
      <div className="px-5 py-2 flex items-center gap-2 overflow-x-auto border-t border-[#1C2234] bg-[#0C0F17]">
        <span className="text-[11px] text-slate-400 shrink-0 font-medium">Quick:</span>
        <button
          onClick={() => handleSend("I have a hackathon tomorrow and need OD")}
          className="text-xs bg-[#161B28] hover:bg-[#1E2538] text-indigo-300 border border-[#252E46] px-2.5 py-1 rounded-full shrink-0 transition-colors"
        >
          Hackathon OD Request
        </button>
        <button
          onClick={() => handleSend("What bus should I take from Tambaram?")}
          className="text-xs bg-[#161B28] hover:bg-[#1E2538] text-slate-300 border border-[#252E46] px-2.5 py-1 rounded-full shrink-0 transition-colors"
        >
          Tambaram Bus Schedule
        </button>
        <button
          onClick={() => handleSend("What classes do I have today?")}
          className="text-xs bg-[#161B28] hover:bg-[#1E2538] text-slate-300 border border-[#252E46] px-2.5 py-1 rounded-full shrink-0 transition-colors"
        >
          Today's Timetable
        </button>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-[#212738] bg-[#11141E]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask VYSE about OD, attendance, bus routes, or classes..."
            className="flex-1 bg-[#090B10] border border-[#252E46] focus:border-indigo-500 text-slate-200 text-sm rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-500"
          />
          <Button type="submit" variant="glow" disabled={!input.trim() || loading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}