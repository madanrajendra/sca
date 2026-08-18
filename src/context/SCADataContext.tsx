import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Alliance,
  Category,
  Business,
  AdSharePromotion,
  PromotedOffer,
  Referral,
  ActivityLog,
  NotificationItem,
  TeamMemberItem,
  MembershipStatus,
  PromotionStatus,
  ReferralStatus,
} from '../types';
import {
  INITIAL_ALLIANCES,
  INITIAL_CATEGORIES,
  INITIAL_BUSINESSES,
  INITIAL_PROMOTIONS,
  INITIAL_PROMOTED_OFFERS,
  INITIAL_REFERRALS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface SCADataContextType {
  alliances: Alliance[];
  categories: Category[];
  businesses: Business[];
  promotions: AdSharePromotion[];
  promotedOffers: PromotedOffer[];
  referrals: Referral[];
  teamMembers: TeamMemberItem[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
  
  // Business Loop 1: Membership & Onboarding
  applyForBusinessMembership: (data: {
    businessName: string;
    description: string;
    ownerName: string;
    ownerEmail: string;
    allianceId: string;
    categoryId: string;
    logo: string;
    website: string;
    phone: string;
    serviceArea: string;
  }) => { success: boolean; message: string; businessId?: string };
  
  checkCategoryAvailability: (allianceId: string, categoryId: string) => {
    isAvailable: boolean;
    occupyingBusinessName?: string;
  };
  
  approveBusinessApplication: (businessId: string) => void;
  rejectBusinessApplication: (businessId: string, reason?: string) => void;
  simulatePaymentStatusChange: (businessId: string, newStatus: MembershipStatus) => void;
  
  // Business Loop 2: AdShare Marketplace
  createPromotion: (promo: Omit<AdSharePromotion, 'id' | 'views' | 'clicks' | 'shares' | 'resultsCount' | 'membersPromotingCount' | 'createdAt'>) => string;
  updatePromotionStatus: (id: string, status: PromotionStatus) => void;
  promoteOffer: (promotionId: string, promoterBusinessId: string, promoterBusinessName: string, promoterUserId: string) => PromotedOffer;
  simulateAdClick: (trackingCode: string) => void;
  
  // Business Loop 3: Referrals
  sendReferral: (data: {
    receiverBusinessId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes: string;
    hasConsent: boolean;
    estimatedValue?: number;
  }) => string;
  updateReferralStatus: (referralId: string, status: ReferralStatus, recordedValue?: number) => void;
  
  // Admin & Alliance Management
  createAlliance: (name: string, city: string, state: string, country: string) => void;
  inviteTeamMember: (email: string, name: string, roleTitle: string) => void;
  markNotificationRead: (id: string) => void;
  addCategory: (name: string, description: string, iconName: string) => void;
}

const SCADataContext = createContext<SCADataContextType | undefined>(undefined);

export const SCADataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [alliances, setAlliances] = useState<Alliance[]>(INITIAL_ALLIANCES);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [promotions, setPromotions] = useState<AdSharePromotion[]>(INITIAL_PROMOTIONS);
  const [promotedOffers, setPromotedOffers] = useState<PromotedOffer[]>(INITIAL_PROMOTED_OFFERS);
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>(INITIAL_TEAM_MEMBERS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Helper log generator
  const logActivity = (action: string, entityType: string, entityId: string, details: string, status: 'SUCCESS' | 'WARNING' | 'ERROR' = 'SUCCESS') => {
    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action,
      entityType,
      entityId,
      details,
      status,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Helper notification generator
  const pushNotification = (userId: string, title: string, message: string, link: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      link,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // 1. Check Category Exclusivity
  const checkCategoryAvailability = (allianceId: string, categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return { isAvailable: true };
    const statusObj = cat.allianceMap[allianceId];
    if (statusObj && statusObj.status === 'OCCUPIED') {
      return {
        isAvailable: false,
        occupyingBusinessName: statusObj.businessName || 'Another active member',
      };
    }
    return { isAvailable: true };
  };

  // 2. Business Membership Application
  const applyForBusinessMembership = (data: {
    businessName: string;
    description: string;
    ownerName: string;
    ownerEmail: string;
    allianceId: string;
    categoryId: string;
    logo: string;
    website: string;
    phone: string;
    serviceArea: string;
  }) => {
    // Validate category exclusivity first
    const check = checkCategoryAvailability(data.allianceId, data.categoryId);
    if (!check.isAvailable) {
      return {
        success: false,
        message: `This category is already occupied by "${check.occupyingBusinessName}" in this alliance. Only one business per category is allowed.`,
      };
    }

    const alliance = alliances.find((a) => a.id === data.allianceId);
    const category = categories.find((c) => c.id === data.categoryId);

    const newBizId = `biz_${Date.now()}`;
    const newBusiness: Business = {
      id: newBizId,
      name: data.businessName,
      ownerId: currentUser.id,
      ownerName: data.ownerName,
      ownerEmail: data.ownerEmail,
      allianceId: data.allianceId,
      allianceName: alliance ? alliance.name : 'Alliance',
      categoryId: data.categoryId,
      categoryName: category ? category.name : 'Category',
      description: data.description,
      logo: data.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80',
      website: data.website,
      phone: data.phone,
      serviceArea: data.serviceArea,
      membershipStatus: 'PENDING_APPROVAL',
      joinedDate: new Date().toISOString().substring(0, 10),
    };

    setBusinesses((prev) => [newBusiness, ...prev]);

    logActivity('Business Applied', 'Business', newBizId, `Business "${data.businessName}" submitted application for category "${category?.name}"`);

    pushNotification(
      'usr_all_admin_blr',
      'New Alliance Application',
      `"${data.businessName}" applied for ${category?.name} in ${alliance?.name}`,
      `/alliance/applications/${newBizId}`,
      'APPLICATION'
    );

    return {
      success: true,
      message: 'Your application has been submitted to the Alliance Admin for review!',
      businessId: newBizId,
    };
  };

  // 3. Approve Business
  const approveBusinessApplication = (businessId: string) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === businessId) {
          return { ...b, membershipStatus: 'APPROVED_PAYMENT_REQUIRED' };
        }
        return b;
      })
    );

    const biz = businesses.find((b) => b.id === businessId);
    if (biz) {
      // Update Category Map to OCCUPIED
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id === biz.categoryId) {
            return {
              ...c,
              allianceMap: {
                ...c.allianceMap,
                [biz.allianceId]: {
                  status: 'OCCUPIED',
                  businessId: biz.id,
                  businessName: biz.name,
                },
              },
            };
          }
          return c;
        })
      );

      logActivity('Business Approved', 'Business', businessId, `Approved business "${biz.name}". Payment now required.`);
      pushNotification(
        biz.ownerId,
        'Application Approved! 🎉',
        `Your application for ${biz.name} was approved! Please complete your membership payment to activate profile.`,
        '/app/dashboard',
        'PAYMENT'
      );
    }
  };

  // 4. Reject Business
  const rejectBusinessApplication = (businessId: string, reason?: string) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === businessId ? { ...b, membershipStatus: 'REJECTED' } : b))
    );
    const biz = businesses.find((b) => b.id === businessId);
    if (biz) {
      logActivity('Business Rejected', 'Business', businessId, `Rejected "${biz.name}". Reason: ${reason || 'Criteria not met'}`);
      pushNotification(biz.ownerId, 'Application Update', `Your application for ${biz.name} was not approved at this time.`, '/app/dashboard', 'APPLICATION');
    }
  };

  // 5. Simulate Payment Failure / Recovery
  const simulatePaymentStatusChange = (businessId: string, newStatus: MembershipStatus) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === businessId) {
          return {
            ...b,
            membershipStatus: newStatus,
            lastPaymentDate: newStatus === 'ACTIVE' ? new Date().toISOString().substring(0, 10) : b.lastPaymentDate,
          };
        }
        return b;
      })
    );

    const biz = businesses.find((b) => b.id === businessId);
    logActivity(
      'Membership Status Changed',
      'Business',
      businessId,
      `Updated membership state of "${biz?.name}" to ${newStatus}`
    );
  };

  // 6. Create Promotion Wizard
  const createPromotion = (
    promoData: Omit<AdSharePromotion, 'id' | 'views' | 'clicks' | 'shares' | 'resultsCount' | 'membersPromotingCount' | 'createdAt'>
  ) => {
    const newId = `promo_${Date.now()}`;
    const newPromo: AdSharePromotion = {
      ...promoData,
      id: newId,
      views: 1,
      clicks: 0,
      shares: 0,
      resultsCount: 0,
      membersPromotingCount: 0,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setPromotions((prev) => [newPromo, ...prev]);

    logActivity('Promotion Created', 'AdSharePromotion', newId, `Created AdShare campaign "${promoData.title}"`);
    return newId;
  };

  // 7. Update Promotion Status
  const updatePromotionStatus = (id: string, status: PromotionStatus) => {
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    logActivity('Promotion Status Updated', 'AdSharePromotion', id, `Status set to ${status}`);
  };

  // 8. Promote Offer (Generate Unique Link)
  const promoteOffer = (
    promotionId: string,
    promoterBusinessId: string,
    promoterBusinessName: string,
    promoterUserId: string
  ) => {
    const promo = promotions.find((p) => p.id === promotionId);
    const existing = promotedOffers.find(
      (po) => po.promotionId === promotionId && po.promoterBusinessId === promoterBusinessId
    );

    if (existing) return existing;

    const shortHash = Math.random().toString(36).substring(2, 8);
    const trackingCode = `scalocal.com/p/${shortHash}`;

    const newPromoted: PromotedOffer = {
      id: `promoted_${Date.now()}`,
      promotionId,
      promotionTitle: promo ? promo.title : 'Promotion',
      targetBusinessId: promo ? promo.businessId : 'biz_target',
      targetBusinessName: promo ? promo.businessName : 'Target Business',
      promoterBusinessId,
      promoterBusinessName,
      promoterUserId,
      trackingCode,
      fullTrackingUrl: `https://${trackingCode}`,
      clicks: 0,
      results: 0,
      datePromoted: new Date().toISOString().substring(0, 10),
    };

    setPromotedOffers((prev) => [newPromoted, ...prev]);

    // Increment promotion metrics
    setPromotions((prev) =>
      prev.map((p) => {
        if (p.id === promotionId) {
          return {
            ...p,
            shares: p.shares + 1,
            membersPromotingCount: p.membersPromotingCount + 1,
          };
        }
        return p;
      })
    );

    logActivity('Promoted Offer', 'PromotedOffer', newPromoted.id, `Generated tracking link ${trackingCode} for "${promo?.title}"`);
    return newPromoted;
  };

  // 9. Simulate Customer Click on Tracked Link
  const simulateAdClick = (trackingCode: string) => {
    setPromotedOffers((prev) =>
      prev.map((po) => {
        if (po.trackingCode.includes(trackingCode) || trackingCode.includes(po.trackingCode)) {
          return { ...po, clicks: po.clicks + 1, results: po.clicks % 5 === 0 ? po.results + 1 : po.results };
        }
        return po;
      })
    );

    const match = promotedOffers.find((po) => po.trackingCode.includes(trackingCode) || trackingCode.includes(po.trackingCode));
    if (match) {
      setPromotions((prev) =>
        prev.map((p) => {
          if (p.id === match.promotionId) {
            return { ...p, clicks: p.clicks + 1 };
          }
          return p;
        })
      );
    }
  };

  // 10. Send Referral
  const sendReferral = (data: {
    receiverBusinessId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes: string;
    hasConsent: boolean;
    estimatedValue?: number;
  }) => {
    const senderBiz = businesses.find((b) => b.ownerId === currentUser.id || b.id === currentUser.businessId) || businesses[0];
    const receiverBiz = businesses.find((b) => b.id === data.receiverBusinessId);

    const newRefId = `ref_${Date.now()}`;
    const newRef: Referral = {
      id: newRefId,
      senderBusinessId: senderBiz.id,
      senderBusinessName: senderBiz.name,
      senderUserId: currentUser.id,
      senderUserName: currentUser.name,
      receiverBusinessId: data.receiverBusinessId,
      receiverBusinessName: receiverBiz ? receiverBiz.name : 'Alliance Partner',
      allianceId: senderBiz.allianceId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      notes: data.notes,
      hasConsent: data.hasConsent,
      status: 'SENT',
      estimatedValue: data.estimatedValue,
      dateSent: new Date().toISOString().substring(0, 10),
      dateUpdated: new Date().toISOString().substring(0, 10),
    };

    setReferrals((prev) => [newRef, ...prev]);

    logActivity('Referral Sent', 'Referral', newRefId, `Sent referral for customer "${data.customerName}" to ${receiverBiz?.name}`);

    if (receiverBiz) {
      pushNotification(
        receiverBiz.ownerId,
        'New Client Referral Received! 💼',
        `${senderBiz.name} just sent you a referral: ${data.customerName}`,
        `/app/referrals/${newRefId}`,
        'REFERRAL'
      );
    }

    return newRefId;
  };

  // 11. Update Referral Status
  const updateReferralStatus = (referralId: string, status: ReferralStatus, recordedValue?: number) => {
    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id === referralId) {
          return {
            ...r,
            status,
            recordedValue: recordedValue !== undefined ? recordedValue : r.recordedValue,
            dateUpdated: new Date().toISOString().substring(0, 10),
          };
        }
        return r;
      })
    );

    const ref = referrals.find((r) => r.id === referralId);
    if (ref) {
      logActivity(
        'Referral Status Updated',
        'Referral',
        referralId,
        `Status set to ${status}${recordedValue ? ` ($${recordedValue} value recorded)` : ''}`
      );

      pushNotification(
        ref.senderUserId,
        `Referral Updated to ${status}`,
        `${ref.receiverBusinessName} updated referral for ${ref.customerName} to ${status}.`,
        `/app/referrals/${referralId}`,
        'REFERRAL'
      );
    }
  };

  // 12. Create Alliance
  const createAlliance = (name: string, city: string, state: string, country: string) => {
    const newId = `all_${Date.now()}`;
    const newAlliance: Alliance = {
      id: newId,
      name,
      city,
      state,
      country,
      memberCount: 0,
      occupiedCategoriesCount: 0,
      totalCategoriesCount: 35,
      status: 'ACTIVE',
      createdDate: new Date().toISOString().substring(0, 10),
    };
    setAlliances((prev) => [newAlliance, ...prev]);
    logActivity('Alliance Created', 'Alliance', newId, `Created new city alliance "${name}" in ${city}`);
  };

  // 13. Invite Team Member
  const inviteTeamMember = (email: string, name: string, roleTitle: string) => {
    const newMember: TeamMemberItem = {
      id: `tm_${Date.now()}`,
      name,
      email,
      businessId: currentUser.businessId || 'biz_apex',
      roleTitle,
      status: 'ACTIVE',
      permissions: ['promote_offer', 'send_referral', 'view_directory', 'view_adshare'],
      invitedDate: new Date().toISOString().substring(0, 10),
    };
    setTeamMembers((prev) => [...prev, newMember]);
    logActivity('Team Member Invited', 'TeamMember', newMember.id, `Invited ${name} (${email}) as ${roleTitle}`);
  };

  // 14. Add Category
  const addCategory = (name: string, description: string, iconName: string) => {
    const newCat: Category = {
      id: `cat_${Date.now()}`,
      name,
      description,
      iconName,
      allianceMap: {},
    };
    setCategories((prev) => [...prev, newCat]);
    logActivity('Category Added', 'Category', newCat.id, `Added platform category "${name}"`);
  };

  // 15. Notification Read
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <SCADataContext.Provider
      value={{
        alliances,
        categories,
        businesses,
        promotions,
        promotedOffers,
        referrals,
        teamMembers,
        activityLogs,
        notifications,
        applyForBusinessMembership,
        checkCategoryAvailability,
        approveBusinessApplication,
        rejectBusinessApplication,
        simulatePaymentStatusChange,
        createPromotion,
        updatePromotionStatus,
        promoteOffer,
        simulateAdClick,
        sendReferral,
        updateReferralStatus,
        createAlliance,
        inviteTeamMember,
        markNotificationRead,
        addCategory,
      }}
    >
      {children}
    </SCADataContext.Provider>
  );
};

export const useSCAData = (): SCADataContextType => {
  const context = useContext(SCADataContext);
  if (!context) {
    throw new Error('useSCAData must be used within an SCADataProvider');
  }
  return context;
};
