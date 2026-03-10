import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

// Query key
const authKeys = {
  user: ['auth', 'user'] as const,
};

// Hook to get current user
export const useUser = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.user,
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated && !user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to send OTP
export const useSendOTP = () => {
  const { login } = useAuthStore();
  
  return useMutation({
    mutationFn: (phone: string) => authService.sendOTP(phone),
    onMutate: (phone) => {
      // Store phone temporarily for verification
      sessionStorage.setItem('pendingPhone', phone);
    },
  });
};

// Hook to verify OTP
export const useVerifyOTP = () => {
  const queryClient = useQueryClient();
  const { verifyOtp } = useAuthStore();
  
  return useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      const result = await verifyOtp(phone, otp);
      return result;
    },
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: authKeys.user });
        toast({
          title: 'Welcome!',
          description: 'You are now logged in.',
        });
      }
    },
    onError: () => {
      toast({
        title: 'Invalid Code',
        description: 'Please check and try again.',
        variant: 'destructive',
      });
    },
  });
};

// Hook to logout
export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      logout();
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/login';
    },
  });
};

// Hook to setup role
export const useSetupRole = () => {
  const queryClient = useQueryClient();
  const { setupRole } = useAuthStore();
  
  return useMutation({
    mutationFn: (role: 'consumer' | 'partner') => setupRole(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user });
    },
  });
};

// Hook to submit partner application
export const usePartnerApplication = () => {
  return useMutation({
    mutationFn: (data: {
      restaurantName: string;
      ownerName: string;
      phone: string;
      email: string;
      address: string;
      businessType: string;
      fssLicense: string;
      tradeLicense: string;
    }) => authService.submitPartnerApplication(data),
    onSuccess: () => {
      toast({
        title: 'Application Submitted!',
        description: 'We will review and get back to you soon.',
      });
    },
    onError: (error: { message?: string }) => {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    },
  });
};

// Hook to get partner status
export const usePartnerStatus = () => {
  return useQuery({
    queryKey: ['partner', 'status'],
    queryFn: () => authService.getPartnerStatus(),
    staleTime: 1000 * 60, // 1 minute
  });
};
