import React, { useMemo } from "react";

const placeholderImg = "https://placehold.co/300x300?text=No+Image";

export default function Home({ products = [], onAddToCart, onAddToWishlist }) {
  const defaultFeatured = [
    {
      id: "f1",
      name: "Classic Tee",
      price: 25,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "f2",
      name: "Blue Jeans",
      price: 40,
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "f3",
      name: "Running Shoes",
      price: 60,
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "f4",
      name: "Hoodie",
      price: 55,
      image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const featured = useMemo(() => (products && products.length ? products : defaultFeatured), [products]);

  return (
    <div className="container" style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <h2 style={{ fontSize: "2em", marginBottom: 8, color: "#2b6cb0" }}>Welcome to Trendora</h2>
      <p style={{ fontSize: "1.15em", color: "#4a5568", marginBottom: 28 }}>Discover curated picks and great deals.</p>

      <h3 style={{ fontSize: "1.3em", marginBottom: 18, color: "#38a169" }}>Featured</h3>
      <div className="product-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px"
      }}>
        {featured.map(p => (
          <div key={p.id} className="product-card" style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #edf2f7",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ position: "relative", width: "100%", paddingTop: "75%", background: "#f7fafc" }}>
              <img
                src={p.image || placeholderImg}
                alt={p.name}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImg; }}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: "#2d3748" }}>{p.name}</h3>
              <p style={{ color: "#2b6cb0", fontWeight: "bold", margin: 0 }}>${Number(p.price).toFixed(2)}</p>
              <div className="btn-row" style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  className="btn-add"
                  onClick={() => onAddToCart && onAddToCart(p)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: "#2b6cb0",
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                    cursor: onAddToCart ? "pointer" : "default",
                    opacity: onAddToCart ? 1 : 0.6
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="btn-wish"
                  onClick={() => onAddToWishlist && onAddToWishlist(p)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: "#38a169",
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                    cursor: onAddToWishlist ? "pointer" : "default",
                    opacity: onAddToWishlist ? 1 : 0.6
                  }}
                >
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
