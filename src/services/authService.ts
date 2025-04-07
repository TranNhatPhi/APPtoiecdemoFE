// src/services/authService.ts
import { api } from "./api";
import socket from "../socket"; // ✅ dùng socket chung
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

// ✅ Lắng nghe reconnect: gửi lại userId khi socket reconnect (F5, rớt mạng...)
socket.on("connect", () => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
        socket.emit("user-online", Number(storedUserId));
        console.log(`🔁 Reconnected - resent user-online for ID ${storedUserId}`);
    }
});

// ✅ Hiển thị toast khi vừa login (không hiện khi chỉ F5)
let hasJustLoggedIn = false;

socket.on("update-online-users", (onlineUserIds: number[]) => {
    if (hasJustLoggedIn) {
        const lastOnlineId = onlineUserIds[onlineUserIds.length - 1];
        const currentUserId = Number(localStorage.getItem("user_id"));
        if (lastOnlineId && lastOnlineId !== currentUserId) {
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

        localStorage.setItem("token", token);

        // ✅ Giải mã token để lấy userId
        const decoded: any = JSON.parse(atob(token.split(".")[1]));
        const userId = decoded?.userId;

        if (userId) {
            toast.info(`👤 Người dùng ID ${userId} vừa online`, {
                position: "bottom-right",
            });

            socket.emit("user-online", userId);
            socket.emit("new-user-login", userId);

            localStorage.setItem("user_id", userId.toString());
            hasJustLoggedIn = true;
        }

        return response.data;
    } catch (error: any) {
        toast.error(`❌ Đăng nhập thất bại: ${error.response?.data?.message || "Lỗi không xác định"}`, { position: "top-right" });
        throw error;
    }
};

// ✅ Logout + Gửi trạng thái offline
export const logoutUser = () => {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded: any = JSON.parse(atob(token.split(".")[1]));
            const userId = decoded?.userId;

            if (userId) {
                socket.emit("user-offline", userId);
                toast.info(`👤 Người dùng ID ${userId} vừa offline`, {
                    position: "bottom-right",
                });
            }
        }
    } catch (error) {
        console.warn("❗Lỗi giải mã token khi logout:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    toast.info("👋 Bạn đã đăng xuất!", { position: "bottom-right" });
    window.location.href = "/";
};

// ✅ (Tuỳ chọn) Gửi user-offline khi đóng tab
window.addEventListener("beforeunload", () => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
        socket.emit("user-offline", Number(userId));
    }
});
