import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const placeholderImg = 'https://placehold.co/600x600?text=No+Image';

function Cart({ cartItems = [], setCartItems }) {
  const navigate = useNavigate();

  const updateQuantity = (id, delta) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const totalPrice = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container" style={{ maxWidth: 1100, margin: '32px auto', background: '#fff', borderRadius: 10, padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Shopping Cart</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/catalog">Catalog</Link>
          <span>•</span>
          <Link to="/wishlist">Wishlist</Link>
        </div>
      </header>

      {(!cartItems || cartItems.length === 0) ? (
        <p style={{ textAlign: 'center', color: '#718096', fontSize: '1.1em' }}>Your cart is empty.</p>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16
          }}>
            {cartItems.map(item => {
              const imgSrc = item.image || placeholderImg;
              return (
                <div key={item.id} style={{
                  border: '1px solid #edf2f7',
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ position: 'relative', width: '100%', paddingTop: '66%', background: '#f7fafc' }}>
                    <Link to={`/product/${item.id}`} style={{ position: 'absolute', inset: 0 }}>
                      <img
                        src={imgSrc}
                        alt={item.name}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImg; }}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Link>
                  </div>
                  <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>{item.name}</h3>
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600 }}>{fmt.format(item.price)}</span>
                      <span style={{ color: '#4a5568' }}>x {item.quantity}</span>
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button aria-label={`Decrease quantity of ${item.name}`} onClick={() => updateQuantity(item.id, -1)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e0', background: '#f7fafc', cursor: 'pointer' }}>-</button>
                        <span style={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                        <button aria-label={`Increase quantity of ${item.name}`} onClick={() => updateQuantity(item.id, 1)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e0', background: '#f7fafc', cursor: 'pointer' }}>+</button>
                      </div>
                      <button aria-label={`Remove ${item.name} from cart`} onClick={() => removeItem(item.id)} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: '#e53e3e', color: '#fff', cursor: 'pointer' }}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 24,
            padding: 16,
            background: '#f7f8fa',
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <p style={{ fontWeight: 'bold', fontSize: '1.1em', margin: 0 }}>Total: {fmt.format(totalPrice)}</p>
            <button onClick={handleCheckout} style={{
              padding: '10px 22px',
              borderRadius: 6,
              background: '#2b6cb0',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer'
            }}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

Cart.propTypes = {
  cartItems: PropTypes.array,
  setCartItems: PropTypes.func.isRequired
};

export default Cart;