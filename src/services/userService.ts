// src/services/userService.ts
const API_BASE_URL = "https://app-toiec-be-v4.onrender.com/api/users";

// ✅ Lấy toàn bộ người dùng
export const fetchAllUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/all`);
    if (!response.ok) {
        throw new Error("Không thể tải danh sách người dùng");
    }
    return await response.json();
};

// ✅ Kiểm tra trạng thái online của 1 user (nếu dùng riêng biệt)
export const fetchUserOnlineStatus = async (userId: number): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/${userId}/status`);
    if (!response.ok) {
        throw new Error("Không thể lấy trạng thái online của người dùng");
    }
    const data = await response.json();
    return data.online; // ⚠️ dùng .online thay vì .isOnline như trước
};

// ✅ Lấy tổng số người dùng
export const fetchUserCount = async (): Promise<number> => {
    try {
        const response = await fetch(`${API_BASE_URL}/count`);
        if (!response.ok) throw new Error("Lỗi khi gọi API user count");
        const data = await response.json();
        return data.total;
    } catch (err) {
        console.error("❌ Lỗi khi fetch tổng số người dùng:", err);
        return 0;
    }
};
