import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, LogOut, ArrowLeft, Leaf, Wallet, Utensils, Award, Settings, ChevronRight, Heart, Globe, Bell, HelpCircle, RotateCcw, MapPin, Search, Clock, Star, MessageSquareWarning, Gift, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userProfile, restaurants } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { RoleSwitcher } from "@/components/nightbite/RoleSwitcher";

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

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"impact" | "orders" | "settings">("impact");
  const [copiedCode, setCopiedCode] = useState(false);
  const referralCode = "ALI50NIGHT";

  const mealCount = useCountUp(userProfile.mealsSaved);
  const moneyCount = useCountUp(userProfile.moneySaved);
  const co2Count = useCountUp(userProfile.co2Prevented);

  const stats = [
    { icon: Utensils, label: "Meals Saved", value: mealCount, unit: "", color: "text-primary" },
    { icon: Wallet, label: "Money Saved", value: `৳${moneyCount.toLocaleString()}`, unit: "", color: "text-secondary" },
    { icon: Leaf, label: "CO₂ Prevented", value: `${co2Count}kg`, unit: "", color: "text-secondary" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => navigate("/app/home")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <h1 className="font-bold text-foreground text-lg">Profile</h1>
          <div className="ml-auto">
          </div>

          <div className="mt-4 flex justify-between items-center sm:hidden">
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* User card */}
        <motion.div
          className="glass-card p-5 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-14 h-14 rounded-full amber-gradient flex items-center justify-center text-primary-foreground font-bold text-lg">
            {userProfile.avatar}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-foreground">{userProfile.name}</h2>
            <p className="text-xs text-muted-foreground font-bengali">{userProfile.nameBn}</p>
            <p className="text-xs text-muted-foreground">{userProfile.phone}</p>
          </div>
          {userProfile.orderStreak >= 5 && (
            <div className="flex flex-col items-center">
              <Award className="w-6 h-6 text-primary" />
              <span className="text-[10px] text-primary font-semibold">Climate Hero</span>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {(["impact", "orders", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Impact */}
        {activeTab === "impact" && (
          <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-3 gap-3">
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
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {userProfile.orderStreak}-order streak! You're a <span className="text-primary font-semibold">Climate Hero</span>
              </p>
            </div>
          </motion.div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {userProfile.orders.map((order) => {
              const rest = restaurants.find((r) => r.id === order.restaurantId);
              if (!rest) return null;
              return (
                <div key={order.id} className="glass-card p-4 space-y-3">
                  <div className="flex items-start gap-4">
                    <img src={rest.image} alt={rest.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm flex items-center justify-between">
                        {rest.name}
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold uppercase">Completed</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.date} · {order.boxes} mystery box{order.boxes > 1 ? 'es' : ''}</p>
                      <p className="text-xs text-primary font-bold mt-1">৳{order.total}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium text-xs">Rate your experience</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} className="text-muted-foreground hover:text-amber-500 transition-colors hover:scale-110 active:scale-95">
                            <Star className="w-5 h-5 fill-transparent" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs h-9 bg-card hover:bg-muted font-semibold border-primary/20 text-foreground" onClick={() => navigate(`/app/checkout/${rest.id}?qty=${order.boxes}`)}>
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-primary" /> Reorder
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs h-9 text-muted-foreground font-semibold hover:text-destructive border-transparent bg-transparent hover:bg-destructive/10 transition-colors">
                        <MessageSquareWarning className="w-3.5 h-3.5 mr-1.5" /> Report Issue
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Settings & Referrals */}
        {activeTab === "settings" && (
          <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Referral Card */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Gift className="w-16 h-16 text-emerald-500" />
              </div>
              <div className="relative z-10 space-y-3">
                <div>
                  <h3 className="font-bold text-foreground text-lg">Give ৳50, Get ৳50</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Invite friends to NightBite. They get ৳50 off their first box, you get ৳50 when they order.</p>
                </div>

                <div className="bg-background/80 backdrop-blur rounded-xl p-3 flex items-center justify-between border border-border">
                  <span className="font-mono font-bold text-primary tracking-wider">{referralCode}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs font-semibold px-3"
                    onClick={() => {
                      navigator.clipboard.writeText(referralCode);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : null}
                    {copiedCode ? "Copied" : "Copy"}
                  </Button>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button variant="amber" size="sm" className="flex-1 text-xs shadow-sm bg-[#25D366] hover:bg-[#128C7E] text-white border-transparent" onClick={() => window.open(`https://wa.me/?text=Use my code ${referralCode} to get ৳50 off your first mystery box on NightBite! 🍔🌍`)}>
                    WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs bg-background">
                    <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share options
                  </Button>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-emerald-500/20 text-xs">
                  <span className="text-muted-foreground">Friends invited: <span className="font-bold text-foreground">2</span></span>
                  <span className="text-emerald-500 font-bold">৳100 Earned</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { icon: Bell, label: "Notifications", desc: "Push & email preferences" },
                { icon: Globe, label: "Language", desc: "English / বাংলা" },
                { icon: Heart, label: "Saved Restaurants", desc: `${userProfile.favorites.length} favorites` },
                { icon: HelpCircle, label: "Help Center", desc: "FAQs & support" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full glass-card p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full flex items-center justify-between p-4 glass-card border-none hover:bg-destructive/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-destructive" />
                  </div>
                  <span className="font-medium text-destructive">Log Out</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/30 safe-bottom z-50">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {[
            { icon: <MapPin className="w-5 h-5" />, label: "Home", path: "/app/home", active: false },
            { icon: <Leaf className="w-5 h-5" />, label: "Impact", path: "/app/impact", active: false },
            { icon: <Clock className="w-5 h-5" />, label: "Orders", path: "/app/orders", active: false },
            { icon: <User className="w-5 h-5" />, label: "Profile", path: "/app/profile", active: true },
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

export default ProfileScreen;
