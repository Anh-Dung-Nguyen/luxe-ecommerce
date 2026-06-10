import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { useToast } from '../../components/shared/ToastProvider';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/shared/StatusBadge';
import Badge from '../../components/ui/Badge';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const toast = useToast();

  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  
  const [products, setProducts] = useState([]);
  const [productModal, setProductModal] = useState(false);
  const [editProd, setEditProd] = useState(null);
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", stock: "", categoryId: "" });
  const [file, setFile] = useState(null);

  const [recentOrders, setRecentOrders] = useState([]);
  const [myCoupons, setMyCoupons] = useState([]);
  const [orderModal, setOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: "", trackingNumber: "" });
  const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

  const load = () => {
    if (!user) {
      return;
    }
    
    apiFetch('/dashboard/seller').then(d => setStats(d.data)).catch(() => {});
    apiFetch(`/products?limit=100&sellerId=${user.id}`).then(d => setProducts(d.data || []));
    apiFetch('/orders?limit=5').then(d => setRecentOrders(d.data || [])).catch(() => {});
    apiFetch('/coupons').then(d => setMyCoupons(d.data || [])).catch(() => {});
  };

  useEffect(() => { 
    load(); 
    apiFetch("/categories").then(d => setCategories(d.data || [])); 
  }, [user]);

  const openNewProduct = () => { 
    setEditProd(null); 
    setProductForm({ name: "", description: "", price: "", stock: "", categoryId: "" }); 
    setFile(null); 
    setProductModal(true); 
  };
  const openEditProduct = (p) => { 
    setEditProd(p); 
    setProductForm({ name: p.name, description: p.description || "", price: p.price, stock: p.stock, categoryId: p.categoryId || "" }); 
    setFile(null); 
    setProductModal(true); 
  };

  const saveProduct = async () => {
    try {
      const formData = new FormData();
      Object.keys(productForm).forEach(key => formData.append(key, productForm[key]));
      if (file) {
        formData.append('image', file);
      }

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/products${editProd ? `/${editProd.id}` : ''}`, {
        method: editProd ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (!res.ok) {
        throw new Error("Error saving product");
      }
      toast(editProd ? "Product updated" : "Product created");
      setProductModal(false); 
      load();
    } catch (err) { 
      toast(err.message, "error"); 
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      toast("Product deleted"); load();
    } catch (err) { 
      toast(err.message, "error"); 
    }
  };

  const updateOrderStatus = async () => {
    try {
      await apiFetch(`/orders/${selectedOrder.id}/status`, { method: "PUT", body: JSON.stringify(statusForm) });
      toast("Order status updated"); 
      setOrderModal(false); 
      load();
    } catch (err) { 
      toast(err.message, "error"); 
    }
  };

  const StatCard = ({ label, value, color = "var(--accent)" }) => (
    <Card style = {{ padding: "1.5rem" }}>
      <p style = {{ color: "var(--textMuted)", fontSize: "13px", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "1px" }}>
        {label}
      </p>
      <p style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2.2rem", color }}>
        {value}
      </p>
    </Card>
  );

  return (
    <div style = {{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      
      <div style = {{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2rem" }}>
            Seller Dashboard
          </h1>
          <p style = {{ color: "var(--textMuted)", fontSize: "14px" }}>
            Manage your catalog, track sales, and process orders.
          </p>
        </div>
        <Btn onClick = {openNewProduct}>
          + New Product
        </Btn>
      </div>

      {stats && (
        <div style = {{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
          <StatCard label = "Total Products" value = {stats.totalProducts} />
          <StatCard label = "Items Sold" value = {stats.totalSold} color="var(--info)" />
          <StatCard label = "Total Revenue" value = {`$${stats.totalRevenue.toFixed(2)}`} color="var(--success)" />
        </div>
      )}

      <div style = {{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        
        <Card style = {{ padding: "1.5rem" }}>
          <div style = {{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.3rem" }}>
              Recent Orders
            </h3>
            <Btn variant = "ghost" size = "sm" onClick = {() => navigate('/seller/orders')}>
              View All →
            </Btn>
          </div>
          
          {recentOrders.length === 0 ? (
            <p style = {{ color: "var(--textMuted)", fontSize: "14px", fontStyle: "italic" }}>
              No orders placed yet.
            </p>
          ) : (
            <div style = {{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {recentOrders.map(o => (
                <div key = {o.id} style = {{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <span style = {{ fontWeight: 500, fontSize: "14px", marginRight: "0.5rem" }}>
                      Order #{o.id}
                    </span>
                    <StatusBadge status = {o.status} />
                    <p style = {{ color: "var(--textMuted)", fontSize: "12px", marginTop: "4px" }}>
                      {new Date(o.createdAt).toLocaleDateString()} - ${parseFloat(o.totalPrice).toFixed(2)}
                    </p>
                  </div>
                  <Btn 
                    variant = "secondary" 
                    size = "sm" 
                    onClick = {() => { setSelectedOrder(o); setStatusForm({ status: o.status, trackingNumber: o.trackingNumber || "" }); setOrderModal(true); }}
                  >
                    Update
                  </Btn>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* BLOC : COUPONS ACTIFS */}
        <Card style = {{ padding: "1.5rem" }}>
          <div style = {{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.3rem" }}>
              My Coupons
            </h3>
            <Btn variant = "ghost" size = "sm" onClick = {() => navigate('/seller/coupons')}>
              Manage →
            </Btn>
          </div>
          
          {myCoupons.length === 0 ? (
             <p style = {{ color: "var(--textMuted)", fontSize: "14px", fontStyle: "italic" }}>You haven't created any coupons.</p>
          ) : (
            <div style = {{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {myCoupons.slice(0, 5).map(c => (
                <div key = {c.id} style = {{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <span style = {{ fontFamily: "monospace", fontSize: "15px", fontWeight: 600, color: "var(--accent)" }}>
                      {c.code}
                    </span>
                    <p style = {{ color: "var(--textMuted)", fontSize: "12px", marginTop: "4px" }}>
                      {c.discountType === "percent" ? `${c.discountValue}% off` : `$${c.discountValue} off`} 
                      {c.maxUses && ` · Used ${c.usedCount}/${c.maxUses}`}
                    </p>
                  </div>
                  <Badge color = {c.isActive ? "success" : "danger"}>
                    {c.isActive ? "Active" : "Off"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>

      {/* RACCOURCIS */}
      <h2 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.5rem", marginBottom: "1rem" }}>
        Store Management
      </h2>
      <div style = {{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
        {[
          ["📦 Orders History", "/seller/orders"], 
          ["🏷️ Categories", "/seller/categories"], 
          ["🎟️ Marketing", "/seller/coupons"]
        ].map(([label, target]) => (
          <button 
            key = {target} 
            onClick = {() => navigate(target)}
            style = {{ 
              background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", 
              padding: "1.25rem 1rem", textAlign: "center", cursor: "pointer", color: "var(--text)", 
              fontSize: "15px", fontWeight: 500, transition: "all 0.2s" 
            }}
            onMouseEnter = {e => { e.currentTarget.style.borderColor = "var(--accentDim)"; e.currentTarget.style.background = "#201c12"; }}
            onMouseLeave = {e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--card)"; }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* CATALOGUE PRODUITS */}
      <h2 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.5rem", marginBottom: "1rem" }}>
        My Products Catalog
      </h2>
      <Card style = {{ overflow: "hidden" }}>
        <table style = {{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style = {{ borderBottom: "1px solid var(--border)" }}>
              {["Product", "Price", "Stock", "Sold", "Actions"].map(h => (
                <th key = {h} style = {{ padding: "1rem", textAlign: "left", fontSize: "12px", color: "var(--textMuted)", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const soldCount = stats?.salesPerProduct?.[p.id] || 0;
              return (
                <tr key = {p.id} style = {{ borderBottom: "1px solid var(--border)" }}>
                  <td style = {{ padding: "1rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {p.image && <img src = {`http://localhost:5000${p.image}`} alt = "img" style = {{ width: "32px", height: "32px", borderRadius: "4px", objectFit: "cover" }} />}
                    {p.name}
                  </td>
                  <td style = {{ padding: "1rem", color: "var(--accent)", fontFamily: "var(--fontDisplay)" }}>
                    ${parseFloat(p.price).toFixed(2)}
                  </td>
                  <td style = {{ padding: "1rem" }}>
                    {p.stock}
                  </td>
                  <td style = {{ padding: "1rem", color: soldCount > 0 ? "var(--success)" : "var(--textMuted)", fontWeight: "bold" }}>
                    {soldCount}
                  </td>
                  <td style = {{ padding: "1rem" }}>
                    <div style = {{ display: "flex", gap: "0.5rem" }}>
                      <Btn variant = "secondary" size = "sm" onClick = {() => openEditProduct(p)}>
                        Edit
                      </Btn>
                      <Btn variant = "danger" size = "sm" onClick = {() => deleteProduct(p.id)}>
                        Del
                      </Btn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* MODAL : PRODUITS */}
      {productModal && (
        <Modal title = {editProd ? "Edit Product" : "New Product"} onClose = {() => setProductModal(false)}>
          <div style = {{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input placeholder = "Name" value = {productForm.name} onChange = {e => setProductForm({ ...productForm, name: e.target.value })} />
            <input type = "number" placeholder = "Price" value = {productForm.price} onChange = {e => setProductForm({ ...productForm, price: e.target.value })} />
            <input type = "number" placeholder = "Stock" value = {productForm.stock} onChange = {e => setProductForm({ ...productForm, stock: e.target.value })} />
            <textarea rows = {3} placeholder = "Description" value = {productForm.description} onChange = {e => setProductForm({ ...productForm, description: e.target.value })} />
            <select value = {productForm.categoryId} onChange = {e => setProductForm({ ...productForm, categoryId: e.target.value })}>
              <option value = "">
                Select a category
              </option>
              {categories.map(c => <option key = {c.id} value = {c.id}>{c.name}</option>)}
            </select>
            <input type = "file" accept = "image/*" onChange = {e => setFile(e.target.files[0])} />
            <Btn onClick = {saveProduct} style = {{ marginTop: "0.5rem" }}>
              Save Product
            </Btn>
          </div>
        </Modal>
      )}

      {/* MODAL : COMMANDES (Mise à jour statut) */}
      {orderModal && (
        <Modal title = {`Process Order #${selectedOrder?.id}`} onClose = {() => setOrderModal(false)}>
          <div style = {{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label style = {{ fontSize: "12px", color: "var(--textMuted)" }}>
              Update Status
            </label>
            <select value = {statusForm.status} onChange = {e => setStatusForm({ ...statusForm, status: e.target.value })}>
              {STATUSES.map(s => <option key = {s} value = {s}>{s}</option>)}
            </select>
            
            <label style = {{ fontSize: "12px", color: "var(--textMuted)" }}>
              Tracking Number
            </label>
            <input placeholder = "Tracking Number (e.g. TRK123)" value = {statusForm.trackingNumber} onChange = {e => setStatusForm({ ...statusForm, trackingNumber: e.target.value })} />
            
            <Btn onClick = {updateOrderStatus}>
              Save Changes
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default SellerDashboard;