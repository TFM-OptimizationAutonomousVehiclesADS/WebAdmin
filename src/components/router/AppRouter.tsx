import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';
import SignUpPage from '@app/pages/SignUpPage';
import ForgotPasswordPage from '@app/pages/ForgotPasswordPage';
import SecurityCodePage from '@app/pages/SecurityCodePage';
import NewPasswordPage from '@app/pages/NewPasswordPage';
import LockPage from '@app/pages/LockPage';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import ProfileLayout from '@app/components/profile/ProfileLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
import DigitalModelsListPage from '@app/pages/DigitalModels/DigitalModelsListPage';
import DigitalModelPage from "@app/pages/DigitalModels/DigitalModelPage";
import AlertsDashboardPage from "@app/pages/DashboardPages/AlertsDashboardPage";
import AnomaliesDashboardPage from "@app/pages/DashboardPages/AnomaliesDashboardPage";
import RetrainingDashboardPage from "@app/pages/DashboardPages/RetrainingDashboardPage";
import RealSystemPage from "@app/pages/RealSystem/RealSystemPage";

const ServerErrorPage = React.lazy(() => import('@app/pages/ServerErrorPage'));
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const PersonalInfoPage = React.lazy(() => import('@app/pages/PersonalInfoPage'));
const SecuritySettingsPage = React.lazy(() => import('@app/pages/SecuritySettingsPage'));
const NotificationsPage = React.lazy(() => import('@app/pages/NotificationsPage'));
const PaymentsPage = React.lazy(() => import('@app/pages/PaymentsPage'));
const Logout = React.lazy(() => import('./Logout'));

export const INDEX_DASHBOARD_PATH = '/';
export const ALERTS_DASHBOARD_PATH = '/alerts-dashboard';
export const ANOMALIES_DASHBOARD_PATH = '/anomalies-dashboard';
export const RETRAINING_DASHBOARD_PATH = '/retraining-dashboard';

const RetrainingDashboard = withLoading(RetrainingDashboardPage);
const AnomaliesDashboard = withLoading(AnomaliesDashboardPage);
const AlertsDashboard = withLoading(AlertsDashboardPage);

const ServerError = withLoading(ServerErrorPage);
const Error404 = withLoading(Error404Page);

const DigitalModelsList = withLoading(DigitalModelsListPage);

// Profile
const PersonalInfo = withLoading(PersonalInfoPage);
const SecuritySettings = withLoading(SecuritySettingsPage);
const Notifications = withLoading(NotificationsPage);
const Payments = withLoading(PaymentsPage);

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={protectedLayout}>
          <Route index element={<AlertsDashboard/>} />
          <Route path={"/alerts-dashboard"} element={<AlertsDashboard/>} />
          <Route path={"/anomalies-dashboard"} element={<AnomaliesDashboard/>} />
          <Route path={"/retraining-dashboard"} element={<RetrainingDashboard/>} />

          <Route path={"/digital-models"} element={<DigitalModelsList />} />
          <Route path={"/digital-model/:idDigitalModel"} element={<DigitalModelPage/>} />
          <Route path={"/real-system"} element={<RealSystemPage/>} />
          <Route path="server-error" element={<ServerError />} />
          <Route path="404" element={<Error404 />} />
          <Route path="profile" element={<ProfileLayout />}>
            <Route path="personal-info" element={<PersonalInfo />} />
            <Route path="security-settings" element={<SecuritySettings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="payments" element={<Payments />} />
          </Route>
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route
            path="lock"
            element={
              <RequireAuth>
                <LockPage />
              </RequireAuth>
            }
          />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="security-code" element={<SecurityCodePage />} />
          <Route path="new-password" element={<NewPasswordPage />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
