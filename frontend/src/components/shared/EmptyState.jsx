import React from "react";

const EmptyState = ({ icon = "📭", title, subtitle }) => {
    return (
        <div style = {{ 
            textAlign: "center", 
            padding: "4rem 2rem", 
            color: "var(--textMuted)" 
        }}>
            <div style = {{ 
                fontSize: "3rem", 
                marginBottom: "1rem" 
            }}>
                {icon}
            </div>
            <p style = {{ 
                fontSize: "16px", 
                color: "var(--text)", 
                marginBottom: "0.5rem" 
            }}>
                {title}
            </p>
            {subtitle && <p style = {{ fontSize: "14px" }}>{subtitle}</p>}
        </div>
    );
}

export default EmptyState;