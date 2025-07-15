// "use client";

// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import Cookies from "js-cookie";

// export type Branch = {
//   id: number;
//   label: string;
// };

// export type Broker = {
//   id: number;
//   code: string;
//   name: string;
//   position: string;
//   branch: Branch;
//   status: number;
// };

// interface BrokerStore {
//   broker: Broker | null;
//   token: string | null;
//   isLoggedIn: boolean;

//   login: (broker: Broker, token: string) => void;
//   logout: () => void;

//   setBroker: (broker: Broker | null) => void;
//   setToken: (token: string | null) => void;
// }

// const JWT_COOKIE_NAME = "fe_auth_token";

// export const useBrokerStore = create<BrokerStore>()(
//   persist(
//     (set, get) => ({
//       broker: null,
//       token: null,

//       get isLoggedIn() {
//         const { broker, token } = get();
//         return !!token && broker !== null && typeof broker.code === "string";
//       },

//       login: (broker, token) => {
//         set({ broker, token });
//         Cookies.set(JWT_COOKIE_NAME, token, { expires: 1 });
//       },

//       logout: () => {
//         set({ broker: null, token: null });
//         Cookies.remove(JWT_COOKIE_NAME);
//       },

//       setBroker: (broker) => set({ broker }),
//       setToken: (token) => {
//         set({ token });
//         if (token) {
//           Cookies.set(JWT_COOKIE_NAME, token, { expires: 1 });
//         } else {
//           Cookies.remove(JWT_COOKIE_NAME);
//         }
//       },
//     }),
//     {
//       name: "broker-storage",
//       partialize: (state) => ({
//         broker: state.broker,
//         token: state.token,
//       }),
//     }
//   )
// );

import { create } from "zustand";

interface Broker {
  name: string;
  code: string;
  branch: { label: string };
}

interface BrokerStore {
  isLoggedIn: boolean;
  token: string;
  broker: Broker;
  logout: (_redirect?: boolean) => Promise<void>;
  loginAction: (
    broker: Broker,
    token: string,
    redirectPath: string
  ) => Promise<void>;
}

export const useBrokerStore = create<BrokerStore>((set) => ({
  isLoggedIn: true,
  token: "mock-token-abc123",
  broker: {
    name: "Nguyễn Văn A",
    code: "B12345",
    branch: { label: "Chi nhánh Hà Nội" },
  },

  logout: async (_redirect = false) => {
    alert("Mock logout");
    set({
      isLoggedIn: false,
      token: "",
      broker: { name: "", code: "", branch: { label: "" } },
    });

    if (_redirect && typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  loginAction: async (broker, token, redirectPath) => {
    alert("Mock loginAction");
    set({
      isLoggedIn: true,
      token,
      broker,
    });

    if (typeof window !== "undefined") {
      window.location.href = redirectPath;
    }
  },
}));
