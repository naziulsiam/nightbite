import apiClient from '@/api/client';
import type { Restaurant, Category, ApiResponse, RestaurantFilters } from '@/types';

export const restaurantService = {
  // Get all restaurants with filters
  getRestaurants: async (filters?: RestaurantFilters): Promise<{
    restaurants: Restaurant[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const { data } = await apiClient.get<ApiResponse<{
      restaurants: Restaurant[];
      total: number;
      page: number;
      totalPages: number;
    }>>(`/restaurants?${params.toString()}`);
    
    return data.data;
  },

  // Get restaurant by ID
  getRestaurant: async (id: string): Promise<Restaurant> => {
    const { data } = await apiClient.get<ApiResponse<Restaurant>>(`/restaurants/${id}`);
    return data.data;
  },

  // Get featured restaurants
  getFeatured: async (): Promise<Restaurant[]> => {
    const { data } = await apiClient.get<ApiResponse<Restaurant[]>>('/restaurants/featured');
    return data.data;
  },

  // Get nearby restaurants
  getNearby: async (lat: number, lng: number, radius = 5): Promise<Restaurant[]> => {
    const { data } = await apiClient.get<ApiResponse<Restaurant[]>>(
      `/restaurants/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    return data.data;
  },

  // Get categories
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },

  // Get locations
  getLocations: async (): Promise<string[]> => {
    const { data } = await apiClient.get<ApiResponse<string[]>>('/locations');
    return data.data;
  },

  // Search restaurants
  search: async (query: string): Promise<Restaurant[]> => {
    const { data } = await apiClient.get<ApiResponse<Restaurant[]>>(`/restaurants/search?q=${encodeURIComponent(query)}`);
    return data.data;
  },

  // Check availability
  checkAvailability: async (restaurantId: string): Promise<{
    boxesLeft: number;
    isOpen: boolean;
    nextAvailable?: string;
  }> => {
    const { data } = await apiClient.get<ApiResponse<{
      boxesLeft: number;
      isOpen: boolean;
      nextAvailable?: string;
    }>>(`/restaurants/${restaurantId}/availability`);
    return data.data;
  },
};
