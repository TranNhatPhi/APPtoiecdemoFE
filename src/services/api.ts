import axios from "axios";
import { logoutUser } from "./authService";
import { toast } from "react-toastify"; // ✅ Nếu đang dùng react-toastify

const API_BASE_URL = "https://app-toiec-be-v4.onrender.com/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Gửi token nếu có
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ✅ Interceptor kiểm tra token hết hạn
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("🔥 Interceptor bắt lỗi:", error.response?.status, error.response?.data); // 👈 THÊM
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.error;

            if (status === 401) {
                toast.error(`⚠ ${message || "Phiên đăng nhập đã hết hạn!"}`);
                logoutUser(); // 👉 Gọi hàm logout để xoá token
            }
        }
        return Promise.reject(error);
    }
);

