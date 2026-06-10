import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/shared/EmptyState';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        apiFetch("/dashboard")
        .then(d => setStats(d.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style = {{ textAlign: "center", padding: "5rem" }}>
                <Spinner />
            </div>
        )
    }
    if (!stats) {
        return (
            <EmptyState icon = "🔒" title = "Access denied" subtitle = "You do not have permission to view this page." />
        )
    }

    const StatCard = ({ label, value, color = "var(--accent)", sub }) => (
        <Card style = {{ padding: "1.5rem" }}>
            <p style = {{ color: "var(--textMuted)", fontSize: "13px", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                {label}
            </p>
            <p style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2.2rem", color }}>
                {value}
            </p>
            {sub && <p style = {{ color: "var(--textDim)", fontSize: "12px", marginTop: "0.25rem" }}>{sub}</p>}
        </Card>
    );

    return (
        <div style = {{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                Dashboard
            </h1>
            <p style = {{ color: "var(--textMuted)", marginBottom: "2.5rem" }}>
                Platform overview
            </p>

            <div style = {{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
                <StatCard label = "Total Products" value = {stats.totalProducts} />
                <StatCard label = "Total Users" value = {stats.totalUsers} sub = {`${stats.userBreakdown?.sellers} sellers · ${stats.userBreakdown?.clients} clients`} />
                <StatCard label = "Inventory Value" value = {`$${Math.round(stats.totalInventoryValue).toLocaleString()}`} color="var(--success)" />
                <StatCard label = "Low Stock Alerts" value = {stats.actionRequired?.lowStockCount} color = {stats.actionRequired?.lowStockCount > 0 ? "#f97316" : "var(--success)"} />
            </div>

            {/* Alertes de stock faible */}
            {stats.actionRequired?.itemsToRestock?.length > 0 && (
                <Card style = {{ padding: "1.5rem", marginBottom: "2rem" }}>
                    <h3 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.2rem", marginBottom: "1rem", color: "#f97316" }}>
                        ⚠️ Low Stock Items
                    </h3>
                    <div style = {{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {stats.actionRequired.itemsToRestock.map(p => (
                            <div key = {p.id} style = {{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
                                <span style = {{ fontSize: "14px" }}>
                                    {p.name}
                                </span>
                                <Badge color = {p.stock === 0 ? "danger" : "warning"}>
                                    {p.stock} left
                                </Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Raccourcis de navigation Admin */}
            <h2 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.5rem", marginBottom: "1rem" }}>
                Management
            </h2>
            <div style = {{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
                {[
                    ["📦 Products", "/admin/products"], 
                    ["📋 Orders", "/admin/orders"], 
                    ["👥 Users", "/admin/users"], 
                    ["🏷️ Categories", "/admin/categories"], 
                    ["🎟️ Coupons", "/admin/coupons"], 
                    ["⭐ Reviews", "/admin/reviews"]
                ].map(([label, target]) => (
                    <button 
                        key = {target} 
                        onClick = {() => navigate(target)}
                        style = {{ 
                            background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", 
                            padding: "1.5rem 1rem", textAlign: "center", cursor: "pointer", color: "var(--text)", 
                            fontSize: "15px", fontWeight: 500, transition: "all 0.2s" 
                        }}
                        onMouseEnter = {e => { e.currentTarget.style.borderColor = "var(--accentDim)"; e.currentTarget.style.background = "#201c12"; }}
                        onMouseLeave = {e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--card)"; }}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;