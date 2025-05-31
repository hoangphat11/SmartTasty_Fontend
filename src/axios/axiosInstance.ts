import axios from "axios";

const axiosInstance = axios.create({
   baseURL: "https://smarttasty-backend.onrender.com",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 60000,
});

export default axiosInstance;
