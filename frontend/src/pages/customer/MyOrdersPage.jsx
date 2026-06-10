import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useToast } from '../../components/shared/ToastProvider';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import StatusBadge from '../../components/shared/StatusBadge';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        apiFetch("/orders/my").then(d => setOrders(d.data || [])).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const cancel = async (id) => {
        try {
            await apiFetch(`/orders/my/${id}/cancel`, { 
                method: "PUT" 
            });
            toast("Order cancelled");
            const d = await apiFetch("/orders/my");
            setOrders(d.data || []);
        } catch (err) { 
            toast(err.message, "error"); 
        }
    };

    if (loading) {
        return (
            <div style = {{ textAlign: "center", padding: "5rem" }}>
                <Spinner />
            </div>
        )
    }

    return (
        <div style = {{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2.5rem", marginBottom: "2rem" }}>
                My Orders
            </h1>
            {orders.length === 0 ? (
                <EmptyState icon = "📦" title = "No orders yet" subtitle = "Place your first order today" />
            ) : (
                <div style = {{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {orders.map(o => (
                        <Card key = {o.id} style = {{ padding: "1.25rem" }}>
                            <div style = {{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "0.75rem" }}>
                                <div>
                                    <p style = {{ fontWeight: 500, marginBottom: "0.25rem" }}>
                                        Order #{o.id}
                                    </p>
                                    <p style = {{ color: "var(--textMuted)", fontSize: "13px" }}>
                                        {new Date(o.createdAt).toLocaleString()}
                                    </p>
                                    <div style = {{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                        <StatusBadge status = {o.status} />
                                        <StatusBadge status = {o.paymentStatus} />
                                        {o.trackingNumber && <Badge color="info">Track: {o.trackingNumber}</Badge>}
                                    </div>
                                </div>
                                <div style = {{ textAlign: "right" }}>
                                    <p style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.3rem", color: "var(--accent)" }}>
                                        ${parseFloat(o.totalPrice).toFixed(2)}
                                    </p>
                                    <p style = {{ color: "var(--textMuted)", fontSize: "13px" }}>
                                        {o.items?.length || 0} items
                                    </p>
                                </div>
                            </div>

                            {/* Items preview */}
                            {o.items && o.items.length > 0 && (
                                <div style = {{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    {o.items.slice(0, 4).map(item => (
                                        <div 
                                            key = {item.id} 
                                            style = {{ fontSize: "12px", color: "var(--textMuted)", background: "var(--surface)", padding: "4px 8px", borderRadius: "6px" }}
                                        >
                                            {item.product?.name} × {item.quantity}
                                        </div>
                                    ))}
                                    {o.items.length > 4 && <span style={{ fontSize: "12px", color: "var(--textDim)" }}>+{o.items.length - 4} more</span>}
                                </div>
                            )}

                            <div style = {{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                                {["pending", "paid"].includes(o.status) && (
                                    <Btn variant = "danger" size = "sm" onClick = {() => cancel(o.id)}>
                                        Cancel
                                    </Btn>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrdersPage;