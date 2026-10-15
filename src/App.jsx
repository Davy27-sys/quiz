import React, { useEffect, useState, useCallback } from "react";
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
import AdventureMap from "./AdventureMap";

import "./App.css";

function decodeHTML(html) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
}

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function MainQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const fetchTriviaQuestions = async () => {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=5&type=multiple",
    );

    if (response.status === 429) {
      setCooldown(10);
      throw new Error(
        "Terlalu banyak permintaan. Tunggu beberapa detik lalu coba lagi.",
      );
    }

    if (!response.ok) {
      throw new Error("Gagal mengambil soal dari server.");
    }

    const data = await response.json();

    if (data.response_code !== 0 || !data.results?.length) {
      throw new Error("Soal belum tersedia. Coba lagi nanti.");
    }

    return data.results.map((item) => {
      const correctAnswer = decodeHTML(item.correct_answer);

      const answers = shuffleArray([
        ...item.incorrect_answers.map((answer) => decodeHTML(answer)),
        correctAnswer,
      ]);

      return {
        question: decodeHTML(item.question),
        answers,
        correctAnswer,
      };
    });
  };

  const fetchMixedQuestions = async () => {
    if (cooldown > 0) return;

    setLoading(true);
    setErrorMessage("");
    setIsFinishing(false);

    try {
      const apiQuestions = await fetchTriviaQuestions();

      const savedQuestions = localStorage.getItem("custom_questions");
      let customQuestions = [];

      if (savedQuestions) {
        try {
          const parsedQuestions = JSON.parse(savedQuestions);

          if (Array.isArray(parsedQuestions)) {
            customQuestions = parsedQuestions;
          }
        } catch (error) {
          console.error("Data soal custom tidak valid:", error);
        }
      }

      const convertedCustomQuestions = customQuestions
        .filter(
          (question) =>
            question &&
            typeof question.question === "string" &&
            Array.isArray(question.answers) &&
            question.answers.length === 4 &&
            Number.isInteger(question.correctAnswerIndex) &&
            question.correctAnswerIndex >= 0 &&
            question.correctAnswerIndex < question.answers.length &&
            question.answers.every((answer) => typeof answer === "string"),
        )
        .map((question) => {
          const correctAnswer = question.answers[question.correctAnswerIndex];

          const answers = shuffleArray(question.answers);

          return {
            question: question.question,
            answers,
            correctAnswer,
          };
        });

      const combinedQuestions = [...apiQuestions, ...convertedCustomQuestions];

      const mixedQuestions = shuffleArray(combinedQuestions);

      if (mixedQuestions.length === 0) {
        throw new Error("Soal belum tersedia.");
      }

      setQuestions(mixedQuestions);
      setCurrentIndex(0);
      setScore(0);
      setSelectedAnswer(null);

      sessionStorage.setItem("quiz_questions", JSON.stringify(mixedQuestions));
      sessionStorage.setItem("currentIndex", "0");
      sessionStorage.setItem("score", "0");
    } catch (error) {
      setErrorMessage(
        error.message || "Terjadi kesalahan saat mengambil soal.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMixedQuestions();
  }, []);

  const handleNextQuestion = useCallback(
    (force = false) => {
      if (isFinishing) return;
      if (!force && selectedAnswer === null) return;

      const currentQuestion = questions[currentIndex];

      if (!currentQuestion) return;

      const chosenAnswer =
        selectedAnswer === null
          ? null
          : currentQuestion.answers[selectedAnswer];

      const isCorrect =
        chosenAnswer !== null && chosenAnswer === currentQuestion.correctAnswer;

      const newScore = isCorrect ? score + 1 : score;

      setScore(newScore);
      sessionStorage.setItem("score", String(newScore));

      if (currentIndex < questions.length - 1) {
        const nextIndex = currentIndex + 1;

        setCurrentIndex(nextIndex);
        setSelectedAnswer(null);

        sessionStorage.setItem("currentIndex", String(nextIndex));
      } else {
        setIsFinishing(true);

        sessionStorage.removeItem("quiz_questions");
        sessionStorage.removeItem("currentIndex");
        sessionStorage.removeItem("score");

        setTimeout(() => {
          navigate("/result", {
            state: {
              score: newScore,
              total: questions.length,
            },
          });
        }, 2200);
      }
    },
    [isFinishing, selectedAnswer, questions, currentIndex, score, navigate],
  );

  const buttonStyle = {
    marginTop: "16px",
    padding: "12px 18px",
    fontSize: "14px",
    cursor: "pointer",
  };

  if (loading) {
    return (
      <main className="app-shell">
        <div className="quiz-layout">
          <LoadingView message="Memuat soal..." />
        </div>
      </main>
    );
  }

  if (errorMessage || questions.length === 0) {
    return (
      <main className="app-shell">
        <div className="quiz-layout">
          <ErrorView
            errorMessage={errorMessage || "Soal belum tersedia."}
            cooldown={cooldown}
            onRetry={fetchMixedQuestions}
            buttonStyle={buttonStyle}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="quiz-layout">
        <QuizScreen
          questions={questions}
          currentIndex={currentIndex}
          score={score}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          handleNextQuestion={handleNextQuestion}
          isFinishing={isFinishing}
        />

        <nav className="home-navigation">
          <Link to="/petualangan" className="secondary-button">
            🦕 Peta Petualangan
          </Link>

          <Link to="/leaderboard" className="secondary-button">
            🏆 Leaderboard
          </Link>

          <Link to="/buat-soal" className="secondary-button">
            ✏️ Buat Soal
          </Link>

          <Link to="/daftar-soal" className="secondary-button">
            📚 Daftar Soal
          </Link>
        </nav>

        {isFinishing && (
          <div className="dino-finish-overlay">
            <div className="dino-finish-card">
              <div className="dino-stars">✦ ✧ ★ ✧ ✦</div>

              <div className="dino-finish-sprite">🦖</div>

              <h2>Petualangan Selesai!</h2>

              <p>Yeay! Kamu berhasil menyelesaikan kuis!</p>

              <div className="dino-finish-loading">
                <span />
              </div>

              <small>Menyiapkan hasil kuis...</small>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainQuiz />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
        <Route path="/buat-soal" element={<CreateQuestion />} />
        <Route path="/daftar-soal" element={<DaftarSoal />} />
        <Route path="/petualangan" element={<AdventureMap />} />
      </Routes>
    </BrowserRouter>
  );
}
