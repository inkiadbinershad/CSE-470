import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import Home from "./Home";
import ProductCatalog from "./ProductCatalog";
import Cart from "./Cart";
import Wishlist from "./Wishlist";
import Checkout from "./Checkout";
import OrderConfirmation from "./OrderConfirmation";
import UserProfile from "./UserProfile";
import AdminDashboard from "./AdminDashboard";
import VirtualTryOn from "./VirtualTryOn";
import TrendBoxx from "./TrendBoxx";
import Login from "./Login";
import Signup from "./Signup";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({ id: decoded.id, email: decoded.email, isAdmin: decoded.isAdmin });
      } else {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const isAuthed = !!user;
  const isAdmin = !!user?.isAdmin || user?.email === "inkiadbinershad@gmail.com";

  return (
    <Router>
      <header>
        <button
          className="menu-toggle"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <nav className={`main-nav${navOpen ? " open" : ""}`}>
          {!isAuthed ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Sign Up</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" end>Home</NavLink>
              <NavLink to="/catalog">Catalog</NavLink>
              <NavLink to="/cart">Cart</NavLink>
              <NavLink to="/wishlist">Wishlist</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              <NavLink to="/virtualtryon">Virtual Try-On</NavLink>
              <NavLink to="/trendboxx">TrendBoxx</NavLink>
              {isAdmin && (
                <NavLink to="/admin" style={{ background: "#D4AF37", color: "#800000", borderRadius: "4px", padding: "6px 12px" }}>
                  Admin
                </NavLink>
              )}
              <button onClick={() => {
                setUser(null);
                localStorage.removeItem('token');
              }} style={{ marginLeft: 12 }}>Logout</button>
            </>
          )}
        </nav>
      </header>
      <main>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={isAuthed ? <Navigate to="/" replace /> : <Login setUser={setUser} />} />
          <Route path="/signup" element={isAuthed ? <Navigate to="/" replace /> : <Signup />} />

          {/* Protected routes */}
          <Route path="/" element={isAuthed ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/catalog" element={isAuthed ? <ProductCatalog cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} /> : <Navigate to="/login" replace />} />
          <Route path="/cart" element={isAuthed ? <Cart cartItems={cart} setCartItems={setCart} /> : <Navigate to="/login" replace />} />
          <Route path="/wishlist" element={isAuthed ? <Wishlist wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} /> : <Navigate to="/login" replace />} />
          <Route path="/checkout" element={isAuthed ? <Checkout cartItems={cart} setCartItems={setCart} computedTotal={cart.reduce((sum, i) => sum + i.price * i.quantity, 0)} /> : <Navigate to="/login" replace />} />
          <Route path="/order-confirmation" element={isAuthed ? <OrderConfirmation /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuthed ? <UserProfile /> : <Navigate to="/login" replace />} />
          <Route path="/admin" element={isAuthed && isAdmin ? <AdminDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/virtualtryon" element={isAuthed ? <VirtualTryOn /> : <Navigate to="/login" replace />} />
          <Route path="/trendboxx" element={isAuthed ? <TrendBoxx /> : <Navigate to="/login" replace />} />
          <Route path="/product/:id" element={isAuthed ? <div style={{ padding: 24 }}>Product details page</div> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
    </Router>
  );
}
