import React from "react";

export default function ErrorView({
  errorMessage,
  cooldown,
  onRetry,
  buttonStyle,
}) {
  return (
    <div
      style={{ textAlign: "center", marginTop: "80px", fontFamily: "Arial" }}
    >
      <h2 style={{ color: "red", padding: "0 20px" }}>{errorMessage}</h2>
      <button
        onClick={onRetry}
        disabled={cooldown > 0}
        style={{
          ...buttonStyle,
          backgroundColor: cooldown > 0 ? "#cccccc" : "#007BFF",
          cursor: cooldown > 0 ? "not-allowed" : "pointer",
        }}
      >
        {cooldown > 0 ? `Tunggu (${cooldown}s)...` : "Coba Lagi"}
      </button>
    </div>
  );
}
