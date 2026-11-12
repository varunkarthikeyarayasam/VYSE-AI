import { useState, useEffect, useRef, useCallback } from "react";
import { transcribeWithWhisper, isWhisperConfigured } from "./whisperService";

export type SpeechLanguage = "auto" | "en" | "ta" | "te" | "hi";

const BROWSER_LANG_MAP: Record<SpeechLanguage, string> = {
  auto: "en-IN",
  en: "en-IN",
  ta: "ta-IN",
  te: "te-IN",
  hi: "hi-IN",
};

export interface UseSpeechRecognitionOptions {
  onTranscriptChange?: (
    transcript: string,
    isFinal: boolean,
    metadata?: { locale: string; lang: SpeechLanguage }
  ) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isUsingWhisperRef = useRef<boolean>(false);
  const activeLangRef = useRef<SpeechLanguage>("auto");

  // Check browser speech recognition support
  const isWebSpeechSupported = typeof window !== "undefined" && Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );
  const isSupported = isWebSpeechSupported || isWhisperConfigured();

  // Initialize Web Speech API if supported
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let accumulatedFinal = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) {
            accumulatedFinal += text + " ";
          } else {
            interim += text;
          }
        }

        const locale = recognitionRef.current?.lang || BROWSER_LANG_MAP[activeLangRef.current] || "en-IN";

        if (accumulatedFinal) {
          console.log(`%c[VYSE STT RAW TRANSCRIPTION] FINAL: "${accumulatedFinal.trim()}"`, "background: #16181B; color: #7A8C7A; font-weight: bold; padding: 2px 6px; border-radius: 4px;", {
            locale,
            lang: activeLangRef.current,
            transcript: accumulatedFinal.trim(),
          });

          setFinalTranscript((prev) => {
            const next = (prev ? prev + " " : "") + accumulatedFinal.trim();
            options.onTranscriptChange?.(next, true, { locale, lang: activeLangRef.current });
            return next;
          });
        }

        if (interim) {
          setInterimTranscript(interim);
          options.onTranscriptChange?.(interim, false, { locale, lang: activeLangRef.current });
        } else {
          setInterimTranscript("");
        }
      };

      recognition.onerror = (event: any) => {
        let msg = "An error occurred during speech recognition.";
        switch (event.error) {
          case "not-allowed":
          case "permission-denied":
            msg = "Microphone access denied. Please allow microphone permissions in your browser.";
            break;
          case "no-speech":
            msg = "No speech detected. Please speak clearly into your microphone.";
            break;
          case "audio-capture":
            msg = "No microphone was found. Please ensure a microphone is connected.";
            break;
          case "network":
            msg = "Network issue during speech recognition. Please check your connection.";
            break;
          case "aborted":
            return; // Normal cancel/abort
          default:
            msg = `Speech recognition error: ${event.error}`;
        }
        setError(msg);
        options.onError?.(msg);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const startListening = useCallback(
    async (lang: SpeechLanguage = "auto") => {
      setError(null);
      activeLangRef.current = lang;

      // 1. Prefer Native Web Speech API
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = BROWSER_LANG_MAP[lang] || "en-IN";
          recognitionRef.current.start();
          return;
        } catch (e: any) {
          // If already started, ignore or restart
          if (e.name !== "InvalidStateError") {
            console.warn("Web Speech API start error:", e);
          }
        }
      }

      // 2. Fallback to MediaRecorder + Whisper if Web Speech API is absent
      if (isWhisperConfigured() && navigator.mediaDevices?.getUserMedia) {
        try {
          isUsingWhisperRef.current = true;
          audioChunksRef.current = [];
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data);
          };

          recorder.onstop = async () => {
            setIsListening(false);
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            stream.getTracks().forEach((t) => t.stop());

            try {
              const text = await transcribeWithWhisper(audioBlob, lang === "auto" ? undefined : lang);
              if (text.trim()) {
                setFinalTranscript(text);
                options.onTranscriptChange?.(text, true);
              } else {
                setError("No speech detected in recording.");
              }
            } catch (err: any) {
              const msg = err.message || "Failed to transcribe audio with Whisper.";
              setError(msg);
              options.onError?.(msg);
            }
          };

          recorder.start();
          setIsListening(true);
          return;
        } catch (permErr: any) {
          const msg = "Microphone access denied or audio recording failed.";
          setError(msg);
          options.onError?.(msg);
          setIsListening(false);
          return;
        }
      }

      // 3. Not supported
      const unsuppMsg = "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.";
      setError(unsuppMsg);
      options.onError?.(unsuppMsg);
    },
    [options]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
    }

    setIsListening(false);
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setFinalTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  return {
    isListening,
    interimTranscript,
    finalTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}
