import { useState } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle2, DollarSign, Download, Lock, MapPin, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const payouts = [
    { id: "TX-9901", date: "Mar 05, 2026", amount: 4500, method: "bKash (*1234)", status: "Completed" },
    { id: "TX-9842", date: "Feb 28, 2026", amount: 3200, method: "bKash (*1234)", status: "Completed" },
    { id: "TX-9791", date: "Feb 21, 2026", amount: 5100, method: "bKash (*1234)", status: "Completed" },
    { id: "TX-9733", date: "Feb 14, 2026", amount: 2800, method: "bKash (*1234)", status: "Completed" },
];

const PartnerPayoutsScreen = () => {
    const [isRequesting, setIsRequesting] = useState(false);

    // Hardcoded mock balance logic
    const availableBalance = 1450;
    const pendingClearance = 350;

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <header>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Payouts
                </h1>
                <p className="text-muted-foreground mt-1">Manage your earnings and withdrawal methods.</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Balance & Withdrawal */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden bg-emerald-500/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl -mr-10 -mt-10" />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                        <div>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Available Balance</p>
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground">৳{availableBalance.toLocaleString()}</h2>
                            <div className="flex items-center gap-2 mt-4 text-sm font-medium text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg w-fit">
                                <Lock className="w-4 h-4" /> ৳{pendingClearance} pending clearance
                            </div>
                        </div>

                        <Button
                            variant="emerald"
                            size="xl"
                            disabled={availableBalance < 500 || isRequesting}
                            className="w-full md:w-auto shadow-lg shadow-emerald-500/20"
                            onClick={() => setIsRequesting(true)}
                        >
                            {isRequesting ? "Processing..." : (
                                <>
                                    Request Withdrawal <ArrowUpRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>

                    {availableBalance < 500 && (
                        <p className="text-xs text-muted-foreground mt-4 text-right">Minimum withdrawal amount is ৳500</p>
                    )}
                </div>

                {/* Payout Method */}
                <div className="glass-card rounded-2xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Payout Method</h3>
                        <button className="text-sm text-primary font-bold hover:underline">Edit</button>
                    </div>

                    <div className="flex-1 border border-border bg-muted/30 rounded-xl p-4 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-500 shrink-0">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-foreground">bKash Merchant</p>
                                <p className="text-sm text-muted-foreground font-mono mt-0.5">017****1234</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50 text-xs font-semibold text-secondary">
                            <CheckCircle2 className="w-4 h-4" /> Account Verified
                        </div>
                    </div>
                </div>

                {/* History Table */}
                <div className="lg:col-span-3 glass-card rounded-2xl p-0 overflow-hidden">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h3 className="font-bold text-lg">Transaction History</h3>
                        <Button variant="outline" size="sm" className="bg-card">
                            <Download className="w-4 h-4 mr-2" /> Export CSV
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-muted/50 text-muted-foreground hidden md:table-header-group">
                                <tr>
                                    <th className="font-medium px-6 py-4">Transaction ID</th>
                                    <th className="font-medium px-6 py-4">Date</th>
                                    <th className="font-medium px-6 py-4">Method</th>
                                    <th className="font-medium px-6 py-4">Status</th>
                                    <th className="font-medium px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {payouts.map(tx => (
                                    <tr key={tx.id} className="hover:bg-muted/20 transition-colors flex flex-col md:table-row px-4 py-3 md:p-0">
                                        <td className="md:px-6 md:py-4">
                                            <div className="flex items-center justify-between md:justify-start">
                                                <span className="font-mono text-foreground font-medium">{tx.id}</span>
                                                <span className="md:hidden font-bold text-foreground text-right pl-4">৳{tx.amount.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="md:px-6 md:py-4 text-muted-foreground">{tx.date}</td>
                                        <td className="md:px-6 md:py-4 text-muted-foreground truncate">{tx.method}</td>
                                        <td className="md:px-6 md:py-4">
                                            <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary text-xs font-bold px-2.5 py-1 rounded-full w-fit">
                                                <div className="w-1.5 h-1.5 rounded-full bg-secondary" /> {tx.status}
                                            </span>
                                        </td>
                                        <td className="md:px-6 md:py-4 text-right font-bold text-foreground hidden md:table-cell">
                                            ৳{tx.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PartnerPayoutsScreen;
