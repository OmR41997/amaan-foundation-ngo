"use client";

import { fetchTeamMembers } from "@/lib/api/teams";
import { teamMembers as staticTeamMembers } from "@/data/team";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const resolveGroupRole = (name: string, role?: string): string => {
  if (role && role.trim()) {
    const trimmed = role.trim();
    if (trimmed.toLowerCase().includes("medical")) {
      return "Medical Team";
    }
    return trimmed;
  }
  if (name.toLowerCase().startsWith("dr ")) return "Medical Team";
  return "Core Member";
};

const resolveCardRole = (name: string, role?: string): string => {
  if (role && role.trim()) return role.trim();
  if (name.toLowerCase().startsWith("dr ")) return "Medical Team";
  return "Core Member";
};

// Logical presentation ordering for roles
const ROLE_ORDER = [
  "Founder & President",
  "Vice President",
  "Treasurer",
  "Secretary",
  "Joint Secretary",
  "Patron",
  "Core Member",
  "Medical Team",
  "Legal Advisor",
  "Media Incharge",
];

// Role badge styling presets
const ROLE_BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Founder & President": {
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/20",
  },
  "Vice President": {
    bg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/20",
  },
  Treasurer: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
  Secretary: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-500/20",
  },
  "Joint Secretary": {
    bg: "bg-indigo-500/10",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-500/20",
  },
  Patron: {
    bg: "bg-purple-500/10",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-500/20",
  },
  "Core Member": {
    bg: "bg-slate-500/10",
    text: "text-slate-700 dark:text-slate-400",
    border: "border-slate-500/20",
  },
  "Medical Team": {
    bg: "bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-400",
    border: "border-teal-500/20",
  },
  "Medical Support": {
    bg: "bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-400",
    border: "border-teal-500/20",
  },
  "Legal Advisor": {
    bg: "bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-500/20",
  },
  "Media Incharge": {
    bg: "bg-cyan-500/10",
    text: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-500/20",
  },
};

type ExtendedTeamMember = {
  name: string;
  role?: string;
  photoUrl?: string;
  imageFile?: string;
  bio?: string;
  district?: string;
  state?: string;
  country?: string;
};

function getMemberPhotoUrl(member: ExtendedTeamMember): string {
  if (member.photoUrl && member.photoUrl.trim()) {
    if (member.photoUrl.startsWith("http")) return member.photoUrl;
    if (member.photoUrl.startsWith("/images/team/")) return member.photoUrl;
    if (member.photoUrl.startsWith("/team/")) return `/images${member.photoUrl}`;
    if (member.photoUrl.startsWith("/")) return member.photoUrl;
    return `/images/team/${member.photoUrl}`;
  }
  if (member.imageFile) {
    return `/images/team/${member.imageFile}`;
  }
  return "/images/logo/logo.png";
}

