import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useToast } from '../../components/shared/ToastProvider';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ code: "", discountType: "percent", discountValue: "", minOrderValue: "0", maxUses: "", expiresAt: "" });
  const toast = useToast();

  const load = () => apiFetch("/coupons").then(d => setCoupons(d.data || [])).catch(() => {});
  useEffect(() => { 
    load(); 
  }, []);

  const save = async () => {
    try {
      await apiFetch("/coupons", { 
        method: "POST", 
        body: JSON.stringify({ 
          ...form, 
          discountValue: parseFloat(form.discountValue), 
          minOrderValue: parseFloat(form.minOrderValue), 
          maxUses: form.maxUses ? parseInt(form.maxUses) : null 
        }) 
      });
      toast("Coupon created"); 
      setModal(false); 
      load();
    } catch (err) { 
      toast(err.message, "error"); 
    }
  };

  const toggle = async (id) => {
    try {
      await apiFetch(`/coupons/${id}/toggle`, { 
        method: "PATCH" 
      });
      load();
    } catch (err) { 
      toast(err.message, "error"); 
    }
  };

  return (
    <div style = {{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style = {{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2rem" }}>
          Coupons
        </h1>
        <Btn onClick = {() => setModal(true)}>
          + New Coupon
        </Btn>
      </div>

      <div style = {{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {coupons.map(c => (
          <Card key = {c.id} style = {{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style = {{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.25rem" }}>
                <span style = {{ fontFamily: "monospace", fontSize: "16px", fontWeight: 600, color: "var(--accent)", letterSpacing: "2px" }}>
                  {c.code}
                </span>
                <Badge color = {c.isActive ? "success" : "danger"}>
                  {c.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p style = {{ color: "var(--textMuted)", fontSize: "13px" }}>
                {c.discountType === "percent" ? `${c.discountValue}%` : `$${c.discountValue}`} off
                {c.minOrderValue > 0 && ` · Min order $${c.minOrderValue}`}
                {c.maxUses && ` · ${c.usedCount}/${c.maxUses} used`}
                {c.expiresAt && ` · Expires ${new Date(c.expiresAt).toLocaleDateString()}`}
              </p>
            </div>
            <Btn variant = {c.isActive ? "danger" : "success"} size = "sm" onClick = {() => toggle(c.id)}>
              {c.isActive ? "Disable" : "Enable"}
            </Btn>
          </Card>
        ))}
      </div>

      {modal && (
        <Modal title = "New Coupon" onClose = {() => setModal(false)}>
          <div style = {{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input 
              placeholder = "Code (e.g. SUMMER20)" 
              value = {form.code} 
              onChange = {e => setForm({ ...form, code: e.target.value.toUpperCase() })} 
              style={{ fontFamily: "monospace", letterSpacing: "2px" }} 
            />
            <select value = {form.discountType} onChange = {e => setForm({ ...form, discountType: e.target.value })}>
              <option value = "percent">
                Percentage (%)
              </option>
              <option value = "fixed">
                Fixed amount ($)
              </option>
            </select>
            <input 
              type = "number" 
              placeholder = "Discount Value" 
              value = {form.discountValue} 
              onChange = {e => setForm({ ...form, discountValue: e.target.value })} 
            />
            <input 
              type = "number" 
              placeholder = "Minimum order value ($0)" 
              value = {form.minOrderValue} 
              onChange = {e => setForm({ ...form, minOrderValue: e.target.value })} 
            />
            <input 
              type = "number" 
              placeholder = "Max uses (leave empty for unlimited)" 
              value = {form.maxUses} 
              onChange = {e => setForm({ ...form, maxUses: e.target.value })} 
            />
            <input 
              type = "datetime-local" 
              value = {form.expiresAt} 
              onChange = {e => setForm({ ...form, expiresAt: e.target.value })} 
            />
            <Btn onClick = {save}>
              Create Coupon
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdminCouponsPage;