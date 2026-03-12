import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { LoadingScreen } from "@/components/LoadingScreen";
import type { UserRole } from "@/types";

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated, isLoading, hasHydrated } = useAuthStore();

    // Wait for auth store to hydrate before making routing decisions
    if (!hasHydrated || isLoading) {
        return <LoadingScreen message="Loading..." />;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user.activeRole && !allowedRoles.includes(user.activeRole)) {
        // Redirect contextually if they are on a route they don't have access to based on their active role
        return <Navigate to={user.activeRole === "partner" ? "/partner" : "/app/home"} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
