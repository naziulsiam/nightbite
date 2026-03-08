import { useState, useEffect } from "react";
import { Copy, Edit3, MoreVertical, Package, PackageOpen, Plus, Search, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export interface MockListing {
    id: string;
    title: string;
    description: string;
    originalPrice: number;
    discountPrice: number;
    totalQuantity: number;
    remainingQuantity: number;
    pickupStart: string;
    pickupEnd: string;
    status: "active" | "scheduled" | "expired" | "draft";
    imageUrl: string;
}

const initialListings: MockListing[] = [
    {
        id: "L1", title: "Surprise Biryani Box", description: "Contains 2 portions of kacchi biryani",
        originalPrice: 400, discountPrice: 199, totalQuantity: 10, remainingQuantity: 5,
        pickupStart: "20:30", pickupEnd: "22:00", status: "active", imageUrl: "/src/assets/biryani.jpg"
    },
    {
        id: "L2", title: "End of Day Pastries", description: "Assortment of sweet & savory pastries",
        originalPrice: 500, discountPrice: 150, totalQuantity: 5, remainingQuantity: 1,
        pickupStart: "21:00", pickupEnd: "22:30", status: "active", imageUrl: "/src/assets/bakery.jpg"
    },
    {
        id: "L3", title: "Weekend Combo Bundle", description: "Burgers, fries, and drinks",
        originalPrice: 800, discountPrice: 350, totalQuantity: 20, remainingQuantity: 20,
        pickupStart: "22:00", pickupEnd: "23:59", status: "scheduled", imageUrl: "/src/assets/fastfood.jpg"
    }
];

const PartnerListingsScreen = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"active" | "scheduled" | "expired" | "draft">("active");
    const [listings, setListings] = useState<MockListing[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("nb_partner_listings");
        if (stored) {
            setListings(JSON.parse(stored));
        } else {
            localStorage.setItem("nb_partner_listings", JSON.stringify(initialListings));
            setListings(initialListings);
        }
    }, []);

    const filteredListings = listings.filter(l => l.status === activeTab);

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        My Listings
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage your boxes and availability.</p>
                </div>
                <Button variant="emerald" onClick={() => navigate("/partner/listings/new")} className="w-full md:w-auto shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" /> Add New Box
                </Button>
            </header>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-2 rounded-2xl border border-border">
                <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1">
                    {(["active", "scheduled", "expired", "draft"] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${activeTab === tab ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search listings..."
                        className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted border-none text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                </div>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filteredListings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl border border-border border-dashed">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
                            <PackageOpen className="w-10 h-10 opacity-50" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">No {activeTab} listings</h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
                            {activeTab === "active" ? "You don't have any boxes live right now. Prevent food waste and earn extra revenue by creating a listing!" : `You have no ${activeTab} listings at the moment.`}
                        </p>
                        {activeTab === "active" && (
                            <Button variant="emerald" onClick={() => navigate("/partner/listings/new")}>
                                Create your first box
                            </Button>
                        )}
                    </div>
                ) : (
                    filteredListings.map(listing => (
                        <div key={listing.id} className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 group transition-shadow hover:shadow-lg hover:border-primary/30">
                            {/* Image & Badges */}
                            <div className="relative w-full md:w-32 h-32 shrink-0">
                                <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover rounded-xl" />
                                {listing.discountPrice < listing.originalPrice && (
                                    <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-md shadow-md">
                                        -{Math.round((1 - listing.discountPrice / listing.originalPrice) * 100)}%
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-bold text-lg text-foreground truncate">{listing.title}</h3>
                                        <div className="flex items-center gap-1">
                                            {listing.status === "active" && listing.remainingQuantity < 3 && (
                                                <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Almost Gone</span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{listing.description}</p>
                                </div>

                                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-foreground">Remaining: {listing.remainingQuantity} of {listing.totalQuantity}</span>
                                            <span className="text-secondary">৳{listing.discountPrice} <span className="text-muted-foreground line-through text-[10px] font-normal">৳{listing.originalPrice}</span></span>
                                        </div>
                                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${listing.remainingQuantity / listing.totalQuantity < 0.3 ? 'bg-destructive' : 'bg-primary'}`}
                                                style={{ width: `${(listing.remainingQuantity / listing.totalQuantity) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium pt-1">
                                            Pickup: {listing.pickupStart} - {listing.pickupEnd}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="h-9 w-9 bg-card text-foreground" onClick={() => navigate(`/partner/listings/edit/${listing.id}`)}>
                                            <Edit3 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-9 w-9 bg-card text-foreground">
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-9 w-9 bg-card text-destructive hover:bg-destructive/10 border-destructive/20">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PartnerListingsScreen;
