import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const placeholderImg = "https://placehold.co/600x600?text=No+Image";

export default function Wishlist(props) {
  // Internal fallbacks to ensure page works if no props are wired from App
  const [internalWishlist, setInternalWishlist] = useState([]);
  const [internalCart, setInternalCart] = useState([]);

  // Prefer props if provided, otherwise fallback to internal state
  const wishlist = props.wishlist || internalWishlist;
  const setWishlist = props.setWishlist || setInternalWishlist;

  const cart = props.cartItems || props.cart || internalCart;
  const setCart = props.setCartItems || props.setCart || setInternalCart;

  const wishlistCount = wishlist.length;
  const cartCount = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);

  const getQty = (id) => cart.find((x) => x.id === id)?.quantity || 0;

  const toggleWishlist = (product) => {
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increment = (product) => addToCart(product);

  const decrement = (productId) => {
    setCart((prev) => {
      const item = prev.find((p) => p.id === productId);
      if (!item) return prev;
      if (item.quantity <= 1) return prev.filter((p) => p.id !== productId);
      return prev.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - 1 } : p));
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  };

  const items = useMemo(() => wishlist || [], [wishlist]);

  return (
    <div style={{ maxWidth: 1100, margin: "32px auto", background: "#fff", borderRadius: 10, padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Your Wishlist</h2>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <span>Wishlist: <strong>{wishlistCount}</strong></span>
          <span>Cart: <strong>{cartCount}</strong></span>
          <div style={{ display: "flex", gap: 8 }}>
            <Link to="/catalog">Catalog</Link>
            <span>•</span>
            <Link to="/cart">Cart</Link>
            <span>•</span>
            <Link to="/checkout">Checkout</Link>
          </div>
        </div>
      </header>

      {items.length === 0 ? (
        <p style={{ textAlign: "center", color: "#718096" }}>Your wishlist is empty.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16
        }}>
          {items.map((p) => {
            const qty = getQty(p.id);
            const imgSrc = p.image || placeholderImg;
            return (
              <div key={p.id} style={{
                position: "relative",
                border: "1px solid #edf2f7",
                borderRadius: 10,
                overflow: "hidden",
                background: "#fff",
                display: "flex",
                flexDirection: "column"
              }}>
                {/* Image */}
                <div style={{ position: "relative", width: "100%", paddingTop: "66%", background: "#f7fafc" }}>
                  <Link to={`/product/${p.id}`} style={{ position: "absolute", inset: 0 }}>
                    <img
                      src={imgSrc}
                      alt={p.name}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImg; }}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Link>
                  <button
                    aria-label={`Remove ${p.name} from wishlist`}
                    onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: "1px solid #cbd5e0",
                      background: "#fde8e8",
                      color: "#c53030",
                      cursor: "pointer"
                    }}
                  >♥</button>
                </div>

                {/* Content */}
                <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <Link to={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>{p.name}</h3>
                  </Link>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600 }}>{fmt.format(p.price)}</span>
                    <span style={{ background: "#edf2f7", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>{p.category || "Other"}</span>
                  </div>

                  <div style={{ marginTop: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                    {qty > 0 ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button aria-label={`Decrease quantity of ${p.name}`} onClick={() => decrement(p.id)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e0", background: "#f7fafc", cursor: "pointer" }}>-</button>
                          <span style={{ minWidth: 24, textAlign: "center" }}>{qty}</span>
                          <button aria-label={`Increase quantity of ${p.name}`} onClick={() => increment(p)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e0", background: "#f7fafc", cursor: "pointer" }}>+</button>
                        </div>
                        <button aria-label={`Remove ${p.name} from cart`} onClick={() => removeFromCart(p.id)} style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "#e53e3e", color: "#fff", cursor: "pointer" }}>Remove</button>
                      </div>
                    ) : (
                      <button aria-label={`Add ${p.name} to cart`} onClick={() => addToCart(p)} style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "none", background: "#2b6cb0", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Add to Cart</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
