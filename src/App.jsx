import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    const fetchTriviaQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://opentdb.com/api.php?amount=5&type=multiple",
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const formattedQuestions = data.results.map((item) => {
            const allAnswers = [...item.incorrect_answers, item.correct_answer];
            const shuffledAnswers = allAnswers
              .map((ans) => decodeHTML(ans))
              .sort(() => Math.random() - 0.5);

            return {
              question: decodeHTML(item.question),
              answers: shuffledAnswers,
              correctAnswer: decodeHTML(item.correct_answer),
            };
          });

          setQuestions(formattedQuestions);
          setLoading(false);
        } else {
          throw new Error("Data soal kosong dari API.");
        }
      } catch (error) {
        // Cetak error asli ke console browser (tekan F12 untuk melihat)
        console.error("Detail Error Fetch:", error);
        setErrorMessage(
          "Gagal memuat soal dari Trivia DB. Periksa koneksi internet atau jaringanmu.",
        );
        setLoading(false);
      }
    };

    fetchTriviaQuestions();
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentIndex].correctAnswer) {
      setScore(score + 1);
    }

    setSelectedAnswer("");
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "80px", fontFamily: "Arial" }}
      >
        <h2>Memuat soal dari Trivia DB... ⏳</h2>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "80px", fontFamily: "Arial" }}
      >
        <h2 style={{ color: "red", padding: "0 20px" }}>{errorMessage}</h2>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div
      className="quiz-container"
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      {!isFinished ? (
        <div>
          <h3 style={{ color: "#007BFF" }}>Kuis Trivia Online 🌍</h3>
          <h4>
            Soal {currentIndex + 1} dari {questions.length}
          </h4>

          <h2>{questions[currentIndex].question}</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            {questions[currentIndex].answers.map((ans, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(ans)}
                style={{
                  padding: "12px",
                  fontSize: "16px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedAnswer === ans ? "#4CAF50" : "#f9f9f9",
                  color: selectedAnswer === ans ? "white" : "black",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  textAlign: "left",
                }}
              >
                {ans}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: selectedAnswer ? "#007BFF" : "#cccccc",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: selectedAnswer ? "pointer" : "not-allowed",
            }}
          >
            {currentIndex === questions.length - 1
              ? "Selesai"
              : "Soal Berikutnya"}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h2>Kuis Selesai! 🎉</h2>
          <p style={{ fontSize: "18px" }}>Skor kamu:</p>
          <h1 style={{ color: "#4CAF50" }}>
            {score} / {questions.length}
          </h1>
          <button
            onClick={handleRestart}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Main Lagi
          </button>
        </div>
      )}
    </div>
  );
}
