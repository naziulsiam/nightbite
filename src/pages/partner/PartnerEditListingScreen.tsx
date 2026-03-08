import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Clock, Loader2, Save, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ALLERGENS = ["Nuts", "Dairy", "Gluten", "Shellfish", "Eggs", "Vegan", "Vegetarian"];
const CATEGORIES = ["Biryani", "Bakery", "Sweets", "Fast Food", "Mixed", "Groceries"];

const PartnerEditListingScreen = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // If id exists, we're editing
    const isEditing = !!id;

    const [form, setForm] = useState({
        title: isEditing ? "Surprise Biryani Box" : "",
        category: "Mixed",
        description: isEditing ? "Contains 2 portions of kacchi biryani" : "",
        originalPrice: isEditing ? 400 : 0,
        discountPrice: isEditing ? 199 : 0,
        quantity: isEditing ? 10 : 1,
        allergens: [] as string[],
        pickupStart: "20:30",
        pickupEnd: "22:00",
        buffer: "30min"
    });

    const [images, setImages] = useState<string[]>([isEditing ? "/src/assets/biryani.jpg" : ""]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAllergenToggle = (allergen: string) => {
        setForm(prev => ({
            ...prev,
            allergens: prev.allergens.includes(allergen)
                ? prev.allergens.filter(a => a !== allergen)
                : [...prev.allergens, allergen]
        }));
    };

    const handleSave = (status: "active" | "draft") => {
        if (!form.title || !form.originalPrice || !form.discountPrice) {
            toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast({ title: "Success", description: `Listing ${isEditing ? 'updated' : 'created'} successfully.` });
            navigate("/partner/listings");
        }, 1000);
    };

    const discountPercentage = form.originalPrice > 0
        ? Math.round((1 - form.discountPrice / form.originalPrice) * 100)
        : 0;

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-0">
            <header className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-foreground hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                    {isEditing ? "Edit Listing" : "Create New Box"}
                </h1>
            </header>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                {/* Images */}
                <div className="glass-card p-4 md:p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold text-foreground mb-4">Photos</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {images.filter(Boolean).map((img, idx) => (
                            <div key={idx} className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-xl overflow-hidden border border-border group">
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setImages([])} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs">Remove</button>
                            </div>
                        ))}
                        {images.filter(Boolean).length < 3 && (
                            <button type="button" onClick={() => setImages(["/src/assets/fastfood.jpg"])} className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                                <Upload className="w-6 h-6 mb-2" />
                                <span className="text-xs font-bold">Add Photo</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Basic Info */}
                <div className="glass-card p-4 md:p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold text-foreground mb-4">Box Details</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Box Name *</label>
                        <input
                            type="text" placeholder="e.g Chef's Surprise Dinner"
                            className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                            value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            placeholder="May include: 2 pcs chicken biryani, 1 naan, salad..."
                            className="w-full min-h-[100px] p-4 rounded-xl bg-muted border border-border text-foreground focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Dietary & Allergens</label>
                        <div className="flex flex-wrap gap-2">
                            {ALLERGENS.map(a => (
                                <button
                                    key={a} type="button"
                                    onClick={() => handleAllergenToggle(a)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${form.allergens.includes(a) ? 'bg-primary/20 border-primary text-primary' : 'bg-background border-border text-muted-foreground hover:bg-muted'}`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pricing & Quantity */}
                <div className="glass-card p-4 md:p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold text-foreground mb-4">Pricing & Quantity</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Original Price (৳)</label>
                            <input
                                type="number" placeholder="500"
                                className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                value={form.originalPrice || ""} onChange={e => setForm({ ...form, originalPrice: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-emerald-500">NightBite Price (৳)</label>
                            <input
                                type="number" placeholder="150"
                                className="w-full h-11 px-4 rounded-xl bg-primary/10 border border-primary/30 text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                value={form.discountPrice || ""} onChange={e => setForm({ ...form, discountPrice: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-sm font-medium">Quantity</label>
                            <div className="flex items-center border border-border bg-muted rounded-xl h-11 overflow-hidden">
                                <button type="button" onClick={() => setForm(p => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))} className="w-11 h-full flex items-center justify-center font-bold text-xl hover:bg-border/50">-</button>
                                <div className="flex-1 text-center font-bold">{form.quantity}</div>
                                <button type="button" onClick={() => setForm(p => ({ ...p, quantity: p.quantity + 1 }))} className="w-11 h-full flex items-center justify-center font-bold text-xl hover:bg-border/50">+</button>
                            </div>
                        </div>
                    </div>
                    {discountPercentage > 0 && (
                        <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center gap-2">
                            <Check className="w-5 h-5 text-secondary" />
                            <p className="text-sm font-bold text-secondary">Great! You are offering a {discountPercentage}% discount.</p>
                        </div>
                    )}
                </div>

                {/* Pickup Window */}
                <div className="glass-card p-4 md:p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-foreground">Pickup Window</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Starts At</label>
                            <input type="time" className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground focus:ring-2 focus:ring-primary/50 outline-none" value={form.pickupStart} onChange={e => setForm({ ...form, pickupStart: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ends At</label>
                            <input type="time" className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground focus:ring-2 focus:ring-primary/50 outline-none" value={form.pickupEnd} onChange={e => setForm({ ...form, pickupEnd: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2 pt-2">
                        <label className="text-sm font-medium text-muted-foreground">Preparation Buffer (before start)</label>
                        <select className="w-full h-11 px-4 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/50 outline-none" value={form.buffer} onChange={e => setForm({ ...form, buffer: e.target.value })}>
                            <option value="15min">15 Minutes</option>
                            <option value="30min">30 Minutes</option>
                            <option value="1hour">1 Hour</option>
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse md:flex-row gap-3 pt-4">
                    <Button type="button" variant="outline" className="w-full md:w-auto bg-card" onClick={() => handleSave("draft")} disabled={isSubmitting}>
                        <Save className="w-4 h-4 mr-2" /> Save to Drafts
                    </Button>
                    <div className="flex gap-3 w-full md:w-auto md:ml-auto">
                        <Button type="button" variant="outline" className="flex-1 md:w-auto text-primary hover:text-primary border-primary/20 hover:bg-primary/10">
                            <Eye className="w-4 h-4 mr-2" /> Preview
                        </Button>
                        <Button type="button" variant="emerald" className="flex-[2] md:w-auto" onClick={() => handleSave("active")} disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Publish Now"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PartnerEditListingScreen;
