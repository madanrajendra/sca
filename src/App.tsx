import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SCADataProvider } from './context/SCADataContext';
import { AppLayout } from './components/layout/AppLayout';

// Public Landing Page
import { LandingPage } from './pages/landing/LandingPage';

// Auth & Onboarding Pages
import { Login } from './pages/auth/Login';

// Application Core Pages
import { BusinessDashboard } from './pages/app/BusinessDashboard';
import { AdShareMarketplace } from './pages/app/AdShareMarketplace';
import { CreatePromotionWizard } from './pages/app/CreatePromotionWizard';
import { MyPromotions } from './pages/app/MyPromotions';
import { PromotedByMe } from './pages/app/PromotedByMe';
import { AnalyticsOverview } from './pages/common/AnalyticsOverview';
import { ReferralHub } from './pages/app/ReferralHub';
import { MarketingCalendar } from './pages/app/MarketingCalendar';
import { BusinessDirectory } from './pages/app/BusinessDirectory';
import { AllianceLeaderboard } from './pages/app/AllianceLeaderboard';
import { AllianceFeed } from './pages/app/AllianceFeed';
import { BusinessFeed } from './pages/app/BusinessFeed';
import { CreateFeedPost } from './pages/app/CreateFeedPost';
import { PromoteAlliance } from './pages/app/PromoteAlliance';

import { useAuth } from './context/AuthContext';

// Admin Pages
import { NationalAdminDashboard } from './pages/admin/NationalAdminDashboard';
import { NationalDirectoryPage } from './pages/admin/NationalDirectoryPage';
import { AllianceAdminDashboard } from './pages/alliance/AllianceAdminDashboard';
import { BusinessesAdmin } from './pages/admin/BusinessesAdmin';
import { CategoriesAdmin } from './pages/admin/CategoriesAdmin';
import { ActivityAuditLog } from './pages/admin/ActivityAuditLog';
import { PaymentsAdmin } from './pages/admin/PaymentsAdmin';

// Common Utility Pages
import { NotificationsPage } from './pages/common/NotificationsPage';
import { SettingsPage } from './pages/common/SettingsPage';

const AdminDashboardView: React.FC = () => {
  const { currentUser } = useAuth();
  if (currentUser.role === 'ALLIANCE_ADMIN') {
    return <AllianceAdminDashboard />;
  }
  return <NationalAdminDashboard />;
};

export function App() {
  return (
    <AuthProvider>
      <SCADataProvider>
        <Router>
          <Routes>
            {/* 1. Public Marketing Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* 2. Public Auth Flow */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />

            {/* 3. Member Command Center Routes */}
            <Route
              path="/app/dashboard"
              element={
                <AppLayout>
                  <BusinessDashboard />
                </AppLayout>
              }
            />
            <Route
              path="/app/adshare"
              element={<Navigate to="/app/feed" replace />}
            />
            <Route
              path="/app/promotions/create"
              element={<Navigate to="/app/feed/create" replace />}
            />
            <Route
              path="/app/promotions"
              element={
                <AppLayout>
                  <MyPromotions />
                </AppLayout>
              }
            />
            <Route
              path="/app/promoted"
              element={
                <AppLayout>
                  <PromotedByMe />
                </AppLayout>
              }
            />
            <Route
              path="/app/analytics"
              element={
                <AppLayout>
                  <AnalyticsOverview />
                </AppLayout>
              }
            />
            <Route
              path="/app/referrals"
              element={
                <AppLayout>
                  <ReferralHub />
                </AppLayout>
              }
            />
            <Route
              path="/app/calendar"
              element={
                <AppLayout>
                  <MarketingCalendar />
                </AppLayout>
              }
            />
            <Route
              path="/app/directory"
              element={
                <AppLayout>
                  <BusinessDirectory />
                </AppLayout>
              }
            />
            <Route
              path="/app/promote-alliance"
              element={
                <AppLayout>
                  <PromoteAlliance />
                </AppLayout>
              }
            />
            <Route
              path="/app/leaderboard"
              element={
                <AppLayout>
                  <AllianceLeaderboard />
                </AppLayout>
              }
            />
            <Route
              path="/app/feed"
              element={
                <AppLayout>
                  <AllianceFeed />
                </AppLayout>
              }
            />
            <Route
              path="/app/feed/create"
              element={
                <AppLayout>
                  <CreateFeedPost />
                </AppLayout>
              }
            />
            <Route
              path="/app/feed/:businessId"
              element={
                <AppLayout>
                  <BusinessFeed />
                </AppLayout>
              }
            />

            {/* Common Secondary Routes */}
            <Route
              path="/app/notifications"
              element={
                <AppLayout>
                  <NotificationsPage />
                </AppLayout>
              }
            />
            <Route
              path="/app/settings"
              element={
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              }
            />
            <Route
              path="/app/activity"
              element={
                <AppLayout>
                  <ActivityAuditLog />
                </AppLayout>
              }
            />

            {/* 4. Admin Management Routes */}
            <Route
              path="/admin"
              element={
                <AppLayout>
                  <NationalDirectoryPage />
                </AppLayout>
              }
            />
            <Route
              path="/admin/directory"
              element={
                <AppLayout>
                  <NationalDirectoryPage />
                </AppLayout>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AppLayout>
                  <AdminDashboardView />
                </AppLayout>
              }
            />
            <Route path="/alliance" element={<Navigate to="/app/directory" replace />} />
            <Route
              path="/admin/promotions"
              element={
                <AppLayout>
                  <MyPromotions />
                </AppLayout>
              }
            />
            <Route
              path="/admin/businesses"
              element={
                <AppLayout>
                  <BusinessesAdmin />
                </AppLayout>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AppLayout>
                  <CategoriesAdmin />
                </AppLayout>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <AppLayout>
                  <PaymentsAdmin />
                </AppLayout>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AppLayout>
                  <AnalyticsOverview />
                </AppLayout>
              }
            />
            <Route
              path="/admin/activity"
              element={
                <AppLayout>
                  <ActivityAuditLog />
                </AppLayout>
              }
            />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SCADataProvider>
    </AuthProvider>
  );
}

export default App;
