import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf, Wallet, Utensils, Award, Share2, MapPin, Search, Clock, User, Facebook, Twitter, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userProfile } from "@/data/mockData";

const useCountUp = (end: number, duration = 1500) => {
    const [count, setCount] = useState(0);
    const started = useRef(false);
    useEffect(() => {
        if (started.current) return;
        started.current = true;
        const start = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress >= 1) clearInterval(timer);
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration]);
    return count;
};

const ImpactScreen = () => {
    const navigate = useNavigate();
    const mealCount = useCountUp(userProfile.mealsSaved);
    const moneyCount = useCountUp(userProfile.moneySaved);
    const co2Count = useCountUp(userProfile.co2Prevented);

    const stats = [
        { icon: Utensils, label: "Meals Saved", value: mealCount, unit: "", color: "text-primary" },
        { icon: Wallet, label: "Money Saved", value: `৳${moneyCount.toLocaleString()}`, unit: "", color: "text-secondary" },
        { icon: Leaf, label: "CO₂ Prevented", value: `${co2Count}kg`, unit: "", color: "text-emerald-500" },
    ];

    const badges = [
        { id: "first-bite", name: "First Bite", desc: "First order", icon: Utensils, unlocked: true },
        { id: "night-owl", name: "Night Owl", desc: "5 orders after 9pm", icon: Clock, unlocked: true },
        { id: "waste-warrior", name: "Waste Warrior", desc: "10 meals saved", icon: Leaf, unlocked: true },
        { id: "biryani-lover", name: "Biryani Lover", desc: "5 biryani boxes", icon: Award, unlocked: false },
        { id: "regular", name: "Regular", desc: "Order 3 weeks in a row", icon: User, unlocked: false },
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30 px-4 py-3">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    <button onClick={() => navigate("/app/home")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                        <ArrowLeft className="w-4 h-4 text-foreground" />
                    </button>
                    <h1 className="font-bold text-foreground text-lg">My Impact</h1>
                    <div className="ml-auto">
                        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-5 space-y-6">
                {/* Top Banner */}
                <motion.div
                    className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-background border border-primary/20 p-5 text-center relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="relative z-10 space-y-2">
                        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-2">
                            <Award className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">Top 10%</h2>
                        <p className="text-sm text-muted-foreground">You are in the top 10% of NightBite users in Dhaka!</p>
                    </div>
                    {/* abstract shapes */}
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                </motion.div>

                {/* Stats */}
                <motion.div className="grid grid-cols-3 gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            className="glass-card p-4 flex flex-col items-center gap-2 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Data Visualization Mock (Weekly) */}
                <motion.div className="glass-card p-5 space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-sm text-foreground">Weekly Savings</h3>
                        <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">This Month</span>
                    </div>
                    <div className="h-40 flex items-end justify-between gap-2 pt-4 border-b border-border/50 pb-2">
                        {/* Mock Chart Bars */}
                        {[40, 60, 30, 80, 50, 90, 70].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full relative bg-muted rounded-t-sm h-full max-h-[120px] flex items-end justify-center group-hover:bg-muted/80 transition-colors">
                                    <motion.div
                                        className="w-full bg-primary rounded-t-sm"
                                        style={{ height: `${height}%` }}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 1, delay: 0.3 + (i * 0.1) }}
                                    />
                                    <div className="absolute -top-6 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        ৳{height * 10}
                                    </div>
                                </div>
                                <span className="text-[10px] text-muted-foreground">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                        🔥 You're on a <span className="font-bold text-primary">5-week streak!</span> Keep it up.
                    </p>
                </motion.div>

                {/* Badges / Achievements */}
                <motion.div className="glass-card p-5 space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-sm text-foreground">Achievements</h3>
                        <span className="text-xs text-primary font-bold">3 / 5 Unlocked</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {badges.map((badge, i) => (
                            <div key={badge.id} className="flex flex-col items-center gap-2 text-center group">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${badge.unlocked ? 'amber-gradient shadow-md' : 'bg-muted border border-border/50 grayscale opacity-50'}`}>
                                    <badge.icon className={`w-7 h-7 ${badge.unlocked ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                                </div>
                                <div>
                                    <p className={`text-[10px] font-bold ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>{badge.name}</p>
                                    {/* <p className="text-[9px] text-muted-foreground mx-auto max-w-[60px] leading-tight mt-0.5">{badge.desc}</p> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Share Impact */}
                <motion.div className="glass-card p-5 space-y-4 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <h3 className="font-bold text-sm text-foreground">Inspire Others</h3>
                    <p className="text-xs text-muted-foreground">Share your impact and invite friends to save food.</p>

                    <div className="flex justify-center gap-4">
                        <button className="w-12 h-12 rounded-full bg-blue-600/10 text-blue-500 flex items-center justify-center hover:bg-blue-600/20 transition-colors">
                            <Facebook className="w-5 h-5" />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /></svg>
                        </button>
                        <button className="w-12 h-12 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 transition-colors">
                            <Link className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/30 safe-bottom z-50">
                <div className="max-w-lg mx-auto flex justify-around py-2">
                    {[
                        { icon: <MapPin className="w-5 h-5" />, label: "Home", path: "/app/home", active: false },
                        { icon: <Leaf className="w-5 h-5" />, label: "Impact", path: "/app/impact", active: true },
                        { icon: <Clock className="w-5 h-5" />, label: "Orders", path: "/app/orders", active: false },
                        { icon: <User className="w-5 h-5" />, label: "Profile", path: "/app/profile", active: false },
                    ].map((item) => (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors ${item.active ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default ImpactScreen;
