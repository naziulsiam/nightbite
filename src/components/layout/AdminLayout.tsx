import { Navigate, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, FileText, CheckCircle, XCircle, Settings, Bell, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    const isAuthenticated = localStorage.getItem("nb_admin_auth") === "true";

    useEffect(() => {
        // Poll for pending count
        const updateCount = () => {
            const stored = localStorage.getItem("nb_admin_applications");
            if (stored) {
                const apps = JSON.parse(stored);
                setPendingCount(apps.filter((a: { status: string }) => a.status === "pending").length);
            }
        };
        updateCount();
        const interval = setInterval(updateCount, 2000);
        return () => clearInterval(interval);
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem("nb_admin_auth");
        navigate("/admin/login");
    };

    const navItems = [
        { name: "Applications", path: "/admin", icon: FileText, badge: pendingCount },
        { name: "Approved Partners", path: "/admin/approved", icon: CheckCircle },
        { name: "Rejected Apps", path: "/admin/rejected", icon: XCircle },
        { name: "Settings", path: "/admin/settings", icon: Settings },
    ];

    const isActive = (path: string) => {
        if (path === "/admin" && location.pathname !== "/admin") return false;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row font-sans">

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-background border-r border-border fixed h-full z-40 shadow-sm">
                <div className="p-6 flex items-center gap-3 border-b border-border/50">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="font-bold text-lg text-foreground block leading-tight">NightBite</span>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Admin Portal</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-5 h-5" />
                                    {item.name}
                                </div>
                                {item.badge > 0 && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-primary-foreground text-primary' : 'bg-destructive text-destructive-foreground'}`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-3" />
                        Log out
                    </Button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-background border-b border-border sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-foreground">Admin Portal</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="relative text-muted-foreground p-2" onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                        {pendingCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-background z-50 flex flex-col md:hidden animate-in fade-in duration-200">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <span className="font-bold text-lg">Menu</span>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-muted-foreground hover:bg-muted rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center justify-between p-4 rounded-xl font-medium border ${active ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-card border-border text-foreground'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                                        {item.name}
                                    </div>
                                    {item.badge > 0 && (
                                        <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="p-4 border-t border-border bg-muted/30">
                        <Button variant="outline" className="w-full text-destructive border-destructive/20 hover:bg-destructive/10" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" /> Log out
                        </Button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-[calc(100vh-64px)] md:min-h-screen">
                {/* Desktop Topbar */}
                <div className="hidden md:flex items-center justify-between h-16 px-8 bg-background/50 backdrop-blur-md border-b border-border sticky top-0 z-30">
                    <div className="font-medium text-muted-foreground">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />
                        </button>
                    </div>
                </div>

                <div className="p-4 md:p-8 flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
