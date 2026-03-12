import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/stores/authStore";
import type { User, UserRole, PartnerStatus } from "@/types";

// Re-export types for backward compatibility
export type Role = UserRole;
export type { PartnerStatus };

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (phone: string) => Promise<void>;
    verifyOtp: (otp: string) => Promise<boolean>;
    logout: () => void;
    setupRole: (role: Role) => void;
    toggleActiveRole: () => void;
    submitPartnerApplication: () => void;
    setPartnerStatus: (status: PartnerStatus) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Store phone temporarily for OTP verification
let pendingPhone: string | null = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const store = useAuthStore();
    const [localLoading, setLocalLoading] = useState(false);

    // Sync store hydration state
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        if (store.hasHydrated) {
            setIsReady(true);
        }
    }, [store.hasHydrated]);

    const login = async (phone: string) => {
        pendingPhone = phone;
        await store.login(phone);
    };

    const verifyOtp = async (otp: string): Promise<boolean> => {
        if (!pendingPhone) return false;
        const result = await store.verifyOtp(pendingPhone, otp);
        if (result) {
            pendingPhone = null;
        }
        return result;
    };

    const logout = () => {
        store.logout();
    };

    const setupRole = (role: Role) => {
        setLocalLoading(true);
        store.setupRole(role).finally(() => setLocalLoading(false));
    };

    const toggleActiveRole = () => {
        setLocalLoading(true);
        store.toggleActiveRole().finally(() => setLocalLoading(false));
    };

    const submitPartnerApplication = () => {
        store.updateUser({ partnerStatus: "pending" as PartnerStatus });
    };

    const setPartnerStatus = (status: PartnerStatus) => {
        store.updateUser({ partnerStatus: status });
    };

    const value: AuthContextType = {
        user: store.user,
        isAuthenticated: store.isAuthenticated,
        isLoading: store.isLoading || localLoading || !isReady,
        login,
        verifyOtp,
        logout,
        setupRole,
        toggleActiveRole,
        submitPartnerApplication,
        setPartnerStatus,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
