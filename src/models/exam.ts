export interface Exam {
    id: number;
    title: string;
    duration: number; // ✅ Chuyển từ string -> number
    participants: number;
    comments: number;
    sections: number;
    questions: number;
    audio?: string; // ✅ Thuộc tính audio là tùy chọn
}
