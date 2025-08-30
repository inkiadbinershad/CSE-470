import React, { useState } from "react";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone: "" }) // Adjust phone if required
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = "/login"; // force login after signup
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 8 }}>
      <h2>Sign Up</h2>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
          clearFields();
        }}
      >
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          required
        />
        <button type="submit" style={{ width: "100%", padding: 10, background: "#38a169", color: "#fff", border: "none", borderRadius: 6 }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
