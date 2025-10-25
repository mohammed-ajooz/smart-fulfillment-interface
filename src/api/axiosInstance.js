import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // ✅ نفس الرابط الذي تستخدمه في Postman
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧩 إضافة الـ Token تلقائيًا في كل الطلبات
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ التعامل مع الأخطاء العامة (مثل انتهاء الجلسة)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Session expired, redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
