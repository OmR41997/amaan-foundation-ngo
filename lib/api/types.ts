export type RequestStatus = "pending" | "approved" | "rejected";
export type MembershipType = "temporary" | "lifetime";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  from?: number;
  to?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface MemberRequest {
  id: string;
  name: string;
  city: string;
  dob: string;
  age: string;
  gender: string;
  bloodGroup: string;
  aadhaar: string;
  mobile: string;
  photoUrl?: string;
  email: string;
  education: string;
  profession: string;
  currentAddress: string;
  district: string;
  tehsil: string;
  division: string;
  state: string;
  pinCode: string;
  referenceNo: string;
  declarationConsent: boolean;
  membershipType: MembershipType;
  place: string;
  formDate: string;
  status: RequestStatus;
  approvalDate: string | null;
  expiryDate: string | null;
  rejectedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: AuthUser;
}

export interface TeamMember {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  district?: string;
  state?: string;
  country?: string;
  photoUrl?: string;
  role?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTeamMemberDto {
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  district?: string;
  state?: string;
  country?: string;
  photoUrl?: string;
  role?: string;
  bio?: string;
}

export type UpdateTeamMemberDto = Partial<CreateTeamMemberDto>;

export type GallerySource = "local" | "cloud";

export interface GalleryItem {
  id: string;
  eventName: string;
  eventType?: string;
  photoUrl: string;
  source?: GallerySource;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGalleryDto {
  eventName: string;
  eventType?: string;
  photoUrl: string;
  source?: GallerySource;
  isPublished?: boolean;
}

export type UpdateGalleryDto = Partial<CreateGalleryDto>;

export interface UploadMediaRecord {
  id: string;
  originalName: string;
  fileName: string;
  fileUrl: string;
  fileType: "image" | "video" | "other";
  mimeType: string;
  size: number;
  category: string;
  uploadedBy?: string;
  title?: string;
  altText?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CloudinaryOverview {
  connected: boolean;
  isLive: boolean;
  cloudName: string;
  uploadPreset?: string;
  plan: string;
  lastUpdated?: string;
  message?: string;
  credits: {
    usage: number;
    limit: number;
    remaining: number;
    percentUsed: number;
  };
  storage: {
    usedBytes: number;
    usedFormatted: string;
    limitBytes: number;
    limitFormatted: string;
    remainingBytes: number;
    remainingFormatted: string;
    percentUsed: number;
  };
  objects: {
    storedFiles: number;
    galleryFiles: number;
    memberPhotos: number;
    uploadFiles: number;
  };
  bandwidth: {
    usedBytes: number;
    usedFormatted: string;
    creditsUsage: number;
  };
  transformations: {
    usage: number;
    creditsUsage: number;
  };
  requests?: number;
}

export interface MembersOverview {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  temporary: number;
  lifetime: number;
  recentCount: number;
}

export interface AssetsOverview {
  totalAssets: number;
  uploadsCount: number;
  galleryCount: number;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  byMediaType: {
    image: number;
    video: number;
    other: number;
  };
  galleryPublished: number;
  galleryUnpublished: number;
}

export interface TeamOverview {
  total: number;
  rolesCount: number;
  districtsCount: number;
  statesCount: number;
  rolesBreakdown: { role: string; count: number }[];
}

export interface SystemOverview {
  totalVisitors: number;
  topSources: { source: string; viewCount: number }[];
  serverUptimeSeconds: number;
  nodeEnv: string;
}

export interface RecentMemberRequestItem {
  id: string;
  name: string;
  city: string;
  mobile: string;
  membershipType: string;
  status: string;
  createdAt: string;
}

export interface DashboardOverviewData {
  members: MembersOverview;
  assets: AssetsOverview;
  team: TeamOverview;
  cloudinary: CloudinaryOverview;
  system: SystemOverview;
  recentRequests?: RecentMemberRequestItem[];
}


