import type { Role, Permission, User } from '../types';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  NATIONAL_ADMIN: [
    'manage_alliances',
    'manage_members',
    'approve_businesses',
    'manage_categories',
    'create_promotion',
    'approve_promotions',
    'promote_offer',
    'send_referral',
    'manage_team',
    'manage_membership',
    'view_analytics',
    'view_activity_logs',
    'view_directory',
    'view_adshare',
  ],

  ALLIANCE_ADMIN: [
    'manage_members',
    'approve_businesses',
    'manage_categories',
    'approve_promotions',
    'view_analytics',
    'view_activity_logs',
    'view_directory',
    'view_adshare',
  ],

  BUSINESS_OWNER: [
    'create_promotion',
    'promote_offer',
    'send_referral',
    'manage_team',
    'manage_membership',
    'view_analytics',
    'view_directory',
    'view_adshare',
  ],

  TEAM_MEMBER: [
    'promote_offer',
    'send_referral',
    'view_directory',
    'view_adshare',
  ],
};

export const ROLE_LABELS: Record<Role, string> = {
  NATIONAL_ADMIN: 'National Admin',
  ALLIANCE_ADMIN: 'Alliance Admin',
  BUSINESS_OWNER: 'Business Owner',
  TEAM_MEMBER: 'Team Member',
};

export const ROLE_DEFAULT_ROUTES: Record<Role, string> = {
  NATIONAL_ADMIN: '/admin/directory',
  ALLIANCE_ADMIN: '/app/directory',
  BUSINESS_OWNER: '/app/dashboard',
  TEAM_MEMBER: '/team/dashboard',
};

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  
  // Custom permissions override if any
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.includes(permission);
}

export function hasRole(user: User | null, roles: Role | Role[]): boolean {
  if (!user) return false;
  const roleList = Array.isArray(roles) ? roles : [roles];
  return roleList.includes(user.role);
}
