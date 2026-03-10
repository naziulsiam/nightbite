import apiClient from '@/api/client';
import type { Order, ApiResponse } from '@/types';

export interface CreateOrderData {
  restaurantId: string;
  boxes: number;
  pickupTime: string;
  paymentMethod: 'cash' | 'card' | 'bkash' | 'nagad';
  notes?: string;
}

export const orderService = {
  // Create new order
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    const { data } = await apiClient.post<ApiResponse<Order>>('/orders', orderData);
    return data.data;
  },

  // Get user's orders
  getMyOrders: async (status?: string): Promise<Order[]> => {
    const params = status ? `?status=${status}` : '';
    const { data } = await apiClient.get<ApiResponse<Order[]>>(`/orders/my${params}`);
    return data.data;
  },

  // Get order by ID
  getOrder: async (orderId: string): Promise<Order> => {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return data.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string, reason?: string): Promise<Order> => {
    const { data } = await apiClient.post<ApiResponse<Order>>(`/orders/${orderId}/cancel`, { reason });
    return data.data;
  },

  // Verify pickup
  verifyPickup: async (orderId: string, code: string): Promise<Order> => {
    const { data } = await apiClient.post<ApiResponse<Order>>(`/orders/${orderId}/verify`, { code });
    return data.data;
  },

  // Get active order (if any)
  getActiveOrder: async (): Promise<Order | null> => {
    try {
      const { data } = await apiClient.get<ApiResponse<Order>>('/orders/active');
      return data.data;
    } catch {
      return null;
    }
  },

  // Rate order
  rateOrder: async (orderId: string, rating: number, review?: string): Promise<void> => {
    await apiClient.post(`/orders/${orderId}/rate`, { rating, review });
  },
};
