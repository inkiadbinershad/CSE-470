import React, { useState } from 'react';

function ProductCatalog({ products, onAddToCart, onAddToWishlist }) {
  // If `products` not passed, fallback to sample list (keeps older behavior)
  const defaultProducts = [
    { id: 1, name: "Men T-Shirt", price: 20, image: "tshirt.jpg", category: "Men" },
    { id: 2, name: "Women Dress", price: 50, image: "dress.jpg", category: "Women" },
    { id: 3, name: "Sunglasses", price: 15, image: "sunglasses.png", category: "Accessories" },
    { id: 4, name: "Men Jacket", price: 60, image: "jacket.png", category: "Men" },
    { id: 5, name: "Women Scarf", price: 25, image: "scarf.png", category: "Women" }
  ];

  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState(''); // new state for price filter

  const list = products && products.length ? products : defaultProducts;

  const filteredProducts = list.filter(product =>
    (category === 'All' || product.category === category) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (maxPrice === '' || product.price <= parseFloat(maxPrice))
  );

  return (
    <div className="container">
      <h2>Product Catalog</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Accessories">Accessories</option>
        </select>

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #D8A7B1' }}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ width: 100, padding: 8, borderRadius: 6, border: '1px solid #D8A7B1' }}
        />
      </div>

      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={`/images/${product.image}`} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            <div className="btn-row">
              <button onClick={() => onAddToCart(product)} className="btn-add">Add to Cart</button>
              {onAddToWishlist && (
                <button onClick={() => onAddToWishlist(product)} className="btn-wish">
                  Add to Wishlist
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCatalog;
