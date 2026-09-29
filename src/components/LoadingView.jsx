import React from "react";

export default function LoadingView({ message }) {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>{message}</h2>
    </div>
  );
}
