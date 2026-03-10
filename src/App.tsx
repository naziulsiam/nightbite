import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/authStore';
import ErrorBoundary from '@/components/ErrorBoundary';
import { LoadingScreen } from '@/components/LoadingScreen';

// Eager load critical components
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import ConsumerLayout from '@/components/layout/ConsumerLayout';
import PartnerLayout from '@/components/layout/PartnerLayout';

// Lazy load route components for code splitting
const SplashScreen = lazy(() => import('@/pages/SplashScreen'));
const LoginScreen = lazy(() => import('@/pages/LoginScreen'));
const LocationScreen = lazy(() => import('@/pages/LocationScreen'));
const HomeScreen = lazy(() => import('@/pages/HomeScreen'));
const RestaurantDetail = lazy(() => import('@/pages/RestaurantDetail'));
const CheckoutScreen = lazy(() => import('@/pages/CheckoutScreen'));
const PickupScreen = lazy(() => import('@/pages/PickupScreen'));
const ProfileScreen = lazy(() => import('@/pages/ProfileScreen'));
const ImpactScreen = lazy(() => import('@/pages/ImpactScreen'));
const RestaurantDashboard = lazy(() => import('@/pages/RestaurantDashboard'));
const PartnerRegisterScreen = lazy(() => import('@/pages/PartnerRegisterScreen'));
const PartnerStatusScreen = lazy(() => import('@/pages/PartnerStatusScreen'));
const PartnerListingsScreen = lazy(() => import('@/pages/partner/PartnerListingsScreen'));
const PartnerEditListingScreen = lazy(() => import('@/pages/partner/PartnerEditListingScreen'));
const PartnerOrdersScreen = lazy(() => import('@/pages/partner/PartnerOrdersScreen'));
const PartnerAnalyticsScreen = lazy(() => import('@/pages/partner/PartnerAnalyticsScreen'));
const PartnerPayoutsScreen = lazy(() => import('@/pages/partner/PartnerPayoutsScreen'));
const AdminLoginScreen = lazy(() => import('@/pages/admin/AdminLoginScreen'));
const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'));
const AdminApplicationsScreen = lazy(() => import('@/pages/admin/AdminApplicationsScreen'));
const AdminApprovedScreen = lazy(() => import('@/pages/admin/AdminApprovedScreen'));
const AdminRejectedScreen = lazy(() => import('@/pages/admin/AdminRejectedScreen'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Initialize auth from storage on app load
const InitAuth = ({ children }: { children: React.ReactNode }) => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return <LoadingScreen message="Starting up..." />;
  }

  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <InitAuth>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<SplashScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/location" element={<LocationScreen />} />

                {/* Protected Consumer Routes */}
                <Route element={<ProtectedRoute allowedRoles={['consumer']} />}>
                  <Route element={<ConsumerLayout />}>
                    <Route path="/app" element={<Navigate to="/app/home" replace />} />
                    <Route path="/app/home" element={<HomeScreen />} />
                    <Route path="/app/restaurant/:id" element={<RestaurantDetail />} />
                    <Route path="/app/checkout/:id" element={<CheckoutScreen />} />
                    <Route path="/app/pickup/:id" element={<PickupScreen />} />
                    <Route path="/app/orders" element={<ProfileScreen />} />
                    <Route path="/app/profile" element={<ProfileScreen />} />
                    <Route path="/app/favorites" element={<Navigate to="/app/profile" replace />} />
                    <Route path="/app/impact" element={<ImpactScreen />} />
                  </Route>
                </Route>

                {/* Protected Partner Routes */}
                <Route element={<ProtectedRoute allowedRoles={['partner']} />}>
                  <Route path="/partner/register" element={<PartnerRegisterScreen />} />
                  <Route path="/partner/status" element={<PartnerStatusScreen />} />
                  <Route element={<PartnerLayout />}>
                    <Route path="/partner" element={<RestaurantDashboard />} />
                    <Route path="/partner/dashboard" element={<Navigate to="/partner" replace />} />
                    <Route path="/partner/listings" element={<PartnerListingsScreen />} />
                    <Route path="/partner/listings/new" element={<PartnerEditListingScreen />} />
                    <Route path="/partner/listings/edit/:id" element={<PartnerEditListingScreen />} />
                    <Route path="/partner/orders" element={<PartnerOrdersScreen />} />
                    <Route path="/partner/orders/:id" element={<PartnerOrdersScreen />} />
                    <Route path="/partner/analytics" element={<PartnerAnalyticsScreen />} />
                    <Route path="/partner/payouts" element={<PartnerPayoutsScreen />} />
                    <Route path="/partner/settings" element={<Navigate to="/partner" replace />} />
                  </Route>
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginScreen />} />
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminApplicationsScreen />} />
                  <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
                  <Route path="/admin/approved" element={<AdminApprovedScreen />} />
                  <Route path="/admin/rejected" element={<AdminRejectedScreen />} />
                </Route>

                {/* Redirect legacy routes */}
                <Route path="/home" element={<Navigate to="/app/home" replace />} />
                <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
                <Route path="/restaurant-dashboard" element={<Navigate to="/partner/dashboard" replace />} />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </InitAuth>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
