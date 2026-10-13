import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LeaderboardScreen({ containerStyle, buttonStyle }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
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

      setHistory([...data].sort((a, b) => b.score - a.score));
    } catch (error) {
      console.error("Gagal membaca leaderboard:", error);
      setHistory([]);
    }
  }, []);

  return (
    <div
      className="quiz-container"
      style={{
        ...containerStyle,
        background: "#fffaf0",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 40 }}>🏆</div>
        <h2>Leaderboard</h2>
        <p style={{ color: "#718096" }}>
          Para penjelajah dengan skor tertinggi
        </p>
      </div>

      {history.length === 0 ? (
        <div
          style={{
            padding: 24,
            background: "#edf3e6",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          Belum ada skor. Yuk, mulai bermain!
        </div>
      ) : (
        <ol style={{ paddingLeft: 26 }}>
          {history.map((item, index) => (
            <li key={index}>
              <strong>
                {index + 1}. {item.name}
              </strong>

              <div style={{ marginTop: 6 }}>
                Skor: {item.score} / {item.total || 5}
              </div>

              <small style={{ color: "#718096" }}>{item.date}</small>
            </li>
          ))}
        </ol>
      )}

      <button
        type="button"
        onClick={() => navigate("/")}
        className="primary-button"
        style={{
          ...buttonStyle,
          width: "100%",
          marginTop: 16,
        }}
      >
        Kembali ke Kuis
      </button>
    </div>
  );
}
