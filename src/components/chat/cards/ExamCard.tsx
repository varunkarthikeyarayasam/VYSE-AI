import React from "react";
import { Calendar, Clock, MapPin, AlertCircle, FileText, Sparkles } from "lucide-react";

export interface ExamItem {
  id: string;
  courseCode: string;
  courseName: string;
  examType: string;
  examDate: string;
  room?: string;
  maxMarks: number;
}

export interface ExamCardData {
  title: string;
  description: string;
  exams: ExamItem[];
}

export function ExamCard({ data }: { data: ExamCardData }) {
  return (
    <div className="rounded-lg border border-hairline bg-[var(--bg-surface)] p-5 space-y-4 max-w-xl text-[var(--text-primary)] my-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-hairline">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-[0.14em] text-[var(--text-tertiary)] uppercase">
          <Calendar className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          <span>{data.title}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-hairline">
          <Sparkles className="w-3 h-3 text-[var(--text-tertiary)]" />
          Official Schedule
        </span>
      </div>

      <p className="text-xs text-[var(--text-secondary)]">{data.description}</p>

      {/* Exam Items */}
      <div className="space-y-2.5">
        {data.exams.map((exam, idx) => (
          <div
            key={exam.id || idx}
            className="p-3.5 rounded-md bg-[var(--bg-surface-2)] border border-hairline space-y-2 hover:border-hairline-strong transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-[var(--text-primary)] bg-[var(--bg-base)] px-1.5 py-0.5 rounded border border-hairline">
                    {exam.courseCode}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] bg-[var(--bg-base)] px-1.5 py-0.5 rounded border border-hairline">
                    {exam.examType.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-medium text-[var(--text-primary)] text-xs mt-1">
                  {exam.courseName}
                </h4>
              </div>

              <div className="text-right shrink-0 font-mono">
                <span className="text-xs font-semibold text-[#C29B38] block">
                  {exam.maxMarks} Marks
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-[var(--text-secondary)] pt-1 border-t border-hairline font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[var(--text-tertiary)]" />
                {exam.examDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[var(--text-tertiary)]" />
                10:00 AM - 11:30 AM
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[var(--text-tertiary)]" />
                {exam.room || "Block M (Room 302)"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-md bg-[var(--bg-surface-2)] border border-hairline flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
        <FileText className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
        <span>
          Exam seating arrangements and hall tickets are verified against institutional RFID attendance logs.
        </span>
      </div>
    </div>
  );
}
