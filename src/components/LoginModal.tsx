import React, { useState, useEffect, useRef } from "react";
import "../assets/styles/LoginModal.css";

interface LoginModalProps {
    closeModal: () => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ closeModal, setIsLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus vào ô Email khi mở modal
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.includes("@")) {
            setError("Email không hợp lệ");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        if (isRegister && password !== confirmPassword) {
            setError("Mật khẩu nhập lại không khớp");
            return;
        }

        setError("");

        if (isRegister) {
            alert(`Đăng ký thành công với Email: ${email}`);
        } else {
            alert(`Đăng nhập thành công với Email: ${email}`);
            setIsLoggedIn(true);
        }

        closeModal();
    };

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{isRegister ? "Đăng ký" : "Đăng nhập"}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {isRegister && (
                        <input
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    )}
                    {error && <p className="error-text">{error}</p>}
                    <button type="submit" className="btn-primary">{isRegister ? "Đăng ký" : "Đăng nhập"}</button>
                    <button type="button" className="btn-secondary" onClick={() => setIsRegister(!isRegister)}>
                        {isRegister ? "Bạn đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
                    </button>
                    <button type="button" className="btn-close" onClick={closeModal}>Đóng</button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
