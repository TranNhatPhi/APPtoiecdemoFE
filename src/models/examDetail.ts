import { ExamPart } from "./examPart";

export interface ExamDetail {
    exam_id: number;
    title: string;
    audio: string;
    duration: number; // Thêm thời gian làm bài (phút)
    parts: ExamPart[];
}
