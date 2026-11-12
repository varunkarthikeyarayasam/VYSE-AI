export type SupportedLanguage = "en" | "ta" | "te" | "hi";
export type LanguageOption = "auto" | SupportedLanguage;

export function detectLanguage(query: string, preferredLang: LanguageOption = "auto"): SupportedLanguage {
  // Check for Tamil Unicode range
  if (/[\u0B80-\u0BFF]/.test(query)) return "ta";
  // Check for Telugu Unicode range
  if (/[\u0C00-\u0C7F]/.test(query)) return "te";
  // Check for Devanagari / Hindi Unicode range
  if (/[\u0900-\u097F]/.test(query)) return "hi";
  
  if (preferredLang !== "auto") {
    return preferredLang;
  }
  return "en";
}

export const localizedText = {
  attendance: {
    en: (pct: number, attended: number, total: number, buffer: number) =>
      `Your current verified overall attendance is **${pct}%** (${attended}/${total} classes attended). You are **+${buffer}%** above the required 75.0% university threshold and securely in the **Safe Zone**.`,
    ta: (pct: number, attended: number, total: number, buffer: number) =>
      `உங்கள் தற்போதைய சரிபார்க்கப்பட்ட வருகைப்பதிவு **${pct}%** (${attended}/${total} வகுப்புகள்). நீங்கள் பல்கலைக்கழகத்தின் கட்டாய 75.0% வரம்பை விட **+${buffer}%** அதிகமாகப் பெற்று **பாதுகாப்பான மண்டலத்தில் (Safe Zone)** உள்ளீர்கள்.`,
    te: (pct: number, attended: number, total: number, buffer: number) =>
      `మీ ప్రస్తుత ధృవీకరించబడిన మొత్తం హాజరు **${pct}%** (${attended}/${total} తరగతులు). మీరు తప్పనిసరి 75.0% విశ్వవిద్యాలయ పరిమితి కంటే **+${buffer}%** ఎక్కువగా ఉండి **సురక్షిత జోన్ (Safe Zone)** లో ఉన్నారు.`,
    hi: (pct: number, attended: number, total: number, buffer: number) =>
      `आपकी वर्तमान सत्यापित कुल उपस्थिति **${pct}%** (${attended}/${total} कक्षाएं) है। आप अनिवार्य 75.0% विश्वविद्यालय सीमा से **+${buffer}%** ऊपर हैं और **सुरक्षित क्षेत्र (Safe Zone)** में हैं।`,
  },
  scheduleTomorrow: {
    en: () =>
      `Here is your verified academic timetable for tomorrow. All sessions are scheduled in **Block M** and lab facilities:`,
    ta: () =>
      `நாளைய தினத்திற்கான உங்கள் சரிபார்க்கப்பட்ட கல்வி கால அட்டவணை இதோ. அனைத்து வகுப்புகளும் **பிளாக் M** மற்றும் ஆய்வகங்களில் திட்டமிடப்பட்டுள்ளன:`,
    te: () =>
      `రేపటి కోసం మీ ధృవీకరించబడిన విద్యా సమయ పట్టిక ఇక్కడ ఉంది. అన్ని తరగతులు **బ్లాక్ M** మరియు ల్యాబ్‌లలో నిర్ణయించబడ్డాయి:`,
    hi: () =>
      `कल के लिए आपकी सत्यापित शैक्षणिक समय सारिणी यहाँ है। सभी कक्षाएं **ब्लॉक M** और प्रयोगशालाओं में निर्धारित हैं:`,
  },
  nextClass: {
    en: (code: string, name: string, time: string, room: string, faculty: string) =>
      `Your next class is **${code}: ${name}** tomorrow at **${time}** in **${room}**, conducted by **${faculty}**.`,
    ta: (code: string, name: string, time: string, room: string, faculty: string) =>
      `உங்கள் அடுத்த வகுப்பு நாளை காலை **${time}** மணிக்கு **${room}**-ல் நடைபெறும் **${code}: ${name}**. இதை நடத்துபவர் **${faculty}**.`,
    te: (code: string, name: string, time: string, room: string, faculty: string) =>
      `మీ తదుపరి తరగతి రేపు ఉదయం **${time}** గంటలకు **${room}** లో **${code}: ${name}**, బోధకులు: **${faculty}**.`,
    hi: (code: string, name: string, time: string, room: string, faculty: string) =>
      `आपकी अगली कक्षा कल **${time}** बजे **${room}** में **${code}: ${name}** है, जिसे **${faculty}** द्वारा संचालित किया जाएगा।`,
  },
  exams: {
    en: () =>
      `Here is the verified schedule for your upcoming **Continuous Assessment Test 2 (CAT-2)** examinations:`,
    ta: () =>
      `உங்கள் வரவிருக்கும் **CAT-2 இடைப்பருவத் தேர்வுகளுக்கான** சரிபார்க்கப்பட்ட கால அட்டவணை இதோ:`,
    te: () =>
      `మీ రాబోయే **CAT-2 పరీక్షల** ధృవీకరించబడిన సమయ పట్టిక ఇక్కడ ఉంది:`,
    hi: () =>
      `आपकी आगामी **CAT-2 परीक्षाओं** की सत्यापित समय सारिणी यहाँ है:`,
  },
  odEligible: {
    en: (eventTitle: string, pct: number, threshold: number) =>
      `I verified your eligibility for **${eventTitle}**. With an attendance of **${pct}%** (threshold: ${threshold}%) and available semester allowances, you meet all criteria. You can prepare and submit your OD request below:`,
    ta: (eventTitle: string, pct: number, threshold: number) =>
      `**${eventTitle}** நிகழ்விற்கான உங்கள் ஆன்-டியூட்டி தகுதியை நான் சரிபார்த்தேன். உங்கள் வருகைப்பதிவு **${pct}%** (வரம்பு: ${threshold}%) ஆக இருப்பதால் நீங்கள் முழு தகுதி பெற்றுள்ளீர்கள். உங்கள் OD கோரிக்கையை கீழே சமர்ப்பிக்கலாம்:`,
    te: (eventTitle: string, pct: number, threshold: number) =>
      `**${eventTitle}** కోసం మీ ఆన్-డ్యూటీ అర్హతను ధృవీకరించాను. మీ హాజరు **${pct}%** (పరిమితి: ${threshold}%) తో మీరు అర్హత పొందారు. మీ OD అభ్యర్థనను క్రింద సమర్పించవచ్చు:`,
    hi: (eventTitle: string, pct: number, threshold: number) =>
      `मैंने **${eventTitle}** के लिए आपकी ऑन-ड्यूटी पात्रता का सत्यापन किया है। **${pct}%** उपस्थिति (सीमा: ${threshold}%) के साथ आप पूर्णतः पात्र हैं। आप नीचे अपना OD अनुरोध सबमिट कर सकते हैं:`,
  },
  odStatus: {
    en: (status: string, eventTitle: string, id: string) =>
      `Your On-Duty request for **${eventTitle}** (ID: \`${id}\`) is currently **${status.toUpperCase()}**. It has been recorded in the institutional registry and routed to faculty admin for formal sign-off.`,
    ta: (status: string, eventTitle: string, id: string) =>
      `**${eventTitle}** நிகழ்விற்கான உங்கள் ஆன்-டியூட்டி கோரிக்கை (எண்: \`${id}\`) தற்போது **${status.toUpperCase()}** நிலையில் உள்ளது. இது பேராசிரியரின் ஒப்புதலுக்காக அனுப்பப்பட்டுள்ளது.`,
    te: (status: string, eventTitle: string, id: string) =>
      `**${eventTitle}** కోసం మీ ఆన్-డ్యూటీ అభ్యర్థన (ID: \`${id}\`) ప్రస్తుతం **${status.toUpperCase()}** స్థితిలో ఉంది. ఇది అధ్యాపకుల ఆమోదం కోసం పంపబడింది.`,
    hi: (status: string, eventTitle: string, id: string) =>
      `**${eventTitle}** के लिए आपका ऑन-ड्यूटी अनुरोध (ID: \`${id}\`) वर्तमान में **${status.toUpperCase()}** स्थिति में है। यह फैकल्टी अनुमोदन के लिए भेजा गया है।`,
  },
  transport: {
    en: (origin: string) =>
      `Based on your registered location in **${origin}**, here is the verified campus transit schedule:`,
    ta: (origin: string) =>
      `**${origin}**-ல் உங்கள் பதிவு செய்யப்பட்ட முகவரியின் அடிப்படையில், சரிபார்க்கப்பட்ட கல்லூரி பேருந்து அட்டவணை இதோ:`,
    te: (origin: string) =>
      `**${origin}** లో మీ నమోదిత చిరునామా ఆధారంగా, ధృవీకరించబడిన కళాశాల బస్సు సమయాలు ఇక్కడ ఉన్నాయి:`,
    hi: (origin: string) =>
      `**${origin}** में आपके पंजीकृत पते के आधार पर, सत्यापित कॉलेज बस समय सारिणी यहाँ है:`,
  },
  events: {
    en: () =>
      `Here are the verified campus events scheduled for tomorrow:`,
    ta: () =>
      `நாளை நடைபெற உள்ள சரிபார்க்கப்பட்ட கல்லூரி நிகழ்வுகள் இதோ:`,
    te: () =>
      `రేపు జరగనున్న ధృవీకరించబడిన క్యాంపస్ ఈవెంట్‌లు ఇక్కడ ఉన్నాయి:`,
    hi: () =>
      `कल आयोजित होने वाले सत्यापित कॉलेज कार्यक्रम यहाँ हैं:`,
  },
  notices: {
    en: () =>
      `Here are the latest verified institutional notices and urgent updates:`,
    ta: () =>
      `நிறுவனத்தின் சமீபத்திய சரிபார்க்கப்பட்ட அறிவிப்புகள் மற்றும் முக்கிய தகவல்கள் இதோ:`,
    te: () =>
      `తాజా ధృవీకరించబడిన సంస్థాగత నోటీసులు మరియు ముఖ్యమైన సమాచారం ఇక్కడ ఉన్నాయి:`,
    hi: () =>
      `नवीनतम सत्यापित संस्थागत सूचनाएं और महत्वपूर्ण अपडेट यहाँ हैं:`,
  },
  navigation: {
    en: (location: string, room: string) =>
      `Here are your turn-by-turn walking directions to **${location} (${room})**:`,
    ta: (location: string, room: string) =>
      `**${location} (${room})**-க்கு செல்வதற்கான வழிகாட்டல் குறிப்புகள் இதோ:`,
    te: (location: string, room: string) =>
      `**${location} (${room})** చేరుకోవడానికి మార్గదర్శకాలు ఇక్కడ ఉన్నాయి:`,
    hi: (location: string, room: string) =>
      `**${location} (${room})** तक पहुँचने के चरणबद्ध निर्देश यहाँ हैं:`,
  },
  compoundOdTransit: {
    en: (event: string, origin: string) =>
      `I've handled both parts of your request for tomorrow's **${event}**:\n\n1. **On-Duty Eligibility**: Your 90.7% attendance meets regulations, and your OD authorization card is prepared below.\n2. **Campus Transit**: The verified **${origin} Special** departs at 07:00 AM to get you to the venue on time.`,
    ta: (event: string, origin: string) =>
      `நாளைய **${event}** குறித்த உங்கள் இரண்டு கோரிக்கைகளும் கையாளப்பட்டுள்ளன:\n\n1. **ஆன்-டியூட்டி அனுமதி**: உங்கள் 90.7% வருகைப்பதிவு தகுதியுடையது; உங்கள் OD அட்டை கீழே தயாராக உள்ளது.\n2. **போக்குவரத்து**: நிகழ்வு இடத்திற்கு சரியான நேரத்தில் சென்றடைய **${origin} சிறப்புப் பேருந்து** காலை 07:00 மணிக்கு புறப்படுகிறது.`,
    te: (event: string, origin: string) =>
      `రేపటి **${event}** కోసం మీ రెండు అభ్యర్థనలు పరిష్కరించబడ్డాయి:\n\n1. **ఆన్-డ్యూటీ అర్హత**: మీ 90.7% హాజరు నిబంధనలకు అనుగుణంగా ఉంది, OD కార్డు క్రింద సిద్ధంగా ఉంది.\n2. **రవాణా**: మిమ్మల్ని సమయానికి చేర్చడానికి **${origin} స్పెషల్ బస్సు** ఉదయం 07:00 గంటలకు బయలుదేరుతుంది.`,
    hi: (event: string, origin: string) =>
      `कल के **${event}** के लिए आपके दोनों अनुरोध संसाधित कर दिए गए हैं:\n\n1. **ऑन-ड्यूटी पात्रता**: आपकी 90.7% उपस्थिति नियमों के अनुरूप है, आपका OD कार्ड नीचे तैयार है।\n2. **परिवहन**: आपको समय पर पहुँचाने के लिए **${origin} स्पेशल बस** सुबह 07:00 बजे रवाना होगी।`,
  },
  unverifiedRefusal: {
    en: () =>
      `I searched the verified institutional knowledge base, but found no verified campus records or university regulations regarding that inquiry. \n\nVYSE answers strictly using verified institutional data to prevent hallucinations and inaccuracies. If you have an academic, schedule, transport, examination, or On-Duty question, please let me know!`,
    ta: () =>
      `சரிபார்க்கப்பட்ட நிறுவன அறிவுத் தளத்தில் தேடினேன், ஆனால் இந்தக் கேள்விக்கான பல்கலைக்கழக ஆவணங்கள் அல்லது அதிகாரப்பூர்வ தகவல்கள் எதுவும் கிடைக்கவில்லை.\n\nதவறான தகவல்களைத் தவிர்க்க, VYSE சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ தகவல்களை மட்டுமே பதில்களாக வழங்குகிறது. உங்கள் வகுப்புகள், தேர்வுகள், பேருந்து அல்லது ஆன்-டியூட்டி குறித்து ஏதேனும் கேள்விகள் இருந்தால் கேளுங்கள்!`,
    te: () =>
      `నేను ధృవీకరించబడిన సంస్థాగత డేటాబేస్‌లో శోధించాను, కానీ ఈ ప్రశ్నకు సంబంధించి ఎటువంటి అధికారిక రికార్డులు లభించలేదు.\n\nతప్పుడు సమాచారాన్ని నివారించడానికి, VYSE కేవలం ధృవీకరించబడిన సమాచారంతో మాత్రమే సమాధానమిస్తుంది. విద్యా తరగతులు, పరీక్షలు, బస్సు లేదా ఆన్-డ్యూటీ గురించి ఏవైనా ప్రశ్నలు ఉంటే దయచేసి అడగండి!`,
    hi: () =>
      `मैंने सत्यापित संस्थागत नॉलेज बेस में खोज की, लेकिन इस प्रश्न से संबंधित कोई आधिकारिक विश्वविद्यालय रिकॉर्ड या नियम नहीं मिले।\n\nगलत जानकारी और भ्रम से बचने के लिए, VYSE केवल सत्यापित संस्थागत डेटा के आधार पर ही उत्तर देता है। यदि आपके पास शैक्षणिक कार्यक्रम, परीक्षा, बस या ऑन-ड्यूटी से संबंधित कोई प्रश्न है, तो कृपया पूछें!`,
  },
};
