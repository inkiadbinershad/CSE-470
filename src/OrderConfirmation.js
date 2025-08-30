import React from "react";
import { Link } from "react-router-dom";

function OrderConfirmation() {
  return (
    <div className="container" style={{
      maxWidth: 500,
      margin: "60px auto",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 12px rgba(44,62,80,0.08)",
      padding: "32px",
      textAlign: "center"
    }}>
      <h2 style={{ color: "#38a169", marginBottom: 18 }}>✅ Order Confirmed!</h2>
      <p style={{ fontSize: "1.15em", color: "#2d3748", marginBottom: 10 }}>
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <p style={{ color: "#4a5568" }}>
        You will receive an email with the order details shortly.
      </p>
      <div style={{ marginTop: 30 }}>
        <Link to="/" style={{
          display: "inline-block",
          padding: "10px 24px",
          borderRadius: "6px",
          background: "#2b6cb0",
          color: "#fff",
          fontWeight: "bold",
          textDecoration: "none",
          boxShadow: "0 1px 4px rgba(44,62,80,0.08)"
        }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;