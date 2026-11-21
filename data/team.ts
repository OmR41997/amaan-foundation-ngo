export type TeamMember = {
  name: string;
  role?: string;
  imageFile: string;
  bio?: string;
  district?: string;
  state?: string;
  country?: string;
};

export const COMMON_NGO_ROLES = [
  "Founder & President",
  "Vice President",
  "Treasurer",
  "Secretary",
  "Joint Secretary",
  "Patron",
  "Core Member",
  "Medical Support",
  "Medical Team",
  "Legal Advisor",
  "Media Incharge",
  "Executive Member",
  "Volunteer",
] as const;

export const teamMembers: TeamMember[] = [
  { name: "Alim Ansari", role: "Founder & President", imageFile: "alim.jpeg" },

  { name: "Shabana Begum", role: "Vice President", imageFile: "shabanabegum.jpg" },
  { name: "Kalim Ansari", role: "Vice President", imageFile: "kalimansari.jpg" },
  { name: "Mohammad Wasim Ansari", role: "Vice President", imageFile: "wasim.jpg" },

  { name: "Musawwir Ahmed Siddiqui", role: "Treasurer", imageFile: "ahmedsiddiqui.jpg" },

  { name: "Hasan Ali", role: "Secretary", imageFile: "hasanali.jpg" },
  { name: "Ghulam Moinuddin", role: "Joint Secretary", imageFile: "ghulam.jpg" },
  { name: "Tajuddin Ansari", role: "Joint Secretary", imageFile: "tajuddinansari.jpeg" },

  { name: "Mohammad Imran", role: "Patron", imageFile: "imran.jpg" },
  { name: "Jasbir Singh Chawla", role: "Patron", imageFile: "jasbir.jpeg" },
  { name: "Nasim Ansari", role: "Patron", imageFile: "naseemansari.jpg" },
  { name: "Shekh Ayyub", role: "Patron", imageFile: "shekhayyub-patron.jpg" },

  { name: "Maulana Shabbir Noori", role: "Core Member", imageFile: "maulanashabbirnoori-coremember.jpg" },
  { name: "Waseem Ullah Khan", role: "Core Member", imageFile: "waseemullah.jpg" },
  { name: "Kunal Ramteke ", role: "Core Member", imageFile: "kunalramteke.jpg" },
  { name: "Firoz Ansari", role: "Core Member", imageFile: "firozansari.jpg" },
  { name: "Afsana Saifi", role: "Core Member", imageFile: "afsanasaifi.jpg" },
  { name: "Sana Parween", role: "Core Member", imageFile: "sanaparween.jpg" },

  { name: "Sadaf Bano", role: "Core Member", imageFile: "sadafbano.jpg" },
  { name: "Ruhi Nazmi", role: "Core Member", imageFile: "ruhinazmi-coremember.jpg" },
  { name: "Shruti Kedia", role: "Core Member", imageFile: "shrutikedia-coremember.jpg" },
  { name: "Shajad Ansari", role: "Core Member", imageFile: "shajadansari.jpg" },
  { name: "Tanweer Sadab", role: "Core Member", imageFile: "tanweersadab.jpg" },
  { name: "Ravendra Pandey", role: "Core Member", imageFile: "ravendrapandey-coremember.jpg" },

  { name: "Kamlesh Lavhatre", role: "Media Incharge", imageFile: "kamlesh.jpg" },
  { name: "Kumar Poptani", role: "Media Incharge", imageFile: "kumarpoptani.jpg" },

  { name: "Nasimuddin Ansari", role: "Legal Advisor", imageFile: "nasimuddin.jpg" },
  { name: "Dinesh Lahre", role: "Legal Advisor", imageFile: "dinesh.jpg" },

  { name: "Dr Rupesh Agrawal", role: "Medical Support", imageFile: "rupesh.jpg" },
  { name: "Dr J P Kaushik", role: "Medical Support", imageFile: "jpkaushik.jpg" },
  { name: "Dr Samarth Sharma", role: "Medical Support", imageFile: "samarth.jpeg" },
  { name: "Dr Salim Khan", role: "Medical Support", imageFile: "salimkhan.jpg" },
  { name: "Dr Nosheen Riza", role: "Medical Support", imageFile: "drnosheenriza-medicalsupport.jpeg" },
  { name: "Dr Shagufta Parween", role: "Medical Support", imageFile: "shagufta.jpg" },
  { name: "Dr Nayeem Khan", role: "Medical Support", imageFile: "nayeem.jpg" },
  { name: "Dr Virendra Dahire", role: "Medical Support", imageFile: "virendra.jpg" },
  { name: "Dr Umesh Sahu", role: "Medical Support", imageFile: "umeshsahu.jpg" },
  { name: "Dr Ravikant Singh", role: "Medical Support", imageFile: "ravikant.jpg" },
  { name: "Dr Akhilesh Deoras ", role: "Medical Support", imageFile: "akhilesh.jpg" },
  { name: "Dr Rajnish Pandey", role: "Medical Support", imageFile: "rajnish.jpg" },
  { name: "Dr Aslam Arif", role: "Medical Support", imageFile: "aslamarif.jpg" },
];
