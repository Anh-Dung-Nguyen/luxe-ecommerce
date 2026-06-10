import React from "react";

const  Spinner = () => {
    return (
        <div style = {{ 
            width: "20px", 
            height: "20px", 
            border: `2px solid var(--border)`, 
            borderTopColor: "var(--accent)", 
            borderRadius: "50%", 
            animation: "spin 0.7s linear infinite", 
            margin: "0 auto" 
        }} />
    )
}

export default Spinner;