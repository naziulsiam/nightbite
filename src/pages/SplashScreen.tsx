import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ShoppingBag, Clock } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  { icon: ShoppingBag, title: "Mystery Boxes", desc: "Get surprise food boxes at 50-70% off" },
  { icon: Clock, title: "Evening Pickup", desc: "Rescue meals between 8:30-10 PM" },
  { icon: Leaf, title: "Save the Planet", desc: "Reduce food waste, lower CO₂ emissions" },
];

const SplashScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // If the user is already authenticated, redirect them immediately to their active dashboard
    if (user && user.activeRole) {
      if (user.activeRole === "consumer") navigate("/app/home", { replace: true });
      else if (user.activeRole === "partner") navigate("/partner", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <AnimatePresence>
        {!showContent ? (
          <motion.div
            key="logo"
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onAnimationComplete={() => setTimeout(() => setShowContent(true), 1200)}
          >
            <motion.img
              src={logo}
              alt="NightBite Logo"
              className="w-28 h-28"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <motion.h1
              className="text-4xl font-black text-primary tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              NightBite
            </motion.h1>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="flex flex-col items-center gap-8 max-w-sm w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.img
              src={logo}
              alt="NightBite"
              className="w-16 h-16"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
            />
            <div className="text-center space-y-3">
              <motion.h1
                className="text-3xl font-black text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Save Food.<br />
                <span className="text-primary">Save Money.</span><br />
                <span className="text-secondary">Save the Planet.</span>
              </motion.h1>
              <motion.p
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Rescue delicious surplus food from top restaurants at up to 70% off
              </motion.p>
            </div>

            <div className="w-full space-y-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  className="glass-card p-4 flex items-center gap-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{f.title}</p>
                    <p className="text-muted-foreground text-xs">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="w-full space-y-3 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                variant="amber"
                size="xl"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Get Started
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Join 15,000+ food rescuers in Dhaka
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SplashScreen;
