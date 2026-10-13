import React from "react";

export default function ErrorView({ errorMessage, cooldown = 0, onRetry }) {
  const isCooldown = cooldown > 0;

  return (
    <div className="dino-container">
      <div className="dino-card">
        <div className="dino-error-icon">!</div>

        <h2 className="dino-title">Waduh, Ada Masalah!</h2>

        <p className="dino-text">Dinosaurus belum berhasil mengambil soal.</p>

        <p className="dino-error-message">
          {errorMessage || "Terjadi kesalahan. Coba lagi nanti."}
        </p>

        {isCooldown && (
          <p className="dino-cooldown">Tunggu {cooldown} detik lagi...</p>
        )}

        <button
          type="button"
          onClick={onRetry}
          disabled={isCooldown}
          className="primary-button"
        >
          {isCooldown ? `Tunggu ${cooldown} detik` : "↻ Coba Lagi"}
        </button>

        <p className="dino-subtext">Jangan menyerah, petualang!</p>
      </div>
    </div>
  );
}
