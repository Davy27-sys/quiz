import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";

import LoadingView from "./components/LoadingView";
import ErrorView from "./components/ErrorView";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import LeaderboardScreen from "./components/LeaderboardScreen";
import CreateQuestion from "./components/CreateQuestion";
import DaftarSoal from "./components/DaftarSoal";

import "./App.css";

const decodeHTML = (html) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
};

const containerStyle = {
  maxWidth: "600px",
  margin: "40px auto",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman utama kuis */}
        <Route path="/" element={<MainQuiz />} />

        {/* Halaman hasil */}
        <Route
          path="/result"
          element={
            <ResultScreen
              containerStyle={containerStyle}
              buttonStyle={buttonStyle}
            />
          }
        />

        {/* Halaman leaderboard */}
        <Route
          path="/leaderboard"
          element={
            <LeaderboardScreen
              containerStyle={containerStyle}
              buttonStyle={buttonStyle}
            />
          }
        />

        {/* Halaman membuat soal custom */}
        <Route path="/buat-soal" element={<CreateQuestion />} />

        {/* Halaman daftar soal custom */}
        <Route path="/daftar-soal" element={<DaftarSoal />} />
      </Routes>
    </BrowserRouter>
  );
}

function MainQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const fetchTriviaQuestions = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=5&type=multiple",
      );

      if (response.status === 429) {
        setCooldown(10);
        throw new Error(
          "Server terlalu banyak menerima permintaan. Tunggu 10 detik lalu coba lagi.",
        );
      }

      if (!response.ok) {
        throw new Error(`Gagal mengambil soal. Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.response_code !== 0) {
        throw new Error("Soal gagal dimuat dari Open Trivia Database.");
      }

      if (!data.results || data.results.length === 0) {
        throw new Error("Tidak ada soal yang diterima.");
      }

      const formattedQuestions = data.results.map((item) => {
        const correctAnswer = decodeHTML(item.correct_answer);

        const answers = [...item.incorrect_answers, item.correct_answer]
          .map((answer) => decodeHTML(answer))
          .sort(() => Math.random() - 0.5);

        return {
          question: decodeHTML(item.question),
          answers: answers,
          correctAnswer: correctAnswer,
        };
      });

      setQuestions(formattedQuestions);
      setCurrentIndex(0);
      setScore(0);
      setSelectedAnswer("");

      sessionStorage.setItem(
        "quiz_questions",
        JSON.stringify(formattedQuestions),
      );

      sessionStorage.setItem("quiz_currentIndex", "0");
      sessionStorage.setItem("quiz_score", "0");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message || "Gagal memuat soal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTriviaQuestions();
  }, []);

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      return;
    }

    const currentQuestion = questions[currentIndex];

    if (!currentQuestion) {
      return;
    }

    let newScore = score;

    if (selectedAnswer === currentQuestion.correctAnswer) {
      newScore = score + 1;
    }

    setScore(newScore);

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedAnswer("");
      sessionStorage.setItem("quiz_currentIndex", String(nextIndex));
      sessionStorage.setItem("quiz_score", String(newScore));

      return;
    }

    sessionStorage.removeItem("quiz_questions");
    sessionStorage.removeItem("quiz_currentIndex");
    sessionStorage.removeItem("quiz_score");

    navigate("/result", {
      state: {
        score: newScore,
        total: questions.length,
      },
    });
  };

  if (loading) {
    return <LoadingView message="Memuat soal..." />;
  }

  if (errorMessage) {
    return (
      <ErrorView
        errorMessage={errorMessage}
        cooldown={cooldown}
        onRetry={fetchTriviaQuestions}
        buttonStyle={buttonStyle}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <ErrorView
        errorMessage="Soal tidak tersedia."
        cooldown={cooldown}
        onRetry={fetchTriviaQuestions}
        buttonStyle={buttonStyle}
      />
    );
  }

  return (
    <div style={containerStyle}>
      <QuizScreen
        questions={questions}
        currentIndex={currentIndex}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        handleNextQuestion={handleNextQuestion}
        containerStyle={{}}
        buttonStyle={buttonStyle}
      />

      {/* Tombol Leaderboard */}
      <Link
        to="/leaderboard"
        style={{
          display: "block",
          textDecoration: "none",
        }}
      >
        <button
          type="button"
          style={{
            ...buttonStyle,
            width: "100%",
            backgroundColor: "#10b981",
          }}
        >
          Lihat Leaderboard 🏆
        </button>
      </Link>

      {/* Tombol Buat Soal Custom */}
      <Link
        to="/buat-soal"
        style={{
          display: "block",
          textDecoration: "none",
        }}
      >
        <button
          type="button"
          style={{
            ...buttonStyle,
            width: "100%",
            backgroundColor: "#8b5cf6",
          }}
        >
          Buat Soal Custom ✏️
        </button>
      </Link>

      {/* Tombol Lihat Soal Custom */}
      <Link
        to="/daftar-soal"
        style={{
          display: "block",
          textDecoration: "none",
        }}
      >
        <button
          type="button"
          style={{
            ...buttonStyle,
            width: "100%",
            backgroundColor: "#f59e0b",
          }}
        >
          Lihat Soal Custom 📚
        </button>
      </Link>
    </div>
  );
}
