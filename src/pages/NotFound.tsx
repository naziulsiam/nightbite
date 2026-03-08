import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home, MapPin, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      `404 hit at: ${location.pathname}, referrer: ${document.referrer || "direct"}`
    );
  }, [location.pathname]);

  const homePath = user?.activeRole === "partner" ? "/partner" : "/app/home";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <motion.div
        className="text-center max-w-sm w-full space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Illustration */}
        <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-black text-primary tracking-tight">404</h1>
          <p className="text-lg font-bold text-foreground">Page not found</p>
          <p className="text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full pt-2">
          <Button
            variant="amber"
            size="lg"
            className="w-full"
            onClick={() => navigate(homePath, { replace: true })}
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Route Debugger */}
        <div className="mt-8 bg-muted rounded-xl p-4 text-left space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Route Debug</p>
          <p className="text-xs text-muted-foreground font-mono">
            <span className="font-bold text-foreground">Current:</span> {location.pathname}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            <span className="font-bold text-foreground">Role:</span> {user?.activeRole || "none"}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            <span className="font-bold text-foreground">Auth:</span> {user ? "true" : "false"}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