function TeamCard({
  member,
  index,
  onSelect,
}: {
  member: ExtendedTeamMember;
  index: number;
  onSelect: (member: ExtendedTeamMember) => void;
}) {
  const [hasError, setHasError] = useState(false);
  const [prevMember, setPrevMember] = useState(member);

  if (member !== prevMember) {
    setPrevMember(member);
    setHasError(false);
  }

  const src = hasError ? "/images/logo/logo.png" : getMemberPhotoUrl(member);

  const cardRole = useMemo(() => resolveCardRole(member.name, member.role), [member]);
  const style = ROLE_BADGE_STYLES[cardRole] || {
    bg: "bg-sky-500/10",
    text: "text-sky-700",
    border: "border-sky-500/20",
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.04, 0.3),
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={() => onSelect(member)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] shadow-sm hover:shadow-xl hover:border-[var(--primary)]/30 transition-all duration-300"
    >
      <div className="relative h-72 w-full overflow-hidden bg-slate-50 dark:bg-[#08150f]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={member.name}
          className="h-full w-full object-contain object-center p-3 transition-transform duration-500 group-hover:scale-105"
          onError={() => setHasError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${style.bg} ${style.text} ${style.border}`}
            >
              {cardRole}
            </span>
            <span className="text-[11px] font-semibold text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              View Profile &rarr;
            </span>
          </div>
          <h3 className="mt-2.5 text-lg font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-200">
            {member.name}
          </h3>
        </div>
      </div>
    </motion.article>
  );
}

function MemberDetailModal({
  member,
  onClose,
}: {
  member: ExtendedTeamMember | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (member) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [member, onClose]);

  if (!member) return null;

  const photoUrl = getMemberPhotoUrl(member);
  const cardRole = resolveCardRole(member.name, member.role);
  const style = ROLE_BADGE_STYLES[cardRole] || {
    bg: "bg-sky-500/10",
    text: "text-sky-700",
    border: "border-sky-500/20",
  };

  const locationParts = [member.district, member.state, member.country || "India"].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "Bilaspur, Chhattisgarh, India";

  const getDefaultBio = () => {
    if (cardRole.includes("Medical")) {
      return "Dedicated healthcare professional providing specialized medical support, health consultations, and emergency patient assistance under Amaan Ansari Welfare Foundation.";
    }
    if (cardRole.includes("President") || cardRole.includes("Vice")) {
      return "Senior organizational leader driving social welfare initiatives, educational upliftment, healthcare projects, and community development across Chhattisgarh.";
    }
    if (cardRole.includes("Legal")) {
      return "Legal advisor providing strategic counsel on public welfare, human rights, institutional compliance, and legal assistance.";
    }
    if (cardRole.includes("Media")) {
      return "Media and communications coordinator overseeing public relations, event coverage, and social awareness campaigns.";
    }
    return "Active team member contributing continuously to healthcare, education, and social welfare programs.";
  };

  const bioText = member.bio && member.bio.trim() ? member.bio.trim() : getDefaultBio();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        {/* Frosted Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0f2434]/60 backdrop-blur-md transition-opacity"
        />

        {/* Dialog Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex w-full max-w-lg max-h-[92vh] flex-col overflow-y-auto custom-scrollbar rounded-3xl bg-[var(--card)] shadow-2xl border border-[var(--line)]"
        >
          {/* Top Decorative Banner */}
          <div className="relative h-32 w-full bg-gradient-to-r from-[#1f6fa8] via-[#2780bf] to-[#185987] p-4 flex items-start justify-between">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-10 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

            <div className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md border border-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse" />
              <span>Amaan Ansari Welfare Foundation</span>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="relative z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md border border-white/25 hover:bg-white/35 transition shadow-sm"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Profile Details Container */}
          <div className="px-6 pb-6 pt-0">
            {/* Avatar & Role Badge Row */}
            <div className="-mt-14 mb-4 flex items-end justify-between">
              <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-[var(--card)] bg-slate-50 dark:bg-[#08150f] shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt={member.name}
                  className="h-full w-full object-contain object-center p-1.5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/logo/logo.png";
                  }}
                />
              </div>

              <span
                className={`mb-1 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold shadow-xs ${style.bg} ${style.text} ${style.border}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {cardRole}
              </span>
            </div>

            {/* Member Name */}
            <h3 className="font-serif text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
              {member.name}
            </h3>

            {/* Location Tag */}
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#f0f6fb] dark:bg-[var(--mint)] px-3 py-1 text-xs font-semibold text-[var(--primary)] border border-[var(--line)]">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{locationStr}</span>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-[var(--line)]/60" />

            {/* Bio / Speciality Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-1 rounded-full bg-[var(--primary)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Speciality & Profile Overview
                </h4>
              </div>
              <div className="text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-line bg-[#f8fcff] dark:bg-[var(--mint)]/60 p-4 sm:p-5 rounded-2xl border border-[var(--line)] shadow-inner">
                {bioText}
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--line)]/50">
              <span className="text-[11px] font-medium text-[var(--muted)]">
                Dedicated to Health, Education & Social Welfare
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-white shadow-md hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function TeamGrid() {
  const [membersList, setMembersList] = useState<ExtendedTeamMember[]>(staticTeamMembers);
  const [selectedMember, setSelectedMember] = useState<ExtendedTeamMember | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchTeamMembers({ limit: 100 })
      .then((res) => {
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: ExtendedTeamMember[] = res.data.map((m) => ({
            name: m.fullName,
            role: m.role || "Core Member",
            photoUrl: m.photoUrl || "",
            imageFile: m.photoUrl?.startsWith("/images/team/")
              ? m.photoUrl.replace("/images/team/", "")
              : m.photoUrl?.startsWith("/team/")
              ? m.photoUrl.replace("/team/", "")
              : undefined,
            bio: m.bio || "",
            district: m.district || "",
            state: m.state || "",
            country: m.country || "",
          }));
          setMembersList(mapped);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch backend teams, using fallback static data:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Group team members by role
  const { groupedRoles, allRolesList } = useMemo(() => {
    const map: Record<string, ExtendedTeamMember[]> = {};

    membersList.forEach((member) => {
      const role = resolveGroupRole(member.name, member.role);
      if (!map[role]) map[role] = [];
      map[role].push(member);
    });

    // Sort team members within each role in ascending alphabetical order (A-Z) by name
    Object.keys(map).forEach((role) => {
      map[role].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );
    });

    // Sort roles according to ROLE_ORDER, then append any unspecified roles
    const ordered = Object.keys(map).sort((a, b) => {
      const indexA = ROLE_ORDER.indexOf(a);
      const indexB = ROLE_ORDER.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });

    return {
      groupedRoles: map,
      allRolesList: ordered,
    };
  }, [membersList]);

  return (
    <div className="space-y-12">
      {allRolesList.map((role) => {
        const members = groupedRoles[role] || [];
        if (members.length === 0) return null;

        return (
          <section key={role} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-1.5 rounded-full bg-[var(--primary)]" />
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
                  {role}
                </h2>
                <p className="text-xs text-[var(--muted)] md:text-sm">
                  {members.length} {members.length === 1 ? "member" : "members"} dedicated to this domain
                </p>
              </div>
              <div className="flex-1 border-t border-[var(--line)]/50" />
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {members.map((member, idx) => (
                <TeamCard
                  key={member.name}
                  member={member}
                  index={idx}
                  onSelect={setSelectedMember}
                />
              ))}
            </motion.div>
          </section>
        );
      })}

      {/* Member Detail Dialog Modal */}
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
