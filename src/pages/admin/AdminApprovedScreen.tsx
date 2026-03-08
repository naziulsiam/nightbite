import { useState, useEffect } from "react";
import { Download, Edit2, MessageSquare, MoreVertical, Search, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminApplication } from "@/pages/admin/AdminApplicationsScreen";

const initialApproved = [
    { id: "NB-2025-0012", date: "Feb 15, 2025", restaurantName: "Star Kabab", type: "Mixed", commission: 12, listings: 45, revenue: 145000, status: "Active" },
    { id: "NB-2025-0018", date: "Feb 22, 2025", restaurantName: "Panshi Restaurant", type: "Bengali", commission: 15, listings: 12, revenue: 32000, status: "Active" },
    { id: "NB-2025-0024", date: "Mar 01, 2025", restaurantName: "Burger King", type: "Fast Food", commission: 10, listings: 85, revenue: 210000, status: "Active" },
    { id: "NB-2025-0030", date: "Mar 05, 2025", restaurantName: "Cafe Mango", type: "Cafe", commission: 12, listings: 0, revenue: 0, status: "Onboarding" },
];

const AdminApprovedScreen = () => {
    const [partners, setPartners] = useState<any[]>(initialApproved);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("nb_admin_applications");
        if (stored) {
            const apps: AdminApplication[] = JSON.parse(stored);
            const newlyApproved = apps
                .filter(a => a.status === "approved")
                .map(a => ({
                    id: a.id,
                    date: a.date,
                    restaurantName: a.restaurantName,
                    type: a.type,
                    commission: 12, // Default mock commission
                    listings: 0,
                    revenue: 0,
                    status: "Onboarding"
                }));

            // Merge mock data with any newly approved partners from localstorage during this session
            const merged = [...newlyApproved, ...initialApproved].reduce((acc, current) => {
                const x = acc.find((item: any) => item.id === current.id);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);

            setPartners(merged);
        }
    }, []);

    const filteredPartners = partners.filter(p => p.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 pb-6">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                        Approved Partners
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage active business relationships and commissions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-card">
                        <MessageSquare className="w-4 h-4 mr-2" /> Bulk Message
                    </Button>
                    <Button variant="outline" className="bg-card">
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </header>

            {/* Search */}
            <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search partner name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                />
            </div>

            {/* Table */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="font-bold px-6 py-4">Restaurant</th>
                                <th className="font-bold px-6 py-4">Approved Date</th>
                                <th className="font-bold px-6 py-4">Status</th>
                                <th className="font-bold px-6 py-4 text-right">Commission</th>
                                <th className="font-bold px-6 py-4 text-right">Listings</th>
                                <th className="font-bold px-6 py-4 text-right">Total Revenue</th>
                                <th className="font-bold px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredPartners.map(p => (
                                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground text-base">{p.restaurantName}</span>
                                            <span className="text-xs text-muted-foreground font-mono mt-0.5">{p.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{p.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full ${p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} /> {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-medium flex justify-end items-center gap-2 group/edit cursor-pointer">
                                            {p.commission}%
                                            <Edit2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium">{p.listings}</td>
                                    <td className="px-6 py-4 text-right font-bold text-secondary">৳{p.revenue.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
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

export default AdminApprovedScreen;
