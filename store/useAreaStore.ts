import { create } from "zustand";

interface Area {
  name: string;
  code: string;
}

interface AreaState {
  loading: { areaLoading: boolean };
  areaAuto: Area | null;
  token: string | null;
  setLoading: (newState: { areaLoading: boolean }) => void;
  setAreaAuto: (area: Area | null) => void;
  setToken: (token: string) => void;
}

const useLoginStore = create<AreaState>((set) => ({
  loading: { areaLoading: false },
  areaAuto: null,
  token: null,

  setLoading: (newState) =>
    set((state) => ({ loading: { ...state.loading, ...newState } })),
  setAreaAuto: (area) => set({ areaAuto: area }),
  setToken: (token) => set({ token }),
}));
export default useLoginStore;
