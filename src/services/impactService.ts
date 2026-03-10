import apiClient from '@/api/client';
import type { Impact, ApiResponse } from '@/types';

export const impactService = {
  // Get user's impact stats
  getImpact: async (): Promise<Impact> => {
    const { data } = await apiClient.get<ApiResponse<Impact>>('/users/impact');
    return data.data;
  },

  // Get leaderboard
  getLeaderboard: async (period: 'week' | 'month' | 'all' = 'month'): Promise<{
    users: Array<{
      id: string;
      name: string;
      avatar?: string;
      mealsSaved: number;
      rank: number;
    }>;
    myRank?: number;
  }> => {
    const { data } = await apiClient.get<ApiResponse<{
      users: Array<{
        id: string;
        name: string;
        avatar?: string;
        mealsSaved: number;
        rank: number;
      }>;
      myRank?: number;
    }>>(`/leaderboard?period=${period}`);
    return data.data;
  },

  // Get community stats
  getCommunityStats: async (): Promise<{
    totalMealsSaved: number;
    totalMoneySaved: number;
    totalCO2Prevented: number;
    activeUsers: number;
    partnerCount: number;
  }> => {
    const { data } = await apiClient.get<ApiResponse<{
      totalMealsSaved: number;
      totalMoneySaved: number;
      totalCO2Prevented: number;
      activeUsers: number;
      partnerCount: number;
    }>>('/stats/community');
    return data.data;
  },
};
