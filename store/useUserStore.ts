import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserType {
  memberId: string;
  name: string;
  email: string;
  nickname: string;
  phone: string;
  profileImageUrl: string | null;
  gymPayBalance: string | null;
}

interface userStore {
  user: UserType | null;
  InitUser: (data: UserType) => void;
  LogoutUser: () => void;
}

const useUserStore = create(
  persist<userStore>(
    (set) => {
      return {
        user: {
          memberId: "",
          name: "",
          email: "",
          nickname: "",
          phone: "",
          profileImageUrl: "",
          gymPayBalance: "",
        },
        InitUser: (data) => {
          set(() => ({ user: data }));
        },
        LogoutUser: () => {
          set(() => ({
            user: {
              memberId: "",
              name: "",
              email: "",
              nickname: "",
              phone: "",
              profileImageUrl: "",
              gymPayBalance: "",
            },
          }));
        },
      };
    },
    {
      name: "userStore",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useUserStore;
