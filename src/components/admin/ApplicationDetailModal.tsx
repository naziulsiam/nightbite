import { useState } from "react";
import { X, ZoomIn, ZoomOut, CheckCircle2, RotateCw, Download, AlertCircle, Phone, Mail, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AdminApplication } from "@/pages/admin/AdminApplicationsScreen";
import { toast } from "@/hooks/use-toast";

interface Props {
    application: AdminApplication;
    onClose: () => void;
    onApprove: (id: string, rate: number) => void;
    onReject: (id: string, reason: string, d: string) => void;
    onMoreInfo: (id: string, msg: string) => void;
}

const docs = [
    { title: "FSS License", src: "/src/assets/docs/fss_placeholder.jpg" }, // Add real placeholders later if needed
    { title: "Trade License", src: "/src/assets/docs/trade_placeholder.jpg" },
    { title: "NID Front", src: "/src/assets/docs/nid_front_placeholder.jpg" },
    { title: "NID Back", src: "/src/assets/docs/nid_back_placeholder.jpg" },
];

const ApplicationDetailModal = ({ application, onClose, onApprove, onReject, onMoreInfo }: Props) => {
    const [activeDoc, setActiveDoc] = useState(docs[0]);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    const [checks, setChecks] = useState({ fss: false, trade: false, nid: false, address: false, payout: false });
    const [commission, setCommission] = useState(12);

    const [actionState, setActionState] = useState<"view" | "approve" | "reject" | "info">("view");
    const [rejectReason, setRejectReason] = useState("");
    const [reapplyDate, setReapplyDate] = useState("30");

    const handleActionSubmit = () => {
        if (actionState === "approve") {
            onApprove(application.id, commission);
        } else if (actionState === "reject") {
            onReject(application.id, rejectReason, reapplyDate);
        } else if (actionState === "info") {
            onMoreInfo(application.id, "Please upload clearer copies of your NID and Trade License.");
        }
    };

    const isAllChecked = Object.values(checks).every(Boolean);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex"
            >
                {/* Left Panel: Document Viewer (60%) */}
                <div className="hidden lg:flex flex-col w-[60%] border-r border-border bg-muted/20">
                    <div className="p-4 border-b border-border flex items-center justify-between bg-background">
                        <h2 className="font-bold text-lg">{activeDoc.title}</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}><ZoomOut className="w-4 h-4" /></Button>
                            <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.min(3, z + 0.25))}><ZoomIn className="w-4 h-4" /></Button>
                            <Button variant="outline" size="icon" onClick={() => setRotation(r => r + 90)}><RotateCw className="w-4 h-4" /></Button>
                            <Button variant="outline" size="icon"><Download className="w-4 h-4" /></Button>
                        </div>
                    </div>

                    {/* Viewer Area */}
                    <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-grid-white/[0.02]">
                        <motion.div
                            animate={{ scale: zoom, rotate: rotation }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-card w-full max-w-2xl aspect-[1/1.4] rounded-sm shadow-2xl flex items-center justify-center border border-border"
                        >
                            <p className="text-muted-foreground font-medium animate-pulse">Select document to preview</p>
                        </motion.div>
                    </div>

                    {/* Thumbnails */}
                    <div className="p-4 border-t border-border bg-background flex gap-4 overflow-x-auto hide-scrollbar">
                        {docs.map(doc => (
                            <button
                                key={doc.title}
                                onClick={() => { setActiveDoc(doc); setZoom(1); setRotation(0); }}
                                className={`shrink-0 w-32 aspect-[1/1.4] rounded-md border-2 overflow-hidden relative group ${activeDoc.title === doc.title ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                            >
                                <div className="absolute inset-x-0 bottom-0 bg-background/90 text-[10px] font-bold py-1 px-2 text-center border-t border-border">
                                    {doc.title}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Data & Actions (40%) */}
                <div className="w-full lg:w-[40%] flex flex-col bg-background relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-6 border-b border-border flex items-center gap-4 pr-16">
                        <div>
                            <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">{application.id}</span>
                            <h1 className="text-2xl font-bold">{application.restaurantName}</h1>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* Section: Business Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Business Info</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Type</p>
                                    <p className="font-medium text-sm">{application.type}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Est. Daily Waste</p>
                                    <p className="font-medium text-sm text-secondary">{application.expectedWaste} kg</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Address</p>
                                <p className="font-medium text-sm flex items-start gap-1">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                                    <span>House 12, Road 4, Block C, {application.area}, Dhaka</span>
                                </p>
                            </div>
                        </div>

                        {/* Section: Contact */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Contact Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Applicant Name</p>
                                    <p className="font-medium text-sm">Shafiqul Ahsan</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                    <a href={`tel:${application.phone}`} className="font-medium text-sm text-primary hover:underline flex items-center gap-1">
                                        <Phone className="w-3.5 h-3.5" /> {application.phone}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="sm" className="w-full text-xs">
                                    <Mail className="w-3.5 h-3.5 mr-2" /> Email
                                </Button>
                                <Button variant="outline" size="sm" className="w-full text-xs">
                                    <Phone className="w-3.5 h-3.5 mr-2" /> Call
                                </Button>
                            </div>
                        </div>

                        {/* Section: Verification Checklist */}
                        <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verification Checklist
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { id: 'fss', label: "FSS License is valid & matches" },
                                    { id: 'trade', label: "Trade License matches business name" },
                                    { id: 'nid', label: "NID matches applicant details" },
                                    { id: 'address', label: "Address location verified" },
                                    { id: 'payout', label: "Payout account name matches NID" },
                                ].map(check => (
                                    <label key={check.id} className="flex items-start gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checks[check.id as keyof typeof checks] ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-background group-hover:border-primary'}`}>
                                            {checks[check.id as keyof typeof checks] && <CheckCircle2 className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className={`text-sm select-none ${checks[check.id as keyof typeof checks] ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                            {check.label}
                                        </span>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={checks[check.id as keyof typeof checks]}
                                            onChange={(e) => setChecks(p => ({ ...p, [check.id]: e.target.checked }))}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-border bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                        {actionState === "view" ? (
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 text-xs border-amber-500/20 text-amber-500 hover:bg-amber-500/10" onClick={() => setActionState("info")}>
                                    Request Info
                                </Button>
                                <Button variant="outline" className="flex-1 text-xs border-destructive/20 text-destructive hover:bg-destructive/10" onClick={() => setActionState("reject")}>
                                    Reject
                                </Button>
                                <Button
                                    variant="emerald"
                                    className="flex-[2]"
                                    disabled={!isAllChecked}
                                    onClick={() => setActionState("approve")}
                                >
                                    Approve Partner
                                </Button>
                            </div>
                        ) : actionState === "approve" ? (
                            <div className="space-y-4 animate-in slide-in-from-bottom-2">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-sm text-emerald-800 dark:text-emerald-400 font-medium flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                    Confirm approval for {application.restaurantName}. They will receive an activation SMS immediately.
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold">Commission Rate (%)</span>
                                    <input
                                        type="number"
                                        value={commission}
                                        onChange={(e) => setCommission(Number(e.target.value))}
                                        className="w-20 h-8 px-2 border border-border rounded text-right font-bold focus:ring-2 focus:ring-primary/50 outline-none"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" className="flex-1" onClick={() => setActionState("view")}>Cancel</Button>
                                    <Button variant="emerald" className="flex-1" onClick={handleActionSubmit}>Confirm Approve</Button>
                                </div>
                            </div>
                        ) : actionState === "reject" ? (
                            <div className="space-y-4 animate-in slide-in-from-bottom-2">
                                <select
                                    className="w-full h-10 px-3 rounded-lg bg-card border border-border text-sm focus:ring-2 focus:ring-destructive/50 outline-none"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                >
                                    <option value="" disabled>Select Rejection Reason...</option>
                                    <option value="Invalid FSS License">Invalid FSS License</option>
                                    <option value="Trade License mismatch">Trade License mismatch</option>
                                    <option value="Poor document quality">Poor document quality</option>
                                    <option value="Business not eligible">Business not eligible</option>
                                </select>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <label className="flex items-center gap-1 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded border-border" /> Allow Reapply in
                                    </label>
                                    <input
                                        type="number"
                                        value={reapplyDate}
                                        onChange={(e) => setReapplyDate(e.target.value)}
                                        className="w-16 h-8 px-2 border border-border rounded text-center outline-none focus:border-destructive"
                                    />
                                    days
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" className="flex-1" onClick={() => setActionState("view")}>Cancel</Button>
                                    <Button variant="destructive" className="flex-1" disabled={!rejectReason} onClick={handleActionSubmit}>Confirm Reject</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in slide-in-from-bottom-2">
                                <p className="text-xs text-amber-500 font-bold bg-amber-500/10 p-2 rounded inline-flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" /> Application will remain pending
                                </p>
                                <textarea
                                    placeholder="Message to partner (e.g. Please re-upload clearer NID)"
                                    className="w-full min-h-24 p-3 text-sm rounded-lg border border-border bg-card resize-none focus:ring-2 focus:ring-amber-500/50 outline-none"
                                />
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" className="flex-1" onClick={() => setActionState("view")}>Cancel</Button>
                                    <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={handleActionSubmit}>Send Request</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ApplicationDetailModal;
