import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Navigation, X, QrCode, Package, Bell, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { restaurants } from "@/data/mockData";

const PickupScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const qty = parseInt(searchParams.get("qty") || "1");
  const restaurant = restaurants.find((r) => r.id === id);

  const [timeToPickup, setTimeToPickup] = useState({ minutes: 45, seconds: 0 });
  const [isHere, setIsHere] = useState(false);
  const [runningLate, setRunningLate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToPickup((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!restaurant) return null;

  // Generate a fake QR code pattern with SVG
  const qrSize = 200;
  const orderId = `NB-${restaurant.id}${qty}-${Date.now().toString(36).slice(-4).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => navigate("/app/home")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <h1 className="font-bold text-foreground text-lg">Your Reservation</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* QR Code */}
        <motion.div
          className={`glass-card p-6 flex flex-col items-center gap-4 relative overflow-hidden ${isHere ? 'border-primary shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'border-border'}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {isHere && (
            <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-xs font-bold text-center py-1 animate-pulse">
              Restaurant Notified!
            </div>
          )}
          <div className="w-52 h-52 bg-foreground rounded-2xl p-4 flex items-center justify-center relative mt-2">
            {/* Fake QR pattern */}
            <svg width={qrSize} height={qrSize} viewBox={`0 0 ${qrSize} ${qrSize}`}>
              <rect width={qrSize} height={qrSize} fill="white" rx="8" />
              {/* Corner squares */}
              {[
                [10, 10], [150, 10], [10, 150]
              ].map(([x, y], i) => (
                <g key={i}>
                  <rect x={x} y={y} width="40" height="40" fill="black" rx="4" />
                  <rect x={x + 5} y={y + 5} width="30" height="30" fill="white" rx="2" />
                  <rect x={x + 10} y={y + 10} width="20" height="20" fill="black" rx="2" />
                </g>
              ))}
              {/* Random dots pattern */}
              {Array.from({ length: 80 }, (_, i) => {
                const seed = (i * 7 + 13) % 100;
                const x = 60 + (seed % 10) * 9;
                const y = 60 + Math.floor(seed / 10) * 9;
                return seed % 3 !== 0 ? (
                  <rect key={i} x={x} y={y} width="6" height="6" fill="black" rx="1" />
                ) : null;
              })}
              {/* NightBite logo area center */}
              <rect x="75" y="75" width="50" height="50" fill="white" rx="6" />
              <Package className="w-6 h-6 text-primary" />
            </svg>
            <div className="absolute inset-0 border-4 border-primary rounded-2xl opacity-50 animate-ping" style={{ animationDuration: '3s' }} />
          </div>

          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Booking ID</p>
            <p className="font-mono font-bold text-primary tracking-wider text-xl">{orderId}</p>
          </div>

          <div className="w-full flex gap-2 pt-2">
            <Button
              variant={isHere ? "outline" : "amber"}
              className={`flex-1 ${isHere ? 'bg-primary/10 text-primary border-primary' : ''}`}
              onClick={() => setIsHere(true)}
              disabled={isHere}
            >
              <Bell className="w-4 h-4 mr-2" /> {isHere ? "Notified" : "I'm Here"}
            </Button>
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          className="glass-card p-5 flex items-center justify-between relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Pickup Window</p>
              <p className="text-xs text-muted-foreground font-medium">{restaurant.pickupStart} - {restaurant.pickupEnd} {runningLate && <span className="text-destructive font-bold">(+15m)</span>}</p>
            </div>
          </div>
          <div className="text-right relative z-10">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Starts in</p>
            <p className="font-mono font-black text-primary text-2xl drop-shadow-sm">
              {String(timeToPickup.minutes).padStart(2, "0")}:{String(timeToPickup.seconds).padStart(2, "0")}
            </p>
          </div>
        </motion.div>

        {/* Order details */}
        <motion.div
          className="glass-card p-5 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-foreground">Order Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Restaurant</span>
              <span className="text-foreground font-medium">{restaurant.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mystery Boxes</span>
              <span className="text-foreground font-medium">{qty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address</span>
              <span className="text-foreground font-medium text-right text-xs max-w-[200px]">{restaurant.address}</span>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button variant="amber" size="lg" className="w-full font-bold shadow-sm" onClick={() => window.open(`https://maps.google.com/?q=${restaurant.address}`)}>
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-card hover:bg-muted text-xs font-semibold h-12" onClick={() => setRunningLate(!runningLate)}>
              <Clock className="w-4 h-4 mr-2 text-amber-500" />
              {runningLate ? "Buffer Added" : "Running Late"}
            </Button>
            <Button variant="outline" className="flex-1 bg-card hover:bg-muted text-xs font-semibold h-12 text-destructive border-destructive/20 hover:text-destructive hover:bg-destructive/10">
              <X className="w-4 h-4 mr-2" />
              Cancel Reserve
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Free cancellation up to 30 minutes before pickup window
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PickupScreen;
