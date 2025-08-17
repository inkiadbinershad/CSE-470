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
    <div className="container">
      <h2>User Profile</h2>
      <div className="profile-container">
        <form onSubmit={save}>
          <label>Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
          <label>Email<input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
          <label>Address<textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}></textarea></label>
          <button type="submit" className="btn-add">Save Profile</button>
        </form>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Order History</h3>
        {(!orders || orders.length === 0) ? <p>No orders yet.</p> :
          orders.map(o => (
            <div key={o.id} style={{ padding: 10, border: "1px solid #ddd", borderRadius:6, marginBottom:8 }}>
              <div><strong>{o.id}</strong> • {new Date(o.createdAt).toLocaleString()}</div>
              <div>Status: {o.status}</div>
              <div>Total: ${o.total.toFixed(2)}</div>
              <details><summary>Items</summary>
                <ul>
                  {o.items.map(i => <li key={i.id}>{i.name} × {i.quantity}</li>)}
                </ul>
              </details>
            </div>
          ))
        }
      </div>
    </div>
  );
}
