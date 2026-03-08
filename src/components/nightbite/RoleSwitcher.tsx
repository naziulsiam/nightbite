import { motion } from "framer-motion";
import { ArrowRightLeft, Store, Leaf } from "lucide-react";
import { useAuth, Role } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const RoleSwitcher = () => {
    const { user, toggleActiveRole, setupRole } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const hasBothRoles = user.roles.length > 1;
    const isConsumer = user.activeRole === "consumer";

    const handleSwitch = () => {
        if (hasBothRoles) {
            toggleActiveRole();
            if (user.activeRole === "consumer") {
                if (user.partnerStatus === "approved") navigate("/partner");
                else if (user.partnerStatus === "none") navigate("/partner/register");
                else navigate("/partner/status");
            } else {
                navigate("/app/home");
            }
        } else {
            // Setup the missing role
            const missingRole: Role = isConsumer ? "partner" : "consumer";
            setupRole(missingRole);
            if (missingRole === "partner") {
                if (user.partnerStatus === "approved") navigate("/partner");
                else if (user.partnerStatus === "none") navigate("/partner/register");
                else navigate("/partner/status");
            } else {
                navigate("/app/home");
            }
        }
    };

    const currentThemeClasses = isConsumer
        ? "bg-primary/10 text-primary hover:bg-primary/20"
        : "bg-secondary/10 text-secondary hover:bg-secondary/20";

    return (
        <motion.button
            onClick={handleSwitch}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-300 ${currentThemeClasses}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <ArrowRightLeft className="w-3 h-3" />
            <span>{isConsumer ? "Switch to Partner" : "Switch to Consumer"}</span>
            {isConsumer ? <Store className="w-3 h-3 ml-1" /> : <Leaf className="w-3 h-3 ml-1" />}
        </motion.button>
    );
};
