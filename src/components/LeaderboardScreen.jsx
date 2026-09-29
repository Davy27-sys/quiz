import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LeaderboardScreen({ containerStyle, buttonStyle }) {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);

  const loadLeaderboard = () => {
    try {
      const saved = localStorage.getItem("quizHistory");

      if (!saved) {
        setHistory([]);
        return;
      }

      const data = JSON.parse(saved);

      if (!Array.isArray(data)) {
        setHistory([]);
        return;
      }

      const sorted = [...data].sort((a, b) => b.score - a.score);

      setHistory(sorted);
    } catch (error) {
      console.error("Gagal membaca leaderboard:", error);

      setHistory([]);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  return (
    <div className="quiz-container" style={containerStyle}>
      <h2 style={{ textAlign: "center" }}>🏆 Leaderboard</h2>

      {history.length === 0 ? (
        <p style={{ textAlign: "center" }}>Belum ada skor.</p>
      ) : (
        <ol style={{ paddingLeft: "25px" }}>
          {history.map((item, index) => (
            <li
              key={index}
              style={{
                marginBottom: "15px",
                padding: "10px",
                background: "#f8f8f8",
                borderRadius: "8px",
              }}
            >
              <strong>{item.name}</strong>

              <br />

              <span>
                Skor: {item.score} / {item.total || 5}
              </span>

              <br />

              <small style={{ color: "#777" }}>{item.date}</small>
            </li>
          ))}
        </ol>
      )}

      <button
        type="button"
        onClick={() => navigate("/")}
        style={{
          ...buttonStyle,
          width: "100%",
        }}
      >
        Kembali ke Kuis
      </button>
    </div>
  );
}
