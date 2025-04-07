export interface ExamResult {
    id: number;
    user_id: number; // ID của người dùng đã làm bài
    exam_id: number; // ID của bài thi
    score: number; // Tổng điểm bài thi
    total_score?: number; // ✅ Thêm `total_score`
    listening_score: number; // Điểm phần Listening
    reading_score: number; // Điểm phần Reading
    correct_answers: number; // Số câu trả lời đúng
    wrong_answers: number; // Số câu trả lời sai
    unanswered_questions: number; // Số câu không trả lời
    total_questions: number; // Tổng số câu hỏi trong bài thi
    completed_time: number; // Thời gian hoàn thành bài thi (tính bằng phút)
    status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED"; // Trạng thái bài thi
    completed_at: string; // Thời gian hoàn thành (ISO Date String)
}
