import React from "react";

export default function LoadingView({ message = "Memuat soal..." }) {
  return (
    <div className="dino-container">
      <div className="dino-card">
        <div className="dino-loading">
          <div className="dino-run">
            <div className="dino"></div>
            <div className="dino-leg"></div>
          </div>

          <div className="dino-ground"></div>
        </div>

        <h2 className="dino-title">Sebentar, ya!</h2>
        <p className="dino-text">{message}</p>
        <p className="dino-subtext">Dinosaurus sedang menyiapkan soal...</p>
      </div>
    </div>
  );
}
