import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, ChevronDown, Shield, Heart, Share2, Minus, Plus, Phone, ShieldCheck, Map, Users, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { restaurants } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const RestaurantDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const restaurant = restaurants.find((r) => r.id === id);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAllergens, setShowAllergens] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!restaurant) return null;

  const serviceFee = 10;
  const total = restaurant.nightbitePrice * quantity + serviceFee;
  const savings = (restaurant.originalPrice - restaurant.nightbitePrice) * quantity;

  const similar = restaurants.filter((r) => r.id !== id && r.category === restaurant.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Hero Image Carousel */}
      <div className="relative h-64 md:h-72 w-full">
        {/* Sticky Header inside carousel space for demo or pure sticky */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-95">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setIsFavorite(!isFavorite)} className="w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-110">
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-destructive text-destructive" : "text-foreground"}`} />
            </button>
            <button className="w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-95">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
          onScroll={(e) => {
            const scrollLeft = e.currentTarget.scrollLeft;
            const width = e.currentTarget.clientWidth;
            setCurrentImage(Math.round(scrollLeft / width));
          }}
        >
          {restaurant.images.map((img, i) => (
            <img key={i} src={img} alt={`${restaurant.name} ${i}`} className="w-full h-full shrink-0 object-cover snap-center pointer-events-none" />
          ))}
        </div>

        {/* Image dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {restaurant.images.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === currentImage ? "bg-primary w-6" : "bg-white/60 w-1.5"}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-5 -mt-4 relative z-10">
        {/* Restaurant Info */}
        <motion.div
          className="glass-card p-5 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{restaurant.name}</h1>
              <p className="text-sm text-muted-foreground font-bengali">{restaurant.nameBn}</p>
              <p className="text-sm text-muted-foreground mt-1">{restaurant.cuisine}</p>
            </div>
            <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-primary/20 transition-colors">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="font-bold text-primary text-sm">{restaurant.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{restaurant.address}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>Pickup window: <span className="font-bold">{restaurant.pickupStart} - {restaurant.pickupEnd}</span></span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-card hover:bg-muted h-9 text-xs" onClick={() => window.open(`https://maps.google.com/?q=${restaurant.address}`, '_blank')}>
              <Map className="w-4 h-4 mr-2" /> Get Directions
            </Button>
            <Button variant="outline" className="flex-1 bg-card hover:bg-muted h-9 text-xs" onClick={() => window.open('tel:01700000000')}>
              <Phone className="w-4 h-4 mr-2" /> Call Store
            </Button>
          </div>

          <div className="flex gap-2 pt-2 border-t border-border/50 overflow-x-auto no-scrollbar pb-1">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
              <ShieldCheck className="w-4 h-4" /> FSS Certified
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
              <Shield className="w-4 h-4" /> Hygiene Rated A+
            </span>
          </div>
        </motion.div>

        {/* About this box */}
        <motion.div
          className="glass-card p-5 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-start">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              About this Mystery Box
            </h2>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md font-bold flex items-center gap-1">
              <Users className="w-3 h-3" /> {restaurant.socialProof} bought today
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Surprise selection of today's best items! May include:
          </p>
          <div className="flex flex-wrap gap-2">
            {restaurant.mysteryItems.map((item) => (
              <span key={item} className="bg-muted text-muted-foreground px-3 py-1.5 rounded-lg text-xs font-medium">
                {item}
              </span>
            ))}
          </div>

          {/* Allergens */}
          {restaurant.allergens.length > 0 && (
            <div>
              <button
                onClick={() => setShowAllergens(!showAllergens)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Shield className="w-4 h-4" />
                Allergen Information
                <ChevronDown className={`w-4 h-4 transition-transform ${showAllergens ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showAllergens && (
                  <motion.div
                    className="flex gap-2 mt-2 flex-wrap"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {restaurant.allergens.map((a) => (
                      <span key={a} className="urgency-badge">{a}</span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Customer Photos */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-foreground mb-2">What others got</h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {[restaurant.image, restaurant.images?.[1], restaurant.images?.[2]].filter(Boolean).map((img, i) => (
                <img key={i} src={img} className="w-20 h-20 rounded-xl object-cover border border-border shrink-0" alt="Customer snap" />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Price Breakdown */}
        <motion.div
          className="glass-card p-5 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-bold text-foreground">Price Breakdown</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Box price × {quantity}</span>
              <span className="text-foreground">৳{restaurant.nightbitePrice * quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service fee</span>
              <span className="text-foreground">৳{serviceFee}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary text-lg">৳{total}</span>
            </div>
            <div className="eco-badge inline-flex items-center gap-1">
              You save ৳{savings}!
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Quantity</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <Minus className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="text-foreground font-bold text-lg w-4 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(3, quantity + 1))}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
              >
                <Plus className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Similar nearby */}
        {similar.length > 0 && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-bold text-foreground">Similar Nearby</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {similar.map((r) => (
                <div
                  key={r.id}
                  className="glass-card min-w-[200px] overflow-hidden cursor-pointer shrink-0 group"
                  onClick={() => navigate(`/app/restaurant/${r.id}`)}
                >
                  <img src={r.image} alt={r.name} className="w-full h-24 object-cover group-hover:scale-105 transition-transform" />
                  <div className="p-3">
                    <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.distance}</p>
                    <p className="text-primary font-bold mt-1">৳{r.nightbitePrice} <span className="text-[10px] text-muted-foreground line-through ml-1">৳{r.originalPrice}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reviews Section */}
        <motion.div
          className="glass-card p-5 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-bold text-foreground">Customer Reviews</h2>
          <div className="flex gap-6 items-center">
            <div className="text-center shrink-0">
              <p className="text-4xl font-bold">{restaurant.rating}</p>
              <div className="flex items-center justify-center mt-1">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${s <= Math.round(restaurant.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />)}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{restaurant.reviewCount} ratings</p>
            </div>
            <div className="flex-1 space-y-1">
              {[
                { star: 5, pct: 75 },
                { star: 4, pct: 15 },
                { star: 3, pct: 5 },
                { star: 2, pct: 3 },
                { star: 1, pct: 2 },
              ].map(r => (
                <div key={r.star} className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                  <span className="w-2">{r.star}</span>
                  <Star className="w-2 h-2 fill-muted-foreground" />
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 mt-4 pt-4 border-t border-border/50">
            {/* Sample Review */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex gap-2 items-center">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary text-xs">AS</div>
                  <div>
                    <p className="text-sm font-bold">Arif S.</p>
                    <p className="text-[10px] text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-primary text-primary" />)}
                </div>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">Such a great deal! Got 2 plates of Kacchi and a borhani. Food was still warm. Definitely coming back!</p>
              <button className="text-[10px] flex items-center gap-1 text-muted-foreground font-medium border border-border px-2 py-1 rounded hover:bg-muted transition-colors">
                <ThumbsUp className="w-3 h-3" /> Helpful (12)
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/30 p-4 safe-bottom z-50">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-primary font-bold text-xl">৳{total}</p>
            <p className="text-xs text-muted-foreground">{quantity} box{quantity > 1 ? "es" : ""} + fee</p>
          </div>
          <Button
            variant="amber"
            size="lg"
            className="flex-1 max-w-xs"
            onClick={() => navigate(`/app/checkout/${restaurant.id}?qty=${quantity}`)}
          >
            Reserve & Pay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
