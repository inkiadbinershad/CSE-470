import React, { useState, useEffect } from "react";

export default function UserProfile({ user = {}, setUser = () => {}, orders = [] }) {
  const [form, setForm] = useState(user || { name: "", email: "", address: "" });

  useEffect(() => setForm(user || { name: "", email: "", address: "" }), [user]);

  const save = (e) => {
    e.preventDefault();
    setUser(form);
    alert("Profile saved locally.");
  };

  return (
    <div className="container" style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 10, padding: 24 }}>
      <h2 style={{ color: "#2b6cb0", marginBottom: 18 }}>User Profile</h2>
      <div className="profile-container" style={{ marginBottom: 32 }}>
        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label style={{ fontWeight: "bold", color: "#4a5568" }}>
            Name
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #cbd5e0",
                marginTop: "4px"
              }}
              required
            />
          </label>
          <label style={{ fontWeight: "bold", color: "#4a5568" }}>
            Email
            <input
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #cbd5e0",
                marginTop: "4px"
              }}
              type="email"
              required
            />
          </label>
          <label style={{ fontWeight: "bold", color: "#4a5568" }}>
            Address
            <textarea
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #cbd5e0",
                marginTop: "4px",
                resize: "vertical"
              }}
              rows={3}
              required
            />
          </label>
          <button
            type="submit"
            className="btn-add"
            style={{
              padding: "10px",
              borderRadius: "6px",
              background: "#2b6cb0",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              marginTop: "8px"
            }}
          >
            Save Profile
          </button>
        </form>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ color: "#38a169", marginBottom: 12 }}>Order History</h3>
        {(!orders || orders.length === 0) ? (
          <p style={{ color: "#718096" }}>No orders yet.</p>
        ) : (
          orders.map(o => (
            <div key={o.id} style={{
              padding: 14,
              border: "1px solid #D8A7B1",
              borderRadius: 8,
              marginBottom: 14,
              background: "#FFF9F4",
              boxShadow: "0 1px 6px rgba(44,62,80,0.06)"
            }}>
              <div style={{ fontWeight: "bold", color: "#2b6cb0" }}>
                {o.id} • {new Date(o.createdAt).toLocaleString()}
              </div>
              <div>Status: <span style={{ color: "#38a169", fontWeight: "bold" }}>{o.status}</span></div>
              <div>Total: <span style={{ color: "#2b6cb0", fontWeight: "bold" }}>${o.total.toFixed(2)}</span></div>
              <details style={{ marginTop: 8 }}>
                <summary style={{ cursor: "pointer", color: "#4a5568" }}>Items</summary>
                <ul style={{ marginLeft: 18 }}>
                  {o.items.map(i => (
                    <li key={i.id} style={{ color: "#2d3748" }}>
                      {i.name} × {i.quantity}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
}