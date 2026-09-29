import React, { useState, useEffect } from "react";
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
        <Route path="/" element={<MainQuizWrapper />} />
        <Route
          path="/result"
          element={
            <ResultScreen
              containerStyle={containerStyle}
              buttonStyle={buttonStyle}
            />
          }
        />
        <Route
          path="/leaderboard"
          element={
            <LeaderboardWrapper
              containerStyle={containerStyle}
              buttonStyle={buttonStyle}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function MainQuizWrapper() {
  const [questions, setQuestions] = useState(() => {
    const saved = sessionStorage.getItem("quiz_questions");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = sessionStorage.getItem("quiz_currentIndex");
    return saved ? JSON.parse(saved) : 0;
  });

  const [score, setScore] = useState(() => {
    const saved = sessionStorage.getItem("quiz_score");
    return saved ? JSON.parse(saved) : 0;
  });

  const [selectedAnswer, setSelectedAnswer] = useState("");

  const [loading, setLoading] = useState(() => {
    const savedQuestions = sessionStorage.getItem("quiz_questions");
    return !savedQuestions;
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (questions.length > 0) {
      sessionStorage.setItem("quiz_questions", JSON.stringify(questions));
      sessionStorage.setItem("quiz_currentIndex", JSON.stringify(currentIndex));
      sessionStorage.setItem("quiz_score", JSON.stringify(score));
    }
  }, [questions, currentIndex, score]);

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

      let apiUrl = "https://opentdb.com/api.php?amount=5&type=multiple";
      if (token) {
        apiUrl += `&token=${token}`;
      }

      const response = await fetch(apiUrl);

      if (response.status === 429) {
        setCooldown(10);
        throw new Error(
          "Terlalu banyak permintaan ke server (429). Silakan tunggu sebentar lalu klik Coba Lagi.",
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.response_code === 3 || data.response_code === 4) {
        localStorage.removeItem("opentdb_token");
        setLoading(false);
        fetchTriviaQuestions();
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
        setCurrentIndex(0);
        setScore(0);
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
    if (questions.length === 0) {
      fetchTriviaQuestions();
    }
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
      const playerName =
        prompt("Kuis selesai! Masukkan nama kamu untuk Leaderboard:") ||
        "Pemain Anonim";

      const newEntry = {
        name: playerName,
        score: updatedScore,
        date: new Date().toLocaleDateString(),
      };

      try {
        const existingScores =
          JSON.parse(localStorage.getItem("quizHistory")) || [];
        const updatedScores = [...existingScores, newEntry];
        localStorage.setItem("quizHistory", JSON.stringify(updatedScores));
      } catch (error) {
        console.error("Gagal menyimpan ke localStorage:", error);
      }

      sessionStorage.removeItem("quiz_questions");
      sessionStorage.removeItem("quiz_currentIndex");
      sessionStorage.removeItem("quiz_score");

      setTimeout(() => {
        navigate("/result", {
          state: { score: updatedScore, total: questions.length },
        });
      }, 100);
    }
  };

  if (loading) {
    return <LoadingView message="Memuat soal dari Trivia DB... ⏳" />;
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

      <Link to="/leaderboard">
        <button
          style={{ ...buttonStyle, backgroundColor: "#10b981", width: "100%" }}
        >
          Lihat Papan Peringkat (Leaderboard)
        </button>
      </Link>
    </div>
  );
}

function LeaderboardWrapper({ containerStyle, buttonStyle }) {
  const navigate = useNavigate();
  const [scoresList, setScoresList] = useState([]);

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem("quizHistory")) || [];
    const sorted = savedScores.sort((a, b) => b.score - a.score);
    setScoresList(sorted);
  }, []);

  const handleRestartQuiz = () => {
    sessionStorage.removeItem("quiz_questions");
    sessionStorage.removeItem("quiz_currentIndex");
    sessionStorage.removeItem("quiz_score");

    navigate("/");
  };

  return (
    <LeaderboardScreen
      scores={scoresList}
      handleRestartQuiz={handleRestartQuiz}
      containerStyle={containerStyle}
      buttonStyle={buttonStyle}
    />
  );
}

const containerStyle = {
  maxWidth: "600px",
  margin: "40px auto",
  padding: "20px",
  fontFamily: "Arial",
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
