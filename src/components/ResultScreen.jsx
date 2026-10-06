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

  if (!quizData) {
    return null;
  }

  const { score, total } = quizData;

  const handleSave = (event) => {
    event.preventDefault();

    const name = playerName.trim() || "Pemain Anonim";

    const newEntry = {
      name: name,
      score: score,
      total: total,
      date: new Date().toLocaleDateString("id-ID"),
    };

    try {
      const savedData = localStorage.getItem("quizHistory");

      const history = savedData ? JSON.parse(savedData) : [];

      const validHistory = Array.isArray(history) ? history : [];

      const updatedHistory = [...validHistory, newEntry];

      localStorage.setItem("quizHistory", JSON.stringify(updatedHistory));

      setSaved(true);

      navigate("/leaderboard");
    } catch (error) {
      console.error("Gagal menyimpan leaderboard:", error);

      alert("Gagal menyimpan skor.");
    }
  };

  return (
    <div
      className="quiz-container"
      style={{
        ...containerStyle,
        textAlign: "center",
      }}
    >
      <h2>Kuis Selesai! 🎉</h2>

      <p style={{ fontSize: "18px" }}>Skor kamu:</p>

      <h1
        style={{
          color: "#4CAF50",
          fontSize: "42px",
          margin: "10px 0 25px",
        }}
      >
        {score} / {total}
      </h1>

      {!saved ? (
        <form
          onSubmit={handleSave}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <label
            style={{
              textAlign: "left",
              fontWeight: "bold",
            }}
          >
            Masukkan nama kamu:
          </label>

          <input
            type="text"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="Contoh: Davy"
            maxLength={30}
            style={{
              padding: "12px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              outline: "none",
            }}
          />

          <button
            type="submit"
            style={{
              ...buttonStyle,
              width: "100%",
              backgroundColor: "#10b981",
            }}
          >
            Simpan ke Leaderboard 🏆
          </button>
        </form>
      ) : (
        <p
          style={{
            color: "#10b981",
            fontWeight: "bold",
          }}
        >
          Skor berhasil disimpan!
        </p>
      )}

      <button
        type="button"
        onClick={() => navigate("/")}
        style={{
          ...buttonStyle,
          width: "100%",
          backgroundColor: "#6c757d",
        }}
      >
        Main Lagi 🔄
      </button>
    </div>
  );
}
