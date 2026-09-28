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
      <button onClick={() => navigate("/")} style={buttonStyle}>
        Main Lagi
      </button>
    </div>
  );
}
