import { create } from "zustand";

interface TInitConfigBlock {
  feat_t0_limit: boolean;
}

interface AppConfigStore {
  featT0Limit: boolean;
  setConfig: (config: TInitConfigBlock) => void;
}

export const useAppConfigStore = create<AppConfigStore>((set) => ({
  featT0Limit: true,

  setConfig: (config) => {
    set({ featT0Limit: config.feat_t0_limit });
    console.log("+++ Config received:", config);
  },
}));
