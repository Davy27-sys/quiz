import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuizScreen />} />
        <Route path="/result" element={<ResultScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

function QuizScreen() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTriviaQuestions = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const response = await fetch(
          "https://api.allorigins.win/raw?url=" +
            encodeURIComponent(
              "https://opentdb.com/api.php?amount=5&type=multiple",
            ),
        );

        if (response.status === 429) {
          throw new Error(
            "Terlalu banyak permintaan ke server (429). Silakan tunggu sebentar lalu klik Coba Lagi.",
          );
        }

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
        } else {
          throw new Error("Data soal kosong dari API.");
        }
      } catch (error) {
        console.error("Detail Error Fetch:", error);
        setErrorMessage(
          error.message ||
            "Gagal memuat soal dari Trivia DB. Periksa koneksi internet.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTriviaQuestions();
  }, []);

  const handleNextQuestion = () => {
    let updatedScore = score;
    if (selectedAnswer === questions[currentIndex].correctAnswer) {
      updatedScore = score + 1;
      setScore(updatedScore);
    }

    setSelectedAnswer("");
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
    } else {
      navigate("/result", {
        state: { score: updatedScore, total: questions.length },
      });
    }
  };

  if (loading) {
    return <LoadingView message="Memuat soal dari Trivia DB... ⏳" />;
  }

  if (errorMessage) {
    return (
      <ErrorView
        message={errorMessage}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="quiz-container" style={containerStyle}>
      <h3 style={{ color: "#007BFF" }}>Kuis Trivia Online 🌍</h3>
      <h4>
        Soal {currentIndex + 1} dari {questions.length}
      </h4>
      <h2>{currentQ.question}</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {currentQ.answers.map((ans, index) => (
          <AnswerButton
            key={index}
            answer={ans}
            isSelected={selectedAnswer === ans}
            onClick={() => setSelectedAnswer(ans)}
          />
        ))}
      </div>

      <button
        onClick={handleNextQuestion}
        disabled={!selectedAnswer}
        style={{
          ...buttonStyle,
          backgroundColor: selectedAnswer ? "#007BFF" : "#cccccc",
          cursor: selectedAnswer ? "pointer" : "not-allowed",
        }}
      >
        {currentIndex === questions.length - 1 ? "Selesai" : "Soal Berikutnya"}
      </button>
    </div>
  );
}

function ResultScreen() {
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

function AnswerButton({ answer, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: isSelected ? "#4CAF50" : "#f9f9f9",
        color: isSelected ? "white" : "black",
        border: "1px solid #ccc",
        borderRadius: "5px",
        textAlign: "left",
      }}
    >
      {answer}
    </button>
  );
}

function LoadingView({ message }) {
  return (
    <div
      style={{ textAlign: "center", marginTop: "80px", fontFamily: "Arial" }}
    >
      <h2>{message}</h2>
    </div>
  );
}

function ErrorView({ message, onRetry }) {
  return (
    <div
      style={{ textAlign: "center", marginTop: "80px", fontFamily: "Arial" }}
    >
      <h2 style={{ color: "red", padding: "0 20px" }}>{message}</h2>
      <button onClick={onRetry} style={buttonStyle}>
        Coba Lagi
      </button>
    </div>
  );
}

const containerStyle = {
  maxWidth: "600px",
  margin: "40px auto",
  padding: "20px",
  fontFamily: "Arial",
};

const buttonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
