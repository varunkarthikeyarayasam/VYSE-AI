import { SupportedLanguage } from "./responses";

export interface CommandSuggestion {
  prefix: string;
  label: string;
  description: string;
  query: string;
}

export const uiStrings = {
  placeholder: {
    en: "Ask VYSE anything or type / for quick workflows...",
    ta: "VYSE-யிடம் ஏதேனும் கேளுங்கள் அல்லது விரைவு கட்டளைகளுக்கு / தட்டச்சு செய்யவும்...",
    te: "VYSE ని ఏదైనా అడగండి లేదా త్వరిత పనుల కోసం / టైప్ చేయండి...",
    hi: "VYSE से कुछ भी पूछें या त्वरित कार्यों के लिए / टाइप करें...",
  },
  listeningPlaceholder: {
    en: "Listening to your voice... Speak now",
    ta: "உங்கள் குரலைக் கேட்கிறது... இப்போது பேசுங்கள்",
    te: "మీ గొంతును వింటుంది... ఇప్పుడు మాట్లాడండి",
    hi: "आपकी आवाज़ सुन रहा है... अब बोलें",
  },
  attach: {
    en: "Attach",
    ta: "இணைக்க",
    te: "జోడించండి",
    hi: "संलग्न करें",
  },
  commands: {
    en: "Commands",
    ta: "கட்டளைகள்",
    te: "ఆదేశాలు",
    hi: "कमांड्स",
  },
  voice: {
    en: "Voice",
    ta: "குரல்",
    te: "వాయిస్",
    hi: "आवाज़",
  },
  listening: {
    en: "Listening...",
    ta: "கேட்கிறது...",
    te: "వింటుంది...",
    hi: "सुन रहा है...",
  },
  send: {
    en: "Send",
    ta: "அனுப்பு",
    te: "పంపండి",
    hi: "भेजें",
  },
  thinking: {
    en: "Thinking",
    ta: "சிந்திக்கிறது",
    te: "ఆలోచిస్తోంది",
    hi: "सोच रहा है",
  },
  disclaimer: {
    en: "Verified Campus AI • Grounded in university regulations",
    ta: "சரிபார்க்கப்பட்ட கல்லூரி AI • பல்கலைக்கழக விதிமுறைகளின்படி",
    te: "ధృవీకరించబడిన క్యాంపస్ AI • విశ్వవిద్యాలయ నిబంధనల ఆధారంగా",
    hi: "सत्यापित कैंपस AI • विश्वविद्यालय नियमों पर आधारित",
  },
  keyboardHint: {
    en: "Press Enter to send, Shift+Enter for newline",
    ta: "அனுப்ப Enter அழுத்தவும், புதிய வரிக்கு Shift+Enter",
    te: "పంపడానికి Enter నొక్కండి, కొత్త లైన్ కోసం Shift+Enter",
    hi: "भेजने के लिए Enter दबाएं, नई पंक्ति के लिए Shift+Enter",
  },
  fastCommands: {
    en: "Campus Fast Commands",
    ta: "விரைவு கல்லூரி கட்டளைகள்",
    te: "త్వరిత క్యాంపస్ ఆదేశాలు",
    hi: "त्वरित कैंपस कमांड्स",
  },
  selectHint: {
    en: "Select",
    ta: "தேர்வு",
    te: "ఎంచుకోండి",
    hi: "चुनें",
  },
  micNotSupported: {
    en: "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.",
    ta: "இந்த உலாவியில் பேச்சு அறிதல் ஆதரிக்கப்படவில்லை. Chrome, Edge அல்லது Safari-ஐப் பயன்படுத்தவும்.",
    te: "ఈ బ్రౌజర్‌లో స్పీచ్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి Chrome, Edge లేదా Safari ఉపయోగించండి.",
    hi: "इस ब्राउज़र में वाक् पहचान समर्थित नहीं है। कृपया Chrome, Edge या Safari का उपयोग करें।",
  },
};

