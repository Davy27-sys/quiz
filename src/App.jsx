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
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  // Cooldown timer untuk tombol Coba Lagi jika terkena 429
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const fetchTriviaQuestions = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      // 1. Ambil atau buat token sesi OpenTDB agar terhindar dari rate limit ketat IP
      let token = localStorage.getItem("opentdb_token");
      if (!token) {
        const tokenRes = await fetch(
          "https://opentdb.com/api_token.php?command=request",
        );
        const tokenData = await tokenRes.json();
        if (tokenData.response_code === 0) {
          token = tokenData.token;
          localStorage.setItem("opentdb_token", token);
        }
      }

      // 2. Fetch soal dengan menyertakan token sesi
      let apiUrl = "https://opentdb.com/api.php?amount=5&type=multiple";
      if (token) {
        apiUrl += `&token=${token}`;
      }

      const response = await fetch(apiUrl);

      // Jika terkena rate limit (429)
      if (response.status === 429) {
        setCooldown(10); // Kunci tombol selama 10 detik
        throw new Error(
          "Terlalu banyak permintaan ke server (429). Silakan tunggu sebentar lalu klik Coba Lagi.",
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Jika token habis/expired (code 3 atau 4), reset token lalu ambil ulang
      if (data.response_code === 3 || data.response_code === 4) {
        localStorage.removeItem("opentdb_token");
        setLoading(false);
        fetchTriviaQuestions(); // Coba ambil lagi secara rekursif
        return;
      }

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

  useEffect(() => {
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
      <div
        style={{ textAlign: "center", marginTop: "80px", fontFamily: "Arial" }}
      >
        <h2 style={{ color: "red", padding: "0 20px" }}>{errorMessage}</h2>
        <button
          onClick={fetchTriviaQuestions}
          disabled={cooldown > 0}
          style={{
            ...buttonStyle,
            backgroundColor: cooldown > 0 ? "#cccccc" : "#007BFF",
            cursor: cooldown > 0 ? "not-allowed" : "pointer",
          }}
        >
          {cooldown > 0 ? `Tunggu (${cooldown}s)...` : "Coba Lagi"}
        </button>
      </div>
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
