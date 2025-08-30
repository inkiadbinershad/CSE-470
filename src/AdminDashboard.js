import React, { useEffect, useMemo, useState } from "react";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: 0, image: "", category: "", stock: 0 });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const headers = useMemo(() => {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    "X-Admin": "true",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}, []);

const load = async () => {
  setLoading(true);
  setError("");
  try {
    const res = await fetch(`${BASE}/api/products`, { headers });
    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.items || [];
    setItems(list);
  } catch (e) {
    setError("Failed to load products");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { load(); }, []);

  const startEdit = (p) => {
    setForm({ name: p.name, price: p.price, image: p.image || "", category: p.category || "", stock: p.stock || 0 });
    setEditingId(p._id || p.id);
  };
  const reset = () => { setForm({ name: "", price: 0, image: "", category: "", stock: 0 }); setEditingId(null); };

const submit = async (e) => {
  e.preventDefault();
  if (!form.name.trim()) return alert("Name required");
  setLoading(true);
  try {
    if (editingId) {
      const res = await fetch(`${BASE}/api/products/${editingId}`, { method: "PUT", headers, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
    } else {
      const res = await fetch(`${BASE}/api/products`, { method: "POST", headers, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
    }
    await load();
    reset();
  } catch (_) {
    setError("Save failed");
  } finally {
    setLoading(false);
  }
};

const doDelete = async (id) => {
  if (!window.confirm("Delete product?")) return;
  setLoading(true);
  try {
    const res = await fetch(`${BASE}/api/products/${id}`, { method: "DELETE", headers });
    if (!res.ok) throw new Error();
    await load();
  } catch (_) {
    setError("Delete failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container" style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <h2 style={{ color: "#2b6cb0", marginBottom: 24 }}>Admin Dashboard</h2>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div className="admin-dashboard" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
        {/* Product Form */}
        <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 12px rgba(44,62,80,0.07)", padding: 24 }}>
          <h3 style={{ color: "#38a169", marginBottom: 12 }}>{editingId ? "Edit Product" : "Add Product"}</h3>
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e0" }} />
            <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e0" }} />
            <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e0" }} />
            <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e0" }} />
            <input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e0" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" disabled={loading} style={{ padding: "8px 16px", borderRadius: 6, background: "#2b6cb0", color: "#fff", fontWeight: "bold", border: "none", cursor: loading ? "not-allowed" : "pointer" }}>{editingId ? "Update" : "Create"}</button>
              {editingId && <button type="button" onClick={reset} style={{ padding: "8px 16px", borderRadius: 6, background: "#e53e3e", color: "#fff", fontWeight: "bold", border: "none", cursor: "pointer" }}>Cancel</button>}
            </div>
          </form>
        </div>

        {/* Product List */}
        <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 12px rgba(44,62,80,0.07)", padding: 24 }}>
          <h3 style={{ color: "#2b6cb0", marginBottom: 12 }}>Products</h3>
          {loading && <p>Loading…</p>}
          {(!items || items.length === 0) ? <p>No products.</p> : items.map(p => (
            <div key={p._id || p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, borderBottom: "1px solid #edf2f7" }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/96x96?text=No+Image'; }} />
                <div>
                  <strong>{p.name}</strong>
                  <div>Price: ${Number(p.price).toFixed(2)}</div>
                  <div>Stock: {p.stock || 0}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => startEdit(p)} style={{ padding: "6px 12px", borderRadius: 5, background: "#38a169", color: "#fff", border: "none", cursor: "pointer" }}>Edit</button>
                <button onClick={() => doDelete(p._id || p.id)} style={{ padding: "6px 12px", borderRadius: 5, background: "#e53e3e", color: "#fff", border: "none", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
