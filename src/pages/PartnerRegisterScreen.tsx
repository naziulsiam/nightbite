import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
    ArrowLeft, CheckCircle2, ChevronRight, Upload, DollarSign,
    MapPin, Store, Building2, Smartphone, Mail, FileText, Briefcase, SwitchCamera, Edit3, Loader2, PartyPopper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// --- Types ---
type BusinessType = "Restaurant" | "Bakery" | "Hotel" | "Cafe" | "Catering" | "Sweet Shop" | "";
type Area = "Gulshan" | "Banani" | "Dhanmondi" | "Uttara" | "Mohammadpur" | "Mirpur" | "Other" | "";
type YearsOperation = "<1 year" | "1-3 years" | "3-5 years" | "5+ years" | "";
type PaymentMethod = "bKash" | "Bank Transfer" | "";

interface FormData {
    // Step 1
    businessType: BusinessType;
    restaurantName: string;
    area: Area;
    detailedAddress: string;
    yearsOperation: YearsOperation;

    // Step 2
    tradeLicense: string;
    binNumber: string;
    businessPhone: string;
    businessEmail: string;

    // Step 3 (Simulated files)
    fssLicenseFile: boolean;
    tradeLicenseFile: boolean;
    nidFrontFile: boolean;
    nidBackFile: boolean;

    // Step 4
    paymentMethod: PaymentMethod;
    bkashNumber: string;
    bkashName: string;
    sameAsBusinessPhone: boolean;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankBranch: string;

    // Step 5
    agreedToTerms: boolean;
}

const initialFormData: FormData = {
    businessType: "",
    restaurantName: "",
    area: "",
    detailedAddress: "",
    yearsOperation: "",
    tradeLicense: "",
    binNumber: "",
    businessPhone: "",
    businessEmail: "",
    fssLicenseFile: false,
    tradeLicenseFile: false,
    nidFrontFile: false,
    nidBackFile: false,
    paymentMethod: "",
    bkashNumber: "",
    bkashName: "",
    sameAsBusinessPhone: false,
    bankName: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankBranch: "",
    agreedToTerms: false
};

const BANK_NAMES = ["City Bank LTD", "BRAC Bank", "Dutch-Bangla Bank", "Islami Bank", "Eastern Bank", "Standard Chartered", "HSBC", "Trust Bank", "Mutual Trust Bank", "UCB"];

