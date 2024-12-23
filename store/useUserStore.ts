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
  gymPayId: string;
  regionId1: string;
  regionId2: string;
  regionName1: string;
  regionName2: string;
}

interface userStore {
  user: UserType;
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
          gymPayId: "",
          regionId1: "",
          regionId2: "",
          regionName1: "",
          regionName2: "",
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
              gymPayId: "",
              regionId1: "",
              regionId2: "",
              regionName1: "",
              regionName2: "",
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
