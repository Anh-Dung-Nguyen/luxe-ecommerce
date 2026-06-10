import React from 'react';
import Card from './Card';

const Modal = ({ title, onClose, children }) => {
    return (
        <div style = {{ 
            position: "fixed", 
            inset: 0, 
            background: "rgba(0,0,0,0.75)", 
            zIndex: 1000, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "1rem" 
        }}>
            <Card style = {{ 
                width: "100%", 
                maxWidth: "520px", 
                maxHeight: "90vh", 
                overflow: "auto" 
            }}>
                <div style = {{ 
                    padding: "1.25rem 1.5rem", 
                    borderBottom: "1px solid var(--border)", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center" 
                }}>
                    <h3 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "18px" }}>
                        {title}
                    </h3>
                    <button 
                        onClick = {onClose} 
                        style = {{ background: "none", border: "none", color: "var(--textMuted)", fontSize: "20px", cursor: "pointer" }}
                    >
                        ✕
                    </button>
                </div>
                <div style = {{ padding: "1.5rem" }}>
                    {children}
                </div>
            </Card>
        </div>
    );
}

export default Modal;