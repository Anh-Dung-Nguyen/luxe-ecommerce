import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiFetch } from '../../services/api';
import Btn from '../../components/ui/Btn';
import ProductCard from '../../components/shared/ProductCard';

const HomePage = () => {
    const [featured, setFeatured] = useState([]);
    const [categories, setCategories] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        apiFetch("/products?limit=8").then(d => setFeatured(d.data || [])).catch(() => {});
        apiFetch("/categories").then(d => setCategories(d.data || [])).catch(() => {});
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <div style = {{ 
                background: `linear-gradient(135deg, var(--bg) 0%, #1a150a 50%, var(--bg) 100%)`, 
                padding: "6rem 1.5rem", 
                textAlign: "center", 
                position: "relative", 
                overflow: "hidden" 
            }}>
                <div style = {{ 
                    position: "absolute", 
                    top: "30%", 
                    left: "50%", 
                    transform: "translate(-50%,-50%)", 
                    width: "600px", 
                    height: "600px", 
                    background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)", 
                    pointerEvents: "none" 
                }} />
                    <div style = {{ 
                        maxWidth: "720px", 
                        margin: "0 auto", 
                        position: "relative" 
                    }}>
                        <p style = {{ 
                            color: "var(--accent)", 
                            fontSize: "13px", 
                            letterSpacing: "3px", 
                            textTransform: "uppercase", 
                            marginBottom: "1.5rem", 
                            fontWeight: 500 
                        }}>
                            Premium Collection
                        </p>
                        <h1 style = {{ 
                            fontFamily: "var(--fontDisplay)", 
                            fontSize: "clamp(2.5rem, 6vw, 4.5rem)", 
                            lineHeight: 1.1, 
                            marginBottom: "1.5rem", 
                            color: "var(--text)" 
                        }}>
                            Discover Curated<br /><span style={{ color: "var(--accent)" }}>Luxury</span> Products
                        </h1>
                        <p style = {{ 
                            color: "var(--textMuted)", 
                            fontSize: "17px", 
                            lineHeight: 1.7, 
                            marginBottom: "2.5rem", 
                            maxWidth: "480px", 
                            margin: "0 auto 2.5rem" 
                        }}>
                            Exceptional quality, thoughtfully selected. Shop the finest collection crafted for those who appreciate the extraordinary.
                        </p>
                        <div style = {{ 
                            display: "flex", 
                            gap: "1rem", 
                            justifyContent: "center", 
                            flexWrap: "wrap" 
                        }}>
                            <Btn 
                                size = "lg" 
                                onClick={() => navigate("/products")}
                            >
                                Explore Collection →
                            </Btn>
                            {!user && <Btn 
                                variant = "secondary" 
                                size = "lg" 
                                onClick={() => navigate("/register")}
                                >
                                    Create Account
                                </Btn>
                            }
                        </div>
                    </div>
                </div>

            <div style = {{ 
                maxWidth: "1280px", 
                margin: "0 auto", 
                padding: "4rem 1.5rem" 
            }}>
                {/* Stats */}
                <div style = {{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
                    gap: "1.5rem", 
                    marginBottom: "5rem" }}
                >
                    {[["500+", "Products"], ["50+", "Categories"], ["10k+", "Happy Clients"], ["4.9★", "Average Rating"]].map(([n, l]) => (
                        <div 
                            key = {l} 
                            style = {{ 
                                textAlign: "center", 
                                padding: "2rem 1rem", 
                                background: "var(--card)", 
                                borderRadius: "12px", 
                                border: "1px solid var(--border)" 
                            }}
                        >
                            <div 
                                style = {{ 
                                    fontFamily: "var(--fontDisplay)", 
                                    fontSize: "2rem", 
                                    color: "var(--accent)", 
                                    marginBottom: "0.5rem" 
                                }}
                            >
                                    {n}
                            </div>
                            <div 
                                style = {{ 
                                    color: "var(--textMuted)", 
                                    fontSize: "14px" 
                                }}
                            >
                                {l}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                    <div style = {{ marginBottom: "5rem" }}>
                        <div style = {{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "baseline", 
                            marginBottom: "2rem" 
                        }}>
                            <h2 style = {{ 
                                fontFamily: "var(--fontDisplay)", 
                                fontSize: "2rem" 
                            }}>
                                Browse Categories
                            </h2>
                            <button 
                                onClick={() => navigate("/products")} 
                                style={{ 
                                    color: "var(--accent)", 
                                    background: "none", 
                                    border: "none", 
                                    fontSize: "14px", 
                                    cursor: "pointer" 
                                }}
                            >
                                View all →
                            </button>
                        </div>
                        <div style = {{ 
                            display: "grid", 
                            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", 
                            gap: "1rem" 
                        }}>
                            {categories.slice(0, 6).map(cat => (
                                <button 
                                    key = {cat.id} 
                                    onClick = {() => navigate("/products")}
                                    style = {{ 
                                        background: "var(--card)", 
                                        border: "1px solid var(--border)", 
                                        borderRadius: "12px", 
                                        padding: "1.5rem 1rem", 
                                        textAlign: "center", 
                                        cursor: "pointer", 
                                        transition: "all 0.2s" 
                                    }}
                                    onMouseEnter = {e => { e.currentTarget.style.borderColor = "var(--accentDim)"; e.currentTarget.style.background = "#201c12"; }}
                                    onMouseLeave = {e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--card)"; }}
                                >
                                    <div style = {{ 
                                        fontSize: "2rem", 
                                        marginBottom: "0.75rem" 
                                    }}>
                                        🏷️
                                    </div>
                                    <div style = {{ 
                                        fontSize: "14px", 
                                        fontWeight: 500, 
                                        color: "var(--text)" 
                                    }}>
                                        {cat.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Featured Products */}
                <div>
                    <div style = {{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "baseline", 
                        marginBottom: "2rem" 
                    }}>
                        <h2 style = {{ 
                            fontFamily: "var(--fontDisplay)", 
                            fontSize: "2rem" 
                        }}>
                            Featured Products
                        </h2>
                        <button 
                            onClick = {() => navigate("/products")} 
                            style = {{ 
                                color: "var(--accent)", 
                                background: "none", 
                                border: "none", 
                                fontSize: "14px", 
                                cursor: "pointer" 
                            }}
                        >
                            Shop all →
                        </button>
                    </div>
                    <div style = {{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", 
                        gap: "1.5rem" 
                    }}>
                        {featured.map(p => <ProductCard key = {p.id} product = {p} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;