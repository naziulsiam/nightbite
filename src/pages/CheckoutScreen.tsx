import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Tag, Check, PartyPopper, CalendarPlus, AlertCircle, Share2, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { restaurants } from "@/data/mockData";

const paymentMethods = [
  { id: "bkash", label: "bKash", icon: <Smartphone className="w-5 h-5" />, color: "bg-pink-500/10 text-pink-400" },
  { id: "nagad", label: "Nagad", icon: <Smartphone className="w-5 h-5" />, color: "bg-orange-500/10 text-orange-400" },
  { id: "card", label: "Card", icon: <CreditCard className="w-5 h-5" />, color: "bg-blue-500/10 text-blue-400" },
];

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const qty = parseInt(searchParams.get("qty") || "1");
  const restaurant = restaurants.find((r) => r.id === id);

  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"select" | "simulate" | "failed">("select");
  const [pickupTime, setPickupTime] = useState("");
  const [runningLate, setRunningLate] = useState(false);
  const [note, setNote] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvc: "" });

  useEffect(() => {
    if (restaurant) setPickupTime(restaurant.pickupStart);
  }, [restaurant]);

  if (!restaurant) return null;

  const serviceFee = 10;
  const discount = promoApplied ? 20 : 0;
  const subtotal = restaurant.nightbitePrice * qty + serviceFee;
  const total = Math.round(subtotal * (1 - discount / 100));
  const savings = (restaurant.originalPrice - restaurant.nightbitePrice) * qty + (promoApplied ? Math.round(subtotal * 0.2) : 0);

  const handleConfirm = () => {
    setIsProcessing(true);
    setPaymentStep("simulate");

    // Simulate payment failure for card if cvc is '000'
    if (paymentMethod === "card" && cardDetails.cvc === "000") {
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentStep("failed");
      }, 2000);
      return;
    }

    // Success flow
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Wait a moment before redirecting to pickup
      setTimeout(() => navigate(`/app/pickup/${restaurant.id}?qty=${qty}`), 4000);
    }, paymentMethod === "card" ? 2000 : 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {isSuccess ? (
          <motion.div
            key="success"
            className="min-h-screen flex flex-col items-center justify-center px-6 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Check className="w-12 h-12 text-secondary" />
            </motion.div>
            <motion.div
              className="text-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-foreground">Reservation Confirmed!</h1>
              <p className="text-muted-foreground">Your mystery box is waiting for you</p>
            </motion.div>
            <motion.div
              className="flex gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[<PartyPopper key="1" className="w-6 h-6 text-primary" />, <PartyPopper key="2" className="w-6 h-6 text-secondary" />, <PartyPopper key="3" className="w-6 h-6 text-primary" />, <PartyPopper key="4" className="w-6 h-6 text-secondary" />, <PartyPopper key="5" className="w-6 h-6 text-primary" />].map((icon, i) => (
                <motion.span
                  key={i}
                  className="text-2xl"
                  animate={{ y: [0, -30, 0, -10, 0], rotate: [0, 15, -15, 5, 0] }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 1.5, ease: "easeOut" }}
                >
                  {icon}
                </motion.span>
              ))}
            </motion.div>

            {/* Order Summary Card Animates In */}
            <motion.div
              className="w-full max-w-sm glass-card p-5 space-y-4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1, type: "spring" }}
            >
              <h3 className="font-bold border-b border-border pb-2 text-foreground">Order #{Math.floor(Math.random() * 90000) + 10000}</h3>
              <div className="flex items-center gap-3">
                <img src={restaurant.image} alt="Restaurant" className="w-12 h-12 rounded bg-muted object-cover" />
                <div>
                  <p className="font-bold text-sm text-foreground">{restaurant.name}</p>
                  <p className="text-xs text-muted-foreground">{qty}x Mystery Box</p>
                </div>
              </div>
              <div className="bg-muted p-3 rounded-lg text-sm flex justify-between items-center text-foreground">
                <span className="flex items-center gap-2 font-medium"><Clock className="w-4 h-4 text-primary" /> Pickup Time</span>
                <span className="font-bold">{pickupTime} {runningLate && <span className="text-destructive">(+15m)</span>}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs bg-background h-8">
                  <CalendarPlus className="w-3.5 h-3.5 mr-1" /> Add to Cal
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs bg-background h-8">
                  <Share2 className="w-3.5 h-3.5 mr-1" /> Share
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30 px-4 py-3">
              <div className="flex items-center gap-3 max-w-lg mx-auto">
                <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 text-foreground" />
                </button>
                <h1 className="font-bold text-foreground text-lg">Checkout</h1>
              </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-5 space-y-5 pb-32">
              {/* Order summary */}
              <motion.div className="glass-card p-4 flex gap-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <img src={restaurant.image} alt={restaurant.name} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{restaurant.name}</h3>
                  <p className="text-xs text-muted-foreground">{qty} Mystery Box{qty > 1 ? "es" : ""}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pickup: <span className="text-primary">{restaurant.pickupStart}</span>
                  </p>
                </div>
              </motion.div>

              {/* Pickup time */}
              <motion.div className="glass-card p-4 space-y-3" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <h3 className="font-semibold text-foreground text-sm flex justify-between items-center">
                  Pickup Window
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{restaurant.pickupStart} - {restaurant.pickupEnd}</span>
                </h3>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {[restaurant.pickupStart, "9:00 PM", "9:30 PM", restaurant.pickupEnd].map((t) => (
                    <button
                      key={t}
                      onClick={() => setPickupTime(t)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${pickupTime === t ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Add 15 min buffer?</span>
                  <button
                    onClick={() => setRunningLate(!runningLate)}
                    className={`text-xs px-3 py-1.5 rounded-full font-bold transition-colors ${runningLate ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-muted text-muted-foreground'}`}
                  >
                    I might be late
                  </button>
                </div>
              </motion.div>

              {/* Note */}
              <motion.div className="glass-card p-4 space-y-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" /> Add a note (Optional)
                </h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="E.g., Please ring the bell when I arrive..."
                  className="w-full h-16 bg-muted rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </motion.div>

              {/* Payment */}
              <motion.div className="glass-card p-4 space-y-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <h3 className="font-semibold text-foreground text-sm">Payment Method</h3>

                {paymentStep === "failed" && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl flex items-start gap-2 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-bold">Payment Failed</p>
                      <p className="text-xs opacity-90 mt-0.5">Your card was declined. Please verify your details or use a different method.</p>
                      <button onClick={() => setPaymentStep("select")} className="mt-2 text-xs font-bold underline">Try again</button>
                    </div>
                  </div>
                )}

                {paymentStep === "simulate" && (
                  <div className="bg-muted p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                      <Smartphone className={`w-8 h-8 ${paymentMethod === 'bkash' ? 'text-pink-500' : paymentMethod === 'nagad' ? 'text-orange-500' : 'text-blue-500'}`} />
                    </motion.div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Processing {paymentMethod.toUpperCase()}</p>
                      {paymentMethod !== "card" && (
                        <p className="text-xs text-muted-foreground mt-1">Simulating USSD {paymentMethod === "bkash" ? "*247#" : "*167#"}...</p>
                      )}
                    </div>
                  </div>
                )}

                {paymentStep === "select" && (
                  <div className="space-y-3">
                    {paymentMethods.map((pm) => (
                      <div key={pm.id} className="space-y-2">
                        <button
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${paymentMethod === pm.id ? "bg-primary/10 border-2 border-primary" : "bg-muted border-2 border-transparent hover:bg-muted/80"
                            }`}
                        >
                          <span className="text-muted-foreground mr-2">{pm.icon}</span>
                          <span className="font-medium text-foreground text-sm">{pm.label}</span>
                          {paymentMethod === pm.id && <Check className="w-4 h-4 text-primary ml-auto" />}
                        </button>

                        {/* Card Form Expand */}
                        <AnimatePresence>
                          {paymentMethod === "card" && pm.id === "card" && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-3 bg-muted rounded-xl space-y-3 mt-1 text-sm border border-border">
                                <div>
                                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Card Number</label>
                                  <input
                                    type="text"
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 mt-1 focus:outline-none"
                                    value={cardDetails.number}
                                    onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                                  />
                                </div>
                                <div className="flex gap-3">
                                  <div className="flex-1">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Expiry</label>
                                    <input
                                      type="text"
                                      placeholder="MM/YY"
                                      className="w-full bg-background border border-border rounded-lg px-3 py-2 mt-1 focus:outline-none"
                                      value={cardDetails.expiry}
                                      onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground">CVC</label>
                                    <input
                                      type="text"
                                      placeholder="123"
                                      className="w-full bg-background border border-border rounded-lg px-3 py-2 mt-1 focus:outline-none"
                                      value={cardDetails.cvc}
                                      onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground italic mt-2 text-center">Tip: Use CVC "000" to simulate a failed payment.</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Promo */}
              <motion.div className="glass-card p-4 space-y-3" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Promo Code
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code (try RAMADAN20)"
                    className="flex-1 h-10 px-3 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button
                    variant="amber-outline"
                    size="sm"
                    onClick={() => {
                      if (promoCode === "RAMADAN20") setPromoApplied(true);
                    }}
                  >
                    Apply
                  </Button>
                </div>
                {promoApplied && (
                  <motion.p
                    className="text-secondary text-xs font-medium"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    RAMADAN20 applied — 20% off!
                  </motion.p>
                )}
              </motion.div>

              {/* Total */}
              <motion.div className="glass-card p-5 space-y-3" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Box price ({qty}x)</span>
                  <span className="text-foreground font-medium">৳{restaurant.nightbitePrice * qty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">Service fee <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground/70">Fixed</span></span>
                  <span className="text-foreground font-medium">৳{serviceFee}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary font-bold">Promo discount</span>
                    <span className="text-secondary font-bold">-৳{Math.round(subtotal * 0.2)}</span>
                  </div>
                )}
                <div className="h-px bg-border my-1" />
                <div className="flex justify-between font-bold items-center py-1">
                  <span className="text-foreground text-lg">Total</span>
                  <span className="text-primary text-2xl font-black">৳{total}</span>
                </div>
                <div className="eco-badge w-full justify-center py-2 text-sm">
                  You save ৳{savings}!
                </div>
              </motion.div>
            </div>

            {/* Sticky footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/30 p-4 safe-bottom z-50">
              <div className="max-w-lg mx-auto">
                <Button
                  variant="amber"
                  size="xl"
                  className="w-full"
                  onClick={handleConfirm}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <motion.span
                      className="flex items-center gap-2"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      Processing...
                    </motion.span>
                  ) : (
                    `Confirm Reservation — ৳${total}`
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutScreen;
