import { useState, useEffect } from "react";
import { Check, CheckCircle2, ChevronRight, Clock, MapPin, Package, Phone, QrCode, Receipt, Search, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type OrderStatus = "new" | "preparing" | "ready" | "completed" | "cancelled";

interface MockOrder {
    id: string;
    customerName: string;
    customerPhone: string;
    items: string;
    total: number;
    pickupTime: string;
    orderTime: string;
    status: OrderStatus;
    notes?: string;
}

const initialOrders: MockOrder[] = [
    { id: "NB8392", customerName: "R****n", customerPhone: "****4921", items: "2x Dinner Box", total: 398, pickupTime: "20:30", orderTime: "2 min ago", status: "new", notes: "Please include extra napkins" },
    { id: "NB8391", customerName: "S****a", customerPhone: "****8832", items: "1x Bakery Surprise", total: 150, pickupTime: "21:00", orderTime: "15 min ago", status: "preparing" },
    { id: "NB8389", customerName: "T****k", customerPhone: "****1120", items: "3x Combo Bundle", total: 1050, pickupTime: "21:30", orderTime: "45 min ago", status: "ready" },
    { id: "NB8385", customerName: "A****i", customerPhone: "****9901", items: "1x Sweet Box", total: 200, pickupTime: "19:00", orderTime: "3 hours ago", status: "completed" },
    { id: "NB8384", customerName: "M****h", customerPhone: "****4431", items: "1x Dinner Box", total: 199, pickupTime: "18:30", orderTime: "4 hours ago", status: "cancelled" },
];

const PartnerOrdersScreen = () => {
    const [activeTab, setActiveTab] = useState<OrderStatus>("new");
    const [orders, setOrders] = useState<MockOrder[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanningOrderId, setScanningOrderId] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("nb_partner_orders");
        if (stored) {
            setOrders(JSON.parse(stored));
        } else {
            localStorage.setItem("nb_partner_orders", JSON.stringify(initialOrders));
            setOrders(initialOrders);
        }
    }, []);

    const saveOrders = (newOrders: MockOrder[]) => {
        setOrders(newOrders);
        localStorage.setItem("nb_partner_orders", JSON.stringify(newOrders));
    };

    const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
        const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
        saveOrders(updated);

        let msg = "";
        if (newStatus === "preparing") msg = "Order confirmed. Customer notified.";
        if (newStatus === "ready") msg = "Order marked as ready. Customer sent QR code.";
        if (newStatus === "completed") msg = "Pickup verified. Order complete!";
        if (newStatus === "cancelled") msg = "Order cancelled.";

        toast({ title: "Order Updated", description: msg, variant: "default" });
    };

    const handleVerifyPickup = (id: string) => {
        setScanningOrderId(id);
        setIsScanning(true);
        // Simulate scanning delay
        setTimeout(() => {
            setIsScanning(false);
            setScanningOrderId(null);
            updateOrderStatus(id, "completed");
        }, 2000);
    };

    const tabs: { id: OrderStatus, label: string }[] = [
        { id: "new", label: "New" },
        { id: "preparing", label: "Preparing" },
        { id: "ready", label: "Ready" },
        { id: "completed", label: "Completed" },
        { id: "cancelled", label: "Cancelled" },
    ];

    const filteredOrders = orders.filter(o => o.status === activeTab);
    const newCount = orders.filter(o => o.status === "new").length;
    const readyCount = orders.filter(o => o.status === "ready").length;

    return (
        <div className="space-y-6 relative pb-20 md:pb-0">
            {/* QR Scanner Overlay */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6"
                    >
                        <h2 className="text-2xl font-bold mb-8">Scan Customer QR</h2>

                        <div className="relative w-64 h-64 border-2 border-primary rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-primary/20">
                            {/* Scanning beam animation */}
                            <motion.div
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_10px_2px_rgba(16,185,129,0.7)] z-10"
                            />
                            {/* Fake camera feed background */}
                            <div className="absolute inset-0 bg-muted flex items-center justify-center opacity-50">
                                <QrCode className="w-16 h-16 text-muted-foreground" />
                            </div>

                            {/* Target brackets */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
                        </div>

                        <p className="text-muted-foreground animate-pulse font-medium">Align QR code within frame...</p>

                        <Button variant="outline" className="mt-8 bg-card" onClick={() => setIsScanning(false)}>
                            Cancel Scan
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Orders
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage incoming and active orders.</p>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-card p-2 rounded-2xl border border-border">
                <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
                        >
                            {tab.label}
                            {tab.id === "new" && newCount > 0 && (
                                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${activeTab === 'new' ? 'bg-primary-foreground text-primary' : 'bg-destructive text-destructive-foreground'}`}>
                                    {newCount}
                                </span>
                            )}
                            {tab.id === "ready" && readyCount > 0 && (
                                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${activeTab === 'ready' ? 'bg-primary-foreground text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                                    {readyCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Order List */}
            <div className="grid gap-4">
                {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl border border-border border-dashed text-muted-foreground">
                        <Receipt className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium">No {activeTab} orders right now.</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="glass-card rounded-2xl p-0 overflow-hidden group hover:border-primary/30 transition-colors">
                            <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between">

                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center justify-between md:justify-start gap-4">
                                        <h3 className="font-bold text-lg text-foreground">Order #{order.id}</h3>
                                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {order.orderTime}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2 text-foreground">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium">{order.customerName}</span>
                                            <span className="text-xs text-muted-foreground">({order.customerPhone})</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-foreground">
                                            <Package className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                            <span className="font-medium">{order.items}</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-bold text-secondary">
                                            ৳{order.total}
                                        </div>
                                        <div className="flex items-center gap-2 text-primary font-medium">
                                            <Clock className="w-4 h-4" />
                                            Pickup: {order.pickupTime}
                                        </div>
                                    </div>

                                    {order.notes && (
                                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs p-2 rounded-lg font-medium">
                                            Note: {order.notes}
                                        </div>
                                    )}
                                </div>

                                {/* Divider for mobile */}
                                <div className="h-px w-full bg-border md:hidden" />

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    {order.status === "new" && (
                                        <>
                                            <Button variant="emerald" className="w-full shadow-md" onClick={() => updateOrderStatus(order.id, "preparing")}>
                                                Confirm Order
                                            </Button>
                                            <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 border-destructive/20" onClick={() => updateOrderStatus(order.id, "cancelled")}>
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {order.status === "preparing" && (
                                        <Button variant="secondary" className="w-full shadow-md" onClick={() => updateOrderStatus(order.id, "ready")}>
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Ready
                                        </Button>
                                    )}
                                    {order.status === "ready" && (
                                        <>
                                            <Button variant="emerald" className="w-full shadow-md relative overflow-hidden group/btn" onClick={() => handleVerifyPickup(order.id)}>
                                                <QrCode className="w-4 h-4 mr-2 z-10 relative" />
                                                <span className="z-10 relative">Verify Pickup</span>
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
                                            </Button>
                                            <Button variant="outline" size="sm" className="w-full text-muted-foreground mt-1" onClick={() => updateOrderStatus(order.id, "cancelled")}>
                                                No Show
                                            </Button>
                                        </>
                                    )}
                                    {(order.status === "completed" || order.status === "cancelled") && (
                                        <Button variant="outline" className="w-full bg-card">
                                            View Details
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PartnerOrdersScreen;
