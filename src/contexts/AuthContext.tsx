import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "consumer" | "partner" | null;
export type PartnerStatus = "none" | "pending" | "approved" | "rejected";

interface User {
    id: string;
    phone: string;
    roles: string[];
    activeRole: Role;
    partnerStatus: PartnerStatus;
}

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingPhone, setPendingPhone] = useState<string | null>(null);

    useEffect(() => {
        // Load from localStorage on mount
        const savedToken = localStorage.getItem("nb_token");
        const savedUserStr = localStorage.getItem("nb_user");

        if (savedToken && savedUserStr) {
            try {
                const savedUser = JSON.parse(savedUserStr);
                setUser(savedUser);
            } catch (e) {
                console.error("Failed to parse user", e);
                localStorage.removeItem("nb_token");
                localStorage.removeItem("nb_user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (phone: string) => {
        // Simulate API call
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setPendingPhone(phone);
                resolve();
            }, 1000);
        });
    };

    const verifyOtp = async (otp: string) => {
        // Simulate OTP verification
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                if (otp === "123456" && pendingPhone) {
                    // Fake JWT and user creation
                    const newUser: User = {
                        id: `user_${Date.now()}`,
                        phone: pendingPhone,
                        roles: [], // New user has no roles initially
                        activeRole: null,
                        partnerStatus: "none",
                    };
                    setUser(newUser);
                    localStorage.setItem("nb_token", `fake_jwt_${Date.now()}`);
                    localStorage.setItem("nb_user", JSON.stringify(newUser));
                    setPendingPhone(null);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 1500);
        });
    };

    const setupRole = (role: Role) => {
        if (user && role) {
            const updatedUser = {
                ...user,
                roles: [...new Set([...user.roles, role])],
                activeRole: role,
            };
            setUser(updatedUser);
            localStorage.setItem("nb_user", JSON.stringify(updatedUser));
        }
    };

    const toggleActiveRole = () => {
        if (user && user.roles.length > 1) {
            const newRole = user.activeRole === "consumer" ? "partner" : "consumer";
            const updatedUser = { ...user, activeRole: newRole as Role };
            setUser(updatedUser);
            localStorage.setItem("nb_user", JSON.stringify(updatedUser));
        }
    };

    const submitPartnerApplication = () => {
        if (user) {
            const updatedUser = { ...user, partnerStatus: "pending" as PartnerStatus };
            setUser(updatedUser);
            localStorage.setItem("nb_user", JSON.stringify(updatedUser));
        }
    };

    const setPartnerStatus = (status: PartnerStatus) => {
        if (user) {
            const updatedUser = { ...user, partnerStatus: status };
            setUser(updatedUser);
            localStorage.setItem("nb_user", JSON.stringify(updatedUser));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("nb_token");
        localStorage.removeItem("nb_user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                verifyOtp,
                logout,
                setupRole,
                toggleActiveRole,
                submitPartnerApplication,
                setPartnerStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
