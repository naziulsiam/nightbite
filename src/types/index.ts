// User Types
export type UserRole = 'consumer' | 'partner' | 'admin';
export type PartnerStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  avatar?: string;
  roles: UserRole[];
  activeRole: UserRole;
  partnerStatus: PartnerStatus;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  nameBn: string;
  cuisine: string;
  category: string;
  location: string;
  locationBn: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  originalPrice: number;
  nightbitePrice: number;
  distance?: string;
  distanceKm?: number;
  pickupStart: string;
  pickupEnd: string;
  boxesLeft: number;
  totalBoxes: number;
  mysteryItems: string[];
  allergens: string[];
  isFeatured: boolean;
  socialProof: number;
  isRamadanSpecial?: boolean;
  isNew?: boolean;
  walkTime?: string;
  isOpen: boolean;
  partnerId: string;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'picked_up' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurant?: Restaurant;
  boxes: number;
  total: number;
  status: OrderStatus;
  pickupCode: string;
  pickupTime: string;
  paymentMethod: 'cash' | 'card' | 'bkash' | 'nagad';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  id: string;
  label: string;
  labelBn: string;
  icon?: string;
  sortOrder: number;
}

// Partner Application Types
export interface PartnerApplication {
  id: string;
  restaurantName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  businessType: string;
  fssLicense: string;
  tradeLicense: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// Impact Types
export interface Impact {
  mealsSaved: number;
  moneySaved: number;
  co2Prevented: number;
  orderStreak: number;
  totalOrders: number;
  rank?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'order' | 'promotion' | 'system' | 'partner';
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  status: number;
  message: string;
  data?: Record<string, unknown>;
}

// Filter Types
export interface RestaurantFilters {
  category?: string;
  location?: string;
  maxDistance?: number;
  minPrice?: number;
  maxPrice?: number;
  isOpen?: boolean;
  sortBy?: 'distance' | 'price' | 'rating' | 'newest';
  lat?: number;
  lng?: number;
}

// WebSocket Types
export interface WSMessage {
  type: 'inventory_update' | 'new_order' | 'order_status' | 'notification' | 'ping';
  payload: unknown;
  timestamp: number;
}
