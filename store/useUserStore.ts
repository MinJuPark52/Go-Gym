import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserType {
  name: string;
  email: string;
  nickname: string;
  phone: string;
  profileImageUrl: string | null;
  interestArea1: string | null;
  interestArea2: string | null;
  payMoneyId: string | null;
  payMoneyBalance: string | null;
}

interface userStore {
  user: UserType | null;
  InitUser: (data: UserType) => void;
  LogoutUser: () => void;
}

const useLoginStore = create(
  persist<userStore>(
    (set) => {
      return {
        user: null,
        InitUser: (data) => {
          set(() => ({ user: data }));
        },
        LogoutUser: () => {
          set(() => ({ user: null }));
        },
      };
    },
    {
      name: "userStore",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useLoginStore;
