import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiFetch } from '../../services/api';
import { useToast } from './ToastProvider';
import Card from '../ui/Card';
import Btn from '../ui/Btn';
import Badge from '../ui/Badge';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const toast = useToast();
    const [adding, setAdding] = useState(false);

    const handleAdd = async (e) => {
        e.stopPropagation();
        
        if (!user) { 
            navigate("/login"); 
            return; 
        }
        
        setAdding(true);

        try {
            await apiFetch("/cart", { 
                method: "POST", 
                body: JSON.stringify({ productId: product.id, quantity: 1 }) 
            });
            toast("Added to cart");
        } catch (err) { 
            toast(err.message, "error"); 
        } finally { 
            setAdding(false); 
        }
    };

    return (
        <Card 
            onClick = {() => navigate(`/product/${product.id}`)}
            style = {{ cursor: "pointer", overflow: "hidden", transition: "transform 0.2s, border-color 0.2s" }}
            onMouseEnter = {e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--accentDim)"; }}
            onMouseLeave = {e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "var(--border)"; }}
        >
            <div style = {{ 
                height: "200px", 
                background: `var(--surface) url(${product.image || ""}) center/cover`, 
                borderRadius: "10px 10px 0 0", 
                display: "flex", 
                alignItems: "flex-end", 
                padding: "0.75rem" 
            }}>
                {product.stock < 10 && product.stock > 0 && <Badge color = "warning">Low stock</Badge>}
                {product.stock === 0 && <Badge color = "danger">Out of stock</Badge>}
            </div>
            <div style = {{ padding: "1rem" }}>
                <p style = {{ fontSize: "12px", color: "var(--accent)", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {product.category?.name || "General"}
                </p>
                <h3 style = {{ fontSize: "15px", fontWeight: 500, marginBottom: "0.5rem", color: "var(--text)", lineHeight: 1.4 }}>
                    {product.name}
                </h3>
                <div style = {{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                    <span style = {{ fontFamily: "var(--fontDisplay)", fontSize: "18px", color: "var(--accent)" }}>
                        ${parseFloat(product.price).toFixed(2)}
                    </span>
                    
                    {(!user || user.role === 'client') && (
                        <Btn size = "sm" onClick = {handleAdd} disabled = {adding || product.stock === 0}>
                        {adding ? "..." : "+ Cart"}
                        </Btn>
                    )}
                </div>
            </div>
        </Card>
    );
}

export default ProductCard;