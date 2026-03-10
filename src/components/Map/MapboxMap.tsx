import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Restaurant } from '@/types';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

interface MapboxMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  restaurants?: Restaurant[];
  onRestaurantClick?: (restaurant: Restaurant) => void;
  showUserLocation?: boolean;
  className?: string;
}

export const MapboxMap = ({
  center = { lat: 23.8103, lng: 90.4125 }, // Dhaka default
  zoom = 13,
  restaurants = [],
  onRestaurantClick,
  showUserLocation = true,
  className = '',
}: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    if (!MAPBOX_TOKEN) {
      console.warn('Mapbox token not configured');
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [center.lng, center.lat],
      zoom,
      attributionControl: false,
    });

    map.current.on('load', () => {
      setIsLoading(false);
      
      // Add navigation controls
      map.current?.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'bottom-right'
      );
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [center.lat, center.lng, zoom]);

  // Get user location
  useEffect(() => {
    if (!showUserLocation || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Center map on user location
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 14,
          essential: true,
        });

        // Add user location marker
        const el = document.createElement('div');
        el.className = 'user-location-marker';
        el.innerHTML = `
          <div class="relative">
            <div class="absolute w-24 h-24 bg-blue-500/10 rounded-full animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
            <div class="absolute w-12 h-12 bg-blue-500/30 rounded-full animate-ping -translate-x-1/2 -translate-y-1/2"></div>
            <div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full relative z-10"></div>
          </div>
        `;

        new mapboxgl.Marker(el)
          .setLngLat([longitude, latitude])
          .addTo(map.current!);
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [showUserLocation]);

  // Update restaurant markers
  useEffect(() => {
    if (!map.current || isLoading) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add restaurant markers
    restaurants.forEach((restaurant) => {
      if (!restaurant.coordinates) return;

      const el = document.createElement('div');
      el.className = 'restaurant-marker cursor-pointer';
      el.innerHTML = `
        <div class="bg-background text-foreground text-xs font-bold px-2 py-1.5 rounded-xl shadow-lg border border-border whitespace-nowrap transform -translate-x-1/2 -translate-y-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors flex flex-col items-center">
          <div class="flex items-center gap-1">
            <span class="text-destructive">৳</span>${restaurant.nightbitePrice}
          </div>
          <span class="text-[9px] font-medium text-muted-foreground truncate max-w-[80px]">${restaurant.name}</span>
        </div>
        <div class="w-2 h-2 bg-foreground rounded-full mx-auto -mt-2 shadow-sm opacity-50"></div>
      `;

      el.addEventListener('click', () => {
        onRestaurantClick?.(restaurant);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([restaurant.coordinates.lng, restaurant.coordinates.lat])
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [restaurants, isLoading, onRestaurantClick]);

  const handleCenterOnUser = () => {
    if (userLocation && map.current) {
      map.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 15,
        essential: true,
      });
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className={`relative w-full h-[60vh] bg-muted/30 rounded-3xl border border-border overflow-hidden flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Map configuration missing</p>
          <p className="text-xs text-muted-foreground mt-1">Add VITE_MAPBOX_ACCESS_TOKEN to your .env</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-[60vh] rounded-3xl overflow-hidden" />
      
      {isLoading && (
        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center rounded-3xl">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {showUserLocation && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-4 right-4 shadow-lg"
          onClick={handleCenterOnUser}
        >
          <Navigation className="w-4 h-4 text-blue-500" />
        </Button>
      )}
    </div>
  );
};

export default MapboxMap;
