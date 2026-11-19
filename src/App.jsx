import { useEffect, useState, useCallback } from "react";
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

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function MainQuiz() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizCategoryId, setQuizCategoryId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);

  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3001/soal");

      if (!response.ok) {
        throw new Error(`Gagal mengambil soal. Status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Soal belum tersedia di database.");
      }

      const categoryMap = new Map();

      data.forEach((item) => {
        if (!item.kategori_id || !item.kategori) {
          throw new Error(`Kategori soal ID ${item.id} tidak valid.`);
        }

        categoryMap.set(String(item.kategori_id), {
          id: item.kategori_id,
          nama: item.kategori,
        });
      });

      const categoryList = [...categoryMap.values()];

      setCategories(categoryList);
      setSelectedCategory(String(categoryList[0].id));
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
      setErrorMessage(
        error instanceof TypeError
          ? "Tidak dapat terhubung ke server. Pastikan backend berjalan."
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const startQuiz = useCallback(async () => {
    if (!selectedCategory) return;

    setLoading(true);
    setErrorMessage("");
    setIsFinishing(false);

    try {
      const category = categories.find(
        (item) => String(item.id) === selectedCategory,
      );

      if (!category) {
        throw new Error("Kategori tidak ditemukan.");
      }

      const response = await fetch(
        `http://localhost:3001/soal?kategori=${encodeURIComponent(category.nama)}`,
      );

      if (!response.ok) {
        throw new Error(`Gagal mengambil soal. Status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Belum ada soal untuk kategori ini.");
      }

      const backendQuestions = data.map((item) => {
        if (
          !Array.isArray(item.jawaban) ||
          item.jawaban.length < 2 ||
          !item.jawabanBenar
        ) {
          throw new Error(`Format soal ID ${item.id} tidak valid.`);
        }

        if (String(item.kategori_id) !== selectedCategory) {
          throw new Error("Soal tidak sesuai dengan kategori yang dipilih.");
        }

        return {
          id: item.id,
          kategori_id: item.kategori_id,
          kategori: item.kategori,
          question: item.pertanyaan,
          answers: shuffleArray(
            item.jawaban.map((option) => ({
              id: option.opsi_id,
              text: option.teks_opsi,
            })),
          ),
          correctAnswer: item.jawabanBenar,
        };
      });

      const mixedQuestions = shuffleArray(backendQuestions);

      setQuestions(mixedQuestions);
      setCurrentIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setQuizAnswers([]);
      setQuizCategoryId(category.id);

      sessionStorage.setItem("quiz_questions", JSON.stringify(mixedQuestions));
      sessionStorage.setItem("currentIndex", "0");
      sessionStorage.setItem("score", "0");
    } catch (error) {
      console.error("Gagal memulai kuis:", error);
      setErrorMessage(
        error instanceof TypeError
          ? "Tidak dapat terhubung ke server."
          : error.message,
      );
      setQuestions([]);
      setQuizAnswers([]);
      setQuizCategoryId(null);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, categories]);

  useEffect(() => {
      const controller = new AbortController();

      const loadCategories = async () => {
        await fetchCategories(controller.signal);
      };

      loadCategories();

      return () => controller.abort();
  }, [fetchCategories]);

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
        chosenAnswer !== null &&
        chosenAnswer.text === currentQuestion.correctAnswer;

      const newScore = isCorrect ? score + 1 : score;

      const newQuizAnswers =
        chosenAnswer !== null
          ? [
              ...quizAnswers,
              {
                soal_id: currentQuestion.id,
                opsi_id: chosenAnswer.id,
              },
            ]
          : quizAnswers;

      setQuizAnswers(newQuizAnswers);
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
              kategori_id: quizCategoryId,
              jawaban: newQuizAnswers,
            },
          });
        }, 2200);
      }
    },
    [
      isFinishing,
      selectedAnswer,
      questions,
      currentIndex,
      score,
      quizAnswers,
      quizCategoryId,
      navigate,
    ],
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
          <LoadingView message="Memuat kategori dan soal..." />
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="app-shell">
        <div className="quiz-layout">
          <ErrorView
            errorMessage={errorMessage}
            onRetry={fetchCategories}
            buttonStyle={buttonStyle}
          />
        </div>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="app-shell">
        <div className="quiz-layout">
          <h2>Pilih Kategori Kuis</h2>

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            style={{ padding: 12, width: "100%", marginBottom: 16 }}
          >
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.nama}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="primary-button"
            onClick={startQuiz}
            style={{ width: "100%" }}
          >
            Mulai Kuis
          </button>

          <nav className="home-navigation">
            <Link to="/petualangan" className="secondary-button">
              Peta Petualangan
            </Link>
            <Link to="/leaderboard" className="secondary-button">
              Leaderboard
            </Link>
            <Link to="/buat-soal" className="secondary-button">
              Buat Soal
            </Link>
            <Link to="/daftar-soal" className="secondary-button">
              Daftar Soal
            </Link>
          </nav>
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
            Peta Petualangan
          </Link>
          <Link to="/leaderboard" className="secondary-button">
            Leaderboard
          </Link>
          <Link to="/buat-soal" className="secondary-button">
            Buat Soal
          </Link>
          <Link to="/daftar-soal" className="secondary-button">
            Daftar Soal
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
