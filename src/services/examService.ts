import { Exam } from "../models/exam";

const API_URL = "https://app-toiec-be-v4.onrender.com/api/exams";
export const fetchExams = async (): Promise<Exam[]> => {
    try {
        console.log("Fetching exams from API...");
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Exams received:", result);

        if (!result.data || !Array.isArray(result.data)) {
            throw new Error("Invalid API response: missing 'data' array");
        }

        return result.data; // ✅ Chỉ lấy phần `data`
    } catch (error) {
        console.error("Error fetching exams:", error);
        throw error;
    }
};
