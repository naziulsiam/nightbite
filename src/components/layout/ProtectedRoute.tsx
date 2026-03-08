import { Navigate, Outlet } from "react-router-dom";
import { useAuth, Role } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
    allowedRoles?: Role[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
        );
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
