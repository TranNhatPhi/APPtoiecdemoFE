// ExamDetail.tsx - Phiên bản đã thêm animation (animate.css + scroll effects)

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useExamDetail from "../hooks/useExamDetail";
import { submitExamResult } from "../services/examResultService";
import "../assets/styles/examDetail.css";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "animate.css";

const ExamDetail: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();

    const [expired, setExpired] = useState<boolean>(() => {
        const hasStarted = localStorage.getItem(`exam_started_${examId}`) === "true";
        return !hasStarted;
    });

    const { examDetail, loading, error } = useExamDetail(Number(examId), expired);

    const LOCAL_STORAGE_KEY_TIME = `exam_time_${examId}`;
    const LOCAL_STORAGE_KEY_ANSWERS = `exam_answers_${examId}`;
    const LOCAL_STORAGE_KEY_START = `exam_start_${examId}`;

    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const autoSubmittedRef = useRef(false); // ✅ Đảm bảo chỉ chạy 1 lần
    const [showFixedTimer, setShowFixedTimer] = useState(false);
    const timerRef = useRef<HTMLDivElement | null>(null);
    const [showSidebarMobile, setShowSidebarMobile] = useState(false);


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowFixedTimer(!entry.isIntersecting); // ❗Hiện khi timer không còn trong màn hình
            },
            { threshold: 0.1 }
        );
        if (timerRef.current) {
            observer.observe(timerRef.current);
        }
        return () => {
            if (timerRef.current) {
                observer.unobserve(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const savedAnswers = localStorage.getItem(LOCAL_STORAGE_KEY_ANSWERS);
        if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    }, []);

    useEffect(() => {
        const isSubmitted = localStorage.getItem(`exam_submitted_${examId}`);
        if (isSubmitted === "true") {
            Swal.fire({
                icon: "info",
                title: "Bài thi đã nộp",
                text: "Bài thi đã được nộp hoặc hết thời gian. Không thể làm lại.",
            }).then(() => {
                window.location.href = "/exam-results";
            });
            localStorage.setItem(`exam_submitted_${examId}`, "true");
            localStorage.setItem(`exam_expired_${examId}`, "false");
        }
    }, [examId]);

    useEffect(() => {
        if (examDetail?.duration) {
            const now = Date.now();
            let startTime = Number(localStorage.getItem(LOCAL_STORAGE_KEY_START));
            if (!startTime) {
                startTime = now;
                localStorage.setItem(LOCAL_STORAGE_KEY_START, String(startTime));
            }
            const timePassed = Math.floor((now - startTime) / 1000);
            const remaining = examDetail.duration * 60 - timePassed;
            setTimeLeft(remaining > 0 ? remaining : 0);
        }
    }, [examDetail]);

    useEffect(() => {
        if (examDetail) {
            localStorage.setItem(`exam_started_${examId}`, "true");
            setExpired(false);
        }
    }, [examDetail, examId]);

    useEffect(() => {
        if (timeLeft === null) return;

        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => (prev ?? 1) - 1), 1000);
            return () => clearTimeout(timer);
        } else if (!autoSubmittedRef.current) {
            autoSubmittedRef.current = true; // ✅ đảm bảo chỉ chạy 1 lần
            toast.warning("⏳ Hết thời gian! Bài thi sẽ được tự động nộp.");
            localStorage.setItem(`exam_expired_${examId}`, "true");
            handleSubmitExam(true);
        }
    }, [timeLeft]);

    const handleSelectAnswer = (index: number, option: string) => {
        setAnswers(prev => {
            const updated = { ...prev, [index]: option };
            localStorage.setItem(LOCAL_STORAGE_KEY_ANSWERS, JSON.stringify(updated));
            return updated;
        });
    };

    const formatTime = (seconds: number | null) => {
        if (seconds === null) return "...";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const scrollToQuestion = (index: number) => {
        questionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const handleSubmitExam = async (expired = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!examDetail) {
            toast.error("❌ Không thể nộp bài do chưa tải xong dữ liệu.");
            setIsSubmitting(false);
            return;
        }

        if (!expired) {
            const confirmSubmit = await Swal.fire({
                title: "Bạn có chắc chắn muốn nộp bài?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Nộp bài",
                cancelButtonText: "Hủy",
            });
            if (!confirmSubmit.isConfirmed) {
                setIsSubmitting(true);
                return;
            }

        }

        setExpired(false);
        localStorage.setItem(`exam_expired_${examId}`, "false");

        const startTime = Number(localStorage.getItem(LOCAL_STORAGE_KEY_START));
        const now = Date.now();
        const completedTime = Math.floor((now - startTime) / 60000);

        const userAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
            question_id: Number(questionId) + 1,
            selected_answer: selectedAnswer,
        }));

        try {
            const result = await submitExamResult(Number(examId), userAnswers, completedTime);
            Swal.fire({
                icon: "success",
                title: "🎉 Nộp bài thành công!",
                html: `
                    <p>✔️ Số câu đúng: <strong>${result.correct_answers}</strong></p>
                    <p>❌ Số câu sai: <strong>${result.wrong_answers}</strong></p>
                    <p>❓ Câu chưa trả lời: <strong>${result.unanswered_questions}</strong></p>
                    <p>🏆 Tổng điểm: <strong>${result.total_score}</strong></p>
                    <p>⏳ Hoàn thành: <strong>${completedTime} phút</strong></p>
                `,
            }).then(() => {
                window.location.href = "/exam-results";
            });

            localStorage.setItem(`exam_submitted_${examId}`, "true");
            localStorage.removeItem(`exam_started_${examId}`);
            setAnswers({});
            localStorage.removeItem(LOCAL_STORAGE_KEY_ANSWERS);
            localStorage.removeItem(LOCAL_STORAGE_KEY_START);
        } catch (error: any) {
            toast.error(`❌ Lỗi khi nộp bài: ${error?.message || "Không xác định"}`);
        } finally {
            setIsSubmitting(false);
            if (expired) {
                setTimeout(() => {
                    window.location.href = "/exam-results";
                }, 1000);
            }
        }

    };

    if (loading) return <p className="animate__animated animate__fadeIn">Đang tải đề thi...</p>;
    if (error) return <p className="text-danger animate__animated animate__shakeX">{error}</p>;
    if (!examDetail) return <p>Không tìm thấy đề thi.</p>;

    const totalQuestions = examDetail.parts.reduce((acc, part) => acc + part.questions.length, 0);
    const selectedCount = Object.keys(answers).length;

    return (

        <div className="exam-page animate__animated animate__fadeIn">

            <div className="exam-container animate__animated animate__fadeInUp">
                <h2>{examDetail.title}</h2>

                <div className="audio-player">
                    <strong>Nghe đoạn hội thoại:</strong>
                    <audio controls>
                        <source src={`http://localhost:3000/listen/${examDetail.audio}`} type="audio/mpeg" />
                        Trình duyệt của bạn không hỗ trợ phát audio.
                    </audio>
                </div>

                <div className="timer animate__animated animate__pulse animate__infinite">
                    ⏳ <strong>Thời gian còn lại:</strong> {formatTime(timeLeft)}
                </div>

                {examDetail.parts.map((part) => (
                    <div key={part.part_id} className="exam-part">
                        <h3>Phần {part.part_number}</h3>
                        {part.questions.map((q, index) => {
                            const questionIndex = examDetail.parts
                                .slice(0, part.part_id - 1)
                                .reduce((acc, p) => acc + p.questions.length, 0) + index;

                            return (
                                <div
                                    key={questionIndex}
                                    className="question animate__animated animate__fadeInUp"
                                    ref={(el) => { questionRefs.current[questionIndex] = el; }}
                                >
                                    {q.image_filename && (
                                        <div className="question-image">
                                            <img
                                                src={`http://localhost:3000/listen/part1/${q.image_filename}`}
                                                alt={`Question ${questionIndex + 1}`}
                                            />
                                        </div>
                                    )}
                                    <p>{questionIndex + 1}. {q.question_text}</p>
                                    <ul>
                                        {["A", "B", "C", "D"]
                                            .filter(option => q[`option${option}` as keyof typeof q])
                                            .map((option) => (
                                                <li key={option} onClick={() => handleSelectAnswer(questionIndex, option)}>
                                                    <label className="radio-container">
                                                        <input type="radio" name={`q${questionIndex}`} value={option} checked={answers[questionIndex] === option} />
                                                        <span>{option}. {q[`option${option}` as keyof typeof q]}</span>
                                                    </label>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            {/* ✅ Nút mở sidebar trên mobile */}
            {window.innerWidth <= 1000 && (
                <button
                    className="open-sidebar-btn"
                    onClick={() => setShowSidebarMobile(true)}
                >
                    📋 Danh sách câu hỏi
                </button>
            )}

            <aside className={`sidebar animate__animated animate__slideInLeft ${showSidebarMobile ? "open" : "closed"}`}>

                <h3>Danh sách câu hỏi</h3>
                <div className="answer-summary">
                    Đã chọn: {selectedCount}/{totalQuestions} câu
                </div>
                {examDetail.parts.map((part, partIndex) => (
                    <div key={part.part_id} className="question-group">
                        <h4>Phần {part.part_number}</h4>
                        <div className="question-grid">
                            {part.questions.map((_, index) => {
                                const questionIndex = examDetail.parts
                                    .slice(0, partIndex)
                                    .reduce((acc, p) => acc + p.questions.length, 0) + index;

                                return (
                                    <button
                                        key={questionIndex}
                                        className={`question-button ${answers[questionIndex] ? "answered" : ""}`}
                                        onClick={() => scrollToQuestion(questionIndex)}
                                    >
                                        {questionIndex + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </aside>

            <div style={{ textAlign: "left" }}>
                <button className="submit-button" onClick={() => handleSubmitExam(false)} disabled={isSubmitting || timeLeft === 0}>
                    {isSubmitting ? "Đang nộp..." : "📝 Nộp bài"}
                </button>

            </div>
            <div className="timer-fixed animate__animated animate__pulse animate__infinite">
                ⏳ <strong>Thời gian còn lại:</strong> {formatTime(timeLeft)}
            </div>
            {window.innerWidth <= 1000 && (
                <button
                    className="hamburger-toggle"
                    onClick={() => setShowSidebarMobile(prev => !prev)}
                >
                    ☰
                </button>
            )}
        </div>

    );
};

export default ExamDetail;
