# VYSE AI — Smart Campus Intelligence System
**Built by Shadow Coders**

VYSE AI is an institutional campus intelligence dashboard and conversational agent grounded in verified university regulations, timetables, bus transit schedules, and attendance records. It features a brutalist-refined **Obsidian Chrome** design system, full real-time **Voice Recognition (Speech-to-Text)**, and complete **Multilingual Support** across English, Tamil, Telugu, and Hindi with automatic language detection.

---

## 🎙️ Voice Recognition (Speech-to-Text)

VYSE provides real-time voice input directly within the chat console:

1. **Browser-Native Web Speech API (Default, Zero-Cost)**:
   - Works natively out of the box in Chromium browsers (Google Chrome, Microsoft Edge, Brave, Opera) and Safari (iOS / macOS).
   - **Zero API keys required and zero cost**.
   - Streams live interim transcription into the text console in real-time.
   - Automatically adapts speech recognition language hints (`en-IN`, `ta-IN`, `te-IN`, `hi-IN`) to match the user's selected or detected language.

2. **OpenAI Whisper API Fallback (Optional)**:
   - If you want cross-browser support on platforms without native Web Speech API (such as Firefox desktop), you can configure an OpenAI API key.
   - VYSE automatically detects the key and activates `MediaRecorder` audio capture with fallback transcription via Whisper (`whisper-1`).

### Configuring Environment Variables

Create or update your `.env` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: OpenAI Whisper Fallback for Speech-to-Text
VITE_OPENAI_API_KEY=sk-...your_openai_key_here...
```

---

## 🌐 Multilingual Support

VYSE natively understands and responds in four primary campus languages:
- **English (`en`)**
- **Tamil (`ta` / தமிழ்)**
- **Telugu (`te` / తెలుగు)**
- **Hindi (`hi` / हिन्दी)**

### Features:
- **Auto-Detection (`auto`)**: The default setting automatically parses the script of the user's query (typed or transcribed) using Unicode range detection (`[\u0B80-\u0BFF]` for Tamil, `[\u0C00-\u0C7F]` for Telugu, `[\u0900-\u097F]` for Hindi) and responds in that language.
- **Manual Override**: The language pill selector in the input toolbar (`Auto`, `EN`, `தமிழ்`, `తెలుగు`, `हिन्दी`) allows students to force a specific language context.
- **UI Localization**: Input placeholders, action buttons ("Attach", "Commands", "Voice", "Send"), slash command descriptions (`/od`, `/schedule`, `/bus`, etc.), and campus disclaimers dynamically localize to the active language.

---

## ➕ How to Add Support for an Additional Language Later

To add a new language (for example, Spanish `es` or Malayalam `ml`):

### 1. Update Supported Languages
In [`src/lib/i18n/responses.ts`](src/lib/i18n/responses.ts):
```typescript
// Add your language code (e.g. 'ml' or 'es')
export type SupportedLanguage = "en" | "ta" | "te" | "hi" | "ml";
export type LanguageOption = "auto" | SupportedLanguage;
```

### 2. Update Language Auto-Detection
In [`src/lib/i18n/responses.ts`](src/lib/i18n/responses.ts), add the Unicode script regex (or keyword detection) inside `detectLanguage()`:
```typescript
export function detectLanguage(query: string, preferredLang: LanguageOption = "auto"): SupportedLanguage {
  if (/[\u0D00-\u0D7F]/.test(query)) return "ml"; // Malayalam Unicode range
  // ...existing checks...
  if (preferredLang !== "auto") return preferredLang;
  return "en";
}
```

### 3. Add Localized Bot Responses
In [`src/lib/i18n/responses.ts`](src/lib/i18n/responses.ts), add the new language handler to each category in `localizedText`:
```typescript
export const localizedText = {
  attendance: {
    en: (pct, attended, total, buffer) => `...`,
    // Add new language translation:
    ml: (pct, attended, total, buffer) =>
      `നിങ്ങളുടെ പരിശോധിച്ച ഹാജർ നില **${pct}%** ആണ്...`,
  },
  // Repeat for scheduleTomorrow, nextClass, exams, odEligible, etc.
};
```

### 4. Add Localized UI Strings & Commands
In [`src/lib/i18n/uiStrings.ts`](src/lib/i18n/uiStrings.ts):
```typescript
export const uiStrings = {
  placeholder: {
    // ...
    ml: "VYSE-യോട് എന്തെങ്കിലും ചോദിക്കുക അല്ലെങ്കിൽ / ടൈപ്പ് ചെയ്യുക...",
  },
  // Add 'ml' translations for attach, commands, voice, send, thinking, etc.
};

