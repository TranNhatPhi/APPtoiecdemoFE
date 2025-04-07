export const getUserRoleIdFromToken = (): number | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role || null;
    } catch (error) {
        console.error("❌ Lỗi giải mã token:", error);
        return null;
    }
};

export const isAdmin = () => getUserRoleIdFromToken() === 1 || getUserRoleIdFromToken() === 3;
export const isLoggedIn = () => !!localStorage.getItem("token");
