import { useState, useEffect } from "react";
import { CheckCircle, Clock, Copy, FileText, Filter, MapPin, Search, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import ApplicationDetailModal from "@/components/admin/ApplicationDetailModal";

// Export mock data structure so it can be shared with the modal
export interface AdminApplication {
    id: string; // e.g NB-2025-0042
    date: string;
    restaurantName: string;
    type: string;
    area: string;
    status: "pending" | "missing_docs" | "approved" | "rejected";
    docs: { fss: boolean | null, trade: boolean | null, nid: boolean | null };
    phone: string;
    expectedWaste: number;
}

const initialApps: AdminApplication[] = [
    { id: "NB-2025-0042", date: "Mar 8, 2:34 PM", restaurantName: "Kacchi Bhai", type: "Biryani", area: "Gulshan", status: "pending", docs: { fss: true, trade: true, nid: null }, phone: "01711000000", expectedWaste: 25 },
    { id: "NB-2025-0041", date: "Mar 8, 1:15 PM", restaurantName: "Cooper's Bakery", type: "Bakery", area: "Banani", status: "pending", docs: { fss: null, trade: true, nid: true }, phone: "01711000001", expectedWaste: 15 },
    { id: "NB-2025-0039", date: "Mar 7, 10:20 AM", restaurantName: "Bismillah Kabab", type: "Fast Food", area: "Mirpur", status: "missing_docs", docs: { fss: false, trade: false, nid: true }, phone: "01711000002", expectedWaste: 10 },
    { id: "NB-2025-0038", date: "Mar 7, 09:05 AM", restaurantName: "Sweet House", type: "Sweets", area: "Dhanmondi", status: "pending", docs: { fss: true, trade: true, nid: true }, phone: "01711000003", expectedWaste: 5 },
];

const AdminApplicationsScreen = () => {
    const [applications, setApplications] = useState<AdminApplication[]>([]);
    const [filter, setFilter] = useState("Pending");
    const [selectedApp, setSelectedApp] = useState<AdminApplication | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("nb_admin_applications");
        if (stored) {
            setApplications(JSON.parse(stored));
        } else {
            localStorage.setItem("nb_admin_applications", JSON.stringify(initialApps));
            setApplications(initialApps);
        }
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: `Reference ${text} copied to clipboard.` });
    };

    const handleApprove = (id: string, commission: number) => {
        const updated = applications.map(a => a.id === id ? { ...a, status: "approved" as const } : a);
        setApplications(updated);
        localStorage.setItem("nb_admin_applications", JSON.stringify(updated));
        setSelectedApp(null);
        toast({ title: "Partner Approved", description: `Commission set to ${commission}%` });
    };

    const handleReject = (id: string, reason: string, days: string) => {
        const updated = applications.map(a => a.id === id ? { ...a, status: "rejected" as const } : a);
        setApplications(updated);
        localStorage.setItem("nb_admin_applications", JSON.stringify(updated));
        setSelectedApp(null);
        toast({ title: "Application Rejected", variant: "destructive" });
    };

    const handleMoreInfo = (id: string, msg: string) => {
        const updated = applications.map(a => a.id === id ? { ...a, status: "missing_docs" as const } : a);
        setApplications(updated);
        localStorage.setItem("nb_admin_applications", JSON.stringify(updated));
        setSelectedApp(null);
        toast({ title: "Information Requested", description: "Partner has been notified." });
    };

    const DocBadge = ({ val, label }: { val: boolean | null, label: string }) => {
        if (val === true) return <span className="bg-emerald-500/10 text-emerald-500 flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded" title={`${label}: Verified`}><CheckCircle className="w-3 h-3" /> {label}</span>;
        if (val === false) return <span className="bg-destructive/10 text-destructive flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded" title={`${label}: Missing/Invalid`}><XCircle className="w-3 h-3" /> {label}</span>;
        return <span className="bg-amber-500/10 text-amber-500 flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded" title={`${label}: Pending Review`}><HelpCircle className="w-3 h-3" /> {label}</span>;
    };

    const pendingCount = applications.filter(a => a.status === "pending" || a.status === "missing_docs").length;

    return (
        <div className="space-y-6 pb-6">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                        Applications Overview
                    </h1>
                    <p className="text-muted-foreground mt-1">Review and verify new partner requests.</p>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card p-4 rounded-2xl border border-b-4 border-amber-500">
                    <p className="text-sm text-muted-foreground font-medium mb-1">Pending Review</p>
                    <h3 className="text-2xl font-bold">{pendingCount}</h3>
                </div>
                <div className="bg-card p-4 rounded-2xl border border-b-4 border-emerald-500">
                    <p className="text-sm text-muted-foreground font-medium mb-1">Approved Today</p>
                    <h3 className="text-2xl font-bold">2</h3>
                </div>
                <div className="bg-card p-4 rounded-2xl border border-b-4 border-destructive">
                    <p className="text-sm text-muted-foreground font-medium mb-1">Rejected This Week</p>
                    <h3 className="text-2xl font-bold">4</h3>
                </div>
                <div className="bg-card p-4 rounded-2xl border border-border">
                    <p className="text-sm text-muted-foreground font-medium mb-1">Avg Review Time</p>
                    <h3 className="text-2xl font-bold text-secondary">18 hrs</h3>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
                    {["All", "Pending", "Priority (>20kg)", "Missing Docs"].map(f => (
                        <Button
                            key={f}
                            variant={filter === f ? "default" : "outline"}
                            onClick={() => setFilter(f)}
                            className={`rounded-full whitespace-nowrap ${filter !== f && 'bg-card text-foreground hover:bg-muted'}`}
                        >
                            {f}
                        </Button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search reference or name..."
                        className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="font-bold px-6 py-4">Reference</th>
                                <th className="font-bold px-6 py-4">Restaurant</th>
                                <th className="font-bold px-6 py-4">Submitted</th>
                                <th className="font-bold px-6 py-4">Documents</th>
                                <th className="font-bold px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {applications.filter(a => ['pending', 'missing_docs'].includes(a.status)).map(app => (
                                <tr key={app.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <button onClick={() => copyToClipboard(app.id)} className="flex items-center gap-1.5 font-mono font-medium text-foreground hover:text-primary transition-colors group/btn">
                                            {app.id}
                                            <Copy className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground text-base">{app.restaurantName}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <span className="bg-muted px-1.5 py-0.5 rounded">{app.type}</span>
                                                <MapPin className="w-3 h-3 ml-1" /> {app.area}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {app.date}
                                        {app.status === "missing_docs" && (
                                            <p className="text-[10px] text-destructive font-bold mt-1 uppercase tracking-wider">Awaiting User</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1.5">
                                            <DocBadge val={app.docs.fss} label="FSS" />
                                            <DocBadge val={app.docs.trade} label="Trade" />
                                            <DocBadge val={app.docs.nid} label="NID" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="group relative inline-block text-left mr-3">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground pointer-events-none">
                                                <HelpCircle className="w-4 h-4" />
                                            </Button>
                                            <div className="absolute bottom-full right-0 mb-2 w-max bg-foreground text-background text-xs font-bold py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                {app.phone}
                                            </div>
                                        </div>

                                        <Button variant="default" size="sm" className="font-bold" onClick={() => setSelectedApp(app)}>
                                            Review
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedApp && (
                <ApplicationDetailModal
                    application={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onMoreInfo={handleMoreInfo}
                />
            )}
        </div>
    );
};

export default AdminApplicationsScreen;
