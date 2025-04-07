import axios from "axios";

// ✅ Tạo instance Axios
const api = axios.create({
    baseURL: "https://app-toiec-be-v4.onrender.com/api", // 🔹 Thay bằng URL API của bạn
});

// ✅ Thêm Interceptor để gắn token vào mỗi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken"); // 🔹 Lấy token từ localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Interceptor để kiểm tra lỗi 401 (Token hết hạn) và tự động đăng xuất
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            alert("🔄 Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");

            // ✅ Xóa token khỏi localStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // ✅ Chuyển hướng về trang đăng nhập
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
