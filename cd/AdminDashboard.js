import React, { useState } from "react";

export default function AdminDashboard({ inventory = [], createProduct = () => {}, updateProduct = () => {}, deleteProduct = () => {}, orders = [], users = [] }) {
  const [form, setForm] = useState({ name: "", price: 0, image: "", category: "", stock: 0 });
  const [editingId, setEditingId] = useState(null);

  const startEdit = (p) => {
    setForm({ name: p.name, price: p.price, image: p.image || "", category: p.category || "", stock: p.stock || 0 });
    setEditingId(p.id);
  };
  const reset = () => { setForm({ name: "", price: 0, image: "", category: "", stock: 0 }); setEditingId(null); };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Name required");
    if (editingId) {
      updateProduct(editingId, form);
    } else {
      createProduct(form);
    }
    reset();
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <div className="admin-dashboard">
        <div>
          <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
          <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
            <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} />
            <input placeholder="Image filename (in /public/images/)" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">{editingId ? "Update" : "Create"}</button>
              {editingId && <button type="button" onClick={reset}>Cancel</button>}
            </div>
          </form>
        </div>

        <div>
          <h3>Products</h3>
          {inventory.length === 0 ? <p>No products.</p> : inventory.map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: 8, border: "1px solid #ddd", marginBottom: 8, borderRadius:6 }}>
              <div>
                <strong>{p.name}</strong><div>Price: ${Number(p.price).toFixed(2)}</div><div>Stock: {p.stock}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => startEdit(p)}>Edit</button>
                <button onClick={() => { if(window.confirm("Delete product?")) deleteProduct(p.id); }}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3>Orders</h3>
          {orders.length === 0 ? <p>No orders yet.</p> : orders.map(o => (
            <div key={o.id} style={{ border: "1px solid #ddd", padding: 8, borderRadius:6, marginBottom:8 }}>
              <div><strong>{o.id}</strong> • {new Date(o.createdAt).toLocaleString()}</div>
              <div>Status: {o.status} • Payment: {o.paymentMethod}</div>
              <div>Total: ${o.total.toFixed(2)}</div>
              <details><summary>Items</summary>
                <ul>
                  {o.items.map(i => <li key={i.id}>{i.name} × {i.quantity}</li>)}
                </ul>
              </details>
            </div>
          ))}
        </div>

        <div>
          <h3>Users</h3>
          {users.length === 0 ? <p>No users.</p> : users.map((u, idx) => (
            <div key={idx} style={{ border: "1px solid #ddd", padding: 8, borderRadius:6, marginBottom:8 }}>
              <div><strong>{u.name || "Guest"}</strong></div>
              <div>{u.email}</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{u.address}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
