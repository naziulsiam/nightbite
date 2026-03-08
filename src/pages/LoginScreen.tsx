import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Smartphone, ShieldCheck, Leaf, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const LoginScreen = () => {
    const navigate = useNavigate();
    const { login, verifyOtp, setupRole, user } = useAuth();

    const [step, setStep] = useState<"phone" | "otp" | "role">("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [countdown, setCountdown] = useState(3);
    const [isProcessing, setIsProcessing] = useState(false);

    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Automatically handle OTP countdown and auto-fill for demo
    useEffect(() => {
        if (step === "otp" && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (step === "otp" && countdown === 0) {
            // Auto-fill OTP for demo
            const demoOtp = ["1", "2", "3", "4", "5", "6"];
            setOtp(demoOtp);
            handleVerify(demoOtp.join(""));
        }
    }, [step, countdown]);

    useEffect(() => {
        // If user is already logged in, redirect them
        if (user && user.activeRole) {
            if (user.activeRole === "consumer") {
                navigate("/app/home");
            } else if (user.activeRole === "partner") {
                if (user.partnerStatus === "approved") {
                    navigate("/partner");
                } else if (user.partnerStatus === "none") {
                    navigate("/partner/register");
                } else {
                    navigate("/partner/status");
                }
            }
        }
    }, [user, navigate]);

    const handleSendOtp = async () => {
        if (phone.length < 10) {
            toast({ title: "Invalid Phone Number", variant: "destructive", description: "Please enter a valid phone number" });
            return;
        }
        setIsProcessing(true);
        await login(`+880${phone}`);
        setIsProcessing(false);
        setStep("otp");
        setCountdown(3);
    };

    const handleVerify = async (otpString: string) => {
        setIsProcessing(true);
        const success = await verifyOtp(otpString);
        setIsProcessing(false);

        if (success) {
            setStep("role");
        } else {
            toast({ title: "Invalid OTP", variant: "destructive" });
            setOtp(["", "", "", "", "", ""]);
            otpRefs.current[0]?.focus();
        }
    };

    const handleRoleSelect = (role: "consumer" | "partner") => {
        setupRole(role);
        if (role === "consumer") {
            navigate("/app/home");
        } else {
            // They just selected partner for the first time
            if (user?.partnerStatus === "none" || !user?.partnerStatus) {
                navigate("/partner/register");
            } else if (user?.partnerStatus === "approved") {
                navigate("/partner");
            } else {
                navigate("/partner/status");
            }
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pb-20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 pointer-events-none" />

            <div className="w-full max-w-sm space-y-8 relative z-10">
                <motion.div
                    className="text-center space-y-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Leaf className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Welcome to NightBite</h1>
                    <p className="text-muted-foreground text-sm">Save food, save money, save the planet.</p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {step === "phone" && (
                        <motion.div
                            key="phone"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card p-6 space-y-6"
                        >
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-foreground">Enter your phone number</label>
                                <div className="flex gap-2">
                                    <div className="h-12 px-4 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground font-medium shrink-0">
                                        +880
                                    </div>
                                    <div className="relative flex-1">
                                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            placeholder="1XXXXXXXXX"
                                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium tracking-wide"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="amber"
                                size="xl"
                                className="w-full group"
                                onClick={handleSendOtp}
                                disabled={isProcessing || phone.length < 10}
                            >
                                {isProcessing ? "Sending OTP..." : "Continue"}
                                {!isProcessing && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                            </Button>
                        </motion.div>
                    )}

                    {step === "otp" && (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card p-6 space-y-6 text-center"
                        >
                            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Verify your number</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    We've sent a code to +880 {phone}
                                </p>
                            </div>

                            <div className="flex justify-center gap-2">
                                {otp.map((d, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => (otpRefs.current[i] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={d}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            const newOtp = [...otp];
                                            newOtp[i] = val;
                                            setOtp(newOtp);
                                            if (val && i < 5) otpRefs.current[i + 1]?.focus();
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Backspace" && !otp[i] && i > 0) {
                                                otpRefs.current[i - 1]?.focus();
                                            }
                                        }}
                                        className="w-10 h-12 rounded-lg bg-muted border border-border text-center font-bold text-lg text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                                    />
                                ))}
                            </div>

                            {countdown > 0 ? (
                                <p className="text-sm text-muted-foreground animate-pulse">
                                    Auto-filling in {countdown}s (Demo)
                                </p>
                            ) : (
                                <p className="text-sm text-primary font-medium">Verifying code...</p>
                            )}
                        </motion.div>
                    )}

                    {step === "role" && (
                        <motion.div
                            key="role"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-4"
                        >
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-foreground">How will you use NightBite?</h3>
                                <p className="text-sm text-muted-foreground mt-1">You can always switch later</p>
                            </div>

                            <button
                                onClick={() => handleRoleSelect("consumer")}
                                className="w-full glass-card p-5 border-2 border-transparent hover:border-primary/50 flex items-center gap-4 transition-all group active:scale-[0.98]"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Leaf className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-left flex-1">
                                    <h4 className="font-bold text-foreground text-lg">I want to save food</h4>
                                    <p className="text-xs text-muted-foreground">Find mystery boxes at great prices</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                            </button>

                            <button
                                onClick={() => handleRoleSelect("partner")}
                                className="w-full glass-card p-5 border-2 border-transparent hover:border-secondary/50 flex items-center gap-4 transition-all group active:scale-[0.98]"
                            >
                                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Store className="w-6 h-6 text-secondary" />
                                </div>
                                <div className="text-left flex-1">
                                    <h4 className="font-bold text-foreground text-lg">I want to sell food</h4>
                                    <p className="text-xs text-muted-foreground">List surplus food from your business</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors group-hover:translate-x-1" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LoginScreen;
