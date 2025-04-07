export interface Question {
    id: number; // 🟢 Mỗi câu hỏi có một ID duy nhất
    part_id: number; // 🟢 Liên kết với phần thi (ExamPart)
    question_text: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD?: string; // Có thể không có đáp án D
    correct_answer: "A" | "B" | "C" | "D"; // 🟢 Đáp án đúng
    image_filename?: string; // 🟢 Tên file ảnh (nếu có)
}
