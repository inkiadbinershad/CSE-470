import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Currency formatter
const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const placeholderImg = "https://placehold.co/600x600?text=No+Image";

export default function ProductCatalog(props) {
  // Sample local products as a safe fallback (with images)
  const sampleProducts = [
    {
      id: 1,
      name: "Classic Tee",
      price: 25,
      category: "Tops",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "Blue Jeans",
      price: 40,
      category: "Bottoms",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Running Shoes",
      price: 60,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "Hoodie",
      price: 55,
      category: "Tops",
      image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      name: "Chinos",
      price: 45,
      category: "Bottoms",
      image: "https://images.unsplash.com/photo-1593032457864-1b345992d1f3?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Internal fallbacks to ensure this component works even if parent doesn't provide props
  const [internalCart, setInternalCart] = useState([]);
  const [internalWishlist, setInternalWishlist] = useState([]);

  // Prefer props if provided, otherwise fall back to internal state
  const cart = props.cartItems || props.cart || internalCart;
  const setCart = props.setCartItems || props.setCart || setInternalCart;
  const wishlist = props.wishlist || internalWishlist;
  const setWishlist = props.setWishlist || setInternalWishlist;

  // Attempt to load products from backend, but gracefully fall back to local data
  useEffect(() => {
    let ignore = false;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const base = process.env.REACT_APP_API_URL || "http://localhost:5000"; // default to backend port
        const res = await fetch(`${base}/api/products`, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
        if (!ignore && list.length) {
          const normalized = list.map((d, idx) => ({
            id: d.id ?? d._id ?? idx + 1,
            name: d.name ?? d.title ?? `Product ${idx + 1}`,
            price: Number(d.price ?? 0),
            category: d.category ?? "Other",
            image: d.image || d.imageUrl || d.thumbnail || d.photo || placeholderImg,
          }));
          setProducts(normalized);
        }
      } catch (_) {
        // Keep sampleProducts on failure
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      ignore = true;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category || "Other")))],
    [products]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const byCategory = category === "All" || p.category === category;
      const bySearch = !term || p.name.toLowerCase().includes(term);
      return byCategory && bySearch;
    });
  }, [products, search, category]);

  const cartCount = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const wishlistCount = wishlist.length;

  const getQty = (id) => cart.find((x) => x.id === id)?.quantity || 0;
  const isWishlisted = (id) => wishlist.some((w) => w.id === id);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
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

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };

  return (
    <div style={{ maxWidth: 1100, margin: "32px auto", background: "#fff", borderRadius: 10, padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Product Catalog</h2>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <span>Cart: <strong>{cartCount}</strong></span>
          <span>Wishlist: <strong>{wishlistCount}</strong></span>
          <div style={{ display: "flex", gap: 8 }}>
            <Link to="/cart">Cart</Link>
            <span>•</span>
            <Link to="/wishlist">Wishlist</Link>
            <span>•</span>
            <Link to="/checkout">Checkout</Link>
          </div>
        </div>
      </header>

      <section style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          aria-label="Search products"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          style={{ flex: 1, minWidth: 220, padding: "10px 12px", borderRadius: 6, border: "1px solid #cbd5e0" }}
        />
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ minWidth: 180, padding: "10px 12px", borderRadius: 6, border: "1px solid #cbd5e0" }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </section>

      {loading && (
        <div style={{ marginBottom: 16, color: "#4a5568" }}>Loading products…</div>
      )}

      {/* Responsive Card Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16
      }}>
        {filtered.map((p) => {
          const qty = getQty(p.id);
          const wish = isWishlisted(p.id);
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
              {/* Image wrapper with 3:2 aspect ratio */}
              <div style={{ position: "relative", width: "100%", paddingTop: "66%", background: "#f7fafc" }}>
                <Link to={`/product/${p.id}`} style={{ position: "absolute", inset: 0 }}>
                  <img
                    src={imgSrc}
                    alt={p.name}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImg; }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </Link>
                <button
                  aria-label={wish ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
                  onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: "1px solid #cbd5e0",
                    background: wish ? "#fde8e8" : "#ffffffcc",
                    color: wish ? "#c53030" : "#2d3748",
                    cursor: "pointer",
                    backdropFilter: "blur(2px)"
                  }}
                >
                  {wish ? "♥" : "♡"}
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                <Link to={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>{p.name}</h3>
                </Link>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600 }}>{fmt.format(p.price)}</span>
                  <span style={{ background: "#edf2f7", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>{p.category}</span>
                </div>

                {/* Cart controls */}
                <div style={{ marginTop: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                  {qty > 0 ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button
                          aria-label={`Decrease quantity of ${p.name}`}
                          onClick={() => decrement(p.id)}
                          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e0", background: "#f7fafc", cursor: "pointer" }}
                        >-</button>
                        <span style={{ minWidth: 24, textAlign: "center" }}>{qty}</span>
                        <button
                          aria-label={`Increase quantity of ${p.name}`}
                          onClick={() => increment(p)}
                          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e0", background: "#f7fafc", cursor: "pointer" }}
                        >+</button>
                      </div>
                      <button
                        aria-label={`Remove ${p.name} from cart`}
                        onClick={() => removeFromCart(p.id)}
                        style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "#e53e3e", color: "#fff", cursor: "pointer" }}
                      >Remove</button>
                    </div>
                  ) : (
                    <button
                      aria-label={`Add ${p.name} to cart`}
                      onClick={() => addToCart(p)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "none", background: "#2b6cb0", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                    >Add to Cart</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <p style={{ textAlign: "center", color: "#718096", marginTop: 24 }}>No products match your filters.</p>
      )}
    </div>
  );
}
