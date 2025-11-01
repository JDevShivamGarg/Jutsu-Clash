import { io, Socket } from 'socket.io-client';
import { ServerEvent, ClientEvent } from '@jutsu-clash/shared';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

class SocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to server:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;
    });

    this.socket.on(ServerEvent.ERROR, (error) => {
      console.error('Server error:', error);
    });
  }

  emit(event: ClientEvent, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Cannot emit event: Socket not connected');
    }
  }

  on(event: ServerEvent, callback: (...args: any[]) => void): void {
    this.socket?.on(event, callback);
  }

  off(event: ServerEvent, callback?: (...args: any[]) => void): void {
    this.socket?.off(event, callback);
  }
}

export const socketManager = new SocketManager();
export const socket = socketManager.getSocket() || (() => {
  socketManager.connect();
  return socketManager.getSocket()!;
})();
