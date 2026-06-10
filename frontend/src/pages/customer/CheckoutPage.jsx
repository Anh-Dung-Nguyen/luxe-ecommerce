import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { apiFetch } from '../../services/api';
import { clearCart } from '../../store/cartSlice';
import { useToast } from '../../components/shared/ToastProvider';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    
    const cartItems = useSelector(state => state.cart.items) || [];
    const cartTotal = useSelector(state => state.cart.total) || 0;

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [couponData, setCouponData] = useState(null);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [addAddressModal, setAddAddressModal] = useState(false);
    const [newAddr, setNewAddr] = useState({ fullName: "", phone: "", street: "", city: "", postalCode: "", country: "VN" });

    useEffect(() => {
        apiFetch("/addresses").then(d => { 
            setAddresses(d.data || []); 
            if (d.data?.length) {
                setSelectedAddress(String(d.data.find(a => a.isDefault)?.id || d.data[0].id)); 
            }
        }).catch(() => {});
    }, []);

    const validateCoupon = async () => {
        if (!couponCode) {
            return;
        }
        try {
            const data = await apiFetch(`/coupons/validate/${couponCode}`);
            setCouponData(data.data);
            toast("Coupon applied!");
        } catch (err) { 
            toast(err.message, "error"); 
            setCouponData(null); 
        }
    };

    const discount = couponData ? (couponData.discountType === "percent" ? cartTotal * couponData.discountValue / 100 : couponData.discountValue) : 0;
    const finalTotal = Math.max(0, cartTotal - discount);

    const saveAddress = async () => {
        try {
            const a = await apiFetch("/addresses", { 
                method: "POST", 
                body: JSON.stringify(newAddr) 
            });
            setAddresses(prev => [...prev, a.data]);
            setSelectedAddress(String(a.data.id));
            setAddAddressModal(false);
            toast("Address saved");
        } catch (err) { 
            toast(err.message, "error"); 
        }
    };

    const placeOrder = async () => {
        if (!selectedAddress) { 
            toast("Please select an address", "warning"); 
            return; 
        }
        setLoading(true);
        try {
            await apiFetch("/orders", { 
                method: "POST", 
                body: JSON.stringify({ 
                    addressId: parseInt(selectedAddress), 
                    couponCode: couponCode || undefined, notes 
                }) 
            });
            dispatch(clearCart());
            toast("Order placed successfully! 🎉");
            navigate("/my-orders");
        } catch (err) { 
            toast(err.message, "error"); 
        } finally { 
            setLoading(false); 
        }
    };

    if (cartItems.length === 0) {
        return (
            <div style = {{ textAlign: "center", padding: "5rem" }}>Your cart is empty.</div>
        )
    }

    return (
        <div style = {{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2.5rem", marginBottom: "2rem" }}>
                Checkout
            </h1>

            <div style = {{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem", alignItems: "start" }}>
                <div style = {{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                
                    {/* Address Section */}
                    <Card style = {{ padding: "1.5rem" }}>
                        <div style = {{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                            <h3 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.2rem" }}>
                                Delivery Address
                            </h3>
                            <Btn 
                                variant = "secondary" 
                                size = "sm" 
                                onClick = {() => setAddAddressModal(true)}
                            >
                                + New
                            </Btn>
                        </div>
                        {addresses.length === 0 ? (
                            <p style = {{ color: "var(--textMuted)", fontSize: "14px" }}>
                                No addresses yet. Add one above.
                            </p>
                        ) : (
                            <div style = {{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {addresses.map(a => (
                                    <label 
                                        key = {a.id} 
                                        style = {{ 
                                            display: "flex", 
                                            gap: "1rem", 
                                            cursor: "pointer", 
                                            padding: "1rem", 
                                            background: selectedAddress === String(a.id) ? "#201c12" : "var(--surface)", 
                                            border: `1px solid ${selectedAddress === String(a.id) ? "var(--accentDim)" : "var(--border)"}`, 
                                            borderRadius: "10px" 
                                        }}
                                    >
                                        <input 
                                            type = "radio" 
                                            name = "address" 
                                            value = {a.id} 
                                            checked = {selectedAddress === String(a.id)} 
                                            onChange = {() => setSelectedAddress(String(a.id))} 
                                            style={{ width: "auto", marginTop: "3px" }} 
                                        />
                                        <div>
                                            <p style = {{ fontWeight: 500 }}>
                                                {a.fullName} · {a.phone}
                                            </p>
                                            <p style = {{ color: "var(--textMuted)", fontSize: "13px" }}>
                                                {a.street}, {a.city}, {a.postalCode}, {a.country}
                                            </p>
                                            {a.isDefault && <Badge color = "accent">Default</Badge>}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Coupon Section */}
                    <Card style = {{ padding: "1.5rem" }}>
                        <h3 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.2rem", marginBottom: "1rem" }}>
                            Coupon Code
                        </h3>
                        <div style = {{ display: "flex", gap: "0.75rem" }}>
                            <input 
                                placeholder = "Enter coupon code" 
                                value = {couponCode} 
                                onChange = {e => setCouponCode(e.target.value)} 
                                onKeyDown = {e => e.key === "Enter" && validateCoupon()} 
                            />
                            <Btn   
                                variant = "secondary" 
                                onClick = {validateCoupon}
                            >
                                Apply
                            </Btn>
                        </div>
                        {couponData && 
                            <p style = {{ color: "var(--success)", fontSize: "13px", marginTop: "0.5rem" }}>
                                ✓ {couponData.discountType === "percent" ? `${couponData.discountValue}% off` : `$${couponData.discountValue} off`} applied
                            </p>
                        }
                    </Card>

                    {/* Notes Section */}
                    <Card style = {{ padding: "1.5rem" }}>
                        <h3 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.2rem", marginBottom: "1rem" }}>
                            Order Notes
                        </h3>
                        <textarea rows = {3} placeholder = "Special instructions (optional)…" value = {notes} onChange = {e => setNotes(e.target.value)} />
                    </Card>
                </div>

                {/* Summary Side */}
                <Card style = {{ padding: "1.5rem", position: "sticky", top: "80px" }}>
                    <h3 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.25rem", marginBottom: "1.5rem" }}>
                        Order Summary
                    </h3>
                    <div style = {{ maxHeight: "280px", overflow: "auto", marginBottom: "1rem" }}>
                        {cartItems.map(item => (
                            <div key = {item.id} style = {{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
                                <span style = {{ fontSize: "13px", color: "var(--textMuted)" }}>
                                    {item.product?.name} × {item.quantity}
                                </span>
                                <span style = {{ fontSize: "13px" }}>
                                    ${(item.quantity * parseFloat(item.product?.price || 0)).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div style = {{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "14px", color: "var(--textMuted)" }}>
                        <span>
                            Subtotal
                        </span>
                        <span style = {{ color: "var(--text)" }}>
                            ${cartTotal.toFixed(2)}
                        </span>
                    </div>
                    {discount > 0 && (
                        <div style = {{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "14px", color: "var(--success)" }}>
                            <span>
                                Discount
                            </span>
                            <span>
                                -${discount.toFixed(2)}
                            </span>
                        </div>
                    )}
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
                        <span style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.4rem", color: "var(--accent)" }}>
                            ${finalTotal.toFixed(2)}
                        </span>
                    </div>
                    <Btn 
                        size = "lg" 
                        onClick = {placeOrder} 
                        disabled = {loading} 
                        style = {{ width: "100%" }}
                    >
                        {loading ? "Placing Order…" : "Place Order →"}
                    </Btn>
                </Card>
            </div>

            {addAddressModal && (
                <Modal 
                    title = "New Address" 
                    onClose = {() => setAddAddressModal(false)}
                >
                    <div style = {{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {[["fullName", "Full Name"], ["phone", "Phone"], ["street", "Street Address"], ["city", "City"], ["postalCode", "Postal Code"], ["country", "Country"]].map(([k, l]) => (
                            <div key = {k}>
                                <label style = {{ fontSize: "12px", color: "var(--textMuted)", display: "block", marginBottom: "4px" }}>
                                    {l}
                                </label>
                                <input 
                                    value = {newAddr[k]} 
                                    onChange = {e => setNewAddr(n => ({ ...n, [k]: e.target.value }))} 
                                />
                            </div>
                        ))}
                        <Btn onClick = {saveAddress} style = {{ marginTop: "0.5rem" }}>
                            Save Address
                        </Btn>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default CheckoutPage;