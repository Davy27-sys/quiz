import React, { useEffect, useState } from "react";
import AnswerButton from "./AnswerButton";

export default function QuizScreen({
  questions,
  currentIndex,
  selectedAnswer,
  setSelectedAnswer,
  handleNextQuestion,
}) {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    setTimeLeft(15);
  }, [currentIndex]);

  useEffect(() => {
    if (selectedAnswer !== null) return;

    if (timeLeft <= 0) {
      handleNextQuestion(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, selectedAnswer, currentIndex, handleNextQuestion]);

  if (!questions?.[currentIndex]) {
    return <div className="quiz-container">Memuat soal...</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="quiz-container">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🦖</div>

        <h2 className="quiz-title">Dino Quiz</h2>

        <p style={{ color: "#718096", margin: 0 }}>
          Uji pengetahuanmu di dunia dinosaurus
        </p>
      </div>

      <div className="question-number">
        SOAL {currentIndex + 1} / {questions.length}
      </div>

      <div
        style={{
          height: 8,
          background: "#e3e9df",
          borderRadius: 4,
          margin: "12px 0 24px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
            background: "#4d8b70",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <h2
        className="question"
        style={{
          color: "#26394b",
          WebkitTextFillColor: "#26394b",
        }}
      >
        {currentQuestion.question}
      </h2>

      <div
        className={`timer ${timeLeft <= 5 ? "timer-danger" : ""}`}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 12px",
          background: "#edf3e6",
          borderRadius: 8,
          margin: "18px 0",
        }}
      >
        <span>Waktu menjawab</span>
        <strong>{timeLeft} detik</strong>
      </div>

      <div className="answers-container">
        {currentQuestion.answers.map((answer, index) => (
          <AnswerButton
            key={index}
            answer={answer}
            isSelected={selectedAnswer === index}
            onClick={() => setSelectedAnswer(index)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => handleNextQuestion()}
        disabled={selectedAnswer === null}
        className="primary-button"
        style={{
          width: "100%",
          marginTop: 12,
        }}
      >
        {currentIndex === questions.length - 1
          ? "Selesaikan Kuis →"
          : "Soal Berikutnya →"}
      </button>
    </div>
  );
}
