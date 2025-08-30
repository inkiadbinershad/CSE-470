import React, { useState } from "react";
import "./App.css";

function SubscriptionBox() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  const plans = [
    { id: 1, name: "Basic Plan", price: "$5/month", description: "Casual essentials delivered monthly." },
    { id: 2, name: "Standard Plan", price: "$10/month", description: "Trendy fashion with exclusive picks." },
    { id: 3, name: "Premium Plan", price: "$20/month", description: "Designer outfits & accessories." },
  ];

  const handleSubscribe = () => {
    setSubscribed(true);
  };

  return (
    <div className="subscription-container" style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f8fa" }}>
      <div className="subscription-box" style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 16px rgba(44,62,80,0.10)", padding: "36px", maxWidth: "420px", width: "100%" }}>
        <h2 style={{ color: "#2b6cb0", marginBottom: "22px" }}>Choose Your Subscription</h2>
        <div className="plan-options" style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "28px" }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card${selectedPlan === plan.id ? " selected" : ""}`}
              onClick={() => { setSelectedPlan(plan.id); setSubscribed(false); }}
              style={{
                border: selectedPlan === plan.id ? "2px solid #38a169" : "1px solid #D8A7B1",
                borderRadius: "10px",
                padding: "18px",
                background: selectedPlan === plan.id ? "#e6fffa" : "#FFF9F4",
                cursor: "pointer",
                boxShadow: selectedPlan === plan.id ? "0 2px 12px rgba(56,161,105,0.10)" : "0 1px 6px rgba(44,62,80,0.06)",
                transition: "all 0.2s"
              }}
            >
              <h3 style={{ margin: "0 0 8px 0", color: "#2d3748" }}>{plan.name}</h3>
              <p style={{ color: "#2b6cb0", fontWeight: "bold", marginBottom: "6px" }}>{plan.price}</p>
              <p style={{ color: "#4a5568", fontSize: "0.98em" }}>{plan.description}</p>
            </div>
          ))}
        </div>
        <button
          className="subscribe-btn"
          disabled={!selectedPlan}
          onClick={handleSubscribe}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            background: selectedPlan ? "#38a169" : "#cbd5e0",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1em",
            border: "none",
            cursor: selectedPlan ? "pointer" : "not-allowed",
            boxShadow: "0 1px 4px rgba(44,62,80,0.08)",
            marginBottom: "10px"
          }}
        >
          Subscribe
        </button>
        {subscribed && selectedPlan && (
          <div style={{ marginTop: "18px", color: "#38a169", fontWeight: "bold", textAlign: "center" }}>
            Thank you for subscribing to the {plans.find(p => p.id === selectedPlan).name}!
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionBox;