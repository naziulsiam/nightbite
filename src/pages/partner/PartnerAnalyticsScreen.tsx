import { useState } from "react";
import { BarChart, ArrowUpRight, ArrowDownRight, Package, Star, Users, Leaf, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const PartnerAnalyticsScreen = () => {
    const [dateRange, setDateRange] = useState("This Week");

    const metrics = [
        { label: "Total Revenue", value: "৳14,500", trend: "+12%", up: true, icon: BarChart },
        { label: "Boxes Sold", value: "85", trend: "+5%", up: true, icon: Package },
        { label: "Average Rating", value: "4.8", subtext: "From 42 reviews", icon: Star },
        { label: "Repeat Customers", value: "32%", trend: "-2%", up: false, icon: Users },
    ];

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1">Track your performance and impact.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        className="h-10 px-4 rounded-xl bg-card border border-border text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>Custom</option>
                    </select>
                    <Button variant="outline" size="icon" className="h-10 w-10 bg-card" title="Download Report">
                        <Download className="w-4 h-4 text-foreground" />
                    </Button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => {
                    const Icon = m.icon;
                    return (
                        <div key={i} className="glass-card p-4 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
                            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{m.label}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">{m.value}</h3>
                            {m.trend && (
                                <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${m.up ? 'text-emerald-500' : 'text-destructive'}`}>
                                    {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {m.trend} vs previous
                                </div>
                            )}
                            {m.subtext && (
                                <div className="mt-2 text-xs font-medium text-muted-foreground">
                                    {m.subtext}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* CSS Chart: Revenue */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-5">
                    <h3 className="font-bold text-lg mb-6">Revenue Overview ({dateRange})</h3>
                    <div className="h-64 flex items-end justify-between gap-2 mt-4 relative">
                        {/* Fake Y Axis */}
                        <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between text-[10px] text-muted-foreground border-r border-border/50 pr-2 pb-1 text-right">
                            <span>৳4k</span>
                            <span>৳3k</span>
                            <span>৳2k</span>
                            <span>৳1k</span>
                            <span>0</span>
                        </div>
                        {/* Margin for axis */}
                        <div className="w-12 shrink-0"></div>

                        {/* Bars with varying heights */}
                        {[
                            { day: "Mon", h: 40 }, { day: "Tue", h: 65 }, { day: "Wed", h: 45 },
                            { day: "Thu", h: 80 }, { day: "Fri", h: 95 }, { day: "Sat", h: 100 }, { day: "Sun", h: 30 }
                        ].map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
                                <div className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary/30 transition-colors relative" style={{ height: `${d.h}%` }}>
                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        ৳{(d.h * 40).toFixed(0)}
                                    </div>
                                    <div className="absolute bottom-0 w-full bg-primary rounded-t-sm" style={{ height: '10%' }} />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Impact Card */}
                <div className="glass-card rounded-2xl p-5 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20 flex flex-col">
                    <h3 className="font-bold text-lg mb-2">Environmental Impact</h3>
                    <p className="text-sm text-muted-foreground mb-6">Your contributions to reducing food waste.</p>

                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-4 animate-pulse">
                            <Leaf className="w-10 h-10" />
                        </div>
                        <h2 className="text-4xl font-bold text-emerald-500">42 kg</h2>
                        <p className="text-muted-foreground font-medium mt-2">CO₂ emissions prevented</p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border/50 text-center">
                        <span className="text-xs font-bold text-foreground bg-card px-3 py-1.5 rounded-full border border-border shadow-sm">
                            Top 10% of partners in Gulshan!
                        </span>
                    </div>
                </div>

                {/* Top Performing Items */}
                <div className="lg:col-span-3 glass-card rounded-2xl p-5">
                    <h3 className="font-bold text-lg mb-6">Top Performing Boxes</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                            <div>
                                <p className="font-bold text-foreground">Surprise Biryani Box</p>
                                <p className="text-xs text-secondary mt-1 font-semibold">95% Sell-through rate</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">45 Sold</p>
                                <p className="text-xs text-muted-foreground mt-1">৳8,955 Revenue</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                            <div>
                                <p className="font-bold text-foreground">End of Day Pastries</p>
                                <p className="text-xs text-secondary mt-1 font-semibold">88% Sell-through rate</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">28 Sold</p>
                                <p className="text-xs text-muted-foreground mt-1">৳4,200 Revenue</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PartnerAnalyticsScreen;
