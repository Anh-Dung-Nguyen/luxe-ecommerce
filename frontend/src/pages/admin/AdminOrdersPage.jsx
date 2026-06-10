import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useToast } from '../../components/shared/ToastProvider';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/shared/Pagination';
import StatusBadge from '../../components/shared/StatusBadge';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: "", trackingNumber: "" });
  const toast = useToast();
  
  const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

  const load = (p = 1, s = statusFilter) => {
    const q = new URLSearchParams({ page: p, limit: 20, ...(s ? { status: s } : {}) });
    apiFetch(`/orders?${q}`).then(d => { 
      setOrders(d.data || []); 
      setTotalPages(d.totalPages || 1); 
    });
  };
  
  useEffect(() => { 
    load(page); 
  }, [page, statusFilter]);

  const updateStatus = async () => {
    try {
      await apiFetch(`/orders/${selected.id}/status`, { 
        method: "PUT", 
        body: JSON.stringify(statusForm) 
      });
      toast("Status updated"); 
      setSelected(null); 
      load(page);
    } catch (err) { 
      toast(err.message, "error"); 
    }
  };

  return (
    <div style = {{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2rem", marginBottom: "2rem" }}>
        Orders
      </h1>

      <div style = {{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button 
          onClick = {() => { setStatusFilter(""); setPage(1); }} 
          style = {{ background: !statusFilter ? "var(--accent)" : "var(--card)", color: !statusFilter ? "#1a1207" : "var(--textMuted)", border: `1px solid ${!statusFilter ? "var(--accent)" : "var(--border)"}`, padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "13px" }}
        >
          All
        </button>
        {STATUSES.map(s => (
          <button 
            key = {s} 
            onClick = {() => { setStatusFilter(s); setPage(1); }} 
            style = {{ background: statusFilter === s ? "var(--accent)" : "var(--card)", color: statusFilter === s ? "#1a1207" : "var(--textMuted)", border: `1px solid ${statusFilter === s ? "var(--accent)" : "var(--border)"}`, padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "13px", textTransform: "capitalize" }}
          >
            {s}
          </button>
        ))}
      </div>

      <Card style = {{ overflow: "hidden" }}>
        <table style = {{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style = {{ borderBottom: "1px solid var(--border)" }}>
              {["Order", "Customer", "Total", "Status", "Payment", "Date", "Action"].map(h => (
                <th key = {h} style = {{ padding: "1rem", textAlign: "left", fontSize: "12px", color: "var(--textMuted)", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key = {o.id} style = {{ borderBottom: "1px solid var(--border)" }}>
                <td style = {{ padding: "1rem", fontWeight: 500 }}>
                  #{o.id}
                </td>
                <td style = {{ padding: "1rem", color: "var(--textMuted)", fontSize: "13px" }}>
                  {o.user?.username}
                </td>
                <td style = {{ padding: "1rem", color: "var(--accent)", fontFamily: "var(--fontDisplay)" }}>
                  ${parseFloat(o.totalPrice).toFixed(2)}
                </td>
                <td style = {{ padding: "1rem" }}>
                  <StatusBadge status = {o.status} />
                </td>
                <td style = {{ padding: "1rem" }}>
                  <StatusBadge status = {o.paymentStatus} />
                </td>
                <td style = {{ padding: "1rem", color: "var(--textDim)", fontSize: "13px" }}>
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td style = {{ padding: "1rem" }}>
                  <Btn 
                    variant = "secondary" 
                    size = "sm" 
                    onClick={() => { setSelected(o); setStatusForm({ status: o.status, trackingNumber: o.trackingNumber || "" }); }}
                  >
                    Update
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Pagination page = {page} totalPages = {totalPages} onChange = {setPage} />

      {selected && (
        <Modal title = {`Update Order #${selected.id}`} onClose = {() => setSelected(null)}>
          <div style = {{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <select value = {statusForm.status} onChange = {e => setStatusForm({ ...statusForm, status: e.target.value })}>
              {STATUSES.map(s => <option key = {s} value = {s}>{s}</option>)}
            </select>
            <input 
              placeholder = "Tracking Number (e.g. TRK123)" 
              value = {statusForm.trackingNumber} 
              onChange = {e => setStatusForm({ ...statusForm, trackingNumber: e.target.value })} 
            />
            <Btn onClick = {updateStatus}>
              Save Changes
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdminOrdersPage;