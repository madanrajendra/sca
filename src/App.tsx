import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SCADataProvider } from './context/SCADataContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/rbac/ProtectedRoute';

// Auth Pages
import { Login } from './pages/auth/Login';
import { BusinessOnboarding } from './pages/auth/BusinessOnboarding';

// Phase 2 Onboarding & Payment Components & Pages
import { BusinessApplicationWizard } from './components/onboarding/BusinessApplicationWizard';
import { ApplicationStatusPage } from './pages/onboarding/ApplicationStatusPage';
import { MembershipCheckoutPage } from './pages/payment/MembershipCheckoutPage';
import { ProfileCompletionPage } from './pages/profile/ProfileCompletionPage';

// Common / Shared Pages
import { NotificationsPage } from './pages/common/NotificationsPage';
import { SettingsPage } from './pages/common/SettingsPage';
import { AnalyticsOverview } from './pages/common/AnalyticsOverview';
import { PermissionDeniedState } from './components/common/PermissionDeniedState';

// Phase 3 & 4/5 Core Active Pages
import { TeamMemberDashboard } from './pages/team/TeamMemberDashboard';
import { TeamMemberProfilePage } from './pages/team/TeamMemberProfilePage';
import { TeamRestrictedAccess } from './pages/team/TeamRestrictedAccess';

// Active Functional Workflows
import { AdShareMarketplace } from './pages/app/AdShareMarketplace';
import { CreatePromotionWizard } from './pages/app/CreatePromotionWizard';
import { MyPromotions } from './pages/app/MyPromotions';
import { PromotedByMe } from './pages/app/PromotedByMe';
import { BusinessDirectory } from './pages/app/BusinessDirectory';
import { ReferralHub } from './pages/app/ReferralHub';
import { MyBusinessProfile } from './pages/app/MyBusinessProfile';
import { TeamManagement } from './pages/app/TeamManagement';

// Business Owner Dashboard & Admin Dashboards
import { BusinessDashboard } from './pages/app/BusinessDashboard';
import { NationalAdminDashboard } from './pages/admin/NationalAdminDashboard';
import { BusinessesAdmin } from './pages/admin/BusinessesAdmin';
import { CategoriesAdmin } from './pages/admin/CategoriesAdmin';
import { ActivityAuditLog } from './pages/admin/ActivityAuditLog';
import { AllianceAdminDashboard } from './pages/alliance/AllianceAdminDashboard';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SCADataProvider>
          <Routes>
            {/* Public Auth & Onboarding Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<BusinessApplicationWizard />} />
            <Route path="/forgot-password" element={<Login />} />
            <Route path="/onboarding/apply" element={<BusinessApplicationWizard />} />

            {/* Application Main Layout Container */}
            <Route element={<AppLayout />}>
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="/access-denied" element={<PermissionDeniedState />} />

              {/* Phase 2 Status & Checkout Routes */}
              <Route path="/onboarding/status" element={<ApplicationStatusPage />} />
              <Route path="/app/payment" element={<MembershipCheckoutPage />} />
              <Route path="/app/membership-lapsed" element={<MembershipCheckoutPage />} />
              <Route path="/app/profile-completion" element={<ProfileCompletionPage />} />

              {/* ------------------- ROLE 1: NATIONAL ADMIN ------------------- */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN']}>
                    <NationalAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/alliances"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN']}>
                    <NationalAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/businesses"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN']}>
                    <BusinessesAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN']}>
                    <CategoriesAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/promotions"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN']}>
                    <AdShareMarketplace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/referrals"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN']}>
                    <ReferralHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN']}>
                    <AnalyticsOverview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/activity"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN']}>
                    <ActivityAuditLog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN']}>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN']}>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* ------------------- ROLE 2: ALLIANCE ADMIN ------------------- */}
              <Route
                path="/alliance"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN', 'ALLIANCE_ADMIN']}>
                    <AllianceAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alliance/applications"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN', 'ALLIANCE_ADMIN']}>
                    <AllianceAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alliance/members"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN', 'ALLIANCE_ADMIN']}>
                    <BusinessesAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alliance/categories"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN', 'ALLIANCE_ADMIN']}>
                    <CategoriesAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alliance/promotions"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN', 'ALLIANCE_ADMIN']}>
                    <AdShareMarketplace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alliance/referrals"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN', 'ALLIANCE_ADMIN']}>
                    <ReferralHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alliance/analytics"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN', 'ALLIANCE_ADMIN']}>
                    <AnalyticsOverview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alliance/activity"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN', 'ALLIANCE_ADMIN']}>
                    <ActivityAuditLog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alliance/notifications"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN', 'ALLIANCE_ADMIN']}>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alliance/settings"
                element={
                  <ProtectedRoute allowedRoles={['NATIONAL_ADMIN', 'ALLIANCE_ADMIN']}>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* ------------------- ROLE 3: BUSINESS OWNER ------------------- */}
              <Route
                path="/app/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <BusinessDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/adshare"
                element={
                  <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <AdShareMarketplace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/promotions"
                element={
                  <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <MyPromotions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/promotions/create"
                element={
                  <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <CreatePromotionWizard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/promoted"
                element={
                  <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <PromotedByMe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/referrals"
                element={
                  <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <ReferralHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/directory"
                element={
                  <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <BusinessDirectory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/business"
                element={
                  <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <MyBusinessProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/business/edit"
                element={
                  <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <MyBusinessProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/team"
                element={
                  <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <TeamManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/notifications"
                element={
                  <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/settings"
                element={
                  <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* ------------------- ROLE 4: TEAM MEMBER ------------------- */}
              <Route
                path="/team/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <TeamMemberDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team/adshare"
                element={
                  <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <AdShareMarketplace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team/promoted"
                element={
                  <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <PromotedByMe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team/referrals"
                element={
                  <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <ReferralHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team/directory"
                element={
                  <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <BusinessDirectory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team/business"
                element={
                  <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <MyBusinessProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team/profile"
                element={
                  <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <TeamMemberProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team/notifications"
                element={
                  <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team/settings"
                element={
                  <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'BUSINESS_OWNER', 'NATIONAL_ADMIN']}>
                    <TeamMemberProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Team Member Restricted Route Attempts */}
              <Route
                path="/team/team"
                element={<TeamRestrictedAccess message="You don't have permission to manage team members." />}
              />
              <Route
                path="/team/membership"
                element={<TeamRestrictedAccess message="You don't have permission to manage membership." />}
              />

              {/* Catch-all */}
              <Route path="*" element={<PermissionDeniedState />} />
            </Route>
          </Routes>
        </SCADataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
