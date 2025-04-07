// src/services/authService.ts

import { api } from "./api";
import io from "socket.io-client";
import { toast } from "react-toastify";

interface RegisterData {
    fullname: string;
    email: string;
    password: string;
    retype_password: string;
    address: string;
    phone: string;
    date_of_birth: string;
}

interface LoginData {
    email: string;
    password: string;
}

// 🔌 Kết nối socket
const socket = io("http://localhost:5000");

// ✅ Khi socket kết nối lại (sau F5, refresh, mất mạng...), gửi lại userId nếu có
socket.on("connect", () => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
        // Gửi lại userId cho server để thông báo online
        socket.emit("user-online", Number(storedUserId));
        toast.info(`👤 Người dùng ID ${storedUserId} đã online`, {
            position: "bottom-right",
        });

    }
});

// ✅ Lắng nghe sự kiện online nhưng KHÔNG hiện toast khi chỉ F5 (chỉ hiện khi thực sự login)
let hasJustLoggedIn = false;

socket.on("update-online-users", (onlineUserIds: number[]) => {
    if (hasJustLoggedIn) {
        const lastOnlineId = onlineUserIds[onlineUserIds.length - 1];
        if (lastOnlineId) {
            toast.info(`👤 Người dùng ID ${lastOnlineId} vừa online`, {
                position: "bottom-right",
            });
        }
        hasJustLoggedIn = false;
    }
});

// ✅ API Đăng ký
export const registerUser = async (userData: RegisterData) => {
    try {
        const response = await api.post("/auth/register", userData);
        toast.success("🎉 Đăng ký thành công!", { position: "top-right" });
        return response.data;
    } catch (error: any) {
        toast.error(`❌ Đăng ký thất bại: ${error.response?.data?.message || "Lỗi không xác định"}`, { position: "top-right" });
        throw error;
    }
};

// ✅ API Đăng nhập + Gửi trạng thái online
export const loginUser = async (loginData: LoginData) => {
    try {
        const response = await api.post("/auth/login", loginData);
        const { token } = response.data;

        // 👉 Lưu token vào localStorage
        localStorage.setItem("token", token);

        // ✅ Decode token để lấy userId và thông báo online
        const decoded: any = JSON.parse(atob(token.split(".")[1]));
        const userId = decoded.userId;
        toast.info(`👤 Người dùng ID ${userId} vừa online`, {
            position: "bottom-right",
        });
        socket.emit("user-online", userId); // Gửi sự kiện người dùng online

        // ✅ Lưu thêm userId để gửi lại khi F5
        localStorage.setItem("user_id", userId.toString());
        hasJustLoggedIn = true; // 👉 Chỉ cho phép hiển thị toast khi vừa login

        // Thông báo cho tất cả các client rằng có người đăng nhập
        socket.emit("new-user-login", userId);

        return response.data;
    } catch (error: any) {
        toast.error(`❌ Đăng nhập thất bại: ${error.response?.data?.message || "Lỗi không xác định"}`, { position: "top-right" });
        throw error;
    }
};

// ✅ Logout + Gửi trạng thái offline
export const logoutUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
        const decoded: any = JSON.parse(atob(token.split(".")[1]));
        const userId = decoded.userId;
        // Thông báo cho tất cả các client rằng có người đăng xuất
        socket.emit("user-offline", userId); // Gửi sự kiện người dùng offline
        toast.info(`👤 Người dùng ID ${userId} vừa offline`, {
            position: "bottom-right",
        });
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    toast.info("👋 Bạn đã đăng xuất!", { position: "bottom-right" });
    window.location.href = "/";
};
