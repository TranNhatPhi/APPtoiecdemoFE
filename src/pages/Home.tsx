import React, { useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import CourseCard from "../components/CourseCard";
import useExams from "../hooks/useExams";
import "animate.css"; // 📦 Import Animate.css để xài hiệu ứng

const Home: React.FC = () => {
    const { exams, loading, error } = useExams();

    // Reset localStorage mỗi lần vào Home
    useEffect(() => {
        localStorage.setItem(`exam_expired_${1}`, "false");
        localStorage.setItem(`exam_redirected_${1}`, "false");
        localStorage.setItem(`exam_submitted_${1}`, "false");
    }, []);

    return (
        <MainLayout>
            {/* 🎯 Banner giới thiệu có animation fadeIn */}
            <div className="toeic-intro animate__animated animate__fadeInDown">
                <img
                    src="/logoAppToeic1.png"
                    alt="TOEIC Exam Banner"
                    className="toeic-banner"
                />
                <div className="toeic-content animate__animated animate__fadeInRight">
                    <h1>📘 Welcome to TOEIC Practice!</h1>
                    <p>
                        The TOEIC (Test of English for International Communication) is a globally recognized English proficiency test designed for professionals and students.
                        Our platform provides the latest TOEIC practice tests to help you prepare efficiently and improve your listening and reading skills.
                    </p>
                    <p>✔ Practice with real exam-like questions.</p>
                    <p>✔ Track your progress and improve daily.</p>
                    <p>✔ Get ready for success in the TOEIC test!</p>
                </div>
            </div>

            {/* 📝 Danh sách đề thi mới */}
            <h2 className="section-title animate__animated animate__fadeInUp">📝 Đề thi mới nhất</h2>

            {loading && <p className="animate__animated animate__fadeIn">Loading exams...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="exam-list animate__animated animate__fadeInUp">
                {exams && exams.length > 0 ? (
                    exams.map((exam, index) => (
                        <div className="animate__animated animate__zoomIn" style={{ animationDelay: `${index * 0.1}s` }} key={index}>
                            <CourseCard {...exam} />
                        </div>
                    ))
                ) : (
                    <p>No exams available.</p>
                )}
            </div>
        </MainLayout>
    );
};

export default Home;
