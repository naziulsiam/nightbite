// Auth hooks
export { useUser, useSendOTP, useVerifyOTP, useLogout, useSetupRole, usePartnerApplication, usePartnerStatus } from './useAuth';

// Restaurant hooks
export {
  useRestaurants,
  useRestaurant,
  useFeaturedRestaurants,
  useNearbyRestaurants,
  useCategories,
  useSearchRestaurants,
  useAvailability,
  useUpdateRestaurantInventory,
  restaurantKeys,
} from './useRestaurants';

// Order hooks
export {
  useOrders,
  useOrder,
  useActiveOrder,
  useCreateOrder,
  useCancelOrder,
  useVerifyPickup,
  useRateOrder,
  orderKeys,
} from './useOrders';

// WebSocket hook
export { useWebSocket } from './useWebSocket';

// Other hooks
export { useToast } from './use-toast';
export { useIsMobile } from './use-mobile';
