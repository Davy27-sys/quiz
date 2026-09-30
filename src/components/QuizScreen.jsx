import React, { useEffect, useState } from "react";
import AnswerButton from "./AnswerButton";

export default function QuizScreen({
  questions,
  currentIndex,
  selectedAnswer,
  setSelectedAnswer,
  handleNextQuestion,
  containerStyle,
  buttonStyle,
}) {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    // Reset timer menjadi 15 setiap berganti soal
    setTimeLeft(15);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);

          // Waktu habis, lanjut ke soal berikutnya
          handleNextQuestion();

          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    // Cleanup untuk menghentikan timer soal sebelumnya
    return () => clearInterval(timer);
  }, [currentIndex]);

  if (!questions || questions.length === 0 || !questions[currentIndex]) {
    return <div>Memuat soal...</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="quiz-container" style={containerStyle}>
      <h3 style={{ color: "#007BFF" }}>Kuis Trivia Online 🌍</h3>

      <h4>
        Soal {currentIndex + 1} dari {questions.length}
      </h4>

      <h2>{currentQuestion.question}</h2>

      <h3 style={{ color: timeLeft <= 5 ? "red" : "#007BFF" }}>
        Waktu: {timeLeft} detik
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {currentQuestion.answers.map((answer, index) => (
          <AnswerButton
            key={index}
            answer={answer}
            isSelected={selectedAnswer === answer}
            onClick={() => setSelectedAnswer(answer)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleNextQuestion}
        disabled={!selectedAnswer}
        style={{
          ...buttonStyle,
          width: "100%",
          backgroundColor: selectedAnswer ? "#007BFF" : "#cccccc",
          cursor: selectedAnswer ? "pointer" : "not-allowed",
        }}
      >
        {currentIndex === questions.length - 1
          ? "Selesai 🎉"
          : "Soal Berikutnya →"}
      </button>
    </div>
  );
}
