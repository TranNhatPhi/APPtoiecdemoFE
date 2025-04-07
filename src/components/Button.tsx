import React from 'react';

interface ButtonProps {
    text: string;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
        >
            {text}
        </button>
    );
};

export default Button;
