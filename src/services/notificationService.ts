import apiClient from '@/api/client';
import type { Notification, ApiResponse } from '@/types';

export const notificationService = {
  // Get user's notifications
  getNotifications: async (page = 1, limit = 20): Promise<{
    notifications: Notification[];
    unreadCount: number;
    total: number;
  }> => {
    const { data } = await apiClient.get<ApiResponse<{
      notifications: Notification[];
      unreadCount: number;
      total: number;
    }>>(`/notifications?page=${page}&limit=${limit}`);
    return data.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  // Mark all as read
  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`);
  },

  // Register push token (for mobile/push notifications)
  registerPushToken: async (token: string): Promise<void> => {
    await apiClient.post('/notifications/push-token', { token });
  },
};
