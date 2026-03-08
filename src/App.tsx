import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import ConsumerLayout from "./components/layout/ConsumerLayout";
import PartnerLayout from "./components/layout/PartnerLayout";
import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import LocationScreen from "./pages/LocationScreen";
import HomeScreen from "./pages/HomeScreen";
import RestaurantDetail from "./pages/RestaurantDetail";
import CheckoutScreen from "./pages/CheckoutScreen";
import PickupScreen from "./pages/PickupScreen";
import ProfileScreen from "./pages/ProfileScreen";
import ImpactScreen from "./pages/ImpactScreen";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import PartnerRegisterScreen from "./pages/PartnerRegisterScreen";
import PartnerStatusScreen from "./pages/PartnerStatusScreen";
import PartnerListingsScreen from "./pages/partner/PartnerListingsScreen";
import PartnerEditListingScreen from "./pages/partner/PartnerEditListingScreen";
import PartnerOrdersScreen from "./pages/partner/PartnerOrdersScreen";
import PartnerAnalyticsScreen from "./pages/partner/PartnerAnalyticsScreen";
import PartnerPayoutsScreen from "./pages/partner/PartnerPayoutsScreen";

import AdminLoginScreen from "./pages/admin/AdminLoginScreen";
import AdminLayout from "./components/layout/AdminLayout";
import AdminApplicationsScreen from "./pages/admin/AdminApplicationsScreen";
import AdminApprovedScreen from "./pages/admin/AdminApprovedScreen";
import AdminRejectedScreen from "./pages/admin/AdminRejectedScreen";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/location" element={<LocationScreen />} />

            {/* Protected Consumer Routes */}
            <Route element={<ProtectedRoute allowedRoles={["consumer"]} />}>
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
            <Route element={<ProtectedRoute allowedRoles={["partner"]} />}>
              <Route path="/partner/register" element={<PartnerRegisterScreen />} />
              <Route path="/partner/status" element={<PartnerStatusScreen />} />
              <Route element={<PartnerLayout />}>
                {/* Main Dashboard */}
                <Route path="/partner" element={<RestaurantDashboard />} />
                <Route path="/partner/dashboard" element={<Navigate to="/partner" replace />} />

                {/* Listings */}
                <Route path="/partner/listings" element={<PartnerListingsScreen />} />
                <Route path="/partner/listings/new" element={<PartnerEditListingScreen />} />
                <Route path="/partner/listings/edit/:id" element={<PartnerEditListingScreen />} />

                {/* Orders, Analytics, Payouts, Settings */}
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
