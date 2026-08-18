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
  // Alliance ID mapped to category status
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
}

export type PromotionStatus = 'DRAFT' | 'PENDING' | 'LIVE' | 'REJECTED' | 'EXPIRED' | 'PAUSED';

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
  startDate: string;
  endDate: string;
  cta: string;
  destinationUrl: string;
  shareHeadline: string;
  shareMessage: string;
  status: PromotionStatus;
  views: number;
  clicks: number;
  shares: number;
  resultsCount: number;
  membersPromotingCount: number;
  createdAt: string;
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
  clicks: number;
  results: number;
  datePromoted: string;
}

export type ReferralStatus = 'SENT' | 'IN_REVIEW' | 'CONTACTED' | 'WON' | 'LOST';

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
  type: 'APPLICATION' | 'PAYMENT' | 'PROMOTION' | 'REFERRAL' | 'MEMBERSHIP';
}
