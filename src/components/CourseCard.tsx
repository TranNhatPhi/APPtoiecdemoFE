import "../assets/styles/exams.css"; // Import file CSS vào component
import React from "react";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  id: number;
  title: string;
  duration: number;
  participants: number;
  comments: number;
  sections: number;
  questions: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ id, title, duration, participants, comments, sections, questions }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/exam/${id}`); // Điều hướng đến trang bài thi
  };

  return (
    <div className="course-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <h3>{title}</h3>
      <p>⏳ {duration} Phút | 👤 {participants} | 💬 {comments}</p>
      <p>{sections} phần thi | {questions} câu hỏi</p>
      <button onClick={(e) => { e.stopPropagation(); handleClick(); }}>Vào thi</button>
    </div>
  );
};

export default CourseCard;
