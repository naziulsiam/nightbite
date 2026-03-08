import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Bell, User, Clock, Flame, ChevronRight, Search, Leaf, SlidersHorizontal, Map, List, Navigation, Settings2, Download, X, WifiOff } from "lucide-react";
import { restaurants, categories } from "@/data/mockData";
import RestaurantCard from "@/components/nightbite/RestaurantCard";
import SkeletonCard from "@/components/nightbite/SkeletonCard";
import { RoleSwitcher } from "@/components/nightbite/RoleSwitcher";
import { useToast } from "@/hooks/use-toast";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 15, seconds: 0 });

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const [activeDistance, setActiveDistance] = useState("Any");
  const [activePrice, setActivePrice] = useState("Any");
  const [activeTime, setActiveTime] = useState("Available Now");

  // Real-time and Demo States
  const [clickCount, setClickCount] = useState(0);
  const [showDemoControls, setShowDemoControls] = useState(false);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowPWAPrompt(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast({ title: "You're back online!", description: "Offline queue synced." });
    };
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);

  // Random simulation toast
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOffline && Math.random() > 0.6) {
        toast({
          title: "🔥 Quick! Someone just reserved",
          description: "A mystery box at " + restaurants[Math.floor(Math.random() * restaurants.length)].name,
        });
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [isOffline, toast]);

  const handleLogoClick = () => {
    setClickCount((prev) => prev + 1);
    if (clickCount >= 2) {
      setShowDemoControls(!showDemoControls);
      setClickCount(0);
    }
  };

  const filtered = activeCategory === "all"
    ? restaurants
    : restaurants.filter((r) => r.category === activeCategory);

  const featured = restaurants.find((r) => r.isFeatured);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-6 pt-2 px-4 max-w-lg mx-auto select-none" onClick={handleLogoClick}>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Good evening,
          </h1>
          <p className="text-muted-foreground flex items-center gap-1 text-sm mt-1">
            <MapPin className="w-4 h-4 text-primary" />
            Gulshan, Dhaka
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RoleSwitcher />
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-secondary" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background" />
            </div>
          </div>
        </div>
      </header>

      {/* Offline Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="bg-destructive text-destructive-foreground px-4 py-2 flex items-center justify-center gap-2 text-xs font-bold w-full uppercase tracking-widest max-w-lg mx-auto">
              <WifiOff className="w-4 h-4" /> Offline Mode
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Prompt */}
      <AnimatePresence>
        {showPWAPrompt && !isOffline && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="px-4 pb-4 max-w-lg mx-auto relative z-40">
            <div className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl flex items-center gap-3 shadow-lg cursor-pointer transition-colors relative">
              <div className="bg-white/20 p-2 rounded-full">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm leading-tight text-white mb-0.5">Add to Home Screen</h4>
                <p className="text-xs text-white/80 font-medium">Faster checkout & instant notifications</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setShowPWAPrompt(false); }} className="p-1 rounded-full hover:bg-white/20 absolute top-2 right-2 transition-colors">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Demo Controls */}
      <AnimatePresence>
        {showDemoControls && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-4 pb-4 max-w-lg mx-auto overflow-hidden">
            <div className="bg-muted p-4 rounded-xl border border-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-2">
                <Settings2 className="w-4 h-4" /> Demo Event Controls
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => toast({ title: "New Partner", description: "Star Kabab just joined!" })} className="bg-background border border-border text-xs px-2 py-1.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors font-semibold">Simulate New Rest.</button>
                <button onClick={() => toast({ title: "Stock Alert", description: "Sultan's Dine just sold out!" })} className="bg-background border border-border text-xs px-2 py-1.5 rounded-lg hover:bg-destructive hover:text-white transition-colors font-semibold">Simulate Stock Out</button>
                <button onClick={() => setIsOffline(!isOffline)} className="bg-background border border-border text-xs px-2 py-1.5 rounded-lg font-semibold col-span-2">Toggle Offline State</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Categories & Filter Toggle */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 shrink-0 rounded-full border transition-colors outline-none ${showFilters ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-foreground hover:bg-muted'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 flex-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${activeCategory === cat.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters (Expandable) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card border border-border rounded-2xl p-4 space-y-4 mb-2 shadow-sm">

                <div className="space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Distance</span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {["Any", "< 1km", "< 3km", "< 5km", "< 10km"].map(d => (
                      <button onClick={() => setActiveDistance(d)} key={d} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${activeDistance === d ? 'bg-primary/10 border-primary text-primary font-bold' : 'bg-background border-border text-muted-foreground hover:bg-muted'}`}>{d}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Price Range</span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {["Any", "৳0-100", "৳100-200", "৳200-500", "৳500+"].map(p => (
                      <button onClick={() => setActivePrice(p)} key={p} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${activePrice === p ? 'bg-primary/10 border-primary text-primary font-bold' : 'bg-background border-border text-muted-foreground hover:bg-muted'}`}>{p}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pickup Time</span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {["Available Now", "Tonight", "Tomorrow", "This Weekend"].map(t => (
                      <button onClick={() => setActiveTime(t)} key={t} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${activeTime === t ? 'bg-primary/10 border-primary text-primary font-bold' : 'bg-background border-border text-muted-foreground hover:bg-muted'}`}>{t}</button>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Hero Card */}
        {featured && !loading && (
          <motion.div
            className="glass-card overflow-hidden cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/app/restaurant/${featured.id}`)}
          >
            <div className="relative">
              <img
                src={featured.image}
                alt={featured.name}
                className="w-full h-44 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Tonight's Special
                </span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
                <Clock className="w-3 h-3 text-primary" />
                <span className="text-xs font-mono font-bold text-primary">
                  {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
            <div className="p-4 -mt-6 relative z-10">
              <h3 className="text-lg font-bold text-foreground">{featured.name}</h3>
              <p className="text-xs text-muted-foreground font-bengali">{featured.nameBn}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground line-through text-sm">৳{featured.originalPrice}</span>
                  <span className="text-primary font-bold text-xl">৳{featured.nightbitePrice}</span>
                </div>
                <span className="eco-badge">
                  {featured.socialProof} rescued today
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Toggle List/Map */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-foreground">
            {viewMode === "list" ? "Available Now" : "Nearby You"}
          </h2>
          <div className="flex items-center bg-muted rounded-xl p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Map className="w-3.5 h-3.5" /> Map
            </button>
          </div>
        </div>

        {/* View Content */}
        {viewMode === "map" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-[60vh] bg-muted/30 rounded-3xl border border-border overflow-hidden bg-grid-black/[0.05] dark:bg-grid-white/[0.02] flex items-center justify-center shadow-inner"
          >
            {/* User Location */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <div className="absolute w-24 h-24 bg-blue-500/10 rounded-full animate-pulse" />
              <div className="absolute w-12 h-12 bg-blue-500/30 rounded-full animate-ping" />
              <div className="w-4 h-4 bg-blue-500 border-2 border-white dark:border-zinc-900 rounded-full relative z-10 shadow-md" />
            </div>

            {/* Simulated Pins */}
            {filtered.map((restaurant, i) => {
              // Generate stable random positions based on ID
              const idNum = parseInt(restaurant.id) || 1;
              const top = 15 + ((idNum * 37) % 70);
              const left = 10 + ((idNum * 23) % 80);

              return (
                <motion.div
                  key={restaurant.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05, type: "spring" }}
                  className="absolute group cursor-pointer z-20 hover:z-30"
                  style={{ top: `${top}%`, left: `${left}%` }}
                  onClick={() => navigate(`/app/restaurant/${restaurant.id}`)}
                >
                  <div className="bg-background text-foreground text-xs font-bold px-2 py-1.5 rounded-xl shadow-lg border border-border whitespace-nowrap transform -translate-x-1/2 -translate-y-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-destructive group-hover:text-primary-foreground" />
                      ৳{restaurant.nightbitePrice}
                    </div>
                    <span className="text-[9px] font-medium text-muted-foreground group-hover:text-primary-foreground/80 truncate max-w-[80px]">{restaurant.name}</span>
                  </div>
                  <div className="w-2 h-2 bg-foreground rounded-full mx-auto -mt-2 shadow-sm opacity-50" />
                </motion.div>
              );
            })}

            {/* Map Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30">
              <button className="w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center shadow-md text-foreground hover:bg-muted transition-colors"><Navigation className="w-4 h-4 text-blue-500" /></button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.map((restaurant, i) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} index={i} />
              ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/30 safe-bottom z-50">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {[
            { icon: <MapPin className="w-5 h-5" />, label: "Home", path: "/app/home", active: true },
            { icon: <Leaf className="w-5 h-5" />, label: "Impact", path: "/app/impact", active: false },
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

export default HomeScreen;
