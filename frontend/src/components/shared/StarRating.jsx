import React from "react";

const StarRating = ({ value, onChange }) => {
    return (
        <div style = {{ display: "flex", gap: "4px" }}>
            {[1,2,3,4,5].map(n => (
                <span 
                    key = {n} 
                    onClick = {() => onChange && onChange(n)}
                    style = {{ fontSize: "20px", color: n <= value ? "var(--accent)" : "var(--border)", cursor: onChange ? "pointer" : "default" }}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

export default StarRating;