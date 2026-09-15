export type Role = 'NATIONAL_ADMIN' | 'ALLIANCE_ADMIN' | 'BUSINESS_OWNER' | 'TEAM_MEMBER';

export type Permission =
  | 'manage_alliances'
  | 'manage_members'
  | 'approve_businesses'
  | 'manage_categories'
  | 'create_promotion'
  | 'approve_promotions'
  | 'promote_offer'
  | 'send_referral'
  | 'manage_team'
  | 'manage_membership'
  | 'view_analytics'
  | 'view_activity_logs'
  | 'view_directory'
  | 'view_adshare';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  allianceId?: string;
  allianceName?: string;
  businessId?: string;
  businessName?: string;
  avatar?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  lastActive: string;
}

export interface Alliance {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  memberCount: number;
  occupiedCategoriesCount: number;
  totalCategoriesCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdDate: string;
}

export interface CategoryStatus {
  status: 'OPEN' | 'OCCUPIED' | 'SUSPENDED';
  businessId?: string;
  businessName?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
  allianceMap: Record<string, CategoryStatus>;
}

export type MembershipStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED_PAYMENT_REQUIRED'
  | 'ACTIVE'
  | 'PAYMENT_FAILED_VIEW_ONLY'
  | 'LAPSED'
  | 'REJECTED';

export interface Business {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  allianceId: string;
  allianceName: string;
  categoryId: string;
  categoryName: string;
  description: string;
  logo: string;
  website: string;
  phone: string;
  serviceArea: string;
  membershipStatus: MembershipStatus;
  joinedDate: string;
  currentOffer?: string;
  offerDetails?: string;
  paymentMethod?: string;
  lastPaymentDate?: string;
  rejectionReason?: string;
  profileCompletionPercentage?: number;
  firstName?: string;
  lastName?: string;
  estimatedAudience?: number;
  instagramFollowers?: number;
  facebookFollowers?: number;
  miscellaneousFollowers?: number;
}

export type PromotionStatus = 'DRAFT' | 'PENDING' | 'LIVE' | 'REJECTED' | 'EXPIRED' | 'PAUSED';

export interface CampaignAsset {
  id: string;
  campaignId: string;
  fileName: string;
  fileType: 'IMAGE' | 'VIDEO' | 'PDF' | 'DOCUMENT';
  fileSize: string;
  storageUrl: string;
}

export interface CampaignChannelContent {
  emailSubject?: string;
  emailBody?: string;
  facebookPost?: string;
  instagramCaption?: string;
  linkedInPost?: string;
  smsMessage?: string;
  flyerCopy?: string;
  landingPageHeadline?: string;
}

export interface AdSharePromotion {
  id: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  allianceId: string;
  title: string;
  shortDescription: string;
  description: string;
  categoryName: string;
  imageUrl: string;
  offer: string;
  targetAudience?: string;
  location?: string;
  startDate: string;
  endDate: string;
  cta: string;
  destinationUrl: string;
  shareHeadline: string;
  shareMessage: string;
  status: PromotionStatus;
  assets?: CampaignAsset[];
  channelContent?: CampaignChannelContent;
  availableChannels?: string[];
  estimatedReach: number;
  views: number;
  clicks: number;
  shares: number;
  leadsCount: number;
  referralsCount: number;
  reportedSalesCount: number;
  estimatedRevenue: number;
  membersPromotingCount: number;
  resultsCount?: number;
  createdAt: string;
  recommended?: boolean;
}

export interface PromotedOffer {
  id: string;
  promotionId: string;
  promotionTitle: string;
  targetBusinessId: string;
  targetBusinessName: string;
  promoterBusinessId: string;
  promoterBusinessName: string;
  promoterUserId: string;
  trackingCode: string;
  fullTrackingUrl: string;
  channels: string[];
  estimatedReach: number;
  clicks: number;
  leads: number;
  referrals: number;
  sales: number;
  results: number;
  datePromoted: string;
  status?: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
}

export type ReferralStatus = 'SENT' | 'IN_REVIEW' | 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'WON' | 'LOST';

export interface Referral {
  id: string;
  senderBusinessId: string;
  senderBusinessName: string;
  senderUserId: string;
  senderUserName: string;
  receiverBusinessId: string;
  receiverBusinessName: string;
  allianceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  hasConsent: boolean;
  status: ReferralStatus;
  estimatedValue?: number;
  recordedValue?: number;
  dateSent: string;
  dateUpdated: string;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  email: string;
  businessId: string;
  roleTitle: string;
  status: 'ACTIVE' | 'INACTIVE';
  permissions: Permission[];
  invitedDate: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: Role;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link: string;
  type: 'APPLICATION' | 'PAYMENT' | 'PROMOTION' | 'REFERRAL' | 'MEMBERSHIP' | 'EVENT';
}

export interface MarketingCalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'CAMPAIGN_START' | 'CAMPAIGN_END' | 'SEASONAL' | 'COMMUNITY_EVENT';
  businessName: string;
  description: string;
}