export const localizedCommands: Record<SupportedLanguage, CommandSuggestion[]> = {
  en: [
    {
      prefix: "/od",
      label: "OD Request",
      description: "Request on-duty for hackathon or event",
      query: "I have a hackathon tomorrow and I need OD.",
    },
    {
      prefix: "/schedule",
      label: "Class Schedule",
      description: "Check timetable for tomorrow",
      query: "What do I have tomorrow?",
    },
    {
      prefix: "/bus",
      label: "Bus Routes",
      description: "Find college bus transit timings",
      query: "Which bus should I take from Tambaram for my 8:30 class?",
    },
    {
      prefix: "/attendance",
      label: "Attendance",
      description: "Check current attendance percentage",
      query: "What is my attendance status?",
    },
    {
      prefix: "/exams",
      label: "Exam Schedule",
      description: "Check upcoming internal/semester exams",
      query: "When are my upcoming exams?",
    },
    {
      prefix: "/map",
      label: "Campus Navigation",
      description: "Interactive Google Maps for Block M & Sathyabama campus",
      query: "My exam is in Block M. How do I get there?",
    },
  ],
  ta: [
    {
      prefix: "/od",
      label: "ஆன்-டியூட்டி அனுமதி",
      description: "ஹேக்கத்தான் அல்லது நிகழ்விற்கான OD கோரிக்கை",
      query: "நாளை ஹேக்கத்தான் உள்ளது, எனக்கு ஆன்-டியூட்டி அனுமதி வேண்டும்.",
    },
    {
      prefix: "/schedule",
      label: "வகுப்பு அட்டவணை",
      description: "நாளைய தினத்திற்கான கால அட்டவணையை சரிபார்க்கவும்",
      query: "நாளை எனக்கு என்னென்ன வகுப்புகள் உள்ளன?",
    },
    {
      prefix: "/bus",
      label: "பேருந்து வழித்தடங்கள்",
      description: "கல்லூரி பேருந்து நேரங்களைக் கண்டறியவும்",
      query: "தாம்பரத்திலிருந்து 8:30 வகுப்பிற்கு எந்த பேருந்தில் செல்ல வேண்டும்?",
    },
    {
      prefix: "/attendance",
      label: "வருகைப்பதிவு",
      description: "தற்போதைய வருகை சதவீதத்தை சரிபார்க்கவும்",
      query: "எனது வருகைப்பதிவு விவரங்களை காட்டுங்கள்.",
    },
    {
      prefix: "/exams",
      label: "தேர்வு அட்டவணை",
      description: "வரவிருக்கும் CAT-2 தேர்வுகளைப் பார்க்கவும்",
      query: "எனது தேர்வுகள் எப்போது?",
    },
    {
      prefix: "/map",
      label: "வளாக வரைபடம்",
      description: "பிளாக் M மற்றும் வளாக வரைபட வழிகாட்டல்",
      query: "பிளாக் M-க்கு எப்படி செல்வது?",
    },
  ],
  te: [
    {
      prefix: "/od",
      label: "ఆన్-డ్యూటీ అభ్యర్థన",
      description: "హ్యాకథాన్ లేదా ఈవెంట్ కోసం OD అభ్యర్థన",
      query: "రేపు హ్యాకథాన్ ఉంది, నాకు ఆన్-డ్యూటీ అనుమతి కావాలి.",
    },
    {
      prefix: "/schedule",
      label: "తరగతి సమయ పట్టిక",
      description: "రేపటి విద్యా సమయ పట్టికను తనిఖీ చేయండి",
      query: "రేపు నాకు ఏ తరగతులు ఉన్నాయి?",
    },
    {
      prefix: "/bus",
      label: "బస్సు మార్గాలు",
      description: "కళాశాల బస్సు వేళలను కనుగొనండి",
      query: "తాంబరం నుండి ఉదయం 8:30 క్లాస్‌కి ఏ బస్సు ఎక్కాలి?",
    },
    {
      prefix: "/attendance",
      label: "హాజరు శాతం",
      description: "ప్రస్తుత హాజరు స్థితిని తనిఖీ చేయండి",
      query: "నా ప్రస్తుత హాజరు ఎంత ఉంది?",
    },
    {
      prefix: "/exams",
      label: "పరీక్షల షెడ్యూల్",
      description: "రాబోయే పరీక్షల తేదీలను తనిఖీ చేయండి",
      query: "నా పరీక్షలు ఎప్పుడు ప్రారంభమవుతాయి?",
    },
    {
      prefix: "/map",
      label: "క్యాంపస్ నావిగేషన్",
      description: "బ్లాక్ M మరియు క్యాంపస్ మ్యాప్ మార్గదర్శకం",
      query: "బ్లాక్ M కి ఎలా చేరుకోవాలి?",
    },
  ],
  hi: [
    {
      prefix: "/od",
      label: "ऑन-ड्यूटी अनुरोध",
      description: "हैकाथॉन या कार्यक्रम के लिए OD अनुरोध",
      query: "कल मेरा हैकाथॉन है और मुझे ऑन-ड्यूटी चाहिए।",
    },
    {
      prefix: "/schedule",
      label: "कक्षा समय सारिणी",
      description: "कल की समय सारिणी देखें",
      query: "कल मेरी कौन-सी कक्षाएं हैं?",
    },
    {
      prefix: "/bus",
      label: "बस मार्ग एवं समय",
      description: "कॉलेज बस का समय जानें",
      query: "तांबरम से सुबह 8:30 की क्लास के लिए कौन-सी बस लेनी चाहिए?",
    },
    {
      prefix: "/attendance",
      label: "उपस्थिति प्रतिशत",
      description: "वर्तमान उपस्थिति की स्थिति जांचें",
      query: "मेरी उपस्थिति कितनी है?",
    },
    {
      prefix: "/exams",
      label: "परीक्षा समय सारिणी",
      description: "आगामी आंतरिक/सेमेस्टर परीक्षाएं देखें",
      query: "मेरी परीक्षाएं कब हैं?",
    },
    {
      prefix: "/map",
      label: "कैंपस नेविगेशन",
      description: "ब्लॉक M और कॉलेज परिसर का नक्शा",
      query: "ब्लॉक M कैसे जाएं?",
    },
  ],
};
