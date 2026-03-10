import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantService } from '@/services/restaurantService';
import type { RestaurantFilters, Restaurant } from '@/types';

// Query keys
export const restaurantKeys = {
  all: ['restaurants'] as const,
  lists: () => [...restaurantKeys.all, 'list'] as const,
  list: (filters: RestaurantFilters | undefined) => [...restaurantKeys.lists(), filters] as const,
  details: () => [...restaurantKeys.all, 'detail'] as const,
  detail: (id: string) => [...restaurantKeys.details(), id] as const,
  featured: () => [...restaurantKeys.all, 'featured'] as const,
  nearby: (lat: number, lng: number, radius?: number) => 
    [...restaurantKeys.all, 'nearby', lat, lng, radius] as const,
  categories: () => [...restaurantKeys.all, 'categories'] as const,
  search: (query: string) => [...restaurantKeys.all, 'search', query] as const,
};

// Hook to fetch restaurants with filters
export const useRestaurants = (filters?: RestaurantFilters) => {
  return useQuery({
    queryKey: restaurantKeys.list(filters),
    queryFn: () => restaurantService.getRestaurants(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to fetch single restaurant
export const useRestaurant = (id: string) => {
  return useQuery({
    queryKey: restaurantKeys.detail(id),
    queryFn: () => restaurantService.getRestaurant(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
};

// Hook to fetch featured restaurants
export const useFeaturedRestaurants = () => {
  return useQuery({
    queryKey: restaurantKeys.featured(),
    queryFn: () => restaurantService.getFeatured(),
    staleTime: 1000 * 60 * 5,
  });
};

// Hook to fetch nearby restaurants
export const useNearbyRestaurants = (lat: number, lng: number, radius = 5, enabled = true) => {
  return useQuery({
    queryKey: restaurantKeys.nearby(lat, lng, radius),
    queryFn: () => restaurantService.getNearby(lat, lng, radius),
    enabled: enabled && !!lat && !!lng,
    staleTime: 1000 * 60 * 2,
  });
};

// Hook to fetch categories
export const useCategories = () => {
  return useQuery({
    queryKey: restaurantKeys.categories(),
    queryFn: () => restaurantService.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour - categories don't change often
  });
};

// Hook to search restaurants
export const useSearchRestaurants = (query: string) => {
  return useQuery({
    queryKey: restaurantKeys.search(query),
    queryFn: () => restaurantService.search(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60,
  });
};

// Hook to check restaurant availability
export const useAvailability = (restaurantId: string) => {
  return useQuery({
    queryKey: [...restaurantKeys.detail(restaurantId), 'availability'],
    queryFn: () => restaurantService.checkAvailability(restaurantId),
    enabled: !!restaurantId,
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
  });
};

// Hook for optimistic updates
export const useUpdateRestaurantInventory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, boxesLeft }: { id: string; boxesLeft: number }) => {
      // This would be an actual API call in production
      return { id, boxesLeft };
    },
    onMutate: async ({ id, boxesLeft }) => {
      await queryClient.cancelQueries({ queryKey: restaurantKeys.detail(id) });
      
      const previousRestaurant = queryClient.getQueryData<Restaurant>(
        restaurantKeys.detail(id)
      );
      
      if (previousRestaurant) {
        queryClient.setQueryData(restaurantKeys.detail(id), {
          ...previousRestaurant,
          boxesLeft,
        });
      }
      
      return { previousRestaurant };
    },
    onError: (err, variables, context) => {
      if (context?.previousRestaurant) {
        queryClient.setQueryData(
          restaurantKeys.detail(variables.id),
          context.previousRestaurant
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.detail(variables.id) });
    },
  });
};
