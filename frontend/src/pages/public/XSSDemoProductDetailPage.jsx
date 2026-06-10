import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiFetch } from '../../services/api';
import { useToast } from '../../components/shared/ToastProvider';
import Btn from '../../components/ui/Btn';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import StarRating from '../../components/shared/StarRating';
import Modal from '../../components/ui/Modal';

const XSSDemoProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const toast = useToast();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    
    const [reviewModal, setReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
    const [submitting, setSubmitting] = useState(false);
    
    const [vulnLevel, setVulnLevel] = useState("secure");

    useEffect(() => {
        setLoading(true);
        Promise.all([
            apiFetch(`/products/${id}`).catch(() => null),
            apiFetch(`/reviews/product/${id}`).catch(() => ({ data: [] }))
        ]).then(([prodData, revData]) => {
            setProduct(prodData?.data || prodData || null); 
            setReviews(revData.data || []);
        }).finally(() => setLoading(false));
    }, [id]);

    const handleAddCart = async () => {
        if (!user) { 
            navigate("/login"); 
            return; 
        }
        try { 
            await apiFetch("/cart", { 
                method: "POST", 
                body: JSON.stringify({ productId: product.id, quantity: qty }) 
            });
            toast("Added to cart"); 
        }
        catch (err) { 
            toast(err.message, "error"); 
        }
    };

    const submitReview = async () => {
        setSubmitting(true);
        try {
            let endpoint = "/reviews";
            if (vulnLevel === "easy") endpoint = "/reviews/vulnerable-easy";
            if (vulnLevel === "medium") endpoint = "/reviews/vulnerable-medium";

            await apiFetch(endpoint, { 
                method: "POST", 
                body: JSON.stringify({ productId: parseInt(id), ...reviewForm }) 
            });
            
            toast(`Review submitted via ${vulnLevel.toUpperCase()} endpoint`);
            setReviewModal(false);
            setReviewForm({ rating: 5, comment: "" });
            
            const revData = await apiFetch(`/reviews/product/${id}`);
            setReviews(revData.data || []);
        } catch (err) { 
            toast(err.message, "error"); 
        } finally { 
            setSubmitting(false); 
        }
    };

    if (loading) {
        return (
            <div style = {{ textAlign: "center", padding: "5rem" }}>
                <Spinner />
            </div>
        )
    }

    if (!product) {
        return (
            <EmptyState icon = "❌" title = "Product not found" />
        )
    }

    const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

    return (
        <div style = {{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <button 
                onClick = {() => navigate("/products")} 
                style = {{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "14px", marginBottom: "2rem" }}
            >
                ← Back to products
            </button>

            <div style = {{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>
                <div style = {{ 
                    background: "var(--card)", 
                    borderRadius: "16px", 
                    height: "420px", 
                    overflow: "hidden", 
                    border: "1px solid var(--border)", 
                    backgroundImage: `url(${product.image || ""})`, 
                    backgroundSize: "cover", 
                    backgroundPosition: "center", 
                    display: "flex", 
                    alignItems: "flex-start", 
                    padding: "1rem" 
                }}>
                    {product.stock === 0 && <Badge color="danger">Out of Stock</Badge>}
                </div>

                <div>
                    <p style = {{ 
                        color: "var(--accent)", 
                        fontSize: "13px", 
                        letterSpacing: "2px", 
                        textTransform: "uppercase", 
                        marginBottom: "0.75rem" 
                    }}>
                        {product.category?.name || "General"}
                    </p>
                    <h1 style = {{ 
                        fontFamily: "var(--fontDisplay)", 
                        fontSize: "2.2rem", 
                        marginBottom: "1rem", 
                        lineHeight: 1.2 
                    }}>
                        {product.name}
                    </h1>

                    <div style = {{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "1rem", 
                        marginBottom: "1.5rem" 
                    }}>
                        <StarRating value = {Math.round(avgRating)} />
                        <span style = {{ color: "var(--textMuted)", fontSize: "14px" }}>
                            ({reviews.length} reviews)
                        </span>
                    </div>

                    <div style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2.5rem", color: "var(--accent)", marginBottom: "1.5rem" }}>
                        ${parseFloat(product.price).toFixed(2)}
                    </div>

                    <p style = {{ color: "var(--textMuted)", lineHeight: 1.7, marginBottom: "2rem" }}>
                        {product.description || "Premium quality product."}
                    </p>

                    <div style = {{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                        <span style = {{ color: product.stock > 0 ? "var(--success)" : "var(--danger)", fontSize: "14px" }}>
                            {product.stock > 0 ? `✓ In stock (${product.stock})` : "✗ Out of stock"}
                        </span>
                    </div>

                    {(!user || user.role === 'client') && (
                        <div style = {{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "2rem" }}>
                            <div style= { { 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "8px", 
                                background: "var(--card)", 
                                border: "1px solid var(--border)", 
                                borderRadius: "8px", 
                                padding: "0.4rem" 
                            }}>
                                <button 
                                    onClick = {() => setQty(q => Math.max(1, q - 1))} 
                                    style={{ 
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
                                    {qty}
                                </span>
                                <button 
                                    onClick = {() => setQty(q => Math.min(product.stock, q + 1))} 
                                    style = {{ 
                                        background: "none", 
                                        border: "none", 
                                        color: "var(--text)", 
                                        width: "28px", 
                                        height: "28px", 
                                        cursor: "pointer", 
                                        fontSize: "16px" 
                                    }}>
                                        +
                                    </button>
                            </div>
                            <Btn 
                                size = "lg" 
                                onClick = {handleAddCart} 
                                disabled = {product.stock === 0} 
                                style = {{ flex: 1 }}
                            >
                                🛒 Add to Cart
                            </Btn>
                        </div>
                    )}

                    {user && user.role === 'client' && (
                        <div style = {{ marginTop: "1rem" }}>
                            <Btn 
                                variant = "secondary" 
                                onClick = {() => setReviewModal(true)}>
                                    Write a Review
                            </Btn>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h2 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.75rem", marginBottom: "1.5rem" }}>
                    Customer Reviews
                </h2>
                {reviews.length === 0 ? (
                    <EmptyState icon = "💬" title = "No reviews yet" subtitle = "Be the first to review this product" />
                ) : (
                    <div style = {{ display: "grid", gap: "1rem" }}>
                        {reviews.map(r => (
                            <Card key = {r.id} style = {{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style = {{ flex: 1 }}>
                                    <div style = {{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                                        <div>
                                            <span style = {{ fontWeight: 500, marginRight: "0.75rem" }}>
                                                {r.author?.username}
                                            </span>
                                            <StarRating value = {r.rating} />
                                        </div>
                                        <span style = {{ color: "var(--textDim)", fontSize: "13px" }}>
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    {r.comment && (
                                        <div 
                                            style={{ color: "var(--textMuted)", fontSize: "14px", lineHeight: 1.6, overflowWrap: "break-word" }}
                                            dangerouslySetInnerHTML={{ __html: r.comment }} 
                                        />
                                    )}
                                </div>
                                
                                {user && user.id === product.createdBy && (
                                    <div style = {{ marginLeft: "1rem", flexShrink: 0 }}>
                                        <Btn 
                                            variant = "danger" 
                                            size = "sm" 
                                            onClick = {async () => {
                                                if(!window.confirm("Report this review to the Admin?")) return;
                                                try {
                                                    await apiFetch(`/reviews/${r.id}/report`, { 
                                                        method: "PUT" 
                                                    });
                                                    toast("Review reported successfully.");
                                                } catch(e) { 
                                                    toast(e.message, "error"); 
                                                }
                                            }}
                                        >
                                            Report
                                        </Btn>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {reviewModal && (
                <Modal 
                    title = "Write a Review (XSS Demo)" 
                    onClose = {() => setReviewModal(false)}
                >
                    <div style = {{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <label style={{ fontSize: "13px", color: "var(--textMuted)", display: "block", marginBottom: "0.5rem" }}>
                                Select API Target
                            </label>
                            <select 
                                value={vulnLevel} 
                                onChange={e => setVulnLevel(e.target.value)}
                                style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
                            >
                                <option value="secure">Secure (Default)</option>
                                <option value="easy">Vulnerable - Easy (No Filtering)</option>
                                <option value="medium">Vulnerable - Medium (Basic Filtering)</option>
                            </select>
                        </div>
                        <div>
                            <label style = {{ fontSize: "13px", color: "var(--textMuted)", display: "block", marginBottom: "0.5rem" }}>
                                Rating
                            </label>
                            <StarRating     
                                value = {reviewForm.rating} 
                                onChange = {r => setReviewForm(f => ({ ...f, rating: r }))} 
                            />
                        </div>
                        <div>
                            <label style = {{ fontSize: "13px", color: "var(--textMuted)", display: "block", marginBottom: "0.5rem" }}>
                                Comment Payload
                            </label>
                            <textarea 
                                rows = {4} 
                                value = {reviewForm.comment} 
                                onChange = {e => setReviewForm(f => ({ ...f, comment: e.target.value }))} 
                                placeholder = "Inject your payload here..." 
                                style = {{ resize: "vertical" }} 
                            />
                        </div>
                        <Btn 
                            onClick = {submitReview} 
                            disabled = {submitting}
                        >
                            {submitting ? "Submitting…" : "Submit Review"}
                        </Btn>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default XSSDemoProductDetailPage;