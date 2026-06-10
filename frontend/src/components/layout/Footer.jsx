import React from "react";

const Footer = () => {
    return (
        <footer style = {{ 
            borderTop: `1px solid var(--border)`, 
            padding: "2rem 1.5rem", 
            textAlign: "center", 
            color: "var(--textDim)", 
            fontSize: "13px", 
            marginTop: "4rem" 
        }}>
            <div style = {{ 
                maxWidth: "1280px", 
                margin: "0 auto", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                flexWrap: "wrap", 
                gap: "1rem" 
            }}>
                <span style = {{ 
                    fontFamily: "var(--fontDisplay)", 
                    fontSize: "16px", 
                    color: "var(--textMuted)" 
                }}>
                    Luxe
                    <span style = {{ color: "var(--accent)" }}>
                        .
                    </span>
                </span>
                <span>
                    © {new Date().getFullYear()} All rights reserved
                </span>
                <div style = {{ display: "flex", gap: "1.5rem" }}>
                    {["Products", "About", "Contact"].map(l => (
                        <span key = {l} style = {{ cursor: "pointer", color: "var(--textDim)" }}>
                            {l}
                        </span>
                    ))}
                </div>
            </div>
        </footer>
    )
}

export default Footer;