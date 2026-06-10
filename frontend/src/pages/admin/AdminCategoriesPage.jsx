import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useToast } from '../../components/shared/ToastProvider';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';

const AdminCategoriesPage = () => {
  const [cats, setCats] = useState([]);
  const toast = useToast();

  const load = () => apiFetch("/categories").then(d => setCats(d.data || []));
  useEffect(() => { 
    load(); 
  }, []);

  const del = async (id) => {
    if (!window.confirm("WARNING: Delete this category permanently?")) {
      return;
    }
    try {
      await apiFetch(`/categories/${id}`, { 
        method: "DELETE" 
      });
      toast("Category deleted by moderation"); 
      load();
    } catch (err) { 
      toast(err.message, "error"); 
    }
  };

  return (
    <div style = {{ maxWidth: "900px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style = {{ marginBottom: "2rem" }}>
        <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2rem" }}>
          Categories Moderation
        </h1>
        <p style = {{ color: "var(--textMuted)", fontSize: "14px" }}>
          View and moderate categories.
        </p>
      </div>

      <div style = {{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
        {cats.map(c => (
          <Card key = {c.id} style = {{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style = {{ fontWeight: 500, marginBottom: "0.25rem" }}>
                {c.name}
              </p>
              <p style = {{ color: "var(--textMuted)", fontSize: "13px" }}>
                {c.description || "No description"}
              </p>
            </div>
            <Btn variant = "danger" size = "sm" onClick = {() => del(c.id)}>
              Delete
            </Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminCategoriesPage;