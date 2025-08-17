import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import ProductCatalog from "./ProductCatalog";
import Cart from "./Cart"; // your existing Cart.js - unchanged
import Wishlist from "./Wishlist";
import Checkout from "./Checkout";
import OrderConfirmation from "./OrderConfirmation";
import Home from "./Home";
import UserProfile from "./UserProfile";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

// localStorage helpers
const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
};

function AppInner() {
  const navigate = useNavigate();

  // Persisted app state
  const [cartItems, setCartItems] = useState(() => storage.get("cartItems", []));
  const [wishlist, setWishlist] = useState(() => storage.get("wishlist", []));
  const [orders, setOrders] = useState(() => storage.get("orders", []));
  const [user, setUser] = useState(() => storage.get("user", { name: "", email: "", address: "" }));
  const [inventory, setInventory] = useState(() => storage.get("inventory", [
    // initial products (optional)
    { id: 1, name: "Men T-Shirt", price: 20, image: "tshirt.jpg", category: "Men", stock: 12 },
    { id: 2, name: "Women Dress", price: 50, image: "dress.jpg", category: "Women", stock: 8 },
    { id: 3, name: "Sunglasses", price: 15, image: "sunglasses.png", category: "Accessories", stock: 20 },
    { id: 4, name: "Men Jacket", price: 60, image: "jacket.png", category: "Men", stock: 6 },
    { id: 5, name: "Women Scarf", price: 25, image: "scarf.png", category: "Women", stock: 14 }
  ]));

  // store on changes
  useEffect(() => storage.set("cartItems", cartItems), [cartItems]);
  useEffect(() => storage.set("wishlist", wishlist), [wishlist]);
  useEffect(() => storage.set("orders", orders), [orders]);
  useEffect(() => storage.set("user", user), [user]);
  useEffect(() => storage.set("inventory", inventory), [inventory]);

  // Keep your existing add-to-cart logic consistent with previous Cart component:
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Wishlist operations
  const addToWishlist = (product) => {
    setWishlist(prev => prev.some(p => p.id === product.id) ? prev : [...prev, product]);
  };
  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  };
  const moveWishlistToCart = (id) => {
    const p = wishlist.find(x => x.id === id);
    if (p) {
      addToCart(p);
      removeFromWishlist(id);
      navigate("/cart");
    }
  };

  // Order placement (frontend-only mock)
  const cartTotal = cartItems.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

  const placeOrder = async ({ shippingAddress, paymentMethod, name, email }) => {
    // create order locally
    const newOrder = {
      id: "ORD-" + Date.now(),
      items: cartItems,
      total: cartTotal,
      shippingAddress,
      paymentMethod,
      name,
      email,
      createdAt: new Date().toISOString(),
      status: "CONFIRMED"
    };
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]); // clear cart on success
    navigate("/order-confirmation");
    return newOrder;
  };

  // Admin inventory CRUD (frontend-only)
  const createProduct = (product) => {
    const id = Date.now();
    setInventory(prev => [{ ...product, id }, ...prev]);
  };
  const updateProduct = (id, updates) => {
    setInventory(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  const deleteProduct = (id) => {
    setInventory(prev => prev.filter(p => p.id !== id));
    // also remove from cart/wishlist if present
    setCartItems(prev => prev.filter(p => p.id !== id));
    setWishlist(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="App">
      <header>
        <h1>Trendora</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/catalog">Catalog</Link>
          <Link to="/cart">Cart ({cartItems.reduce((s, it) => s + it.quantity, 0)})</Link>
          <Link to="/wishlist">Wishlist ({wishlist.length})</Link>
          <Link to="/checkout">Checkout</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={
            <Home products={inventory.slice(0,3)} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />
          } />

          <Route path="/catalog" element={
            <ProductCatalog products={inventory} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />
          } />

          <Route path="/cart" element={
            <Cart cartItems={cartItems} setCartItems={setCartItems} />
          } />

          <Route path="/wishlist" element={
            <Wishlist wishlist={wishlist} onRemove={removeFromWishlist} onMoveToCart={moveWishlistToCart} onAddToCart={addToCart} />
          } />

          <Route path="/checkout" element={
            <Checkout cartItems={cartItems} total={cartTotal} user={user} setUser={setUser} onPlaceOrder={placeOrder} />
          } />

          <Route path="/order-confirmation" element={
            <OrderConfirmation orders={orders} />
          } />

          <Route path="/profile" element={
            <UserProfile user={user} setUser={setUser} orders={orders} />
          } />

          <Route path="/admin" element={
            <AdminDashboard
              inventory={inventory}
              createProduct={createProduct}
              updateProduct={updateProduct}
              deleteProduct={deleteProduct}
              orders={orders}
              users={[user]}
            />
          } />

          <Route path="*" element={<div style={{ padding: 20 }}><h2>Page not found</h2></div>} />
        </Routes>
      </main>

      <footer>
        <p>&copy; 2025 Trendora</p>
      </footer>
    </div>
  );
}

export default function App() {
  // Router wrapper outside so we can call useNavigate inside components
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
