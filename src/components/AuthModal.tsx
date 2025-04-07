// AuthModal.tsx - Giao diện đăng nhập / đăng ký hiện đại Neon + Glassmorphism + Animation nâng cao

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { registerUser, loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface AuthModalProps {
    closeModal: () => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}
    
const AuthModal: React.FC<AuthModalProps> = ({ closeModal, setIsLoggedIn }) => {
    const [isRegisterTab, setIsRegisterTab] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        retype_password: "",
        address: "",
        phone: "",
        date_of_birth: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError("Email và mật khẩu không được để trống!");
            return false;
        }
        if (isRegisterTab) {
            if (!formData.fullname || !formData.address || !formData.phone || !formData.date_of_birth) {
                setError("Vui lòng điền đầy đủ thông tin!");
                return false;
            }
            if (formData.password !== formData.retype_password) {
                setError("Mật khẩu và xác nhận mật khẩu không khớp!");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            if (isRegisterTab) {
                await registerUser(formData);
                toast.success("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
            } else {
                const response = await loginUser({ email: formData.email, password: formData.password });
                toast.success("👋 Đăng nhập thành công!");

                const token = response.token;
                localStorage.setItem("token", token);
                setIsLoggedIn(true);
                closeModal();

                const payload = JSON.parse(atob(token.split(".")[1]));
                const roleId = payload.role;
                if (roleId === 1 || roleId === 3) {
                    navigate("/admin/home");
                } else {
                    navigate("/");
                }
            }
        } catch (error: any) {
            setError(error.error || "Đã xảy ra lỗi!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center z-3 animate__animated animate__fadeIn"
            style={{
                background: "radial-gradient(circle at top left, #0f0c29, #302b63, #24243e)",
                backdropFilter: "blur(6px)",
            }}
            onClick={closeModal}
        >
            <div
                className="p-5 rounded-4 shadow-lg w-100 animate__animated animate__zoomIn"
                style={{
                    maxWidth: 540,
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "20px",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    color: "#fff",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h4 className="text-center text-info fw-bold mb-4 animate__animated animate__fadeInDown">
                    {isRegisterTab ? "📝 Đăng ký tài khoản" : "🔐 Đăng nhập hệ thống"}
                </h4>
                <form onSubmit={handleSubmit} className="animate__animated animate__fadeInUp">
                    {isRegisterTab && (
                        <>
                            <input className="form-control mb-3 bg-dark text-light border-info" type="text" name="fullname" placeholder="👤 Họ và tên" value={formData.fullname} onChange={handleChange} required />
                            <input className="form-control mb-3 bg-dark text-light border-info" type="text" name="address" placeholder="📍 Địa chỉ" value={formData.address} onChange={handleChange} required />
                            <input className="form-control mb-3 bg-dark text-light border-info" type="text" name="phone" placeholder="📞 Số điện thoại" value={formData.phone} onChange={handleChange} required />
                            <input className="form-control mb-3 bg-dark text-light border-info" type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
                        </>
                    )}
                    <input className="form-control mb-3 bg-dark text-light border-info" type="email" name="email" placeholder="📧 Email" value={formData.email} onChange={handleChange} required />
                    <input className="form-control mb-3 bg-dark text-light border-info" type="password" name="password" placeholder="🔑 Mật khẩu" value={formData.password} onChange={handleChange} required />
                    {isRegisterTab && (
                        <input className="form-control mb-3 bg-dark text-light border-info" type="password" name="retype_password" placeholder="🔁 Nhập lại mật khẩu" value={formData.retype_password} onChange={handleChange} required />
                    )}
                    {error && <div className="alert alert-danger py-2 px-3 small animate__animated animate__headShake">⚠️ {error}</div>}
                    <button type="submit" className="btn btn-info w-100 fw-bold fs-5 d-flex justify-content-center align-items-center gap-2">
                        {isSubmitting ? <span className="spinner-border spinner-border-sm text-light"></span> : (isRegisterTab ? "🚀 Đăng ký" : "➡️ Đăng nhập")}
                    </button>
                </form>
                <p className="text-center mt-3 text-white">
                    {isRegisterTab ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
                    <span className="text-decoration-underline text-info fw-bold" role="button" onClick={() => setIsRegisterTab(!isRegisterTab)}>
                        {isRegisterTab ? "🔑 Đăng nhập" : "📝 Đăng ký"}
                    </span>
                </p>
                <div className="text-center mt-3">
                    <button className="btn btn-outline-light btn-sm px-4 py-2" onClick={closeModal}>❌ Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;