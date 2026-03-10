import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { WSMessage } from '@/types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

interface UseWebSocketOptions {
  onMessage?: (message: WSMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    autoReconnect = true,
    reconnectInterval = 3000,
  } = options;

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, isAuthenticated } = useAuthStore();

  const connect = useCallback(() => {
    if (!isAuthenticated || !token) return;

    try {
      const wsUrl = `${WS_URL}?token=${token}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setIsConnected(true);
        onConnect?.();
        
        // Send ping every 30s to keep connection alive
        const pingInterval = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);

        ws.current!.onclose = () => {
          clearInterval(pingInterval);
        };
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        onDisconnect?.();

        if (autoReconnect) {
          reconnectTimer.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }, [token, isAuthenticated, onMessage, onConnect, onDisconnect, onError, autoReconnect, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }
    ws.current?.close();
  }, []);

  const send = useCallback((message: Omit<WSMessage, 'timestamp'>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        ...message,
        timestamp: Date.now(),
      }));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    send,
    connect,
    disconnect,
  };
};
