import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Navigation } from "lucide-react";
import { locations } from "@/data/mockData";

const LocationScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(false);

  const filteredLocations = locations.filter((l) =>
    l.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    navigate("/app/home");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12 flex flex-col">
      <motion.div
        className="flex-1 flex flex-col gap-8 max-w-sm mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Map illustration area */}
        <motion.div
          className="glass-card p-8 flex flex-col items-center gap-4 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <motion.div
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <MapPin className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="text-xl font-bold text-foreground text-center">
              Find NightBite Near You
            </h2>
            <p className="text-muted-foreground text-sm text-center">
              Enable location to discover mystery boxes from restaurants nearby in Dhaka
            </p>
          </div>
        </motion.div>

        {/* Auto-detect button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant={locationEnabled ? "eco" : "amber-outline"}
            size="lg"
            className="w-full"
            onClick={() => {
              setLocationEnabled(true);
              setSelectedLocation("Gulshan");
            }}
          >
            <Navigation className="w-4 h-4" />
            {locationEnabled ? "Location: Gulshan, Dhaka" : "Use My Current Location"}
          </Button>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-xs">or search manually</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Search */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search area (e.g., Gulshan, Banani...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </motion.div>

        {/* Location chips */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredLocations.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setSelectedLocation(loc);
                setLocationEnabled(true);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedLocation === loc
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {loc}
            </button>
          ))}
        </motion.div>

        {/* Continue */}
        <motion.div
          className="mt-auto pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="amber"
            size="xl"
            className="w-full"
            onClick={handleContinue}
            disabled={!selectedLocation}
          >
            Continue to NightBite
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LocationScreen;
