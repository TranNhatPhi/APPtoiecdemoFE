import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <Header />
            <main className="container">{children}</main>
            <Footer />
        </>
    );
};

export default MainLayout;
