import React from "react";

export default function Home({ products = [], onAddToCart, onAddToWishlist }) {
  return (
    <div className="container">
      <h2>Welcome to Trendora</h2>
      <p>Discover curated picks and great deals.</p>

      <h3>Featured</h3>
      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <img src={`/images/${p.image}`} alt={p.name} />
            <h3>{p.name}</h3>
            <p>${Number(p.price).toFixed(2)}</p>
            <div className="btn-row">
              <button className="btn-add" onClick={() => onAddToCart && onAddToCart(p)}>Add to Cart</button>
              {onAddToWishlist && <button className="btn-wish" onClick={() => onAddToWishlist(p)}>Wishlist</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
