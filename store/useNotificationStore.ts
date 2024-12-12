import { create } from "zustand";

interface Notification {
  id: number;
  message: string;
  name: string;
  data: number;
  read: boolean;
  type: "ADD_WISHLIST_MY_POST" | "CHANGE_MEMBER_STATUS";
  timestamp: string;
}

interface NotificationState {
  notifications: Notification[];
  sseUrl: string | null;
  isViewingAll: boolean;
  dummyReceived: boolean;
  error: boolean;
  lastEvent: number;
  notice: (token: string) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: number) => void;
  setSseUrl: (url: string) => void;
  setError: (error: boolean) => void;
  setViewingAll: (viewing: boolean) => void;
  setDummyReceived: (received: boolean) => void;
  setLastEvent: (timestamp: number) => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  sseUrl: null,
  isViewingAll: false,
  dummyReceived: false,
  error: false,
  lastEvent: Date.now(),
  notice: (token) => {
    console.log("token:", token);
  },
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50),
    })),
  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ),
    })),
  setSseUrl: (url) => set({ sseUrl: url }),
  setError: (error) => set({ error }),
  setViewingAll: (viewing) => set({ isViewingAll: viewing }),
  setDummyReceived: (received) => set({ dummyReceived: received }),
  setLastEvent: (timestamp) => set({ lastEvent: timestamp }),
}));

export default useNotificationStore;
