import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const RootLayout = () => {
    return (
        <div style = {{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
            <Navbar />
            
            <main className = "fade-in" style = {{ flex: 1 }}>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default RootLayout;