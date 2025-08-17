import React from "react";

export default function OrderConfirmation({ orders = [] }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="container">
        <h2>No recent orders</h2>
        <p>You will see your order summary here after placing an order.</p>
      </div>
    );
  }

  const latest = orders[0];

  return (
    <div className="container">
      <h2>Order Confirmed 🎉</h2>
      <p><strong>Order ID:</strong> {latest.id}</p>
      <p><strong>Name:</strong> {latest.name}</p>
      <p><strong>Email:</strong> {latest.email}</p>
      <p><strong>Payment:</strong> {latest.paymentMethod}</p>
      <p><strong>Status:</strong> {latest.status}</p>

      <h3>Items</h3>
      <div>
        {latest.items.map(it => (
          <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 6 }}>
            <div>{it.name} × {it.quantity}</div>
            <div>${(it.price * it.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <h3>Total: ${latest.total.toFixed(2)}</h3>

      <h4>Shipping Address</h4>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{latest.shippingAddress}</pre>
    </div>
  );
}
