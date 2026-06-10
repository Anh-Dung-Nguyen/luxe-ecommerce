import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useToast } from '../../components/shared/ToastProvider';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import Modal from '../../components/ui/Modal';

const SellerCategoriesPage = () => {
  const [cats, setCats] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [file, setFile] = useState(null);
  const toast = useToast();

  const load = () => apiFetch("/categories").then(d => setCats(d.data || []));
  
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      if (file) formData.append('image', file);

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/categories`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error saving category");
      }

      toast("Category created successfully"); 
      setModal(false); 
      load();
    } catch (err) { 
      toast(err.message, "error"); 
    }
  };

  return (
    <div style = {{ maxWidth: "900px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style = {{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2rem" }}>
            Categories
          </h1>
          <p style = {{ color: "var(--textMuted)", fontSize: "14px" }}>
            Create a new category for your products.
          </p>
        </div>
        <Btn onClick = {() => { setForm({ name: "", description: "" }); setFile(null); setModal(true); }}>
          + Create Category
        </Btn>
      </div>
      
      <div style = {{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
        {cats.map(c => (
          <Card key = {c.id} style = {{ padding: "1.25rem" }}>
            <p style = {{ fontWeight: 500, marginBottom: "0.25rem" }}>
              {c.name}
            </p>
            <p style = {{ color: "var(--textMuted)", fontSize: "13px" }}>
              {c.description || "No description"}
            </p>
          </Card>
        ))}
      </div>

      {modal && (
        <Modal title = "Create New Category" onClose = {() => setModal(false)}>
          <div style = {{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input 
              placeholder = "Name" 
              value = {form.name} 
              onChange = {e => setForm({ ...form, name: e.target.value })} 
            />
            <textarea rows = {3} placeholder = "Description" value = {form.description} onChange = {e => setForm({ ...form, description: e.target.value })} />
            <input type = "file" accept = "image/*" onChange = {e => setFile(e.target.files[0])} />
            <Btn onClick = {save}>
              Create Category
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default SellerCategoriesPage;