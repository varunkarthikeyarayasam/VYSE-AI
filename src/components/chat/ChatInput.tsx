import React, { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  Command,
  SendIcon,
  LoaderIcon,
  Mic,
  MicOff,
  Globe,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui";
import { LanguageOption, detectLanguage } from "@/lib/i18n/responses";
import { uiStrings, localizedCommands } from "@/lib/i18n/uiStrings";
import { useSpeechRecognition } from "@/lib/speech/useSpeechRecognition";

export function ChatInput({
  onSendMessage,
  loading,
  language = "auto",
  onLanguageChange,
  placeholder,
}: {
  onSendMessage: (msg: string, attachmentName?: string) => void;
  loading: boolean;
  language?: LanguageOption;
  onLanguageChange: (lang: LanguageOption) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [showCommands, setShowCommands] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commandPaletteRef = useRef<HTMLDivElement>(null);

  // Compute effective language for UI strings
  const effectiveLang = detectLanguage(text, language);
  const activeCommands = localizedCommands[effectiveLang] || localizedCommands.en;

  const [lastTranscribed, setLastTranscribed] = useState<{
    text: string;
    locale: string;
    detectedLang: string;
  } | null>(null);

  // Real-time Speech-to-Text via Web Speech API with Whisper Fallback
  const {
    isListening,
    interimTranscript,
    error: speechError,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    onTranscriptChange: (transcript, isFinal, metadata) => {
      setText(transcript);
      if (isFinal && transcript.trim()) {
        const detected = detectLanguage(transcript, language);
        setLastTranscribed({
          text: transcript.trim(),
          locale: metadata?.locale || "en-IN",
          detectedLang: detected,
        });
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
      }
    },
  });

  // Trigger command palette on '/'
  useEffect(() => {
    if (text.startsWith("/") && !text.includes(" ")) {
      setShowCommands(true);
      const query = text.toLowerCase();
      const idx = activeCommands.findIndex((c) =>
        c.prefix.toLowerCase().startsWith(query)
      );
      setActiveSuggestion(idx >= 0 ? idx : 0);
    } else {
      setShowCommands(false);
    }
  }, [text, activeCommands]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (showCommands) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev < activeCommands.length - 1 ? prev + 1 : 0
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev > 0 ? prev - 1 : activeCommands.length - 1
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const selected = activeCommands[activeSuggestion];
        if (selected) {
          setText(selected.query);
          setShowCommands(false);
        }
        return;
      }
      if (e.key === "Escape") {
        setShowCommands(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleSubmit() {
    if ((!text.trim() && !attachment) || loading) return;
    if (isListening) {
      stopListening();
    }
    onSendMessage(text, attachment || undefined);
    setText("");
    setAttachment(null);
    setShowCommands(false);
    resetTranscript();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file.name);
    }
  }

  function handleToggleVoice() {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening(language);
    }
  }

  function selectCommand(cmd: (typeof activeCommands)[number]) {
    setText(cmd.query);
    setShowCommands(false);
    textareaRef.current?.focus();
  }

  const languages: { code: LanguageOption; label: string; title: string }[] = [
    { code: "auto", label: "Auto", title: "Auto-detect language from input" },
    { code: "en", label: "EN", title: "English" },
    { code: "ta", label: "தமிழ்", title: "Tamil (தமிழ்)" },
    { code: "te", label: "తెలుగు", title: "Telugu (తెలుగు)" },
    { code: "hi", label: "हिन्दी", title: "Hindi (हिन्दी)" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 select-none">
      {/* Speech Status Banner */}
      {isListening && (
        <div className="mb-2 flex items-center justify-between gap-2 px-3.5 py-2 rounded-md bg-[#B5675C]/10 border border-[#B5675C]/30 text-[#B5675C] text-xs font-mono animate-in fade-in duration-150">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B5675C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B5675C]"></span>
            </span>
            <span className="font-semibold">{uiStrings.listening[effectiveLang]}</span>
            {interimTranscript && (
              <span className="text-[var(--text-primary)] truncate font-normal italic">
                "{interimTranscript}"
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={stopListening}
            className="text-[10px] uppercase tracking-wider underline hover:text-white cursor-pointer"
          >
            Stop
          </button>
        </div>
      )}

      {/* Speech Error Banner */}
      {speechError && (
        <div className="mb-2 flex items-center justify-between gap-2 px-3 py-1.5 rounded-md bg-[#B5675C]/15 border border-[#B5675C]/35 text-[#B5675C] text-xs font-mono animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{speechError}</span>
          </div>
          <button
            type="button"
            onClick={resetTranscript}
            className="text-[var(--text-tertiary)] hover:text-white cursor-pointer ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Raw Speech Transcription Diagnostic Chip */}
      {lastTranscribed && (
        <div className="mb-2 flex items-center justify-between gap-2 px-3 py-1.5 rounded-md bg-[var(--bg-surface-2)] border border-[var(--border-hairline-strong)] text-[11px] font-mono text-[var(--text-secondary)] animate-in fade-in duration-100">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[#7A8C7A] font-semibold shrink-0">🎙️ STT Captured:</span>
            <span className="text-[var(--text-primary)] truncate font-normal">"{lastTranscribed.text}"</span>
            <span className="shrink-0 text-[10px] px-1.5 py-0.2 rounded bg-[var(--bg-base)] border border-[var(--border-hairline)] text-[var(--text-tertiary)]">
              STT: {lastTranscribed.locale} • Script: {lastTranscribed.detectedLang.toUpperCase()}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setLastTranscribed(null)}
            className="text-[var(--text-tertiary)] hover:text-white cursor-pointer ml-1"
            title="Dismiss diagnostic"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Attachment Preview Chip */}
      {attachment && (
        <div className="mb-2 flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface-2)] border border-[var(--border-hairline-strong)] text-xs text-[var(--text-primary)] w-fit">
          <Paperclip className="w-3.5 h-3.5 stroke-[1.5]" />
          <span className="font-mono text-[11px]">{attachment}</span>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="text-[var(--text-tertiary)] hover:text-[#B5675C] ml-1 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Obsidian Chrome Chatbox Container */}
      <div className="relative rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-3.5 sm:p-4 shadow-2xl focus-within:border-[var(--border-hairline-strong)] transition-all duration-150">
        {/* Command Palette Dropdown */}
        {showCommands && (
          <div
            ref={commandPaletteRef}
            className="absolute left-2 right-2 bottom-full mb-2 bg-[var(--bg-surface)] rounded-lg z-50 border border-[var(--border-hairline)] shadow-2xl overflow-hidden p-1.5 animate-in fade-in duration-100"
          >
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)] border-b border-[var(--border-hairline)] mb-1 flex items-center justify-between">
              <span>{uiStrings.fastCommands[effectiveLang]}</span>
              <span className="text-[9px] text-[var(--text-tertiary)]">ESC to close</span>
            </div>
            {activeCommands.map((suggestion, index) => (
              <div
                key={suggestion.prefix}
                onClick={() => selectCommand(suggestion)}
                className={`flex items-center justify-between px-3 py-2 text-xs rounded-md cursor-pointer transition-all ${
                  activeSuggestion === index
                    ? "bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border-hairline)]"
                    : "text-[var(--text-secondary)] hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[var(--text-primary)] font-semibold">
                    {suggestion.prefix}
                  </span>
                  <span className="font-medium text-[var(--text-primary)]">{suggestion.label}</span>
                  <span className="text-[var(--text-tertiary)] text-[11px] hidden sm:inline font-mono">
                    — {suggestion.description}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
                  ↵ {uiStrings.selectHint[effectiveLang]}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening
              ? uiStrings.listeningPlaceholder[effectiveLang]
              : (placeholder || uiStrings.placeholder[effectiveLang])
          }
          rows={2}
          disabled={loading}
          className="w-full bg-transparent text-sm sm:text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] border-none outline-none resize-none px-1 pt-0.5 max-h-36 leading-relaxed"
        />

        {/* Action Toolbar */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-hairline)] mt-2">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              title="Attach document or OD proof"
            >
              <Paperclip className="w-3.5 h-3.5 stroke-[1.5]" />
              <span className="hidden sm:inline text-xs font-medium">
                {uiStrings.attach[effectiveLang]}
              </span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowCommands(!showCommands)}
              title="Quick commands (/od, /schedule, /bus)"
            >
              <Command className="w-3.5 h-3.5 stroke-[1.5]" />
              <span className="hidden sm:inline text-xs font-medium">
                {uiStrings.commands[effectiveLang]}
              </span>
            </Button>

            {/* Voice Recognition STT Button */}
            <Button
              type="button"
              variant={isListening ? "danger" : "secondary"}
              size="sm"
              onClick={handleToggleVoice}
              title={
                !isSpeechSupported
                  ? uiStrings.micNotSupported[effectiveLang]
                  : isListening
                  ? "Stop listening"
                  : "Voice input (Speech-to-Text)"
              }
              aria-label="Voice input"
              aria-pressed={isListening}
              className={`transition-all ${isListening ? "ring-2 ring-[#B5675C]/50 animate-pulse" : ""}`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 stroke-[1.5] text-[#B5675C]" />
                  <span className="text-xs text-[#B5675C] hidden sm:inline font-mono">
                    {uiStrings.listening[effectiveLang]}
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span className="hidden sm:inline text-xs font-medium">
                    {uiStrings.voice[effectiveLang]}
                  </span>
                </>
              )}
            </Button>

            {/* Language Selector with Auto-detect */}
            <div className="flex items-center gap-1 pl-1 ml-1 border-l border-[var(--border-hairline)]" role="group" aria-label="Language selection">
              <Globe className="w-3.5 h-3.5 stroke-[1.5] text-[var(--text-tertiary)] ml-1 hidden md:block" />
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => onLanguageChange(l.code)}
                  title={l.title}
                  aria-pressed={language === l.code}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    language === l.code
                      ? "bg-[var(--cta-solid)] text-[var(--cta-solid-text)] font-bold"
                      : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Action Button: Solid Off-White Pill Send Button */}
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={(!text.trim() && !attachment) || loading}
            className="min-w-[88px]"
          >
            {loading ? (
              <>
                <LoaderIcon className="w-3.5 h-3.5 animate-spin" />
                <span className="text-xs">{uiStrings.thinking[effectiveLang]}</span>
              </>
            ) : (
              <>
                <SendIcon className="w-3.5 h-3.5 stroke-[2]" />
                <span className="text-xs">{uiStrings.send[effectiveLang]}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between px-2 pt-2 text-[10px] font-mono text-[var(--text-tertiary)]">
        <span>{uiStrings.disclaimer[effectiveLang]}</span>
        <span className="hidden sm:inline">{uiStrings.keyboardHint[effectiveLang]}</span>
      </div>
    </div>
  );
}