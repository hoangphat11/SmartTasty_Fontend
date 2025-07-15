"use client";

import { $fetch } from "ofetch";
import { useBrokerStore } from "@/store/auth/useBrokerStore";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const useHttp = () => {
  const { isLoggedIn, token, logout } = useBrokerStore();

  return $fetch.create({
    baseURL: API_BASE,

    async onRequest({ options }) {
      const headers: Record<string, string> = {};

      if (isLoggedIn && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      if (
        options.headers &&
        typeof options.headers === "object" &&
        !(options.headers instanceof Headers)
      ) {
        Object.assign(headers, options.headers as Record<string, string>);
      }

      options.headers = new Headers(headers);
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        await logout(true);
      }
    },
  });
};
