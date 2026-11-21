import { getContent } from "@/content/site-content";
import { AppLocale } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { HomeView } from "@/components/home/home-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const heroIntro = t.raw("hero.intro") as string[];
  return {
    title: t("meta.title"),
    description: heroIntro.join(" ").slice(0, 170),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const tAbout = await getTranslations({ locale, namespace: "about" });
  const heroIntro = (t.raw("hero.intro") as string[]) || [];
  const visionParagraphs = (t.raw("vision.paragraphs") as string[]) || [];
  const objectiveAreas = (t.raw("objectives.areas") as string[]) || [];
  const founderAlt = locale === "hi" ? "संस्थापक अलीम अंसारी" : "Founder Alim Ansari portrait";

  const data = getContent(locale);

  const byLawsSections =
    locale === "hi"
      ? [
          {
            title: "संस्था के उपविधि एवं उद्देश्य",
            points: [
              "आर्थिक रूप से कमजोर बच्चों को नि:शुल्क शिक्षा प्रदान हेतु प्रयास।",
              "शिक्षा का प्रचार-प्रसार करना।",
              "समिति समाज के वृद्ध एवं सभी वर्गों के लोगों के लिए विशेष स्वास्थ्य अभियान चलायेगी।",
              "समिति का उद्देश्य सर्वांगीण विकास होगा जिसमें समिति निःशुल्क कार्य करेगी।",
              "पर्यावरण के विकास हेतु वृक्षारोपण करना एवं उपयोगी शिक्षा प्रदान करना।",
              "महिला एवं बाल विकास के कार्यक्रमों का आयोजन करना।",
              "सभी वर्गों के लोगों एवं उनके बच्चों के शिक्षा व स्वास्थ्य सम्बन्धी कार्य हेतु जागरूक करना एवं उन्हें अपने स्तर पर मदद करना।",
              "अल्पसंख्यक वर्ग के बच्चों को विशेष शिक्षा प्रदान हेतु प्रयास करना।",
              "समाज कल्याण के लिए निर्धन एवं आवश्यकताधारक लोगों को सहायता प्रदान करना।",
              "जनता को कृषि के लिए जागरूक करना एवं आवश्यक सामग्री उपलब्ध हेतु प्रयास करना।",
              "समिति समाज कल्याण के लिए गरीब वर्ग के लोगों को समय-समय पर स्वास्थ्य सम्बन्धी शिविर लगाकर जांच करायेगी।",
              "समिति शारीरिक रूप से नि:शुल्क बच्चों एवं लोगों के लिए शिक्षा, स्वास्थ्य और रोजगार सम्बन्धी प्रशिक्षण प्रदान करेगी।",
              "समिति किसी भी प्रकार की अप्राकृतिक घटनाओं जैसे सुनामी, भूकंप, बाढ़ प्रभावित क्षेत्रों आदि में पीड़ितों की मदद करेगी।",
              "बेरोजगारी की समस्या को समिति द्वारा अपने स्तर पर निराकरण हेतु विशेष कार्यक्रम एवं प्रशिक्षण प्रदान करेगी।",
            ],
          },
        ]
      : [
          {
            title: "By-Laws & Objectives",
            points: [
              "To make efforts to provide free education to economically weaker children.",
              "To promote and spread education.",
              "To conduct special health awareness and healthcare campaigns for senior citizens and people from all sections of society.",
              "To work towards the overall development of society through the organization's welfare activities, including free services.",
              "To promote environmental development through tree plantation and by providing useful environmental education.",
              "To organize programs for the development and welfare of women and children.",
              "To create awareness among people of all sections of society and their children regarding education and health, and to assist them as much as possible.",
              "To make efforts to provide special educational support to children belonging to minority communities.",
              "To provide assistance to poor and needy people for social welfare.",
              "To raise awareness about agriculture among the public and make efforts to provide necessary resources and materials.",
              "To organize health camps from time to time for poor and underprivileged people and facilitate medical check-ups.",
              "To provide free education, healthcare, and employment-related training for children and people in need.",
              "To assist victims affected by natural disasters and calamities such as tsunamis, earthquakes, floods, and similar emergencies.",
              "To organize special programs and training initiatives aimed at addressing and reducing unemployment.",
            ],
          },
        ];

  const impactSections =
    locale === "hi"
      ? [
          {
            title: "समुदाय स्वास्थ्य पहल",
            description:
              "हम स्वास्थ्य शिविर, बुनियादी जांच और दवा सहायता के माध्यम से जरूरतमंद परिवारों तक समय पर चिकित्सा सहयोग पहुंचाते हैं।",
            image: "/images/initiatives/community-healthcare-initiatives.png",
          },
          {
            title: "शिक्षा और मार्गदर्शन कार्यक्रम",
            description:
              "हम बच्चों और युवाओं के लिए किताबें, स्कॉलरशिप और सीखने का सहयोग उपलब्ध कराते हैं ताकि शिक्षा का सफर बीच में न रुके।",
            image: "/images/initiatives/education-mentorship-program.png",
          },
          {
            title: "महिला सशक्तिकरण और आजीविका",
            description:
              "कौशल प्रशिक्षण और सामुदायिक सहयोग के जरिए महिलाओं को आर्थिक रूप से मजबूत और आत्मनिर्भर बनाने पर हमारा ध्यान है।",
            image: "/images/initiatives/women-empowerment-livelihood.png",
          },
          {
            title: "खिदमत-ए-खल्क (राहत एवं जनसेवा)",
            description:
              "आपातकालीन सहायता, राशन वितरण और प्राकृतिक आपदाओं के समय जरूरतमंदों तक तत्काल मानवीय राहत पहुंचाना।",
            image: "/images/initiatives/khidtmat-a-khalk.png",
          },
          {
            title: "बाल कल्याण एवं पोषण विकास",
            description:
              "कमजोर वर्ग के बच्चों को पोषण, सुरक्षा और सर्वांगीण विकास के अवसर प्रदान कर उनके उज्ज्वल भविष्य का निर्माण।",
            image: "/images/initiatives/whatwedo.png",
          },
          {
            title: "कौशल विकास एवं स्वावलंबन",
            description:
              "युवाओं और महिलाओं के लिए व्यावसायिक प्रशिक्षण और आत्मनिर्भर रोजगार के नए अवसर तैयार करना।",
            image: "/images/initiatives/womenempowerment.jpg",
          },
        ]
      : [
          {
            title: "Community Healthcare Initiatives",
            description:
              "Through regular health camps, basic screenings and medicine support, we bring timely medical care to families who need it most.",
            image: "/images/initiatives/community-healthcare-initiatives.png",
          },
          {
            title: "Educational and Mentorship Programs",
            description:
              "We support children and youth with books, scholarships and learning guidance so their education journey continues with confidence.",
            image: "/images/initiatives/education-mentorship-program.png",
          },
          {
            title: "Women Empowerment and Livelihood",
            description:
              "Our training and local support pathways help women build sustainable income opportunities and long-term self-reliance.",
            image: "/images/initiatives/women-empowerment-livelihood.png",
          },
          {
            title: "Khidmat-e-Khalq & Relief Support",
            description:
              "Providing immediate humanitarian relief, essential supplies, and emergency support during natural calamities and hardships.",
            image: "/images/initiatives/khidtmat-a-khalk.png",
          },
          {
            title: "Child Welfare & Nutrition Development",
            description:
              "Promoting child healthcare, nutritional well-being, and safe, encouraging spaces for underprivileged young minds to learn.",
            image: "/images/initiatives/whatwedo.png",
          },
          {
            title: "Vocational Skills & Self-Reliance",
            description:
              "Equipping youth and community members with practical skills and guidance toward sustainable self-employment.",
            image: "/images/initiatives/womenempowerment.jpg",
          },
        ];

  const certificates = [
    {
      href: "/certificates/Registration_Letter_Certificate.pdf",
      title: locale === "hi" ? "पंजीयन प्रमाणपत्र" : "Registration Certificate",
      description:
        locale === "hi"
          ? "फाउंडेशन का आधिकारिक पंजीयन पत्र।"
          : "Official registration letter of the foundation.",
    },
    {
      href: "/certificates/DARPAN_Organization_Profile.pdf",
      title: locale === "hi" ? "दर्पण आईडी प्रमाणपत्र" : "Darpan ID Certificate",
      description:
        locale === "hi"
          ? "नीति आयोग एनजीओ दर्पण प्रोफ़ाइल।"
          : "NITI Aayog NGO Darpan organization profile.",
    },
    {
      href: "/certificates/12A80G_Form_106_Registration_u_s_332.pdf",
      title: locale === "hi" ? "12A और 80G पंजीयन प्रमाणपत्र" : "12A & 80G Registration Certificate",
      description:
        locale === "hi"
          ? "12A और 80G पंजीयन का प्रमाण।"
          : "Proof of 12A and 80G registration.",
    },
    {
      href: "/certificates/12A80G_Form_106_Approval_u_s_354.pdf",
      title: locale === "hi" ? "12A और 80G स्वीकृति प्रमाणपत्र" : "12A & 80G Approval Certificate",
      description:
        locale === "hi"
          ? "संस्था की कर छूट स्वीकृति।"
          : "Tax exemption approval for the foundation.",
    },
  ];

  return (
    <HomeView
      locale={locale}
      hero={{
        eyebrow: t("hero.eyebrow"),
        registration: t("hero.registration"),
        tagline: t("hero.tagline"),
        headline: t("hero.headline"),
        introLines: heroIntro,
        ctaLabel: t("cta"),
        storyLabel: t("storyLink"),
      }}
      vision={{
        title: t("vision.title"),
        paragraphs: visionParagraphs,
      }}
      founder={{
        title: tAbout("labels.founderTitle"),
        role: tAbout("labels.founderRole"),
        bio: tAbout("labels.founderBio"),
        alt: founderAlt,
      }}
      objectives={{
        title: t("objectives.title"),
        primary: t("objectives.primary"),
        areasIntro: t("objectives.areasIntro"),
        areas: objectiveAreas,
      }}
      highlights={data.home.highlights}
      byLaws={byLawsSections}
      impactSections={impactSections}
      certificates={certificates}
    />
  );
}
