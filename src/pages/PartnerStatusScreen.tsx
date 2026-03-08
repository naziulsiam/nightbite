import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle, Clock, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const PartnerStatusScreen = () => {
    const navigate = useNavigate();
    const { user, setPartnerStatus } = useAuth();
    const [clickCount, setClickCount] = useState(0);
    const [showDemoControls, setShowDemoControls] = useState(false);

    // Hidden triple-click handler for Demo Controls
    const handleHeaderClick = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);
        if (newCount >= 3) {
            setShowDemoControls(!showDemoControls);
            setClickCount(0);
        }
    };

    const handleDemoStatusChange = (status: "pending" | "approved" | "rejected") => {
        setPartnerStatus(status);
        if (status === "approved") {
            navigate("/partner");
        }
    };

    if (!user || user.partnerStatus === "none") {
        navigate("/partner/register");
        return null;
    }

    return (
        <div className="min-h-screen bg-background pb-20 p-6 flex flex-col items-center justify-center">
            <div
                className="w-full max-w-sm space-y-6 select-none"
                onClick={handleHeaderClick}
            >
                <AnimatePresence mode="wait">
                    {user.partnerStatus === "pending" && (
                        <motion.div
                            key="pending"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card p-6 text-center space-y-4 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/50 via-primary/50 to-secondary/50 animate-pulse" />

                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                <Clock className="w-8 h-8" />
                            </div>

                            <div>
                                <h1 className="text-xl font-bold text-foreground">Application Under Review</h1>
                                <p className="text-sm text-muted-foreground mt-2">
                                    We typically review applications within 24-48 hours.
                                </p>
                            </div>

                            <div className="bg-muted p-3 rounded-xl border border-border text-left mt-6">
                                <p className="text-xs text-muted-foreground mb-1">Reference Number</p>
                                <p className="font-mono font-bold text-foreground tracking-wider">NB-2025-{Math.floor(1000 + Math.random() * 9000)}</p>
                            </div>

                            <div className="text-left space-y-3 pt-4 border-t border-border/50">
                                <h3 className="font-semibold text-sm text-foreground">What happens next?</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-secondary opacity-50" />
                                        Document verification
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-secondary opacity-50" />
                                        Phone call confirmation
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-secondary opacity-50" />
                                        Approval notification
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    )}

                    {user.partnerStatus === "rejected" && (
                        <motion.div
                            key="rejected"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card p-6 text-center space-y-4 border-destructive/30"
                        >
                            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
                                <AlertCircle className="w-8 h-8" />
                            </div>

                            <div>
                                <h1 className="text-xl font-bold text-foreground">Action Required</h1>
                                <p className="text-sm text-muted-foreground mt-2">
                                    We couldn't verify some of your details.
                                </p>
                            </div>

                            <div className="bg-destructive/5 p-4 rounded-xl border border-destructive/20 text-left mt-6">
                                <p className="text-sm font-semibold text-destructive mb-1">Reason:</p>
                                <p className="text-sm text-foreground">The uploaded FSS license image is unclear and cannot be read. Please re-upload a clear copy.</p>
                            </div>

                            <Button
                                className="w-full mt-4"
                                variant="destructive"
                                onClick={() => navigate("/partner/register")}
                            >
                                Update Application
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full bg-card"
                        onClick={() => window.open("https://wa.me/8801700000000", "_blank")}
                    >
                        <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                        Contact Support
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        onClick={() => navigate("/app/home")}
                    >
                        Back to Consumer App
                    </Button>
                </div>

                {/* Secret Demo Controls */}
                <AnimatePresence>
                    {showDemoControls && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass-card p-4 space-y-3 border-primary/50"
                        >
                            <p className="text-xs font-bold text-primary uppercase text-center flex items-center justify-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                Demo Controls
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                <Button size="sm" variant="outline" className="text-xs" onClick={() => handleDemoStatusChange("pending")}>Pending</Button>
                                <Button size="sm" variant="outline" className="text-xs border-secondary text-secondary hover:bg-secondary/10" onClick={() => handleDemoStatusChange("approved")}>Approve</Button>
                                <Button size="sm" variant="outline" className="text-xs border-destructive text-destructive hover:bg-destructive/10" onClick={() => handleDemoStatusChange("rejected")}>Reject</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PartnerStatusScreen;
