import React from "react";

const Badge = ({ children, color = "accent" }) => {
    const colors = {
        accent: { 
            bg: "#2a200a", 
            color: "var(--accent)", 
            border: "#4a3615" 
        },

        success: { 
            bg: "#052e16", 
            color: "#86efac", 
            border: "#166534" 
        },

        danger: { 
            bg: "#450a0a", 
            color: "#fca5a5", 
            border: "#7f1d1d" 
        },

        info: { 
            bg: "#172554", 
            color: "#93c5fd", 
            border: "#1d4ed8" 
        },

        warning: { 
            bg: "#431407", 
            color: "#fdba74", 
            border: "#9a3412" 
        },

        gray: { 
            bg: "var(--surface)", 
            color: "var(--textMuted)", 
            border: "var(--border)" 
        },
    };

    const c = colors[color] || colors.gray;

    return (
        <span style = {{ 
            background: c.bg, 
            color: c.color, 
            border: `1px solid ${c.border}`, 
            padding: "2px 8px", 
            borderRadius: "6px", 
            fontSize: "12px", 
            fontWeight: 500 
        }}>
            {children}
        </span>
    );
}

export default Badge;