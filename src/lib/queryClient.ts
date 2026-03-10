import { QueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
      retry: (failureCount, error: { status?: number }) => {
        // Don't retry on 401/403 errors
        if (error?.status === 401 || error?.status === 403) return false;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: { message?: string }) => {
        toast({
          title: 'Error',
          description: error.message || 'Something went wrong',
          variant: 'destructive',
        });
      },
    },
  },
});
