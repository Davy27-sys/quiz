import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultScreen({ containerStyle, buttonStyle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const quizData = location.state;

  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!quizData) {
      navigate("/", { replace: true });
    }
  }, [quizData, navigate]);

  if (!quizData) return null;

  const { score, total } = quizData;

  const handleSave = (event) => {
    event.preventDefault();

    const newEntry = {
      name: playerName.trim() || "Pemain Anonim",
      score,
      total,
      date: new Date().toLocaleDateString("id-ID"),
    };

    try {
      const savedData = localStorage.getItem("quizHistory");
      const history = savedData ? JSON.parse(savedData) : [];

      if (!Array.isArray(history)) {
        throw new Error("Data leaderboard tidak valid.");
      }

      localStorage.setItem(
        "quizHistory",
        JSON.stringify([...history, newEntry]),
      );

      setSaved(true);
      navigate("/leaderboard");
    } catch (error) {
      console.error("Gagal menyimpan leaderboard:", error);
      alert("Gagal menyimpan skor. Silakan coba lagi.");
    }
  };

  return (
    <div className="result-page">
      <div
        className="quiz-container"
        style={{
          ...containerStyle,
          width: "100%",
          maxWidth: 500,
          textAlign: "center",
          padding: 28,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>🦖</div>

        <p style={{ color: "#4d8b70", fontWeight: 800 }}>PETUALANGAN SELESAI</p>

        <h2 style={{ margin: "8px 0" }}>Kuis Selesai!</h2>

        <p style={{ color: "#718096" }}>Ini hasil petualanganmu hari ini.</p>

        <div
          style={{
            background: "#e4f1df",
            border: "2px solid #cbdcc5",
            borderRadius: 10,
            padding: "20px 12px",
            margin: "22px 0",
          }}
        >
          <p style={{ margin: 0 }}>Skor kamu</p>

          <h1
            style={{
              fontSize: 46,
              margin: "8px 0",
              color: "#356b54",
            }}
          >
            {score} / {total}
          </h1>
        </div>

        {!saved && (
          <form onSubmit={handleSave}>
            <label style={{ textAlign: "left" }}>Nama pemain</label>

            <input
              type="text"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Masukkan nama kamu"
              maxLength={30}
            />

            <button
              type="submit"
              className="primary-button"
              style={{ width: "100%" }}
            >
              Simpan Skor
            </button>
          </form>
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
          Main Lagi
        </button>
      </div>
    </div>
  );
}
