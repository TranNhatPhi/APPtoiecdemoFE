import "./assets/styles/global.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import ExamResults from "./pages/ExamResult";
import ExamDetail from "./pages/ExamDetail";
import Dashboard from "./pages/dashboard/Dashboard";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminExamResult from "./pages/admin/AdminExamResult";

import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import AdminUserOnlineCheck from "./pages/admin/AdminUserOnlineCheck";

// 🟢 Import Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Home />} />

          {/* Protected routes (User + Admin) */}
          <Route path="/exam/:examId" element={
            <PrivateRoute><ExamDetail /></PrivateRoute>
          } />
          <Route path="/exam-results" element={
            <PrivateRoute><ExamResults /></PrivateRoute>
          } />

          {/* Admin-only routes */}
          <Route path="/admin" element={<Navigate to="/admin/home" replace />} />
          <Route path="/admin/home" element={
            <AdminRoute><Dashboard /></AdminRoute>
          } />
          <Route path="/admin/questions" element={
            <AdminRoute><AdminQuestions /></AdminRoute>
          } />
          <Route path="/admin/exam-result" element={
            <AdminRoute><AdminExamResult /></AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute><AdminUserOnlineCheck /></AdminRoute>
          } />
        </Routes>
      </Router>

      {/* 🟡 Toast UI luôn nằm bên ngoài Router */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default App;
