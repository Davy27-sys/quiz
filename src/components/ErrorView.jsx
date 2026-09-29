import React from "react";

export default function ErrorView({
  errorMessage,
  cooldown,
  onRetry,
  buttonStyle,
}) {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          color: "#dc2626",
        }}
      >
        Gagal Memuat Kuis
      </h2>

      <p>{errorMessage}</p>

      <button
        type="button"
        onClick={onRetry}
        disabled={cooldown > 0}
        style={{
          ...buttonStyle,
          backgroundColor: cooldown > 0 ? "#cccccc" : "#007BFF",
          cursor: cooldown > 0 ? "not-allowed" : "pointer",
        }}
      >
        {cooldown > 0 ? `Tunggu ${cooldown} detik...` : "Coba Lagi"}
      </button>
    </div>
  );
}
