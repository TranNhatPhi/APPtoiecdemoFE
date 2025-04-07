// 👉 Tạo socket client cho app
import { io } from "socket.io-client";

// 👉 Đổi lại nếu dùng production
const socket = io("https://app-toiec-be-v4.onrender.com", {
    transports: ["websocket"], // 🔒 Tăng độ ổn định
    withCredentials: true,
});

// ✅ Gửi lại userId mỗi khi socket kết nối (F5 / reload / reconnect)
socket.on("connect", () => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
        socket.emit("user-online", Number(userId));
        console.log(`🔁 Reconnected - sent user-online for ID ${userId}`);
    }
});

export default socket;
