// @/axios/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://smarttasty-backend.onrender.com",
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
});

// Thêm interceptor để gắn token vào header Authorization
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          const token = parsed.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (err) {
          console.warn("Lỗi khi parse user data:", err);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
