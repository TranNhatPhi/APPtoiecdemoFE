import { useState, useEffect } from "react";
import { ExamDetail } from "../models/examDetail";

const useExamDetail = (examId: number, expired: boolean) => {
    const [examDetail, setExamDetail] = useState<ExamDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getExamDetail = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Bạn chưa đăng nhập!");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const url = `http://localhost:5000/api/exams/${examId}/questions${expired ? "?expired=true" : ""}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    setExamDetail(null);
                    return;
                }

                const result = await response.json();
                if (!result || !result.data) {
                    setError("Dữ liệu không hợp lệ hoặc không có bài thi");
                    setExamDetail(null);
                } else {
                    setExamDetail(result.data);
                }
            } catch (error) {
                console.error("Lỗi khi fetch exam:", error);
                setError("Lỗi khi tải dữ liệu bài thi");
                setExamDetail(null);
            } finally {
                setLoading(false);
            }
        };

        getExamDetail();
    }, [examId, expired]);

    return { examDetail, loading, error };
};

export default useExamDetail;
