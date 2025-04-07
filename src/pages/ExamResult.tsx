import React, { useEffect, useState } from "react";
import { getExamResultsByUserId } from "../services/examResultService";
import { jwtDecode } from "jwt-decode";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import "../assets/styles/examResults.css";
import "animate.css";

const getUserIdFromToken = (): number | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const decoded: any = jwtDecode(token);
        return decoded.userId || null;
    } catch (error) {
        console.error("❌ Lỗi giải mã token:", error);
        return null;
    }
};

const ExamResults: React.FC = () => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExamResults = async () => {
            try {
                const userId = getUserIdFromToken();
                if (!userId) {
                    throw new Error("Người dùng chưa đăng nhập!");
                }
                const data = await getExamResultsByUserId(userId);
                setResults(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchExamResults();
    }, []);

    return (
        <>
            <Header />
            <div className="exam-results-container animate__animated animate__fadeInUp">
                <h2 className="page-title">📊 Kết quả bài thi</h2>
                {loading ? (
                    <p className="loading">⏳ Đang tải kết quả...</p>
                ) : error ? (
                    <div className="error-message">❌ {error}</div>
                ) : results.length === 0 ? (
                    <p className="no-results">📭 Không có kết quả bài thi nào.</p>
                ) : (
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Bài thi</th>
                                <th>Điểm</th>
                                <th>Số câu đúng</th>
                                <th>Số câu sai</th>
                                <th>Chưa trả lời</th>
                                <th>Thời gian (phút)</th>
                                <th>Ngày hoàn thành</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr key={result.id}>
                                    <td>{index + 1}</td>
                                    <td>{result.detail || "N/A"}</td>
                                    <td>{result.score || 0}</td>
                                    <td>{result.correct_answers || 0}</td>
                                    <td>{result.wrong_answers || 0}</td>
                                    <td>{result.unanswered_questions || 0}</td>
                                    <td>{result.completed_time} phút</td>
                                    <td>{new Date(result.completed_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ExamResults; 