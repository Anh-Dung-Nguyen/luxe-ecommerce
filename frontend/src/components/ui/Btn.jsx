import React from 'react';

const Btn = ({ children, variant = "primary", size = "md", onClick, disabled, type = "button", style, className = "" }) => {
    const styles = {
        primary: { 
            background: "var(--accent)", 
            color: "#1a1207", 
            border: "none" 
        },

        secondary: { 
            background: "transparent", 
            color: "var(--text)", 
            border: "1px solid var(--border)" 
        },

        ghost: { 
            background: "transparent", 
            color: "var(--textMuted)", 
            border: "none" 
        },

        danger: { 
            background: "#7f1d1d", 
            color: "#fca5a5", 
            border: "1px solid #b91c1c" 
        },

        success: { 
            background: "#14532d", 
            color: "#86efac", 
            border: "1px solid #16a34a" 
        },
    };

    const sizes = {
        sm: { 
            padding: "0.35rem 0.75rem", 
            fontSize: "13px", 
            borderRadius: "6px" 
        },

        md: { 
            padding: "0.55rem 1.25rem", 
            fontSize: "14px", 
            borderRadius: "8px" 
        },

        lg: { 
            padding: "0.75rem 1.75rem", 
            fontSize: "15px", 
            borderRadius: "10px" 
        },
    };

    return (
        <button 
            type = {type} 
            onClick = {onClick} 
            disabled = {disabled}
            className = {className}
            style = {{ 
                ...styles[variant], 
                ...sizes[size], 
                fontWeight: 500, 
                opacity: disabled ? 0.5 : 1, 
                ...style 
            }}
            onMouseEnter = {e => { if (!disabled) e.currentTarget.style.filter = "brightness(1.12)"; }}
            onMouseLeave = {e => { e.currentTarget.style.filter = ""; }}
        >
            {children}
        </button>
    );
}

export default Btn;