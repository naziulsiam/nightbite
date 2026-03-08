import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp, TrendingDown, Package, Clock, Star,
  Plus, ChefHat, Eye, ArrowRight, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

const RestaurantDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden md:flex bg-card">
            <Eye className="w-4 h-4 mr-2" /> View Public Profile
          </Button>
          <Button variant="emerald" onClick={() => navigate("/partner/listings/new")} className="w-full md:w-auto shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" /> Add New Box
          </Button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
          <p className="text-sm text-muted-foreground font-medium mb-1">Today's Revenue</p>
          <h3 className="text-2xl font-bold text-foreground">৳2,450</h3>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-500">
            <TrendingUp className="w-3 h-3" /> +12% from yesterday
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
          <p className="text-sm text-muted-foreground font-medium mb-1">Boxes Sold</p>
          <h3 className="text-2xl font-bold text-foreground">14</h3>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-secondary">
            <Clock className="w-3 h-3" /> 3 pending pickup
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
          <p className="text-sm text-muted-foreground font-medium mb-1">Active Listings</p>
          <h3 className="text-2xl font-bold text-foreground">3</h3>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-amber-500">
            <Package className="w-3 h-3" /> 2 ending soon
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
          <p className="text-sm text-muted-foreground font-medium mb-1">Rating</p>
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            4.8 <Star className="w-5 h-5 fill-secondary text-secondary" />
          </h3>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-muted-foreground">
            Based on 42 reviews
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </div>
              Live Activity
            </h2>
            <Link to="/partner/orders" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="glass-card rounded-2xl p-0 divide-y divide-border/50">
            {/* Feed Item */}
            <div className="p-4 flex gap-4 hover:bg-muted/30 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium truncate">New order: <span className="font-bold">2x Dinner Box</span></p>
                <p className="text-xs text-muted-foreground mt-1 text-primary">৳398 • Order #NB8392</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">2 min ago</span>
            </div>
            {/* Feed Item */}
            <div className="p-4 flex gap-4 hover:bg-muted/30 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium truncate">Payment processed successfully</p>
                <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-mono">৳1,250 to bKash</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">1 hour ago</span>
            </div>
            {/* Feed Item */}
            <div className="p-4 flex gap-4 hover:bg-muted/30 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0 group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium truncate">Pickup completed: <span className="font-bold">Order #NB1234</span></p>
                <p className="text-xs text-muted-foreground mt-1">Customer verified via QR.</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">3 hours ago</span>
            </div>
            {/* Feed Item */}
            <div className="p-4 flex gap-4 hover:bg-muted/30 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium truncate">Low stock alert</p>
                <p className="text-xs text-muted-foreground mt-1 text-amber-500">Only 1 Biryani Box left.</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">5 hours ago</span>
            </div>
          </div>
        </div>

        {/* Tonight's Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Tonight's Preview</h2>
            <Link to="/partner/listings" className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors">
              Manage
            </Link>
          </div>
          <div className="grid gap-3">
            {/* Preview Item */}
            <div className="glass-card p-3 rounded-2xl flex gap-3 items-center group cursor-pointer hover:border-primary/50 transition-colors">
              <img src="/src/assets/biryani.jpg" className="w-16 h-16 rounded-xl object-cover" alt="Biryani" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">Surprise Biryani Box</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-semibold text-secondary">৳199</span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md font-medium">Qty: 5/10</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Pickup starts in <span className="font-bold text-foreground">2h 30m</span>
                </p>
              </div>
            </div>
            {/* Preview Item */}
            <div className="glass-card p-3 rounded-2xl flex gap-3 items-center group cursor-pointer hover:border-primary/50 transition-colors">
              <img src="/src/assets/bakery.jpg" className="w-16 h-16 rounded-xl object-cover" alt="Bakery" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">End of Day Pastries</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-semibold text-secondary">৳150</span>
                  <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-md font-bold">Qty: 1/5</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Pickup started <span className="font-bold text-foreground">30m ago</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mt-6 text-center">
            <ChefHat className="w-8 h-8 text-primary mx-auto mb-2 opacity-80" />
            <h4 className="font-bold text-sm text-primary mb-1">Boost your sales</h4>
            <p className="text-xs text-primary/80">Listings created before 4 PM perform 3x better.</p>
            <Button variant="emerald" size="sm" className="w-full mt-3 h-8 shadow-md">
              Create Early Listing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
