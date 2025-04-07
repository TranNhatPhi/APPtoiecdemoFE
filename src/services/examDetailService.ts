import { ExamDetail } from "../models/examDetail";

const API_URL = "http://localhost:5000/api/exams";

/**
 * Lấy chi tiết đề thi. Nếu `expired = true` thì yêu cầu random lại đề.
 */
const getAccessToken = (): string | null => {
    const token = localStorage.getItem("token"); // Đảm bảo đúng key
    if (!token) {
        alert("❌ Bạn chưa đăng nhập! Vui lòng đăng nhập lại.");
        return null;
    }
    return token;
};

export const fetchExamDetail = async (examId: number): Promise<ExamDetail> => {

    const token = getAccessToken();
    if (!token) throw new Error("Không có accessToken!");
    try {

        const url = `http://localhost:5000/api/exams/${examId}/questions`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        if (!result || !result.data) {
            throw new Error("Invalid API response: missing 'data'");
        }

        return result.data;
    } catch (error) {
        console.error("Error fetching exam details:", error);
        throw error;
    }
};
