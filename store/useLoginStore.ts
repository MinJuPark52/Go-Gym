import { create } from 'zustand';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface LoginState {}

const useWebSocketStore = create<LoginState>((set) => ({
  loginState: false,
}));

export default useWebSocketStore;
