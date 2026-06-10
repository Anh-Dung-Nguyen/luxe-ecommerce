import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useToast } from '../../components/shared/ToastProvider';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import Badge from '../../components/ui/Badge';
import StarRating from '../../components/shared/StarRating';
import Pagination from '../../components/shared/Pagination';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("false");
  const toast = useToast();

  const load = (p = 1) => {
    apiFetch(`/reviews?page=${p}&limit=20&approved=${filter}`).then(d => { 
        setReviews(d.data || []); 
        setTotalPages(d.totalPages || 1); 
    });
  };
  
  useEffect(() => { 
    load(page); 
  }, [page, filter]);

  const approve = async (id) => {
    try {
      await apiFetch(`/reviews/${id}/approve`, { 
        method: "PUT" 
      });
      toast("Review approved"); 
      load(page);
    } catch (err) { 
      toast(err.message, "error"); 
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this review permanently?")) {
      return;
    }
    try {
      await apiFetch(`/reviews/${id}`, { 
        method: "DELETE" 
      });
      toast("Review deleted"); 
      load(page);
    } catch (err) { 
      toast(err.message, "error"); 
    }
  };

  return (
    <div style = {{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style = {{ marginBottom: "2rem" }}>
        <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2rem" }}>
          Reviews Moderation
        </h1>
        <p style = {{ color: "var(--textMuted)", fontSize: "14px" }}>
          Approve pending reviews or delete inappropriate ones.
        </p>
      </div>

      <div style = {{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {[["Pending", "false"], ["Approved", "true"], ["All", ""]].map(([l, v]) => (
          <button 
            key = {v} 
            onClick = {() => { 
              setFilter(v); 
              setPage(1); 
            }}
            style = {{ 
                background: filter === v ? "var(--accent)" : "var(--card)", 
                color: filter === v ? "#1a1207" : "var(--textMuted)", 
                border: `1px solid ${filter === v ? "var(--accent)" : "var(--border)"}`, 
                padding: "6px 16px", 
                borderRadius: "20px", 
                cursor: "pointer", 
                fontSize: "13px" 
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <div style = {{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {reviews.map(r => (
          <Card key = {r.id} style = {{ padding: "1.25rem", display: "flex", gap: "1rem", justifyContent: "space-between", alignItems: "start" }}>
            <div style = {{ flex: 1 }}>
              <div style = {{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <span style = {{ fontWeight: 500, fontSize: "14px" }}>
                  {r.author?.username}
                </span>
                <span style = {{ color: "var(--textMuted)", fontSize: "13px" }}>
                  on
                </span>
                <span style = {{ color: "var(--accent)", fontSize: "13px" }}>
                  {r.Product?.name}
                </span>
                <StarRating value = {r.rating} />
              </div>
              {r.comment && <p style = {{ color: "var(--textMuted)", fontSize: "14px", lineHeight: 1.5 }}>{r.comment}</p>}
              <p style = {{ color: "var(--textDim)", fontSize: "12px", marginTop: "0.5rem" }}>
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
            
            <div style = {{ flexShrink: 0, display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {r.isReported && <Badge color = "danger">🚩 Reported by Seller</Badge>}
                <Badge color = {r.isApproved ? "success" : "warning"}>
                  {r.isApproved ? "Approved" : "Pending"}
                </Badge>
                {!r.isApproved && <Btn variant = "success" size = "sm" onClick = {() => approve(r.id)}>Approve</Btn>}
                <Btn variant = "danger" size = "sm" onClick = {() => del(r.id)}>
                  Delete
                </Btn> 
            </div>
          </Card>
        ))}
      </div>
      <Pagination page = {page} totalPages = {totalPages} onChange = {setPage} />
    </div>
  );
}

export default AdminReviewsPage;