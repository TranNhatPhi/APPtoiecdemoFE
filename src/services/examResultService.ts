import { ExamResult } from "../models/examResult";
import axios from "axios";
const API_URL = "https://app-toiec-be-v4.onrender.com/api/exam-results"; // 🔹 Endpoint chính

/**
 * 📝 Gửi bài thi lên Server
 * @param examId ID của bài thi
 * @param answers Danh sách câu trả lời
 * @param completedTime Thời gian hoàn thành bài thi
 * @returns Kết quả bài thi từ server
 */
const getAccessToken = (): string | null => {
    const token = localStorage.getItem("token"); // Đảm bảo đúng key
    if (!token) {
        alert("❌ Bạn chưa đăng nhập! Vui lòng đăng nhập lại.");
        return null;
    }
    return token;
};

export const submitExamResult = async (examId: number, answers: any[], completedTime: number) => {
    const token = getAccessToken();
    if (!token) throw new Error("Không có accessToken!");

    try {
        const response = await fetch(`${API_URL}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ exam_id: examId, answers, completed_time: completedTime })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("❌ Error submitting exam result:", error);
        throw error;
    }
};
export const fetchAllExamResults = async (): Promise<ExamResult[]> => {
    try {
        const res = await axios.get(`${API_URL}`);
        return res.data.data || [];
    } catch (error) {
        console.error("❌ Lỗi khi lấy toàn bộ kết quả bài thi:", error);
        return [];
    }
};
export const fetchAllExamResults1 = async (): Promise<any[]> => {
    try {
        const res = await axios.get(`${API_URL}/all`);
        return res.data.data.results || [];
    } catch (error) {
        console.error("❌ Lỗi khi lấy toàn bộ kết quả bài thi:", error);
        return [];
    }
};

export const fetchPaginatedExamResults = async (page = 1, limit = 10) => {
    try {
        const res = await axios.get(`${API_URL}/paginate?page=${page}&limit=${limit}`);
        return res.data.data; // { results, total, page, limit }
    } catch (error) {
        console.error("❌ Lỗi khi gọi API lấy kết quả bài thi:", error);
        return { results: [], total: 0, page, limit };
    }
};

export const getExamResultById = async (resultId: number): Promise<ExamResult> => {
    try {
        const response = await fetch(`${API_URL}/${resultId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        if (!result.data) {
            throw new Error("Invalid API response: missing 'data'");
        }

        return result.data;
    } catch (error) {
        console.error("❌ Error fetching exam result:", error);
        throw error;
    }
};

export const getExamResultsByUserId = async (userId: number): Promise<ExamResult[]> => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        if (!result.data) {
            throw new Error("Invalid API response: missing 'data'");
        }

        return result.data;
    } catch (error) {
        console.error("❌ Error fetching exam results by user ID:", error);
        throw error;
    }
};

export const getDailyExamAttemptsInMonth = async () => {
    const res = await fetch(`${API_URL}/stats/daily-attempts`);
    const json = await res.json();
    return json.data;
};

export const getAvgScoreLast7Days = async (): Promise<number> => {
    const res = await fetch(`${API_URL}/stats/avg-score-last-7-days`);
    const data = await res.json();
    return data.data || 0;
};

export const deleteExamResult = async (resultId: number): Promise<void> => {
    try {
        const token = getAccessToken();
        if (!token) throw new Error("Không có accessToken!");

        const response = await fetch(`${API_URL}/${resultId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Lỗi khi xóa kết quả bài thi: ${response.status}`);
        }
    } catch (error) {
        console.error("❌ Error deleting exam result:", error);
        throw error;
    }
};