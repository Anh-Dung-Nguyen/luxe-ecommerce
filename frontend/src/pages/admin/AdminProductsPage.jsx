import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useToast } from '../../components/shared/ToastProvider';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import Pagination from '../../components/shared/Pagination';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();

  const load = (p = 1) => {
    apiFetch(`/products?page=${p}&limit=15`).then(d => { 
      setProducts(d.data || []); 
      setTotalPages(d.totalPages || 1); 
    });
  };

  useEffect(() => { 
    load(page); 
  }, [page]);

  const del = async (id) => {
    if (!window.confirm("WARNING: As an admin, you are about to delete a seller's product permanently. Proceed?")) {
      return;
    }
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      toast("Product deleted by moderation"); 
      load(page);
    } catch (err) { 
      toast(err.message, "error"); 
    }
  };

  return (
    <div style = {{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style = {{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
            <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2rem" }}>
              Products Moderation
            </h1>
            <p style = {{ color: "var(--textMuted)", fontSize: "14px" }}>
              View and moderate products across all sellers.
            </p>
        </div>
      </div>

      <Card style = {{ overflow: "hidden" }}>
        <table style = {{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style = {{ borderBottom: "1px solid var(--border)" }}>
              {["Name", "Price", "Seller ID", "Category", "Actions"].map(h => (
                <th key = {h} style = {{ padding: "1rem", textAlign: "left", fontSize: "12px", color: "var(--textMuted)", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key = {p.id} style = {{ borderBottom: "1px solid var(--border)" }}>
                <td style = {{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style = {{ fontSize: "14px", fontWeight: 500 }}>
                    {p.name}
                  </span>
                </td>
                <td style = {{ padding: "1rem", color: "var(--accent)", fontFamily: "var(--fontDisplay)" }}>
                  ${parseFloat(p.price).toFixed(2)}
                </td>
                <td style = {{ padding: "1rem", color: "var(--info)", fontSize: "13px" }}>
                  User #{p.createdBy}
                </td>
                <td style = {{ padding: "1rem", color: "var(--textMuted)", fontSize: "13px" }}>
                  {p.category?.name || "—"}
                </td>
                <td style = {{ padding: "1rem" }}>
                  <Btn variant = "danger" size = "sm" onClick = {() => del(p.id)}>
                    Delete
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Pagination page = {page} totalPages = {totalPages} onChange = {setPage} />
    </div>
  );
}

export default AdminProductsPage;