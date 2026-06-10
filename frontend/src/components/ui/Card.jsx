import React from 'react';

const Card = ({ children, style, onClick, className = "", onMouseEnter, onMouseLeave }) => {
    return (
        <div 
            onClick = {onClick}
            onMouseEnter = {onMouseEnter}
            onMouseLeave = {onMouseLeave}
            className = {className}
            style = {{ 
                background: "var(--card)", 
                border: "1px solid var(--border)", 
                borderRadius: "12px", 
                ...style 
            }}
        >
            {children}
        </div>
    );
}

export default Card;