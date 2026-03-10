import apiClient from '@/api/client';
import type { User, ApiResponse } from '@/types';

export const authService = {
  // Send OTP to phone
  sendOTP: async (phone: string): Promise<void> => {
    await apiClient.post('/auth/otp/send', { phone });
  },

  // Verify OTP
  verifyOTP: async (phone: string, otp: string): Promise<{ user: User; token: string; refreshToken: string }> => {
    const { data } = await apiClient.post<ApiResponse<{
      user: User;
      token: string;
      refreshToken: string;
    }>>('/auth/otp/verify', { phone, otp });
    return data.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    const { data } = await apiClient.post<ApiResponse<{
      token: string;
      refreshToken: string;
    }>>('/auth/refresh', { refreshToken });
    return data.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/users/me');
    return data.data;
  },

  // Update user profile
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const { data } = await apiClient.patch<ApiResponse<User>>('/users/me', updates);
    return data.data;
  },

  // Set user role
  setRole: async (role: string): Promise<User> => {
    const { data } = await apiClient.post<ApiResponse<User>>('/users/role', { role });
    return data.data;
  },

  // Submit partner application
  submitPartnerApplication: async (applicationData: {
    restaurantName: string;
    ownerName: string;
    phone: string;
    email: string;
    address: string;
    businessType: string;
    fssLicense: string;
    tradeLicense: string;
  }): Promise<void> => {
    await apiClient.post('/partners/apply', applicationData);
  },

  // Check partner application status
  getPartnerStatus: async (): Promise<{ status: string; rejectionReason?: string }> => {
    const { data } = await apiClient.get<ApiResponse<{ status: string; rejectionReason?: string }>>('/partners/status');
    return data.data;
  },
};
