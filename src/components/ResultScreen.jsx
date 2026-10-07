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
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px 20px",
      }}
    >
      <div
        className="quiz-container"
        style={{
          ...containerStyle,
          width: "100%",
          maxWidth: "500px",
          boxSizing: "border-box",
          textAlign: "center",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "35px 30px",
          boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          style={{
            fontSize: "60px",
            marginBottom: "10px",
          }}
        >
          🎉
        </div>

        <h2
          style={{
            margin: "0 0 10px",
            color: "#333",
            fontSize: "28px",
          }}
        >
          Kuis Selesai!
        </h2>

        <p
          style={{
            fontSize: "18px",
            color: "#666",
            marginBottom: "5px",
          }}
        >
          Skor kamu:
        </p>

        <h1
          style={{
            color: "#4CAF50",
            fontSize: "48px",
            margin: "5px 0 25px",
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
                color: "#333",
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
                padding: "13px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                outline: "none",
                boxSizing: "border-box",
                width: "100%",
              }}
            />

            <button
              type="submit"
              style={{
                ...buttonStyle,
                width: "100%",
                padding: "13px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
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
              fontSize: "17px",
            }}
          >
            Skor berhasil disimpan! ✅
          </p>
        )}

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            ...buttonStyle,
            width: "100%",
            marginTop: "15px",
            padding: "13px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Main Lagi 🔄
        </button>
      </div>
    </div>
  );
}
