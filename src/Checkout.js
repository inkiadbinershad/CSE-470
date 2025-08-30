import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const placeholderImg = "https://placehold.co/120x120?text=No+Image";

const Checkout = ({ cartItems = [], setCartItems, computedTotal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const derivedTotal = useMemo(() => {
    if (typeof computedTotal === "number") return computedTotal;
    return (Array.isArray(cartItems) ? cartItems : []).reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);
  }, [computedTotal, cartItems]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !email || !address) {
      setError("Please fill in all fields.");
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setAddress("");
      setPaymentMethod("Stripe");
      if (setCartItems) {
        setCartItems([]);
      }
      navigate('/order-confirmation');
    }, 800);
  };

  return (
    <div className="checkout-container" style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      minHeight: "80vh",
      background: "#f7f8fa",
      padding: "24px"
    }}>
      <div className="checkout-card" style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        padding: "24px",
        maxWidth: "980px",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24
      }}>
        {/* Order summary */}
        <section>
          <h2 style={{ margin: 0, marginBottom: "12px", color: "#2d3748" }}>Order Summary</h2>
          {(!cartItems || cartItems.length === 0) ? (
            <p style={{ color: "#718096" }}>No items in cart.</p>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                {cartItems.map((it) => {
                  const imgSrc = it.image || placeholderImg;
                  return (
                    <div key={it.id} style={{
                      display: "grid",
                      gridTemplateColumns: "96px 1fr auto",
                      gap: 12,
                      alignItems: "center",
                      padding: "8px",
                      border: "1px solid #edf2f7",
                      borderRadius: 8
                    }}>
                      <div style={{ position: "relative", width: 96, height: 72, background: "#f7fafc", borderRadius: 6, overflow: "hidden" }}>
                        <img
                          src={imgSrc}
                          alt={it.name}
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImg; }}
                          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{it.name}</div>
                        <div style={{ color: "#4a5568", fontSize: 14 }}>Qty: {it.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: "#2b6cb0" }}>{fmt.format((it.price || 0) * (it.quantity || 0))}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 16,
                fontSize: "1.1em",
                fontWeight: "bold"
              }}>
                <span>Total:</span>
                <span style={{ color: "#38a169" }}>{fmt.format(derivedTotal)}</span>
              </div>
            </>
          )}
        </section>

        {/* Form */}
        <section>
          <h2 style={{ margin: 0, marginBottom: "12px", color: "#2d3748" }}>Checkout</h2>
          <form onSubmit={handleSubmit} aria-label="Checkout form">
            <label style={{ display: "block", marginBottom: 12 }}>
              <span style={{ display: "block", marginBottom: 4, color: "#4a5568" }}>Full Name</span>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #cbd5e0" }}
                placeholder="Enter your name"
                required
              />
            </label>

            <label style={{ display: "block", marginBottom: 12 }}>
              <span style={{ display: "block", marginBottom: 4, color: "#4a5568" }}>Email</span>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #cbd5e0" }}
                placeholder="Enter your email"
                type="email"
                required
              />
            </label>

            <label style={{ display: "block", marginBottom: 12 }}>
              <span style={{ display: "block", marginBottom: 4, color: "#4a5568" }}>Shipping Address</span>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #cbd5e0", resize: "vertical" }}
                placeholder="Enter your address"
                required
              />
            </label>

            <label style={{ display: "block", marginBottom: 18 }}>
              <span style={{ display: "block", marginBottom: 4, color: "#4a5568" }}>Payment Method</span>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #cbd5e0" }}
              >
                <option value="Stripe">Stripe (mock)</option>
                <option value="SSLCommerz">SSLCommerz (mock)</option>
              </select>
            </label>

            {error && <p style={{ color: 'crimson', marginBottom: 12 }}>{error}</p>}
            {success && <p style={{ color: '#38a169', marginBottom: 12 }}>Order placed! (mock)</p>}

            <button
              className="btn-add"
              type="submit"
              disabled={loading || !cartItems || cartItems.length === 0}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 6,
                background: '#2b6cb0',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1em',
                border: 'none',
                cursor: loading || !cartItems || cartItems.length === 0 ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 4px rgba(44,62,80,0.08)'
              }}
            >
              {loading ? 'Processing…' : 'Place Order (mock)'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Checkout;