import React, { useEffect, useState } from "react";
import AuthModal from "../components/AuthModal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Header: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // 👉 Toggle menu

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

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

            {/* Hamburger icon cho mobile */}
            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                ☰
            </button>

            <nav className={menuOpen ? "nav-links open" : "nav-links"}>
                <li><a href="#">My Courses</a></li>
                <li><a href="#">Study Program</a></li>
                <li><a href="#">Online Tests</a></li>
                <li><a href="#">Flashcards</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Activate Account</a></li>
            </nav>

            <div className="auth-section">
                {isLoggedIn ? (
                    <button className="auth-btn logout" onClick={handleLogout}>Logout</button>
                ) : (
                    <button className="auth-btn login" onClick={() => setShowModal(true)}>Login</button>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <AuthModal
                    closeModal={() => setShowModal(false)}
                    setIsLoggedIn={setIsLoggedIn}
                />
            )}
        </header>
    );
};

export default Header;
