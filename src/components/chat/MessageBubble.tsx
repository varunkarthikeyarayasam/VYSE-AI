import React from "react";
import { Sparkles, Bot, CheckCircle2, Bookmark, Clock, User } from "lucide-react";
import { ContextIndicator } from "./cards/ContextIndicator";
import { EligibilityCard, type OdWorkflowData } from "./cards/EligibilityCard";
import { ScheduleCard, type ScheduleItem } from "./cards/ScheduleCard";
import { TransportCard, type TransportCardData } from "./cards/TransportCard";
import { EventCard, type EventCardData } from "./cards/EventCard";
import { NoticeCard, type NoticeItem } from "./cards/NoticeCard";
import { NavigationCard, type NavigationCardData } from "./cards/NavigationCard";
import { AttendanceCard, type AttendanceCardData } from "./cards/AttendanceCard";
import { ExamCard, type ExamCardData } from "./cards/ExamCard";
import { VyseLogo } from "../ui/VyseLogo";
import { MarkdownContent } from "./MarkdownContent";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  contextTag?: string;
  toolCalls?: Array<{ tool: string; status: string }>;
  cardType?: "od_eligibility" | "schedule" | "transport" | "event" | "notice" | "navigation" | "attendance" | "exam";
  cardData?: any;
  citations?: Array<{ id: string; title: string; category: string; source?: string }>;
  timestamp: string;
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end my-3 select-text">
        <div className="max-w-[85%] sm:max-w-xl rounded-md px-4 py-3 bg-[var(--bg-surface-2)] border border-[var(--border-hairline-strong)] text-[var(--text-primary)] text-sm leading-relaxed">
          <p className="whitespace-pre-wrap">{message.content}</p>
          <span className="text-[10px] font-mono text-[var(--text-tertiary)] block text-right mt-1.5">
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 my-4 select-text max-w-full">
      {/* Bot Icon with Precision Apple Squircle VyseLogo */}
      <VyseLogo size={28} showText={false} className="shrink-0 mt-0.5" />

      <div className="flex-1 min-w-0 space-y-2">
        {/* Context Indicator if present */}
        {message.contextTag && (
          <ContextIndicator context={message.contextTag} />
        )}

        {/* Tool Execution Pills */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {message.toolCalls.map((tc, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-[var(--border-hairline)]"
              >
                <CheckCircle2 className="w-3 h-3 stroke-[1.5] text-[#7A8C7A]" />
                <span>{tc.tool}</span>
              </span>
            ))}
          </div>
        )}

        {/* Text Content Surface */}
        <div className="rounded-md p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] text-sm leading-relaxed max-w-2xl">
          <MarkdownContent content={message.content} />

          {/* Structured Contextual Cards */}
          {message.cardType === "od_eligibility" && message.cardData && (
            <EligibilityCard data={message.cardData} />
          )}

          {message.cardType === "schedule" && message.cardData && (
            <ScheduleCard title={message.cardData.title} items={message.cardData.items} />
          )}

          {message.cardType === "transport" && message.cardData && (
            <TransportCard data={message.cardData} />
          )}

          {message.cardType === "event" && message.cardData && (
            <EventCard data={message.cardData} />
          )}

          {message.cardType === "notice" && message.cardData && (
            <NoticeCard items={message.cardData.items} />
          )}

          {message.cardType === "navigation" && message.cardData && (
            <NavigationCard data={message.cardData} />
          )}

          {message.cardType === "attendance" && message.cardData && (
            <AttendanceCard data={message.cardData} />
          )}

          {message.cardType === "exam" && message.cardData && (
            <ExamCard data={message.cardData} />
          )}

          {/* Citations / Source of Truth */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-[var(--border-hairline)] flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-tertiary)]">
              <span className="font-mono text-[var(--text-secondary)] flex items-center gap-1">
                <Bookmark className="w-3 h-3 stroke-[1.5]" />
                Source:
              </span>
              {message.citations.map((c, idx) => (
                <span key={idx} className="bg-[var(--bg-surface-2)] px-2 py-0.5 rounded text-[var(--text-secondary)] font-mono text-[10px] border border-[var(--border-hairline)]">
                  {c.title}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-tertiary)] pt-2 mt-2 border-t border-[var(--border-hairline)]">
            <span>VYSE Operational Core</span>
            <span>{message.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}