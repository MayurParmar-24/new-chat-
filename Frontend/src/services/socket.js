import io from 'socket.io-client';
import { store } from '../store';
import { addMessage, updateLastMessage, incrementUnreadCount } from '../store/slices/chatSlice';

const SOCKET_URL = 'http://localhost:5001';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    this.socket = io(SOCKET_URL, {
      query: { userId },
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('message:received', (data) => {
      store.dispatch(addMessage({
        chatId: data.chatId,
        message: data.message,
      }));
      store.dispatch(updateLastMessage({
        chatId: data.chatId,
        message: data.message.content,
      }));
      store.dispatch(incrementUnreadCount(data.chatId));
    });

    this.socket.on('user:typing', ({ chatId, isTyping }) => {
      // Handle typing indicator
    });

    this.socket.on('message:read', ({ chatId, messageId }) => {
      // Handle message read status
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  sendMessage(chatId, message) {
    if (this.socket) {
      this.socket.emit('message:send', { chatId, message });
    }
  }

  typing(chatId, isTyping) {
    if (this.socket) {
      this.socket.emit('user:typing', { chatId, isTyping });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
export default socketService; 