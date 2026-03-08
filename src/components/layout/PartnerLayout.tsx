import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
    Home, Package, Receipt, BarChart2,
    Bell, LogOut, Store, Menu, X, Settings, HelpCircle
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const PartnerLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user?.activeRole !== "partner") {
        return <Navigate to="/app/home" replace />;
    }

    // Redirect to registration if not submitted
    if (user?.partnerStatus === "none") {
        return <Navigate to="/partner/register" replace />;
    }

    // Redirect to status page if pending or rejected
    if (user?.partnerStatus === "pending" || user?.partnerStatus === "rejected") {
        return <Navigate to="/partner/status" replace />;
    }

    const navItems = [
        { name: "Dashboard", path: "/partner", icon: Home },
        { name: "Listings", path: "/partner/listings", icon: Package },
        { name: "Orders", path: "/partner/orders", icon: Receipt },
        { name: "Analytics", path: "/partner/analytics", icon: BarChart2 },
        { name: "Payouts", path: "/partner/payouts", icon: Settings },
    ];

    const mobileNavItems = [
        { name: "Home", path: "/partner", icon: Home },
        { name: "Listings", path: "/partner/listings", icon: Package },
        { name: "Orders", path: "/partner/orders", icon: Receipt },
        { name: "Analytics", path: "/partner/analytics", icon: BarChart2 },
    ];

    const isActive = (path: string) => {
        if (path === "/partner" && location.pathname !== "/partner") return false;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="partner-theme relative min-h-screen bg-muted/30 flex flex-col md:flex-row">

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-background border-r border-border fixed h-full z-40">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-xl text-primary">
                        <Store className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl text-foreground">NightBite</span>
                    <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full ml-auto">Partner</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="bg-muted rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold">
                                {user?.phone?.slice(-2) || "P"}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-foreground truncate">Partner Account</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.phone}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={logout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Log out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-background border-b border-border sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
                        <Store className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-foreground">NightBite Partner</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="relative text-muted-foreground hover:text-foreground">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
                    </button>
                    <button className="text-muted-foreground" onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Mobile Fullscreen Menu (More Options) */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-background z-50 flex flex-col md:hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <span className="font-bold text-lg">Menu</span>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-muted-foreground hover:text-foreground bg-muted rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="bg-muted rounded-xl p-4 flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold text-lg">
                                {user?.phone?.slice(-2) || "P"}
                            </div>
                            <div>
                                <p className="font-bold text-foreground">My Restaurant</p>
                                <p className="text-sm text-muted-foreground">{user?.phone}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Link to="/partner/payouts" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border text-foreground font-medium">
                                <Settings className="w-5 h-5 text-muted-foreground" /> Payouts & Settings
                            </Link>
                            <button className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border text-foreground font-medium">
                                <HelpCircle className="w-5 h-5 text-muted-foreground" /> Help & Support
                            </button>
                            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive font-medium">
                                <LogOut className="w-5 h-5" /> Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 pb-20 md:pb-0 overflow-y-auto min-h-[calc(100vh-64px)] md:min-h-screen">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {mobileNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <div className={`p-1 rounded-full ${active ? 'bg-primary/10' : ''}`}>
                                    <Icon className={`w-5 h-5 ${active ? 'fill-primary/20' : ''}`} />
                                </div>
                                <span className={`text-[10px] font-medium ${active ? 'font-bold' : ''}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default PartnerLayout;
