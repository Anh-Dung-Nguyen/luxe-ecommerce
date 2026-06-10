import React from 'react';
import Btn from '../ui/Btn';

const Pagination = ({ page, totalPages, onChange }) => {
    if (totalPages <= 1) {
        return null;
    }
    
    return (
        <div style = {{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
            <Btn 
                variant = "secondary" 
                size = "sm" 
                disabled = {page <= 1} 
                onClick = {() => onChange(page - 1)}
            >
                ← Prev
            </Btn>
            
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = i + 1;
                return (
                    <Btn 
                        key = {p} 
                        size = "sm" 
                        variant = {p === page ? "primary" : "secondary"} 
                        onClick = {() => onChange(p)}
                    >
                        {p}
                    </Btn>
                );
            })}
            
            <Btn 
                variant = "secondary" 
                size = "sm" 
                disabled = {page >= totalPages} 
                onClick = {() => onChange(page + 1)}
            >
                Next →
            </Btn>
        </div>
    );
}

export default Pagination;