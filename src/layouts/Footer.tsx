import "../assets/styles/footer.css"; // Import CSS cho footer
import React from "react";
import {
    FaFacebookF, FaTwitter, FaInstagram, FaLinkedin,
    FaYoutube, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt
} from "react-icons/fa";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            {/* 🌟 Phần trên - Chia 3 cột thông tin */}
            <div className="footer-top">
                {/* 🌍 Cột 1 - Về TOEiC APP */}
                <div className="footer-column">
                    <h3>About TOEiC APP</h3>
                    <p>
                        TOEiC APP is a leading online education platform that helps students
                        achieve their academic and career goals with high-quality courses,
                        exams, and study materials.
                    </p>
                    <p>
                        Join us to unlock your full potential and take your learning journey to the next level! 🚀
                    </p>
                </div>

                {/* 🔗 Cột 2 - Links điều hướng */}
                <div className="footer-column">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Courses</a></li>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Community</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* 📍 Cột 3 - Liên hệ + Google Map */}
                <div className="footer-column">
                    <h3>Contact Us</h3>
                    <p><FaMapMarkerAlt /> 123 Study Street, Education City, USA</p>
                    <p><FaPhone /> +1 800 123 4567</p>
                    <p><FaEnvelope /> support@TOEiC APP.com</p>

                    {/* 🌍 Google Map */}
                    <div className="footer-map">
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95373531531695!3d-37.81627917975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5df78c7b51%3A0x5045675218ce760!2sEducation+City!5e0!3m2!1sen!2sus!4v1616234567890!5m2!1sen!2sus"
                            width="100%"
                            height="150"
                            allowFullScreen={true}
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* 🌟 Phần giữa - Mạng xã hội */}
            <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FaFacebookF className="social-icon facebook" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <FaTwitter className="social-icon twitter" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="social-icon instagram" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="social-icon linkedin" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                    <FaYoutube className="social-icon youtube" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="social-icon github" />
                </a>
            </div>

            {/* 🌟 Phần dưới - Bản quyền & thông tin */}
            <div className="footer-bottom">
                <p>© 2025 TOEiC APP. All rights reserved.</p>
                <p>
                    Designed & Developed by <span className="highlight">Nhật Phi</span>
                </p>
                <p className="footer-quote">"Unlock Your Potential with Knowledge"</p>
            </div>
        </footer>
    );
};

export default Footer;