// Add localized slash commands
export const localizedCommands: Record<SupportedLanguage, CommandSuggestion[]> = {
  // ...
  ml: [
    { prefix: "/od", label: "ഓൺ-ഡ്യൂട്ടി അപേക്ഷ", description: "ഹാക്കത്തോൺ OD അപേക്ഷ", query: "..." },
  ],
};
```

### 5. Update Speech Recognition Language Map
In [`src/lib/speech/useSpeechRecognition.ts`](src/lib/speech/useSpeechRecognition.ts):
```typescript
export type SpeechLanguage = "auto" | "en" | "ta" | "te" | "hi" | "ml";

const BROWSER_LANG_MAP: Record<SpeechLanguage, string> = {
  // ...
  ml: "ml-IN",
};
```

### 6. Add to the Language Selector
In [`src/components/chat/ChatInput.tsx`](src/components/chat/ChatInput.tsx):
```typescript
const languages: { code: LanguageOption; label: string; title: string }[] = [
  { code: "auto", label: "Auto", title: "Auto-detect language" },
  { code: "en", label: "EN", title: "English" },
  { code: "ta", label: "தமிழ்", title: "Tamil" },
  { code: "te", label: "తెలుగు", title: "Telugu" },
  { code: "hi", label: "हिन्दी", title: "Hindi" },
  { code: "ml", label: "മലയാളം", title: "Malayalam" },
];
```

---

## 🧪 Manual Verification Checklist

Follow this checklist to test voice recognition and multilingual capabilities:

| Step | Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- |
| **1** | Click the **Voice** button (microphone icon) in the chat bar. | Browser displays permission prompt: *"Use your microphone"*. | [ ] |
| **2** | Allow microphone access and speak clearly: *"What is my attendance status?"* | Mic button turns red with pulsing indicator (`Listening...`). Partial speech streams into the input box in real-time. | [ ] |
| **3** | Click **Stop** or pause speaking. | Speech transcription finalizes inside the text input box ready for review. | [ ] |
| **4** | Press **Send** (or hit Enter). | Normal message sending pipeline triggers. Bot responds with verified Attendance card. | [ ] |
| **5** | Click **Voice** and remain silent for 6–8 seconds. | Notice banner displays: *"No speech detected. Please speak clearly into your microphone."* UI does not freeze. | [ ] |
| **6** | In browser site settings, set Microphone to **Block** and click **Voice**. | Error banner displays: *"Microphone access denied. Please allow microphone permissions in your browser."* | [ ] |
| **7** | Set Language Selector to **Auto**. Type: *"நாளை வகுப்புகள் என்ன?"* (Tamil). | Bot auto-detects Tamil and responds with Tamil verified Schedule card. | [ ] |
| **8** | Type: *"मेरी उपस्थिति क्या है?"* (Hindi). | Bot auto-detects Hindi and responds with Hindi verified Attendance card. | [ ] |
| **9** | Type: *"నా హాజరు ఎంత?"* (Telugu). | Bot auto-detects Telugu and responds with Telugu verified Attendance card. | [ ] |
| **10** | Click **தமிழ்** in the language selector. | UI placeholder changes to Tamil (*"VYSE-யிடம் ஏதேனும் கேளுங்கள்..."*), slash commands display Tamil descriptions. | [ ] |
| **11** | With **தமிழ்** selected, click **Voice** and speak in Tamil. | Speech recognition operates with `ta-IN` language hints for native accuracy. | [ ] |

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript type check
npx tsc --noEmit

# Production build
npm run build
```
