import { Question } from "./question";

export interface ExamPart {
    part_id: number; // 🟢 ID của phần thi
    exam_id: number; // 🟢 Liên kết với bảng `exams`
    part_number: number; // 🟢 Số thứ tự phần thi (1-7)
    description?: string; // 🟢 Mô tả phần thi (nếu có)
    total_questions: number; // 🟢 Tổng số câu hỏi trong phần
    created_at?: string; // 🟢 Ngày tạo (có thể không cần)
    questions: Question[]; // 🟢 Danh sách câu hỏi thuộc phần
}
