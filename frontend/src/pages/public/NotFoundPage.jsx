import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';

const NotFound = () => {
    return (
        <div style = {{ 
            height: "100vh", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            padding: "2rem"
        }}>
            <Card style = {{ padding: "3rem", textAlign: "center", maxWidth: "400px" }}>
                <h1 style = {{ fontSize: "5rem", margin: 0, color: "var(--accent)" }}>
                    404
                </h1>
                <h2 style = {{ marginBottom: "1rem" }}>
                    Page Not Found
                </h2>
                <p style = {{ color: "var(--textMuted)", marginBottom: "2rem" }}>
                    Oops! The page you are looking for does not exist or has been moved.
                </p>
                <Link to = "/">
                    <Btn>Back to Home</Btn>
                </Link>
            </Card>
        </div>
    );
};

export default NotFound;