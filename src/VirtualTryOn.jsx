import React, { useState } from "react";
import "./App.css";

function VirtualTryon() {
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  // Sample outfits
  const outfits = [
    { id: 1, name: "Red Dress", image: "/model/outfits/red-dress.png" },
    { id: 2, name: "Blue Jacket", image: "/model/outfits/blue-jacket.png" },
    { id: 3, name: "Casual T-Shirt", image: "/model/outfits/tshirt.png" },
  ];

  return (
    <div className="virtual-tryon" style={{
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#f7f8fa"
    }}>
      <div className="model-preview" style={{
        position: "relative",
        width: 220,
        height: 380,
        marginBottom: 32,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 16px rgba(44,62,80,0.10)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* Base model image */}
        <img
          src="/model/base-model.png"
          alt="Base Model"
          className="base-model"
          style={{
            width: "220px",
            height: "380px",
            borderRadius: "12px",
            objectFit: "cover"
          }}
        />
        {/* Overlay outfit */}
        {selectedOutfit && (
          <img
            src={selectedOutfit.image}
            alt={selectedOutfit.name}
            className="outfit-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "220px",
              height: "380px",
              pointerEvents: "none"
            }}
          />
        )}
      </div>

      <div className="outfit-selector" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px"
      }}>
        <h3 style={{ color: "#2b6cb0", marginBottom: 10 }}>Select an Outfit</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: 8 }}>
          {outfits.map((outfit) => (
            <button
              key={outfit.id}
              className="outfit-btn"
              onClick={() => setSelectedOutfit(outfit)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                background: selectedOutfit && selectedOutfit.id === outfit.id ? "#38a169" : "#2b6cb0",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(44,62,80,0.08)",
                transition: "background 0.2s"
              }}
            >
              {outfit.name}
            </button>
          ))}
          <button
            onClick={() => setSelectedOutfit(null)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              background: "#e53e3e",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(44,62,80,0.08)"
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default VirtualTryon;