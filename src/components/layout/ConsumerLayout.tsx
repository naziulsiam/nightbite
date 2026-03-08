import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ConsumerLayout = () => {
    const { user } = useAuth();

    if (user?.activeRole !== "consumer") {
        return <Navigate to="/partner" replace />;
    }

    return (
        <div className="consumer-theme relative min-h-screen">
            <Outlet />
        </div>
    );
};

export default ConsumerLayout;
