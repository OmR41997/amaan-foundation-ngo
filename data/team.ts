import rawTeamMembers from "@/public/collections/team-members.json";

export type TeamMember = {
  _id?: string;
  name: string;
  fullName?: string;
  role?: string;
  imageFile?: string;
  photoUrl?: string;
  bio?: string;
  district?: string;
  state?: string;
  country?: string;
  isPublished?: boolean;
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

export const DEFAULT_FOUNDER_ROLE = "Founder & President" as const;
export const DEFAULT_FOUNDER_IMAGE_FILE = "alim.jpeg";
export const DEFAULT_FOUNDER_IMAGE = `/images/team/${DEFAULT_FOUNDER_IMAGE_FILE}`;

export const teamMembers: TeamMember[] = rawTeamMembers as TeamMember[];
