import React, { useState } from "react";

/*
 Props:
 - cartItems (array)
 - total (number)  [we'll compute total in App and pass as prop if desired]
 - user (object) and setUser (function) - optional
 - onPlaceOrder({ shippingAddress, paymentMethod, name, email }) => Promise(order)
*/
export default function Checkout({ cartItems = [], total = 0, user = {}, setUser = () => {}, onPlaceOrder }) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [address, setAddress] = useState(user.address || "");
  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const computedTotal = total || cartItems.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!cartItems.length) { setError("Your cart is empty."); return; }
    if (!name.trim() || !email.trim() || !address.trim()) { setError("Please fill name, email and shipping address."); return; }

    setLoading(true);
    try {
      // save profile locally
      setUser(prev => ({ ...prev, name, email, address }));

      // mock payment delay
      await new Promise(r => setTimeout(r, 700));

      await onPlaceOrder({ shippingAddress: address, paymentMethod, name, email });
      // onPlaceOrder will route to confirmation (handled in App)
    } catch (err) {
      setError("Failed to place order (mock).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Checkout</h2>
      <div className="checkout-form">
        <h3>Order Summary</h3>
        {cartItems.length === 0 ? <p>No items in cart.</p> : (
          <>
            {cartItems.map(it => (
              <div key={it.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <div>{it.name} × {it.quantity}</div>
                <div>${(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))}
            <h3>Total: ${computedTotal.toFixed(2)}</h3>
          </>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Full Name
            <input value={name} onChange={e => setName(e.target.value)} />
          </label>

          <label>
            Email
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </label>

          <label>
            Shipping Address
            <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} />
          </label>

          <label>
            Payment Method
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="Stripe">Stripe (mock)</option>
              <option value="SSLCommerz">SSLCommerz (mock)</option>
            </select>
          </label>

          {error && <p style={{ color: "crimson" }}>{error}</p>}

          <button className="btn-add" type="submit" disabled={loading}>
            {loading ? "Processing…" : "Place Order (mock)"}
          </button>
        </form>
      </div>
    </div>
  );
}
