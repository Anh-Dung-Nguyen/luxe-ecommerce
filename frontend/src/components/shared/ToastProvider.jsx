import React, { useState, useCallback, createContext, useContext } from 'react';

const ToastCtx = createContext(null);

export const useToast = () => {
    return useContext(ToastCtx);
}

const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((msg, type = "success") => {
        const id = Date.now();
        setToasts(t => [...t, { id, msg, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    }, []);

    return (
        <ToastCtx.Provider value = {addToast}>
            {children}
            <div style = {{ 
                position: "fixed", 
                bottom: "2rem", 
                right: "2rem", 
                zIndex: 9999, 
                display: "flex", 
                flexDirection: "column", 
                gap: "0.5rem" 
            }}>
                {toasts.map(t => (
                    <div key = {t.id} style = {{
                        background: t.type === "error" ? "#7f1d1d" : t.type === "warning" ? "#78350f" : "#14532d",
                        color: "#f0fdf4", 
                        padding: "0.75rem 1.25rem", 
                        borderRadius: "8px",
                        fontSize: "14px", 
                        fontFamily: "var(--fontSans)", 
                        maxWidth: "320px",
                        border: `1px solid ${t.type === "error" ? "#b91c1c" : t.type === "warning" ? "#d97706" : "#16a34a"}`,
                        animation: "slideIn 0.2s ease", 
                        boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
                    }}>
                        {t.msg}
                    </div>
                ))}
            </div>
        </ToastCtx.Provider>
    );
}

export default ToastProvider;