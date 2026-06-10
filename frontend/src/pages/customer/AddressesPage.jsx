import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useToast } from '../../components/shared/ToastProvider';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/shared/EmptyState';

const AddressesPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [modal, setModal] = useState(false);
    const [editAddr, setEditAddr] = useState(null);
    const [form, setForm] = useState({ fullName: "", phone: "", street: "", city: "", state: "", postalCode: "", country: "VN", isDefault: false });
    const toast = useToast();

    const load = () => apiFetch("/addresses").then(d => setAddresses(d.data || [])).catch(() => {});
    
    useEffect(() => { 
        load(); 
    }, []);

    const openNew = () => { 
        setEditAddr(null); 
        setForm({ fullName: "", phone: "", street: "", city: "", state: "", postalCode: "", country: "VN", isDefault: false }); 
        setModal(true); 
    };
    
    const openEdit = (a) => { 
        setEditAddr(a); 
        setForm(a); 
        setModal(true); 
    };

    const save = async () => {
        try {
            if (editAddr) {
                await apiFetch(`/addresses/${editAddr.id}`, { 
                    method: "PUT", 
                    body: JSON.stringify(form) 
                });
            } else {
                await apiFetch("/addresses", { 
                    method: "POST", 
                    body: JSON.stringify(form) 
                });
            }
            toast(editAddr ? "Address updated" : "Address added");
            setModal(false); 
            load();
        } catch (err) { 
            toast(err.message, "error"); 
        }
    };

    const del = async (id) => {
        if (!window.confirm("Delete this address?")) {
            return;
        }
        try {
            await apiFetch(`/addresses/${id}`, { 
                method: "DELETE" 
            });
            toast("Address deleted"); 
            load();
        } catch (err) { 
            toast(err.message, "error"); 
        }
    };

    return (
        <div style = {{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <div style = {{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2rem" }}>
                    My Addresses
                </h1>
                <Btn onClick = {openNew}>
                    + Add Address
                </Btn>
            </div>

            {addresses.length === 0 ? (
                <EmptyState icon = "📍" title = "No addresses saved" subtitle = "Add your delivery address" />
            ) : (
                <div style = {{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {addresses.map(a => (
                        <Card key = {a.id} style = {{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                            <div>
                                <div style = {{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.5rem" }}>
                                    <p style = {{ fontWeight: 500 }}>
                                        {a.fullName}
                                    </p>
                                    {a.isDefault && <Badge color="accent">Default</Badge>}
                                </div>
                                <p style = {{ color: "var(--textMuted)", fontSize: "14px" }}>
                                    {a.phone}
                                </p>
                                <p style = {{ color: "var(--textMuted)", fontSize: "14px" }}>
                                    {a.street}, {a.city}, {a.postalCode}, {a.country}
                                </p>
                            </div>
                            <div style = {{ display: "flex", gap: "0.5rem" }}>
                                <Btn variant = "secondary" size = "sm" onClick = {() => openEdit(a)}>
                                    Edit
                                </Btn>
                                <Btn variant = "danger" size = "sm" onClick = {() => del(a.id)}>
                                    Delete
                                </Btn>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {modal && (
                <Modal title = {editAddr ? "Edit Address" : "New Address"} onClose = {() => setModal(false)}>
                    <div style = {{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {[
                            ["fullName", "Full Name"], 
                            ["phone", "Phone"], 
                            ["street", "Street"], 
                            ["city", "City"], 
                            ["state", "State (optional)"], 
                            ["postalCode", "Postal Code"], 
                            ["country", "Country"]
                        ].map(([k, l]) => (
                            <div key = {k}>
                                <label style = {{ fontSize: "12px", color: "var(--textMuted)", display: "block", marginBottom: "4px" }}>
                                    {l}
                                </label>
                                <input value = {form[k] || ""} onChange = {e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                            </div>
                        ))}
                        <label style = {{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "14px", cursor: "pointer", marginTop: "0.5rem" }}>
                            <input 
                                type = "checkbox" 
                                style = {{ width: "auto" }} 
                                checked = {form.isDefault} 
                                onChange = {e => setForm(f => ({ ...f, isDefault: e.target.checked }))} 
                            />
                            Set as default
                        </label>
                        <Btn onClick = {save} style = {{ marginTop: "1rem" }}>
                            Save Address
                        </Btn>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default AddressesPage;