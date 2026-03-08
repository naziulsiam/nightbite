import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const AdminLoginScreen = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(false);
        setIsLoading(true);

        setTimeout(() => {
            if (password === "nightbite2025") {
                localStorage.setItem("nb_admin_auth", "true");
                navigate("/admin");
            } else {
                setError(true);
                toast({
                    title: "Access Denied",
                    description: "Invalid password.",
                    variant: "destructive"
                });
            }
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-8 rounded-3xl border border-border/50 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 shadow-inner">
                        <ShieldCheck className="w-8 h-8" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2">NightBite Admin</h1>
                    <p className="text-muted-foreground mb-8">Secure portal for partner verification.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <motion.div
                            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            className="relative"
                        >
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="password"
                                placeholder="Enter Admin Password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                                className={`w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 border transition-colors outline-none focus:ring-2 ${error ? 'border-destructive focus:ring-destructive/50' : 'border-border focus:ring-primary/50'}`}
                            />
                        </motion.div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-md font-bold"
                            disabled={!password || isLoading}
                        >
                            {isLoading ? "Verifying..." : "Access Dashboard"}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginScreen;
