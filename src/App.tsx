
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import PageTransition from "./components/ui/page-transition";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import PropertiesPage from "./pages/PropertiesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyLoginCodePage from "./pages/auth/VerifyLoginCodePage";

// Dashboard Pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import KycVerificationPage from "./pages/dashboard/KycVerificationPage";

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminKycPage from "./pages/admin/AdminKycPage";

// Auth Guards
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes with MainLayout (includes navbar) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              } />
              <Route path="/home" element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              } />
              <Route path="/properties" element={
                <PageTransition>
                  <PropertiesPage />
                </PageTransition>
              } />
              <Route path="/about" element={
                <PageTransition>
                  <AboutPage />
                </PageTransition>
              } />
              <Route path="/contact" element={
                <PageTransition>
                  <ContactPage />
                </PageTransition>
              } />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              } />
              <Route path="/register" element={
                <PageTransition>
                  <RegisterPage />
                </PageTransition>
              } />
              <Route path="/verify-email" element={
                <PageTransition>
                  <VerifyEmailPage />
                </PageTransition>
              } />
              <Route path="/forgot-password" element={
                <PageTransition>
                  <ForgotPasswordPage />
                </PageTransition>
              } />
              <Route path="/reset-password" element={
                <PageTransition>
                  <ResetPasswordPage />
                </PageTransition>
              } />
              <Route path="/verify-login-code" element={
                <PageTransition>
                  <VerifyLoginCodePage />
                </PageTransition>
              } />
            </Route>

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={
                  <PageTransition>
                    <DashboardPage />
                  </PageTransition>
                } />
                <Route path="/profile" element={
                  <PageTransition>
                    <ProfilePage />
                  </PageTransition>
                } />
                <Route path="/kyc-verification" element={
                  <PageTransition>
                    <KycVerificationPage />
                  </PageTransition>
                } />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin/dashboard" element={
                  <PageTransition>
                    <AdminDashboardPage />
                  </PageTransition>
                } />
                <Route path="/admin/users" element={
                  <PageTransition>
                    <AdminUsersPage />
                  </PageTransition>
                } />
                <Route path="/admin/kyc" element={
                  <PageTransition>
                    <AdminKycPage />
                  </PageTransition>
                } />
              </Route>
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
