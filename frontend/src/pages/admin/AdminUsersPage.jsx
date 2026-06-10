import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useToast } from '../../components/shared/ToastProvider';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/shared/Pagination';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const toast = useToast();

  const load = (p = 1) => {
    const q = new URLSearchParams({ page: p, limit: 15, ...(keyword ? { keyword } : {}) });
    apiFetch(`/users?${q}`).then(d => { 
      setUsers(d.data || []); 
      setTotalPages(d.totalPages || 1); 
    });
  };
  
  useEffect(() => { 
    load(page); 
  }, [page]);

  const changeRole = async (id, role) => {
    try {
      await apiFetch(`/users/${id}/role`, { 
        method: "PATCH", 
        body: JSON.stringify({ role }) 
      });
      toast("Role updated"); 
      load(page);
    } catch (err) { 
      toast(err.message, "error"); 
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }
    try {
      await apiFetch(`/users/${id}`, { 
        method: "DELETE" 
      });
      toast("User deleted"); 
      load(page);
    } catch (err) { 
      toast(err.message, "error"); 
    }
  };

  return (
    <div style = {{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2rem", marginBottom: "2rem" }}>
        Users
      </h1>

      <div style = {{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <input 
          placeholder = "Search by email…" 
          value = {keyword} 
          onChange = {e => setKeyword(e.target.value)} 
          style = {{ maxWidth: "300px" }} 
        />
        <Btn onClick = {() => { setPage(1); load(1); }}>
          Search
        </Btn>
      </div>

      <Card style = {{ overflow: "hidden" }}>
        <table style = {{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style = {{ borderBottom: "1px solid var(--border)" }}>
              {["ID", "Username", "Role", "Verified", "Joined", "Actions"].map(h => (
                <th key = {h} style = {{ padding: "1rem", textAlign: "left", fontSize: "12px", color: "var(--textMuted)", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key = {u.id} style = {{ borderBottom: "1px solid var(--border)" }}>
                <td style = {{ padding: "1rem", color: "var(--textDim)", fontSize: "13px" }}>
                  #{u.id}
                </td>
                <td style = {{ padding: "1rem", fontSize: "14px" }}>
                  {u.username}
                </td>
                <td style = {{ padding: "1rem" }}>
                  <select value = {u.role} onChange = {e => changeRole(u.id, e.target.value)} style = {{ width: "auto", padding: "4px 8px", fontSize: "12px" }}>
                    {["admin", "seller", "client"].map(r => <option key = {r} value = {r}>{r}</option>)}
                  </select>
                </td>
                <td style = {{ padding: "1rem" }}>
                  <Badge color = {u.isVerified ? "success" : "warning"}>
                    {u.isVerified ? "Yes" : "No"}
                  </Badge>
                </td>
                <td style = {{ padding: "1rem", color: "var(--textDim)", fontSize: "13px" }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style = {{ padding: "1rem" }}>
                  <Btn variant = "danger" size = "sm" onClick = {() => del(u.id)}>
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