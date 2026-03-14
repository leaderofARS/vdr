import React, { useEffect, useRef, type FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

// Public Pages
import { LandingPage } from '@/pages/LandingPage';
import { VerifyPage } from '@/pages/public/VerifyPage';
import { VerifyLandingPage } from '@/pages/public/VerifyLandingPage';
import { InviteAcceptPage } from '@/pages/public/InviteAcceptPage';
import { PricingPage } from '@/pages/public/PricingPage';
import { StatsPage } from '@/pages/public/StatsPage';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';

// Legal Pages
import { TermsPage } from '@/pages/legal/TermsPage';
import { PrivacyPage } from '@/pages/legal/PrivacyPage';

// Docs
import { 
  DocsPage, 
  DocsLayout, 
  QuickStartPage,
  InstallationPage,
  BearerAuthPage,
  ApiKeysAuthPage,
  HashingConceptPage,
  LifecyclePage,
  VerificationModelPage,
  StoragePage,
  CliReferencePage,
  CliLinkPage,
  CliStagePage,
  CliAnchorPage,
  CliVerifyPage,
  CliStatusPage,
  CliHistoryPage,
  CliRevokePage,
  ApiReferencePage,
  ApiAuthPage,
  ApiHashesPage,
  ApiKeysPage,
  ApiOrgsPage,
  ApiWebhooksPage,
  ApiUsagePage,
  GuideLegalPage,
  GuideFinancialPage,
  GuideEnterprisePage,
  GuideCicdPage,
  GuideWebhooksPage,
  SdkJavaScriptPage,
  SdkPythonPage,
  ChangelogPage,
  SupportPage,
} from '@/pages/docs';

// Shared Layout
import { MainLayout } from '@/components/shared/MainLayout';

// Dashboard
import { DashboardLayout } from '@/components/dashboard';
import {
  DashboardHome,
  HashesPage,
  HashDetailPage,
  BulkVerifyPage,
  AnalyticsPage,
  ApiKeysPage as DashboardApiKeysPage,
  TeamPage,
  SettingsPage,
  BillingPage,
  NotificationsPage,
  WebhooksPage,
  AuditPage,
  PlaygroundPage,
  EmbedSharePage,
  UsagePage,
} from '@/pages/dashboard';

import './App.css';

// Protected Route - redirects to login if not authenticated
const ProtectedRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-sipheron-base flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-sipheron-purple border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sipheron-text-muted text-sm">Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Only Route - redirects to dashboard if already authenticated
const PublicOnlyRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-sipheron-base flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-sipheron-purple border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sipheron-text-muted text-sm">Loading...</p>
      </div>
    );
  }
  
  if (user) return <Navigate to="/dashboard" replace />;
  
  return <>{children}</>;
};

// Global manager to force full page reload on navigation
const NavigationReloadManager: FC = () => {
  const location = useLocation();
  const lastPathRef = useRef(location.pathname);

  useEffect(() => {
    // Only reload if the path has actually changed to avoid infinite loops on initial load
    if (lastPathRef.current !== location.pathname) {
      window.location.reload();
    }
  }, [location.pathname]);

  return null;
};

const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Pages */}
        <Route path="/verify" element={<VerifyLandingPage />} />
        <Route path="/verify/:hash" element={<VerifyPage />} />
        <Route path="/invite/:token" element={<InviteAcceptPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/stats" element={<StatsPage />} />
        
        {/* Legal Pages */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Route>
      
      {/* Docs */}
      <Route path="/docs" element={<DocsLayout />}>
        {/* Getting Started */}
        <Route index element={<DocsPage />} />
        <Route path="quickstart" element={<QuickStartPage />} />
        <Route path="installation" element={<InstallationPage />} />
        <Route path="authentication/bearer" element={<BearerAuthPage />} />
        <Route path="authentication/api-keys" element={<ApiKeysAuthPage />} />
        
        {/* Core Concepts */}
        <Route path="concepts/hashing" element={<HashingConceptPage />} />
        <Route path="concepts/lifecycle" element={<LifecyclePage />} />
        <Route path="concepts/verification" element={<VerificationModelPage />} />
        <Route path="concepts/storage" element={<StoragePage />} />
        
        {/* CLI Reference */}
        <Route path="cli" element={<CliReferencePage />} />
        <Route path="cli/link" element={<CliLinkPage />} />
        <Route path="cli/stage" element={<CliStagePage />} />
        <Route path="cli/anchor" element={<CliAnchorPage />} />
        <Route path="cli/verify" element={<CliVerifyPage />} />
        <Route path="cli/status" element={<CliStatusPage />} />
        <Route path="cli/history" element={<CliHistoryPage />} />
        <Route path="cli/revoke" element={<CliRevokePage />} />
        
        {/* API Reference */}
        <Route path="api" element={<ApiReferencePage />} />
        <Route path="api/auth" element={<ApiAuthPage />} />
        <Route path="api/hashes" element={<ApiHashesPage />} />
        <Route path="api/keys" element={<ApiKeysPage />} />
        <Route path="api/orgs" element={<ApiOrgsPage />} />
        <Route path="api/webhooks" element={<ApiWebhooksPage />} />
        <Route path="api/usage" element={<ApiUsagePage />} />
        
        {/* Guides */}
        <Route path="guides/legal" element={<GuideLegalPage />} />
        <Route path="guides/financial" element={<GuideFinancialPage />} />
        <Route path="guides/enterprise" element={<GuideEnterprisePage />} />
        <Route path="guides/cicd" element={<GuideCicdPage />} />
        <Route path="guides/webhooks" element={<GuideWebhooksPage />} />
        
        {/* SDKs */}
        <Route path="sdks/javascript" element={<SdkJavaScriptPage />} />
        <Route path="sdks/python" element={<SdkPythonPage />} />
        
        {/* Resources */}
        <Route path="changelog" element={<ChangelogPage />} />
        <Route path="support" element={<SupportPage />} />
      </Route>
      
      {/* Auth Routes - redirect to dashboard if already logged in */}
      <Route element={<MainLayout />}>
        <Route path="/auth/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/auth/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="/auth/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
        <Route path="/auth/reset-password" element={<PublicOnlyRoute><ResetPasswordPage /></PublicOnlyRoute>} />
      </Route>
      
      {/* Dashboard Routes - require authentication */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="hashes" element={<HashesPage />} />
        <Route path="hashes/:hash" element={<HashDetailPage />} />
        <Route path="bulk-verify" element={<BulkVerifyPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="keys" element={<DashboardApiKeysPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="webhooks" element={<WebhooksPage />} />
        <Route path="audit" element={<AuditPage />} />
        <Route path="playground" element={<PlaygroundPage />} />
        <Route path="embed" element={<EmbedSharePage />} />
        <Route path="usage" element={<UsagePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>
      
      {/* Catch-all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="bottom-right" 
          theme="dark"
          toastOptions={{
            style: {
              background: '#0a0a0f',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#f0f0f5',
            },
          }}
        />
        <NavigationReloadManager />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
