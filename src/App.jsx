import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  // Daftar awal soal Kuis IPS Indonesia beserta pilihan jawabannya
  const initialQuestions = [
    {
      question: "Ibu kota negara Indonesia saat ini adalah...",
      answers: ["Surabaya", "Jakarta", "Bandung", "Medan"],
      correctAnswer: "Jakarta",
    },
    {
      question: "Mata uang resmi yang digunakan di Indonesia adalah...",
      answers: ["Ringgit", "Baht", "Rupiah", "Peso"],
      correctAnswer: "Rupiah",
    },
    {
      question:
        "Pulau terbesar di Indonesia berdasarkan luas wilayahnya adalah...",
      answers: ["Jawa", "Sumatra", "Kalimantan", "Sulawesi"],
      correctAnswer: "Kalimantan",
    },
    {
      question: "Semboyan negara Indonesia adalah...",
      answers: [
        "Tut Wuri Handayani",
        "Bhinneka Tunggal Ika",
        "Pancasila",
        "Garuda Pancasila",
      ],
      correctAnswer: "Bhinneka Tunggal Ika",
    },
    {
      question:
        "Garis khayal yang membagi bumi menjadi belahan bumi utara dan selatan disebut...",
      answers: [
        "Garis Bujur",
        "Garis Meridian",
        "Garis Khatulistiwa",
        "Garis Wallace",
      ],
      correctAnswer: "Garis Khatulistiwa",
    },
    {
      question:
        "Danau terbesar di Indonesia yang terletak di Sumatra Utara adalah...",
      answers: [
        "Danau Toba",
        "Danau Singkarak",
        "Danau Poso",
        "Danau Maninjau",
      ],
      correctAnswer: "Danau Toba",
    },
    {
      question:
        "Perundingan yang menghasilkan pengakuan kedaulatan Indonesia oleh Belanda pada tahun 1949 adalah...",
      answers: [
        "Perjanjian Linggarjati",
        "Perjanjian Renville",
        "KMB (Konferensi Meja Bundar)",
        "Perjanjian Roem-Royen",
      ],
      correctAnswer: "KMB (Konferensi Meja Bundar)",
    },
    {
      question:
        "Suku bangsa asli yang mendiami wilayah Papua bagian pegunungan tengah salah satunya adalah...",
      answers: ["Suku Asmat", "Suku Dani", "Suku Baduy", "Suku Toraja"],
      correctAnswer: "Suku Dani",
    },
    {
      question:
        "Batas wilayah Indonesia sebelah utara berbatasan langsung dengan negara...",
      answers: ["Australia", "Malaysia", "Timor Leste", "Papua Nugini"],
      correctAnswer: "Malaysia",
    },
    {
      question:
        "Lembaga tinggi negara yang bertugas membuat undang-undang di Indonesia adalah...",
      answers: ["MPR", "DPR", "MA", "MK"],
      correctAnswer: "DPR",
    },
  ];

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  // State tambahan untuk Loading dan Error
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Mengacak urutan pilihan jawaban (answers) SEKALI saat komponen dimuat
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (initialQuestions.length > 0) {
          // Format dan acak posisi jawaban di setiap soal
          const formattedQuestions = initialQuestions.map((item) => {
            const shuffledAnswers = [...item.answers].sort(
              () => Math.random() - 0.5,
            );
            return {
              ...item,
              answers: shuffledAnswers,
            };
          });

          setQuestions(formattedQuestions);
          setLoading(false);
        } else {
          throw new Error("Data soal tidak ditemukan.");
        }
      } catch (error) {
        setErrorMessage("Gagal memuat soal, coba lagi");
        setLoading(false);
      }
    }, 800); // Simulasi waktu muat sejenak

    return () => clearTimeout(timer);
  }, []);

  // Fungsi saat tombol jawaban diklik
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  // Fungsi untuk lanjut ke soal berikutnya atau menyelesaikan kuis
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

  // Fungsi untuk mengulang kuis
  const handleRestart = () => {
    window.location.reload();
  };

  // Tampilan ketika status masih loading
  if (loading) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "80px", fontFamily: "Arial" }}
      >
        <h2>Memuat soal... ⏳</h2>
      </div>
    );
  }

  // Tampilan ketika terjadi error
  if (errorMessage) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "80px", fontFamily: "Arial" }}
      >
        <h2 style={{ color: "red" }}>{errorMessage}</h2>
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
          <h3 style={{ color: "#007BFF" }}>
            Kuis Ilmu Pengetahuan Sosial (IPS) Indonesia 🇮🇩
          </h3>
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
          <h2>Kuis IPS Indonesia Selesai! 🎉</h2>
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
