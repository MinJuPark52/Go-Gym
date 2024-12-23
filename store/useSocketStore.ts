import { create } from "zustand";
import { Client, Message } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface WebSocketState {
  stompClient: Client | null;
  messages: {
    chatRoomId: string;
    senderId: number;
    content: string;
    createdAt: string;
    safePaymentId: string;
    messageType:
      | "SYSTEM_SAFE_PAYMENT_REQUEST"
      | "SYSTEM_SAFE_PAYMENT_APPROVAL"
      | "SYSTEM_SAFE_PAYMENT_REJECTION"
      | "SYSTEM_SAFE_PAYMENT_CANCEL"
      | "SYSTEM_SAFE_PAYMENT_COMPLETE"
      | "SYSTEM_TRANSACTION_DATE_CONFIRMED"
      | "SYSTEM_TRANSACTION_DATE_CHANGED"
      | "SYSTEM_TRANSACTION_CANCEL"
      | "TEXT_ONLY";
  }[];
  initMessages: () => void;
  setAgoMessage: (
    agoMessage: {
      chatRoomId: string;
      senderId: number;
      content: string;
      createdAt: string;
      safePaymentId: string;
      messageType:
        | "SYSTEM_SAFE_PAYMENT_REQUEST"
        | "SYSTEM_SAFE_PAYMENT_APPROVAL"
        | "SYSTEM_SAFE_PAYMENT_REJECTION"
        | "SYSTEM_SAFE_PAYMENT_CANCEL"
        | "SYSTEM_SAFE_PAYMENT_COMPLETE"
        | "SYSTEM_TRANSACTION_DATE_CONFIRMED"
        | "SYSTEM_TRANSACTION_DATE_CHANGED"
        | "SYSTEM_TRANSACTION_CANCEL"
        | "TEXT_ONLY";
    }[],
  ) => void;
  connect: (
    url: string,
    chatroomId: string,
    onMessage?: (message: Message) => void,
  ) => void;
  sendMessage: (destination: string, body: string) => void;
  disconnect: () => void;
}

const useWebSocketStore = create<WebSocketState>((set) => ({
  stompClient: null,
  messages: [],
  initMessages: () =>
    set(() => {
      console.log("Messages 초기화됨");
      return { messages: [] };
    }),
  setAgoMessage: (agoMessage) =>
    set((state) => {
      const combinedMessages = [...agoMessage, ...state.messages];

      // 중복 제거: chatRoomId와 createdAt을 기준으로 필터링
      const uniqueMessages = Array.from(
        new Map(
          combinedMessages.map((msg) => [`${msg.createdAt}`, msg]),
        ).values(),
      );

      return { messages: uniqueMessages };
    }),

  connect: (url, chatroomId, onMessage) => {
    const client = new Client({
      brokerURL: url,
      webSocketFactory: () => new SockJS(url),
      connectHeaders: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      onConnect: () => {
        console.log("웹소켓 연결 성공");
        if (onMessage) {
          client.subscribe(`/topic/chatroom/${chatroomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            //실시간 상태 구독후 messages의 업데이트 Map객체 사용해서 중복제거
            set((state) => {
              // messages: [...state.messages, receivedMessage],
              const combinedMessages = [...state.messages, receivedMessage];

              // 중복 제거
              const uniqueMessages = Array.from(
                new Map(
                  combinedMessages.map((msg) => [`${msg.createdAt}`, msg]),
                ).values(),
              );

              return { messages: uniqueMessages };
            });
            onMessage(message);
          });
        }
      },
      onDisconnect: () => {
        console.log("웹소켓 연결 끊기");
      },
      onStompError: (error) => {
        console.error("Stomp error:", error);
      },
    });

    client.activate();
    set({ stompClient: client });
  },

  sendMessage: (destination, body) => {
    set((state) => {
      if (state.stompClient && state.stompClient.connected) {
        state.stompClient.publish({ destination, body });
      }
      return state;
    });
  },

  disconnect: () => {
    set((state) => {
      if (state.stompClient) {
        state.stompClient.deactivate();
      }
      return { stompClient: null };
    });
  },
}));

export default useWebSocketStore;
