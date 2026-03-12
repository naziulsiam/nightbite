import { useState, useEffect } from "react";
import { AlertTriangle, Download, RefreshCw, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminApplication } from "@/pages/admin/AdminApplicationsScreen";

const initialRejected = [
    { id: "NB-2025-0015", date: "Feb 18, 2025", restaurantName: "Unknown Cafe", reason: "Invalid FSS License", reapplyDate: "Mar 20, 2025" },
    { id: "NB-2025-0021", date: "Feb 27, 2025", restaurantName: "Fake Biryani", reason: "Business not eligible (No physical location)", reapplyDate: "May 27, 2025" },
    { id: "NB-2025-0033", date: "Mar 06, 2025", restaurantName: "Old Town Treats", reason: "Trade License mismatch", reapplyDate: "Apr 05, 2025" },
];

const AdminRejectedScreen = () => {
    interface RejectedApp {
  id: string;
  date: string;
  restaurantName: string;
  reason: string;
  reapplyDate: string;
}

const AdminRejectedScreen = () => {
    const [applications, setApplications] = useState<RejectedApp[]>(initialRejected);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("nb_admin_applications");
        if (stored) {
            const apps: AdminApplication[] = JSON.parse(stored);
            const newlyRejected = apps
                .filter(a => a.status === "rejected")
                .map(a => ({
                    id: a.id,
                    date: a.date,
                    restaurantName: a.restaurantName,
                    reason: "Rejected after admin review", // Default fallback if didn't capture specific reason
                    reapplyDate: "TBD"
                }));

            const merged = [...newlyRejected, ...initialRejected].reduce((acc: RejectedApp[], current) => {
                const x = acc.find((item) => item.id === current.id);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);

            setApplications(merged);
        }
    }, []);

    const filtered = applications.filter(a => a.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 pb-6">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                        Rejected Applications
                    </h1>
                    <p className="text-muted-foreground mt-1">Review dismissed applications and their cooldown periods.</p>
                </div>
            </header>

            {/* Search */}
            <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search restaurant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-destructive/50 outline-none"
                />
            </div>

            {/* Table */}
            <div className="bg-card rounded-2xl border border-destructive/20 overflow-hidden relative">

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-destructive/5 text-destructive font-medium border-b border-destructive/10">
                            <tr>
                                <th className="px-6 py-4">Restaurant</th>
                                <th className="px-6 py-4">Rejected Date</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Can Reapply After</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filtered.map(app => (
                                <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground text-base">{app.restaurantName}</span>
                                            <span className="text-xs text-muted-foreground font-mono mt-0.5">{app.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{app.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 max-w-xs truncate text-muted-foreground">
                                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                            <span className="truncate" title={app.reason}>{app.reason}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-foreground">{app.reapplyDate}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" className="h-8 text-xs" title="Restore Application">
                                                <RefreshCw className="w-3 h-3 mr-1" /> Restore
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminRejectedScreen;
