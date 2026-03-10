import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, type CreateOrderData } from '@/services/orderService';
import { toast } from '@/hooks/use-toast';
import type { Order } from '@/types';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: { status?: string }) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  active: () => [...orderKeys.all, 'active'] as const,
};

// Hook to fetch user's orders
export const useOrders = (status?: string) => {
  return useQuery({
    queryKey: orderKeys.list({ status }),
    queryFn: () => orderService.getMyOrders(status),
    staleTime: 1000 * 30, // 30 seconds
  });
};

// Hook to fetch single order
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
};

// Hook to get active order
export const useActiveOrder = () => {
  return useQuery({
    queryKey: orderKeys.active(),
    queryFn: () => orderService.getActiveOrder(),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30, // Refetch every 30s to check status
  });
};

// Hook to create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateOrderData) => orderService.createOrder(data),
    onSuccess: (data) => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      // Set the new order in cache
      queryClient.setQueryData(orderKeys.detail(data.id), data);
      queryClient.setQueryData(orderKeys.active(), data);
      
      toast({
        title: 'Order Placed!',
        description: `Your reservation at ${data.restaurant?.name} is confirmed.`,
      });
    },
    onError: (error: { message?: string }) => {
      toast({
        title: 'Order Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

// Hook to cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      orderService.cancelOrder(orderId, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
      queryClient.setQueryData(orderKeys.active(), null);
      
      toast({
        title: 'Order Cancelled',
        description: 'Your reservation has been cancelled.',
      });
    },
    onError: (error: { message?: string }) => {
      toast({
        title: 'Cancel Failed',
        description: error.message || 'Unable to cancel order.',
        variant: 'destructive',
      });
    },
  });
};

// Hook to verify pickup
export const useVerifyPickup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, code }: { orderId: string; code: string }) =>
      orderService.verifyPickup(orderId, code),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
      queryClient.setQueryData(orderKeys.active(), null);
      
      toast({
        title: 'Pickup Verified!',
        description: 'Enjoy your mystery box!',
      });
    },
    onError: (error: { message?: string }) => {
      toast({
        title: 'Invalid Code',
        description: error.message || 'Please check your pickup code.',
        variant: 'destructive',
      });
    },
  });
};

// Hook to rate order
export const useRateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, rating, review }: { orderId: string; rating: number; review?: string }) =>
      orderService.rateOrder(orderId, rating, review),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      
      toast({
        title: 'Thanks for rating!',
        description: 'Your feedback helps us improve.',
      });
    },
  });
};
