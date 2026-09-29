import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingView from "./LoadingView";

export default function ResultScreen({ containerStyle, buttonStyle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const quizData = location.state;

  useEffect(() => {
    if (!quizData) {
      navigate("/");
    }
  }, [quizData, navigate]);

  if (!quizData) {
    return <LoadingView message="Akses ditolak. Mengarahkan kembali... 🔄" />;
  }

  const { score, total } = quizData;

  return (
    <div
      className="quiz-container"
      style={{ ...containerStyle, textAlign: "center" }}
    >
      <h2>Kuis Selesai! 🎉</h2>
      <p style={{ fontSize: "18px" }}>Skor kamu:</p>
      <h1 style={{ color: "#4CAF50" }}>
        {score} / {total}
      </h1>

      {/* Tombol untuk mengulang kuis */}
      <button onClick={() => navigate("/")} style={buttonStyle}>
        Main Lagi
      </button>

      {/* Tombol baru untuk melihat Papan Peringkat */}
      <button
        onClick={() => navigate("/leaderboard")}
        style={{
          ...buttonStyle,
          backgroundColor: "#10b981", // Warna hijau khas leaderboard
          marginTop: "10px",
        }}
      >
        Lihat Papan Peringkat
      </button>
    </div>
  );
}
