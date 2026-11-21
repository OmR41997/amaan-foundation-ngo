import { AppLocale } from "@/i18n/routing";

export const navLinks = [
  { key: "home", href: "" },
  { key: "about", href: "/about" },
  { key: "amaansStory", href: "/amaans-story" },
  { key: "work", href: "/what-we-do" },
  { key: "team", href: "/team" },
  { key: "gallery", href: "/gallery" },
  { key: "contact", href: "/contact" },
] as const;



export type LocalizedContent = typeof content.en;

export const content: Record<AppLocale, {
  siteName: string;
  nav: Record<(typeof navLinks)[number]["key"], string>;
  cta: string;
  footerTagline: string;
  address: string;
  phone: string;
  email: string;
  social: string[];
  home: {
    heroTitle: string;
    heroSubtitle: string;
    intro: string;
    highlights: { title: string; value: string; description: string }[];
    projectGullak?: { title: string; description: string; points: string[] };
    callout?: string;
  };
  about: {
    title: string;
    formation: string;
    mission: string;
    objectives: string[];
    achievements: string[];
    futureVision: string;
    storyTitle: string;
    story: string[];
  };
  activities: { title: string; description: string }[];
  team: { name: string; role: string; image: string }[];
  gallery: { src: string; title: string; category: string }[];
  contact: {
    title: string;
    subtitle: string;
    formLabels: { name: string; phone: string; message: string; submit: string };
    validation: { name: string; phone: string; message: string };
    success: string;
  };
}> = {
  en: {
    siteName: "Amaan Ansari Welfare Foundation",
    nav: {
      home: "Home",
      about: "About",
      amaansStory: "Amaan's Story",
      work: "What We Do",
      team: "Team",
      gallery: "Gallery",
      contact: "Contact Us",
    },
    cta: "Join us",
    footerTagline: "Building dignity through healthcare, education and compassion-led action.",
    address: "House No. 1350/7, Tegi Manzil, Devi Nagar, Maharana Pratap Chowk, Bilaspur (C.G.)",
    phone: "+91 9993090959",
    email: "connect@amaanansariwelfare.org",
    social: ["Instagram", "Facebook", "YouTube"],
    home: {
      heroTitle: "Every life deserves care, respect and a fair chance.",
      heroSubtitle:
        "Amaan Ansari Welfare Foundation works hand in hand with families who are unseen, unheard and underserved.",
      intro:
        "Our foundation stands with communities during their most vulnerable moments and helps them rebuild with dignity.",
      highlights: [
        {
          title: "Families reached",
          value: "4,000+",
          description: "Direct support through food, medicine and social aid.",
        },
        {
          title: "Students supported",
          value: "850+",
          description: "Scholarships, books and after-school guidance.",
        },
        {
          title: "Women trained",
          value: "300+",
          description: "Skill and livelihood programs for financial confidence.",
        },
      ],
      // projectGullak: {
      //   title: "Project Gullak",
      //   description:
      //     "A small monthly contribution model where citizens contribute with consistency to build emergency funds for urgent community needs.",
      //   points: [
      //     "Micro-donations pooled for medical emergencies",
      //     "Transparent monthly updates to donors",
      //     "Community-owned support for rapid response",
      //   ],
      // },
      // callout: "When a community saves together, no child is left behind.",
    },
    about: {
      title: "About the Foundation",
      formation:
        "Amaan Ansari Welfare Foundation was formed on 9 September 2021 by Alim Ansari as a people-first initiative grounded in empathy and accountability.",
      mission:
        "Our mission is to ensure no family is denied basic dignity due to poverty, illness, unemployment or social exclusion.",
      objectives: [
        "Bridge healthcare gaps for low-income families",
        "Keep children connected to education",
        "Enable women and youth toward stable livelihoods",
        "Support the elderly with care and companionship",
      ],
      achievements: [
        "Regular health support and medicine camps",
        "Education sponsorship drives for school-going children",
        "Local volunteer network across multiple neighborhoods",
      ],
      futureVision:
        "Our long-term vision is to establish a community-focused hospital and a school/college ecosystem where quality care and education remain affordable for all.",
      storyTitle: "Amaan's Journey",
      story: [
        "Amaan grew up watching families around him choose between medicine and meals. Those memories stayed with him and shaped his purpose.",
        "The foundation began not as an institution, but as a promise: that no person seeking help should feel invisible.",
        "Today, every project carries that same spirit - practical support, respectful listening and a belief that compassion can be organized for impact.",
      ],
    },
    activities: [
      { title: "Healthcare Support", description: "Medical aid, medicine assistance and emergency interventions for vulnerable families." },
      { title: "Educational Support", description: "Scholarships, educational materials and mentoring for students at risk of dropping out." },
      { title: "Unemployment Help", description: "Skill mapping, job-link support and financial relief during employment transitions." },
      { title: "Women Empowerment", description: "Training programs and self-help pathways that improve confidence and income security." },
      { title: "Child Development", description: "Nutrition, learning support and safe community spaces for children's growth." },
      { title: "Environmental Awareness", description: "Neighborhood cleanliness drives, tree plantation and climate-sensitive practices." },
      { title: "Elderly Care", description: "Routine support, welfare assistance and social inclusion for senior citizens." },
      { title: "Marriage Support", description: "Responsible and dignified assistance for underprivileged girls' marriage needs." },
    ],
    team: Array.from({ length: 14 }).map((_, index) => ({
      name: [
        "Alim Ansari",
        "Sana Parveen",
        "Faizan Malik",
        "Nida Khan",
        "Arif Hussain",
        "Rubina Shaikh",
        "Aamir Qureshi",
        "Hina Fatima",
        "Danish Rahman",
        "Shabnam Ali",
        "Imran Siddiqui",
        "Rukhsar Jahan",
        "Adil Farooqui",
        "Afsana Noor",
      ][index],
      role: [
        "Founder & President",
        "Vice President",
        "Operations Lead",
        "Women Outreach Coordinator",
        "Healthcare Program Lead",
        "Education Coordinator",
        "Community Partnerships",
        "Volunteer Manager",
        "Employment Support Lead",
        "Child Development Lead",
        "Finance & Compliance",
        "Media & Documentation",
        "Field Coordinator",
        "Community Mobilizer",
      ][index],
      image: `/images/assets/team-${index + 1}.svg`,
    })),
    gallery: Array.from({ length: 24 }).map((_, index) => ({
      src: `/images/gallery/gallery${index + 1}.jpeg`,
      title: [
        "Health Camp Outreach",
        "Community Education Session",
        "Certificate Recognition",
        "Project Gullak Meeting",
        "Women's Skill Workshop",
        "Tree Plantation Drive",
        "Child Learning Circle",
        "Elderly Support Visit",
        "Marriage Support Event",
        "Youth Engagement Drive",
        "Relief Support Distribution",
        "Healthcare Medical Camp",
        "Educational Scholarship Distribution",
        "Community Gathering",
        "Women Empowerment Program",
        "Food Distribution Event",
        "Children's Nutrition Program",
        "Skill Development Workshop",
        "Community Volunteer Meeting",
        "Family Support Visit",
        "Health Awareness Camp",
        "Educational Support Session",
        "Community Outreach Program",
        "Foundation Impact Documentation",
      ][index],
      category: ["Event", "Activity", "Certificate", "Project", "Training", "Environment", "Children", "Care", "Support", "Community", "Relief", "Healthcare", "Education", "Community", "Training", "Support", "Children", "Training", "Volunteer", "Care", "Healthcare", "Education", "Community", "Impact"][index],
    })),
    contact: {
      title: "Contact Us",
      subtitle: "Reach out to collaborate, volunteer or support any ongoing initiative.",
      formLabels: {
        name: "Full Name",
        phone: "Phone Number",
        message: "Message",
        submit: "Send Message",
      },
      validation: {
        name: "Please enter your full name.",
        phone: "Please enter a valid 10-digit phone number.",
        message: "Please share a short message.",
      },
      success: "Thank you. Our team will contact you shortly.",
    },
  },
  hi: {
    siteName: "अमान अंसारी वेलफेयर फाउंडेशन",
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      amaansStory: "अमान की कहानी",
      work: "हम क्या करते हैं",
      team: "टीम",
      gallery: "गैलरी",
      contact: "संपर्क करें",
    },
    cta: "हमसे जुड़ें",
    footerTagline: "स्वास्थ्य, शिक्षा और संवेदनशील सेवा से सम्मानपूर्ण जीवन की ओर।",
    address: "मकान नंबर - 1350/7, तेगी मंजिल, देवी नगर, महाराणा प्रताप चौक, बिलासपुर (छ.ग.)",
    phone: "+91 9993090959",
    email: "connect@amaanansariwelfare.org",
    social: ["इंस्टाग्राम", "फेसबुक", "यूट्यूब"],
    home: {
      heroTitle: "हर जीवन को देखभाल, सम्मान और अवसर मिलना चाहिए।",
      heroSubtitle: "अमान अंसारी वेलफेयर फाउंडेशन उन परिवारों के साथ खड़ा है जो अक्सर व्यवस्था से दूर रह जाते हैं।",
      intro: "हम संकट के समय समुदाय के साथ खड़े होकर उन्हें सम्मान के साथ आगे बढ़ने में मदद करते हैं।",
      highlights: [
        { title: "सहायता प्राप्त परिवार", value: "4,000+", description: "खाद्य, दवाइयों और सामाजिक सहायता के माध्यम से।" },
        { title: "समर्थित विद्यार्थी", value: "850+", description: "स्कॉलरशिप, किताबें और मार्गदर्शन।" },
        { title: "प्रशिक्षित महिलाएं", value: "300+", description: "कौशल और आजीविका कार्यक्रम।" },
      ],
      // projectGullak: {
      //   title: "प्रोजेक्ट गुल्लक",
      //   description: "मासिक छोटे योगदानों के माध्यम से आपातकालीन सामुदायिक सहायता को मजबूत करने की पहल।",
      //   points: [
      //     "मेडिकल इमरजेंसी के लिए सामूहिक फंड",
      //     "दानदाताओं के लिए पारदर्शी मासिक अपडेट",
      //     "समुदाय आधारित तेज सहायता तंत्र",
      //   ],
      // },
      // callout: "जब समुदाय साथ बचत करता है, तब कोई बच्चा पीछे नहीं छूटता।",
    },
    about: {
      title: "फाउंडेशन के बारे में",
      formation: "अमान अंसारी वेलफेयर फाउंडेशन की स्थापना 9 सितंबर 2021 को अलीम अंसारी ने सहानुभूति और जवाबदेही के साथ की।",
      mission: "हमारा मिशन है कि गरीबी, बीमारी, बेरोजगारी या सामाजिक उपेक्षा के कारण कोई परिवार सम्मान से वंचित न रहे।",
      objectives: [
        "कम आय वाले परिवारों तक स्वास्थ्य सहायता पहुंचाना",
        "बच्चों की शिक्षा निरंतर बनाए रखना",
        "महिलाओं और युवाओं को आजीविका से जोड़ना",
        "बुजुर्गों को देखभाल और साथ देना",
      ],
      achievements: [
        "नियमित स्वास्थ्य सहायता और दवा कैंप",
        "स्कूली बच्चों के लिए शिक्षा सहयोग अभियान",
        "कई मोहल्लों में सक्रिय स्वयंसेवक नेटवर्क",
      ],
      futureVision: "हमारी दीर्घकालिक दृष्टि एक सामुदायिक अस्पताल और स्कूल/कॉलेज की स्थापना है, जहां गुणवत्ता पूर्ण सेवाएं सभी के लिए सुलभ हों।",
      storyTitle: "अमान की यात्रा",
      story: [
        "अमान ने बचपन से देखा कि कई परिवार दवा और भोजन में से किसी एक को चुनने पर मजबूर होते हैं।",
        "फाउंडेशन एक संस्था बनने से पहले एक वादा था - मदद मांगने वाला कोई भी व्यक्ति अनदेखा महसूस न करे।",
        "आज हर पहल उसी भावना से चलती है - व्यावहारिक सहयोग, सम्मानपूर्ण संवाद और असरदार करुणा।",
      ],
    },
    activities: [
      { title: "स्वास्थ्य सहायता", description: "जरूरतमंद परिवारों के लिए मेडिकल सहायता और आपातकालीन सहयोग।" },
      { title: "शिक्षा सहायता", description: "छात्रवृत्ति, अध्ययन सामग्री और मेंटरशिप।" },
      { title: "बेरोजगारी सहायता", description: "कौशल पहचान, नौकरी कनेक्ट और संक्रमण काल में सहायता।" },
      { title: "महिला सशक्तिकरण", description: "प्रशिक्षण और स्वावलंबन के अवसर।" },
      { title: "बाल विकास", description: "पोषण, सीखने का सहयोग और सुरक्षित सामुदायिक स्थान।" },
      { title: "पर्यावरण जागरूकता", description: "सफाई अभियान, वृक्षारोपण और जिम्मेदार व्यवहार।" },
      { title: "बुजुर्ग देखभाल", description: "नियमित सहयोग और सामाजिक समावेशन।" },
      { title: "विवाह सहायता", description: "आर्थिक रूप से कमजोर बेटियों के विवाह में सम्मानजनक सहयोग।" },
    ],
    team: Array.from({ length: 14 }).map((_, index) => ({
      name: `टीम सदस्य ${index + 1}`,
      role: [
        "संस्थापक एवं अध्यक्ष",
        "उपाध्यक्ष",
        "ऑपरेशन लीड",
        "महिला समन्वय",
        "हेल्थकेयर प्रोग्राम",
        "शिक्षा समन्वय",
        "साझेदारी समन्वय",
        "स्वयंसेवक प्रबंधन",
        "रोजगार सहायता",
        "बाल विकास",
        "वित्त एवं अनुपालन",
        "मीडिया दस्तावेजीकरण",
        "फील्ड समन्वय",
        "समुदाय मोबलाइज़र",
      ][index],
      image: `/images/assets/team-${index + 1}.svg`,
    })),
    gallery: Array.from({ length: 24 }).map((_, index) => ({
      src: `/images/gallery/gallery${index + 1}.jpeg`,
      title: [
        "स्वास्थ्य शिविर",
        "सामुदायिक शिक्षा सत्र",
        "प्रमाणपत्र वितरण",
        "गुल्लक परियोजना मीटिंग",
        "महिला कौशल कार्यशाला",
        "वृक्षारोपण अभियान",
        "बाल शिक्षा कक्षा",
        "बुजुर्ग देखभाल दौरा",
        "विवाह सहायता कार्यक्रम",
        "युवा सहभागिता कार्यक्रम",
        "राहत वितरण कार्यक्रम",
        "चिकित्सा शिविर",
        "छात्रवृत्ति वितरण",
        "सामुदायिक सभा",
        "महिला सशक्तिकरण",
        "खाद्य वितरण",
        "बाल पोषण कार्यक्रम",
        "कौशल विकास प्रशिक्षण",
        "स्वयंसेवक बैठक",
        "परिवार सहायता दौरा",
        "स्वास्थ्य जागरूकता शिविर",
        "शिक्षा समर्थन सत्र",
        "सामुदायिक आउटरीच कार्यक्रम",
        "संस्थान प्रभाव दस्तावेजीकरण",
      ][index],
      category: ["स्वास्थ्य", "गतिविधि", "प्रमाणपत्र", "परियोजना", "प्रशिक्षण", "पर्यावरण", "बचपन", "देखभाल", "समर्थन", "सामुदायिक", "राहत", "स्वास्थ्य", "शिक्षा", "सामुदायिक", "प्रशिक्षण", "समर्थन", "बचपन", "प्रशिक्षण", "स्वयंसेवक", "देखभाल", "स्वास्थ्य", "शिक्षा", "सामुदायिक", "प्रभाव"][index],
    })),
    contact: {
      title: "संपर्क करें",
      subtitle: "सहयोग, स्वयंसेवा या किसी पहल के लिए हमसे जुड़ें।",
      formLabels: {
        name: "पूरा नाम",
        phone: "फोन नंबर",
        message: "संदेश",
        submit: "संदेश भेजें",
      },
      validation: {
        name: "कृपया अपना नाम दर्ज करें।",
        phone: "कृपया सही 10 अंकों का फोन नंबर दर्ज करें।",
        message: "कृपया अपना संदेश लिखें।",
      },
      success: "धन्यवाद। हमारी टीम आपसे शीघ्र संपर्क करेगी।",
    },
  },
};

export const getContent = (locale: AppLocale) => content[locale];


