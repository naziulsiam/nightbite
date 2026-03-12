import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, Package, Heart, Timer } from "lucide-react";
import type { Restaurant } from "@/data/mockData";

interface Props {
  restaurant: Restaurant;
  index: number;
}

const RestaurantCard = ({ restaurant, index }: Props) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 45, seconds: 0 });

  const claimedPercent = Math.round(((restaurant.totalBoxes - restaurant.boxesLeft) / restaurant.totalBoxes) * 100);

  useEffect(() => {
    // Generate deterministic countdown based on ID for demo predictability
    const idNum = parseInt(restaurant.id) || 1;
    let initialH = idNum % 3; // 0, 1, or 2 hours
    let initialM = (idNum * 17) % 60;

    // Simulate "Ending Soon" for specific items
    if (idNum === 2 || idNum === 4) { initialH = 0; initialM = 15; }

    const now = new Date().getTime();
    const end = now + (initialH * 3600 + initialM * 60) * 1000 + (idNum * 1000);

    const interval = setInterval(() => {
      const diff = end - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [restaurant.id]);

  const isEndingSoon = timeLeft.hours === 0 && timeLeft.minutes < 60;
  const isSoldOut = restaurant.boxesLeft <= 0;

  return (
    <motion.div
      className="glass-card overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[70%] z-10">
          <span className="bg-card/80 backdrop-blur-sm text-foreground px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 text-primary fill-primary" />
            {restaurant.rating}
          </span>
          {restaurant.isNew && (
            <span className="bg-emerald-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-bold animate-pulse shadow-sm">
              NEW
            </span>
          )}
          {restaurant.isRamadanSpecial && (
            <span className="bg-secondary/80 backdrop-blur-sm text-secondary-foreground px-2 py-1 rounded-lg text-xs font-medium shadow-sm">
              Ramadan
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-10 shadow-sm"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
        </button>

        {!isSoldOut && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="bg-primary/95 backdrop-blur-sm text-primary-foreground px-2 py-1 rounded-lg text-[10px] font-bold shadow-md">
              Mystery Box
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground truncate pr-2">{restaurant.name}</h3>
            {isEndingSoon && !isSoldOut ? (
              <span className="text-[10px] font-bold text-destructive flex items-center gap-1 shrink-0 bg-destructive/10 px-1.5 py-0.5 rounded">
                <Timer className="w-3 h-3" />
                {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            ) : !isSoldOut ? (
              <span className="text-[10px] font-medium text-primary flex items-center gap-1 shrink-0 bg-primary/10 px-1.5 py-0.5 rounded">
                <Clock className="w-3 h-3" />
                {timeLeft.hours}h {timeLeft.minutes}m
              </span>
            ) : (
              <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Ended</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="font-bengali">{restaurant.nameBn}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {restaurant.distance} {restaurant.walkTime && <span className="text-[10px] bg-muted px-1 rounded">🚶 {restaurant.walkTime}</span>}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground line-through text-sm">৳{restaurant.originalPrice}</span>
            <span className="text-primary font-bold text-xl">৳{restaurant.nightbitePrice}</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
              -{Math.round((1 - restaurant.nightbitePrice / restaurant.originalPrice) * 100)}%
            </span>
          </div>
        </div>

        {/* Urgency bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-semibold ${isSoldOut ? 'text-destructive' : restaurant.boxesLeft <= 2 ? "text-amber-500" : "text-muted-foreground"}`}>
              {isSoldOut ? "Sold Out" : restaurant.boxesLeft <= 2 ? `Almost Gone - ${restaurant.boxesLeft} left!` : `${restaurant.boxesLeft} boxes left`}
            </span>
            <span className="text-muted-foreground font-medium">{claimedPercent}% claimed</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${isSoldOut ? "bg-muted-foreground" : claimedPercent > 70 ? "bg-amber-500" : "bg-primary"}`}
              initial={{ width: 0 }}
              animate={{ width: `${claimedPercent}%` }}
              transition={{ delay: 0.3 + index * 0.08, duration: 0.8 }}
            />
          </div>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {restaurant.socialProof} people reserved today
          </span>
          <button className="amber-gradient text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95">
            Reserve Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
