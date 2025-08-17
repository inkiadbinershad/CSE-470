import React from "react";

export default function Wishlist({ wishlist = [], onRemove, onMoveToCart, onAddToCart }) {
  return (
    <div className="container">
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="product-grid">
          {wishlist.map(item => (
            <div key={item.id} className="product-card">
              <img src={`/images/${item.image}`} alt={item.name} />
              <h3>{item.name}</h3>
              <p>${Number(item.price).toFixed(2)}</p>
              <div className="btn-row">
                <button className="btn-add" onClick={() => { onAddToCart && onAddToCart(item); onRemove && onRemove(item.id); }}>Move to Cart</button>
                <button className="btn-wish" onClick={() => onRemove && onRemove(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
