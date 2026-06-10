import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { apiFetch } from '../../services/api';
import { setCartData } from '../../store/cartSlice';
import { useToast } from '../../components/shared/ToastProvider';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import EmptyState from '../../components/shared/EmptyState';

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    
    const user = useSelector(state => state.auth.user);
    const cartItems = useSelector(state => state.cart.items) || [];
    const cartTotal = useSelector(state => state.cart.total) || 0;

    const loadCart = useCallback(async () => {
        if (!user) {
            return;
        }

        try {
            const data = await apiFetch("/cart");
            dispatch(setCartData({ items: data.data || [], total: data.total || 0 }));
        } catch (err) {
            toast("Could not load cart", "error");
        }
    }, [user, dispatch, toast]);

    useEffect(() => { 
        loadCart(); 
    }, [loadCart]);

    const updateItem = async (id, quantity) => {
        try {
            await apiFetch(`/cart/${id}`, { 
                method: "PUT", 
                body: JSON.stringify({ quantity }) 
            });
            loadCart();
        } catch (err) { 
            toast(err.message, "error"); 
        }
    };

    const removeItem = async (id) => {
        try {
            await apiFetch(`/cart/${id}`, { 
                method: "DELETE" 
            });
            loadCart();
            toast("Item removed");
        } catch (err) { 
            toast(err.message, "error"); 
        }
    };

    if (!user) {
        return (
            <EmptyState icon = "🔒" title = "Please log in" subtitle = "You must be logged in to view your cart." />
        )
    }

    if (cartItems.length === 0) {
        return (
            <div style = {{ maxWidth: "800px", margin: "0 auto", padding: "5rem 1.5rem" }}>
                <EmptyState icon = "🛒" title = "Your cart is empty" subtitle = "Discover our collection and add items you love" />
                <div style = {{ textAlign: "center", marginTop: "2rem" }}>
                    <Btn onClick = {() => navigate("/products")}>
                        Shop Now
                    </Btn>
                </div>
            </div>
        );
    }

    return (
        <div style = {{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2.5rem", marginBottom: "2rem" }}>
                Shopping Cart
            </h1>

            <div style = {{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>
                <div style = {{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {cartItems.map(item => (
                        <Card key = {item.id} style = {{ padding: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
                            <div style = {{ width: "80px", height: "80px", background: "var(--surface)", borderRadius: "8px", flexShrink: 0, backgroundImage: `url(${item.product?.image || ""})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                            <div style = {{ flex: 1 }}>
                                <p style = {{ fontWeight: 500, marginBottom: "0.25rem" }}>
                                    {item.product?.name}
                                </p>
                                <p style = {{ color: "var(--accent)", fontFamily: "var(--fontDisplay)" }}>
                                    ${parseFloat(item.product?.price || 0).toFixed(2)}
                                </p>
                            </div>
                            <div style = {{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "8px", 
                                background: "var(--surface)", 
                                border: "1px solid var(--border)", 
                                borderRadius: "8px", 
                                padding: "0.3rem" 
                            }}>
                                <button 
                                    onClick = {() => { 
                                        if (item.quantity > 1) {
                                            updateItem(item.id, item.quantity - 1); 
                                        } else {
                                            removeItem(item.id); 
                                        }
                                    }} 
                                    style = {{ 
                                        background: "none", 
                                        border: "none", 
                                        color: "var(--text)", 
                                        width: "28px", 
                                        height: "28px", 
                                        cursor: "pointer", 
                                        fontSize: "16px" 
                                    }}
                                >
                                    −
                                </button>
                                <span style = {{ minWidth: "24px", textAlign: "center", fontWeight: 500 }}>
                                    {item.quantity}
                                </span>
                                <button 
                                    onClick = {() => updateItem(item.id, item.quantity + 1)} 
                                    style = {{ background: "none", border: "none", color: "var(--text)", width: "28px", height: "28px", cursor: "pointer", fontSize: "16px" }}
                                >
                                    +
                                </button>
                            </div>
                            <p style = {{ minWidth: "70px", textAlign: "right", fontWeight: 500 }}>
                                ${(item.quantity * parseFloat(item.product?.price || 0)).toFixed(2)}
                            </p>
                            <button 
                                onClick = {() => removeItem(item.id)} 
                                style = {{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "18px" }}
                            >
                                🗑
                            </button>
                        </Card>
                    ))}
                </div>

                {/* Summary */}
                <Card style = {{ padding: "1.5rem", position: "sticky", top: "80px" }}>
                    <h3 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.25rem", marginBottom: "1.5rem" }}>
                        Order Summary
                    </h3>
                    <div style = {{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", color: "var(--textMuted)", fontSize: "14px" }}>
                        <span>
                            Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
                        </span>
                        <span style = {{ color: "var(--text)" }}>
                            ${cartTotal.toFixed(2)}
                        </span>
                    </div>
                    <div style = {{ 
                        borderTop: "1px solid var(--border)", 
                        margin: "1rem 0", 
                        paddingTop: "1rem", 
                        display: "flex", 
                        justifyContent: "space-between", 
                        fontWeight: 600 
                    }}>
                        <span style = {{ fontFamily: "var(--fontDisplay)" }}>
                            Total
                        </span>
                        <span style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.3rem", color: "var(--accent)" }}>
                            ${cartTotal.toFixed(2)}
                        </span>
                    </div>
                    <Btn size = "lg" onClick = {() => navigate("/checkout")} style = {{ width: "100%" }}>
                        Proceed to Checkout
                    </Btn>
                    <Btn 
                        variant = "ghost" 
                        onClick = {() => navigate("/products")} 
                        style={{ width: "100%", marginTop: "0.75rem", color: "var(--textMuted)" }}
                    >
                        Continue Shopping
                    </Btn>
                </Card>
            </div>
        </div>
    );
}

export default CartPage;