import { create } from 'zustand';

const useSocketStore = create((set) => ({
  socket: null, // 초기 상태: 소켓 없음
  connectSocket: () => {},
  disconnectSocket: () => {
    set(() => {});
  },
}));

export default useSocketStore;
