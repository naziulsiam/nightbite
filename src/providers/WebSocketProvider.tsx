import { createContext, useContext, useEffect, useCallback, type ReactNode } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuthStore } from '@/stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { WSMessage, Order, Restaurant } from '@/types';

interface WebSocketContextType {
  isConnected: boolean;
  send: (message: Omit<WSMessage, 'timestamp'>) => boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const handleMessage = useCallback((message: WSMessage) => {
    switch (message.type) {
      case 'inventory_update': {
        const { restaurantId, boxesLeft } = message.payload as { restaurantId: string; boxesLeft: number };
        
        // Update restaurant in cache
        queryClient.setQueryData(['restaurants', 'detail', restaurantId], (old: Restaurant | undefined) => {
          if (!old) return old;
          return { ...old, boxesLeft };
        });

        // Show toast if low inventory
        if (boxesLeft <= 2 && boxesLeft > 0) {
          toast({
            title: '🔥 Hurry! Almost Sold Out',
            description: `Only ${boxesLeft} boxes left!`,
          });
        } else if (boxesLeft === 0) {
          toast({
            title: 'Sold Out',
            description: 'This mystery box is no longer available.',
            variant: 'destructive',
          });
        }
        break;
      }

      case 'new_order': {
        const order = message.payload as Order;
        
        // If this is the user's order
        if (order.userId === user?.id) {
          toast({
            title: 'Order Confirmed!',
            description: `Your reservation at ${order.restaurant?.name} is confirmed.`,
          });
          
          // Update orders cache
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
        break;
      }

      case 'order_status': {
        const { orderId, status, restaurantName } = message.payload as { 
          orderId: string; 
          status: string; 
          restaurantName: string;
        };
        
        // Update order in cache
        queryClient.setQueryData(['orders', 'detail', orderId], (old: Order | undefined) => {
          if (!old) return old;
          return { ...old, status };
        });

        // Show notification based on status
        const statusMessages: Record<string, string> = {
          confirmed: 'Your order has been confirmed!',
          ready: 'Your mystery box is ready for pickup!',
          picked_up: 'Enjoy your meal!',
        };

        if (statusMessages[status]) {
          toast({
            title: restaurantName,
            description: statusMessages[status],
          });
        }
        break;
      }

      case 'notification': {
        const { title, body } = message.payload as { title: string; body: string };
        toast({ title, description: body });
        
        // Refresh notifications
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        break;
      }

      default:
        console.log('Unknown WebSocket message type:', message.type);
    }
  }, [queryClient, user?.id]);

  const { isConnected, send } = useWebSocket({
    onMessage: handleMessage,
    onConnect: () => console.log('WebSocket connected'),
    onDisconnect: () => console.log('WebSocket disconnected'),
    autoReconnect: true,
    reconnectInterval: 5000,
  });

  return (
    <WebSocketContext.Provider value={{ isConnected, send }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