const PartnerRegisterScreen = () => {
    const navigate = useNavigate();
    const { user, submitPartnerApplication } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [shake, setShake] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isVerifyingPayout, setIsVerifyingPayout] = useState(false);
    const [isPayoutVerified, setIsPayoutVerified] = useState(false);

    // --- Auto-Save Draft Logic ---
    useEffect(() => {
        // On mount, load draft if exists
        const savedDraft = localStorage.getItem("nb_partner_draft");
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                setFormData(parsed.data);
                if (parsed.step) setCurrentStep(parsed.step);
            } catch (e) {
                console.error("Failed to parse draft");
            }
        }

        // Default business phone to auth user phone
        if (!formData.businessPhone && user?.phone) {
            setFormData(prev => ({ ...prev, businessPhone: user.phone }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Auto save every 10 seconds or on step change
    useEffect(() => {
        const saveDraft = () => {
            localStorage.setItem("nb_partner_draft", JSON.stringify({
                data: formData,
                step: currentStep,
                timestamp: Date.now()
            }));
        };

        saveDraft(); // Save immediately on step change
        const interval = setInterval(saveDraft, 10000);
        return () => clearInterval(interval);
    }, [formData, currentStep]);

    // Handle same as business phone toggle
    useEffect(() => {
        if (formData.sameAsBusinessPhone) {
            setFormData(prev => ({ ...prev, bkashNumber: prev.businessPhone }));
        }
    }, [formData.sameAsBusinessPhone, formData.businessPhone]);


    // --- Validation ---
    const validateStep = (step: number): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        const reqMsg = "অনুগ্রহ করে সঠিক তথ্য দিন"; // "Please provide correct information"

        switch (step) {
            case 1:
                if (!formData.businessType) newErrors.businessType = reqMsg;
                if (formData.restaurantName.length < 3) newErrors.restaurantName = reqMsg;
                if (!formData.area) newErrors.area = reqMsg;
                if (formData.detailedAddress.length < 5) newErrors.detailedAddress = reqMsg;
                if (!formData.yearsOperation) newErrors.yearsOperation = reqMsg;
                break;
            case 2:
                if (formData.tradeLicense.length < 5) newErrors.tradeLicense = reqMsg;
                if (formData.businessPhone.length < 10) newErrors.businessPhone = reqMsg;
                // Basic email syntax check if provided
                if (formData.businessEmail && !/^\S+@\S+\.\S+$/.test(formData.businessEmail)) {
                    newErrors.businessEmail = "Invalid email format";
                }
                break;
            case 3:
                if (!formData.fssLicenseFile) newErrors.fssLicenseFile = reqMsg;
                if (!formData.tradeLicenseFile) newErrors.tradeLicenseFile = reqMsg;
                if (!formData.nidFrontFile) newErrors.nidFrontFile = reqMsg;
                if (!formData.nidBackFile) newErrors.nidBackFile = reqMsg;
                break;
            case 4:
                if (!formData.paymentMethod) {
                    newErrors.paymentMethod = reqMsg;
                } else if (formData.paymentMethod === "bKash") {
                    if (formData.bkashNumber.length < 11) newErrors.bkashNumber = reqMsg;
                    if (formData.bkashName.length < 3) newErrors.bkashName = reqMsg;
                } else if (formData.paymentMethod === "Bank Transfer") {
                    if (!formData.bankName) newErrors.bankName = reqMsg;
                    if (formData.bankAccountName.length < 3) newErrors.bankAccountName = reqMsg;
                    if (formData.bankAccountNumber.length < 8) newErrors.bankAccountNumber = reqMsg;
                    if (formData.bankBranch.length < 3) newErrors.bankBranch = reqMsg;
                }
                if (!isPayoutVerified) {
                    toast({ title: "Verification Required", description: "Please verify setup first", variant: "destructive" });
                    return false;
                }
                break;
            case 5:
                if (!formData.agreedToTerms) newErrors.agreedToTerms = reqMsg;
                break;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                setCurrentStep(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            navigate(-1);
        }
    };

    const handleSubmit = async () => {
        if (validateStep(5)) {
            setIsSubmitting(true);
            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                setIsSuccess(true);
                localStorage.removeItem("nb_partner_draft"); // Clear draft

                // Show success briefly before submitting to context & redirecting
                setTimeout(() => {
                    submitPartnerApplication();
                    navigate("/partner/status", { replace: true });
                }, 2500);
            }, 1500);
        }
    };

    const handleVerifyPayout = () => {
        setIsVerifyingPayout(true);
        setTimeout(() => {
            setIsVerifyingPayout(false);
            setIsPayoutVerified(true);
        }, 1000);
    }

    const handleFileSimulate = (field: keyof FormData) => {
        // Simulate file upload delay
        toast({ title: "Uploading document...", description: "Please wait a moment" });
        setTimeout(() => {
            setFormData(prev => ({ ...prev, [field]: true }));
            toast({ title: "Document verified", description: "Successfully attached.", variant: "default" });
        }, 800);
    }


    // --- Input Handlers ---
    const updateField = (field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };


    // --- UI Renderers ---
    const renderStepIndicator = () => {
        return (
            <div className="mb-8 relative max-w-sm mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full z-0" />
                <div
                    className="absolute top-1/2 left-0 h-1 bg-secondary -translate-y-1/2 rounded-full z-0 transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />
                <div className="flex justify-between relative z-10">
                    {[1, 2, 3, 4, 5].map((step) => {
                        const isCompleted = step < currentStep;
                        const isActive = step === currentStep;
                        return (
                            <div
                                key={step}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${isCompleted ? 'bg-secondary text-secondary-foreground cursor-pointer' :
                                        isActive ? 'bg-primary text-primary-foreground scale-110 shadow-lg' :
                                            'bg-card border-2 border-muted text-muted-foreground'}`}
                                onClick={() => isCompleted ? setCurrentStep(step) : null}
                            >
                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step}
                            </div>
                        );
                    })}
                </div>
                <div className="text-center mt-3 text-sm font-bold text-foreground">
                    {currentStep === 1 && "Business Basics"}
                    {currentStep === 2 && "Legal & Contact"}
                    {currentStep === 3 && "Documents"}
                    {currentStep === 4 && "Payout"}
                    {currentStep === 5 && "Review"}
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-background pb-24 pt-6 px-4">
            <div className="max-w-xl mx-auto">

                {/* Header */}
                <header className="flex items-center gap-3 mb-8">
                    <button onClick={handleBack} className="p-2 -ml-2 text-foreground hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-foreground">Partner Onboarding</h1>
                </header>

                {renderStepIndicator()}

                <motion.div
                    className={`glass-card p-6 min-h-[400px] ${shake ? 'animate-shake' : ''}`}
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* STEP 1: BUSINESS BASICS */}
                    {currentStep === 1 && (
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Business Type</label>
                                <select
                                    className={`w-full h-12 px-4 rounded-xl bg-muted border ${errors.businessType ? 'border-destructive' : 'border-border'} text-foreground focus:ring-2 focus:ring-primary/50 outline-none`}
                                    value={formData.businessType}
                                    onChange={(e) => updateField("businessType", e.target.value)}
                                >
                                    <option value="" disabled>Select Type</option>
                                    <option value="Restaurant">Restaurant</option>
                                    <option value="Bakery">Bakery</option>
                                    <option value="Hotel">Hotel</option>
                                    <option value="Cafe">Cafe</option>
                                    <option value="Catering">Catering</option>
                                    <option value="Sweet Shop">Sweet Shop</option>
                                </select>
                                {errors.businessType && <p className="text-xs text-destructive">{errors.businessType}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Business Name</label>
                                <div className="relative">
                                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="e.g Sultan's Dine"
                                        className={`w-full h-12 pl-10 pr-4 rounded-xl bg-muted border ${errors.restaurantName ? 'border-destructive' : 'border-border'} text-foreground focus:ring-2 focus:ring-primary/50 outline-none`}
                                        value={formData.restaurantName}
                                        onChange={(e) => updateField("restaurantName", e.target.value)}
                                    />
                                </div>
                                {errors.restaurantName && <p className="text-xs text-destructive">{errors.restaurantName}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Area</label>
                                    <select
                                        className={`w-full h-12 px-3 rounded-xl bg-muted border ${errors.area ? 'border-destructive' : 'border-border'} text-foreground focus:ring-2 focus:ring-primary/50 outline-none`}
                                        value={formData.area}
                                        onChange={(e) => updateField("area", e.target.value)}
                                    >
                                        <option value="" disabled>Select Area</option>
                                        <option value="Gulshan">Gulshan</option>
                                        <option value="Banani">Banani</option>
                                        <option value="Dhanmondi">Dhanmondi</option>
                                        <option value="Uttara">Uttara</option>
                                        <option value="Mohammadpur">Mohammadpur</option>
                                        <option value="Mirpur">Mirpur</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Years in Operation</label>
                                    <select
                                        className={`w-full h-12 px-3 rounded-xl bg-muted border ${errors.yearsOperation ? 'border-destructive' : 'border-border'} text-foreground focus:ring-2 focus:ring-primary/50 outline-none`}
                                        value={formData.yearsOperation}
                                        onChange={(e) => updateField("yearsOperation", e.target.value)}
                                    >
                                        <option value="" disabled>Select Age</option>
                                        <option value="<1 year">{"< 1 year"}</option>
                                        <option value="1-3 years">1-3 years</option>
                                        <option value="3-5 years">3-5 years</option>
                                        <option value="5+ years">5+ years</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Detailed Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                                    <textarea
                                        placeholder="House, Road, Block, Sector/Area detail..."
                                        className={`w-full min-h-[100px] pl-10 pr-4 pt-3 rounded-xl bg-muted border ${errors.detailedAddress ? 'border-destructive' : 'border-border'} text-foreground focus:ring-2 focus:ring-primary/50 outline-none resize-none`}
                                        value={formData.detailedAddress}
                                        onChange={(e) => updateField("detailedAddress", e.target.value)}
                                    />
                                </div>
                                {errors.detailedAddress && <p className="text-xs text-destructive">{errors.detailedAddress}</p>}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: LEGAL & CONTACT */}
                    {currentStep === 2 && (
                        <div className="space-y-5">
                            <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl mb-6">
                                <p className="text-sm text-secondary-foreground font-medium flex gap-2">
                                    <Briefcase className="w-5 h-5 text-secondary shrink-0" />
                                    These details are strictly used for verification and will not be shared publicly.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Trade License Number (Required)</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="TRAD/DSCC/000000/2024"
                                        className={`w-full h-12 pl-10 pr-4 rounded-xl bg-muted border ${errors.tradeLicense ? 'border-destructive' : 'border-border'} text-foreground focus:ring-2 focus:ring-primary/50 outline-none uppercase font-mono tracking-wider`}
                                        value={formData.tradeLicense}
                                        onChange={(e) => updateField("tradeLicense", e.target.value.toUpperCase())}
                                    />
                                </div>
                                {errors.tradeLicense && <p className="text-xs text-destructive">{errors.tradeLicense}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">BIN / VAT Number (Optional)</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="9 digits (e.g. 000000000)"
                                        className={`w-full h-12 pl-10 pr-4 rounded-xl bg-muted border border-border text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-mono tracking-wider`}
                                        value={formData.binNumber}
                                        onChange={(e) => updateField("binNumber", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Business Phone (For support callbacks)</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="tel"
                                        placeholder="+8801XXXXXXXXX"
                                        className={`w-full h-12 pl-10 pr-4 rounded-xl bg-muted border ${errors.businessPhone ? 'border-destructive' : 'border-border'} text-foreground focus:ring-2 focus:ring-primary/50 outline-none`}
                                        value={formData.businessPhone}
                                        onChange={(e) => updateField("businessPhone", e.target.value)}
                                    />
                                </div>
                                {errors.businessPhone && <p className="text-xs text-destructive">{errors.businessPhone}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Business Email (Optional)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        placeholder="contact@restaurant.com"
                                        className={`w-full h-12 pl-10 pr-4 rounded-xl bg-muted border ${errors.businessEmail ? 'border-destructive' : 'border-border'} text-foreground focus:ring-2 focus:ring-primary/50 outline-none`}
                                        value={formData.businessEmail}
                                        onChange={(e) => updateField("businessEmail", e.target.value)}
                                    />
                                </div>
                                {errors.businessEmail && <p className="text-xs text-destructive">{errors.businessEmail}</p>}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: DOCUMENTS */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl mb-4">
                                <p className="text-sm text-primary-foreground font-medium flex gap-2">
                                    <Upload className="w-5 h-5 text-primary shrink-0" />
                                    Clear photos or scans. Max 5MB per file.
                                </p>
                            </div>

                            {[
                                { id: "tradeLicenseFile", label: "Trade License Document" },
                                { id: "fssLicenseFile", label: "FSS/Food Safety License" },
                                { id: "nidFrontFile", label: "Owner NID (Front)" },
                                { id: "nidBackFile", label: "Owner NID (Back)" },
                            ].map((doc) => {
                                const isUploaded = formData[doc.id as keyof FormData] as boolean;
                                const hasError = errors[doc.id as keyof FormData];

                                return (
                                    <div key={doc.id} className={`p-4 rounded-xl border-2 transition-all ${isUploaded ? 'border-secondary bg-secondary/5' : hasError ? 'border-destructive bg-destructive/5' : 'border-dashed border-border bg-muted/50'} flex items-center justify-between`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isUploaded ? 'bg-secondary/20 text-secondary' : 'bg-background border border-border text-muted-foreground'}`}>
                                                {isUploaded ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-foreground">{doc.label}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {isUploaded ? "Uploaded successfully" : "Tap to upload image"}
                                                </p>
                                                {hasError && <p className="text-xs text-destructive font-semibold mt-1">{hasError}</p>}
                                            </div>
                                        </div>

                                        <Button
                                            variant={isUploaded ? "ghost" : "secondary"}
                                            size="sm"
                                            onClick={() => isUploaded ? updateField(doc.id as keyof FormData, false) : handleFileSimulate(doc.id as keyof FormData)}
                                            className={isUploaded ? "text-destructive hover:text-destructive hover:bg-destructive/10" : ""}
                                        >
                                            {isUploaded ? "Remove" : "Upload"}
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* STEP 4: PAYOUT SETUP */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="flex gap-4 p-1 bg-muted rounded-xl">
                                <button
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${formData.paymentMethod === "bKash" ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground'}`}
                                    onClick={() => { updateField("paymentMethod", "bKash"); setIsPayoutVerified(false); }}
                                >
                                    bKash Merchant
                                </button>
                                <button
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${formData.paymentMethod === "Bank Transfer" ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground'}`}
                                    onClick={() => { updateField("paymentMethod", "Bank Transfer"); setIsPayoutVerified(false); }}
                                >
                                    Bank Transfer
                                </button>
                            </div>
                            {errors.paymentMethod && <p className="text-sm text-destructive font-bold text-center mt-2">{errors.paymentMethod}</p>}

                            <AnimatePresence mode="popLayout">
                                {formData.paymentMethod === "bKash" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center gap-2 mb-2 p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                                            <DollarSign className="w-5 h-5 text-pink-500 shrink-0" />
                                            <p className="text-xs font-semibold text-pink-500">Must be a registered bKash Merchant or Personal Retail Account</p>
                                        </div>

                                        <label className="flex items-center gap-2 text-sm text-foreground my-4 p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                                                checked={formData.sameAsBusinessPhone}
                                                onChange={(e) => updateField("sameAsBusinessPhone", e.target.checked)}
                                            />
                                            Same as business phone number
                                        </label>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">bKash Account Number</label>
                                            <input
                                                type="tel"
                                                placeholder="01XXXXXXXXX"
                                                disabled={formData.sameAsBusinessPhone}
                                                className={`w-full h-12 px-4 rounded-xl border ${formData.sameAsBusinessPhone ? 'bg-muted/50 text-muted-foreground' : 'bg-muted text-foreground'} ${errors.bkashNumber ? 'border-destructive' : 'border-border'} focus:ring-2 focus:ring-primary/50 outline-none font-mono`}
                                                value={formData.bkashNumber}
                                                onChange={(e) => updateField("bkashNumber", e.target.value)}
                                            />
                                            {errors.bkashNumber && <p className="text-xs text-destructive">{errors.bkashNumber}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Account Holder Name</label>
                                            <input
                                                type="text"
                                                placeholder="Name matching the account"
                                                className={`w-full h-12 px-4 rounded-xl bg-muted border ${errors.bkashName ? 'border-destructive' : 'border-border'} text-foreground focus:ring-2 focus:ring-primary/50 outline-none uppercase`}
                                                value={formData.bkashName}
                                                onChange={(e) => updateField("bkashName", e.target.value.toUpperCase())}
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {formData.paymentMethod === "Bank Transfer" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Bank Name</label>
                                            <select
                                                className={`w-full h-12 px-4 rounded-xl bg-muted border ${errors.bankName ? 'border-destructive' : 'border-border'} text-foreground focus:ring-2 focus:ring-primary/50 outline-none`}
                                                value={formData.bankName}
                                                onChange={(e) => updateField("bankName", e.target.value)}
                                            >
                                                <option value="" disabled>Select Bank</option>
                                                {BANK_NAMES.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Account Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g SULTANS DINE LTD"
                                                className={`w-full h-12 px-4 rounded-xl bg-muted border ${errors.bankAccountName ? 'border-destructive' : 'border-border'} text-foreground focus:ring-2 focus:ring-primary/50 outline-none uppercase`}
                                                value={formData.bankAccountName}
                                                onChange={(e) => updateField("bankAccountName", e.target.value.toUpperCase())}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Account Number</label>
                                            <input
                                                type="text"
                                                placeholder="xxxxxxxxxxxx"
                                                className={`w-full h-12 px-4 rounded-xl bg-muted border ${errors.bankAccountNumber ? 'border-destructive' : 'border-border'} text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-mono tracking-wider`}
                                                value={formData.bankAccountNumber}
                                                onChange={(e) => updateField("bankAccountNumber", e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Branch Name</label>
                                            <input
                                                type="text"
                                                placeholder="Gulshan Branch"
                                                className={`w-full h-12 px-4 rounded-xl bg-muted border ${errors.bankBranch ? 'border-destructive' : 'border-border'} text-foreground focus:ring-2 focus:ring-primary/50 outline-none`}
                                                value={formData.bankBranch}
                                                onChange={(e) => updateField("bankBranch", e.target.value)}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {formData.paymentMethod && (
                                <div className="pt-4">
                                    {!isPayoutVerified ? (
                                        <Button
                                            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                                            onClick={handleVerifyPayout}
                                            disabled={isVerifyingPayout}
                                        >
                                            {isVerifyingPayout ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Setup"}
                                        </Button>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 py-3 bg-secondary/20 border border-secondary/50 rounded-xl text-secondary font-bold">
                                            <CheckCircle2 className="w-5 h-5" />
                                            Setup Verified
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}


                    {/* STEP 5: REVIEW */}
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            {/* Confetti Explosion (Render conditionally if success) */}
                            {isSuccess && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 1], rotate: [0, 45, -10, 0] }} transition={{ duration: 0.8 }}>
                                        <PartyPopper className="w-32 h-32 text-secondary" />
                                    </motion.div>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-foreground">Almost done!</h2>
                                <p className="text-muted-foreground text-sm mt-1">Please review your application details.</p>
                            </div>

                            <div className="space-y-4">
                                {/* Summary Section 1 */}
                                <div className="bg-muted border border-border p-4 rounded-xl relative">
                                    <button onClick={() => setCurrentStep(1)} className="absolute top-4 right-4 p-2 bg-background rounded-md text-muted-foreground hover:text-primary transition-colors">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <h3 className="font-bold text-foreground text-sm mb-3 uppercase tracking-wider">Business Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-muted-foreground">Name:</span> <span className="font-semibold text-foreground float-right">{formData.restaurantName}</span></p>
                                        <p><span className="text-muted-foreground">Type:</span> <span className="font-semibold text-foreground float-right">{formData.businessType}</span></p>
                                        <p><span className="text-muted-foreground">Area:</span> <span className="font-semibold text-foreground float-right">{formData.area}</span></p>
                                        <p className="text-muted-foreground border-t border-border/50 pt-2 mt-2">{formData.detailedAddress}</p>
                                    </div>
                                </div>

                                {/* Summary Section 2 */}
                                <div className="bg-muted border border-border p-4 rounded-xl relative">
                                    <button onClick={() => setCurrentStep(2)} className="absolute top-4 right-4 p-2 bg-background rounded-md text-muted-foreground hover:text-primary transition-colors">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <h3 className="font-bold text-foreground text-sm mb-3 uppercase tracking-wider">Legal Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-muted-foreground">Trade License:</span> <span className="font-mono font-bold text-foreground float-right">{formData.tradeLicense}</span></p>
                                        <p><span className="text-muted-foreground">Phone:</span> <span className="font-mono font-bold text-foreground float-right">{formData.businessPhone}</span></p>
                                        <p><span className="text-muted-foreground">Docs Uploaded:</span> <span className="text-secondary font-bold float-right flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> 4/4</span></p>
                                    </div>
                                </div>

                                {/* Summary Section 4 */}
                                <div className="bg-muted border border-border p-4 rounded-xl relative">
                                    <button onClick={() => setCurrentStep(4)} className="absolute top-4 right-4 p-2 bg-background rounded-md text-muted-foreground hover:text-primary transition-colors">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <h3 className="font-bold text-foreground text-sm mb-3 uppercase tracking-wider">Payout Setup</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-muted-foreground">Method:</span> <span className="font-bold text-foreground float-right">{formData.paymentMethod}</span></p>
                                        {formData.paymentMethod === "bKash" && (
                                            <p><span className="text-muted-foreground">Account:</span> <span className="font-mono font-bold text-foreground float-right">{formData.bkashNumber}</span></p>
                                        )}
                                        {formData.paymentMethod === "Bank Transfer" && (
                                            <>
                                                <p><span className="text-muted-foreground">Bank:</span> <span className="font-bold text-foreground float-right truncate max-w-[150px]">{formData.bankName}</span></p>
                                                <p><span className="text-muted-foreground">A/C No:</span> <span className="font-mono font-bold text-foreground float-right">{formData.bankAccountNumber.slice(-4).padStart(formData.bankAccountNumber.length, "*")}</span></p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <label className={`flex items-start gap-3 mt-6 p-4 border rounded-xl cursor-pointer transition-colors ${errors.agreedToTerms ? 'border-destructive bg-destructive/5' : 'border-border bg-card'}`}>
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-5 h-5 rounded text-primary focus:ring-primary accent-primary shrink-0"
                                        checked={formData.agreedToTerms}
                                        onChange={(e) => updateField("agreedToTerms", e.target.checked)}
                                    />
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        By submitting this application, I confirm that all provided information is accurate. I agree to NightBite's <a href="#" className="text-primary hover:underline">Partner Terms of Service</a> and understand that misrepresentation may lead to account termination.
                                    </p>
                                </label>
                            </div>

                        </div>
                    )}
                </motion.div>

                {/* Action Footer */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border z-40 lg:static lg:bg-transparent lg:border-none lg:p-0 lg:mt-6">
                    <div className="max-w-xl mx-auto flex gap-3">
                        {currentStep > 1 && (
                            <Button variant="outline" size="xl" className="w-1/3 bg-card" onClick={handleBack} disabled={isSubmitting || isSuccess}>
                                Back
                            </Button>
                        )}

                        {currentStep < totalSteps ? (
                            <Button variant="amber" size="xl" className="flex-1 group" onClick={handleNext}>
                                Next
                                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        ) : (
                            <Button
                                variant="amber"
                                size="xl"
                                className={`flex-1 transition-all overflow-hidden relative ${isSuccess ? 'bg-secondary text-secondary-foreground hover:bg-secondary' : ''}`}
                                onClick={handleSubmit}
                                disabled={isSubmitting || isSuccess || !formData.agreedToTerms}
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
                                ) : isSuccess ? (
                                    <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="flex items-center gap-2 font-bold">
                                        <CheckCircle2 className="w-5 h-5" /> Application Received!
                                    </motion.div>
                                ) : (
                                    <span className="font-bold text-lg">Submit Application</span>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PartnerRegisterScreen;
