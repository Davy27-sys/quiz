import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LeaderboardScreen({ scores, containerStyle, buttonStyle }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedScores =
      scores && scores.length > 0
        ? scores
        : JSON.parse(localStorage.getItem("quizHistory")) || [];

    const sortedScores = savedScores.sort((a, b) => b.score - a.score);
    setHistory(sortedScores);
  }, [scores]);

  const handleRestartQuiz = () => {
    sessionStorage.removeItem("quiz_questions");
    sessionStorage.removeItem("quiz_currentIndex");
    sessionStorage.removeItem("quiz_score");

    navigate("/");
  };

  return (
    <div style={containerStyle} className="quiz-container">
      <h2>Papan Peringkat (Leaderboard)</h2>

      {history.length === 0 ? (
        <p>Belum ada riwayat skor yang tersimpan.</p>
      ) : (
        <ol style={{ paddingLeft: "20px", textAlign: "left" }}>
          {history.map((item, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <strong>{item.name}</strong> - {item.score} Poin
              <br />
              <small style={{ color: "#888" }}>{item.date}</small>
            </li>
          ))}
        </ol>
      )}

      <button
        style={buttonStyle}
        className="quiz-button"
        onClick={handleRestartQuiz}
      >
        Kembali ke Kuis
      </button>
    </div>
  );
}

export default LeaderboardScreen;
