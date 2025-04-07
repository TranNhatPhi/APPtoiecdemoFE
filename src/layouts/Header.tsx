import React, { useState, useEffect } from "react";
import AuthModal from "../components/AuthModal";
import { toast } from "react-toastify"; // ✅ Đúng!
import Swal from "sweetalert2";

const Header: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);

    // Kiểm tra token trong localStorage để xác định trạng thái đăng nhập thực sự
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Có token thì true
    }, []);

    // Xử lý logout
    const handleLogout = () => {
        Swal.fire({
            title: "Bạn có chắc chắn muốn đăng xuất?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Đăng xuất",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                toast.success("✅ Đăng xuất thành công!");
            }
        });
    };



    return (
        <header className="header">
            <div className="logo">TOEiC APP</div>

            <nav>
                <ul className="nav-links">
                    <li><a href="#">My Courses</a></li>
                    <li><a href="#">Study Program</a></li>
                    <li><a href="#">Online Tests</a></li>
                    <li><a href="#">Flashcards</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Activate Account</a></li>
                </ul>
            </nav>

            <div className="auth-section">
                {isLoggedIn ? (
                    <button className="auth-btn logout" onClick={handleLogout}>Logout</button>
                ) : (
                    <button className="auth-btn login" onClick={() => setShowModal(true)}>Login</button>
                )}
            </div>

            {/* Modal đăng nhập */}
            {showModal && (
                <AuthModal
                    closeModal={() => setShowModal(false)}
                    setIsLoggedIn={setIsLoggedIn} // để AuthModal gọi sau khi login thành công
                />
            )}
        </header>
    );
};

export default Header;
