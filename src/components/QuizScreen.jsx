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
  const [showResult, setShowResult] = useState(false);
  const currentQuestion = questions?.[currentIndex];

  useEffect(() => {
    setTimeLeft(15);
    setShowResult(false);
  }, [currentIndex]);

  useEffect(() => {
    if (selectedAnswer !== null || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, selectedAnswer]);

  useEffect(() => {
    if (selectedAnswer === null || !currentQuestion) return;

    setShowResult(false);

    const delay = setTimeout(() => {
      setShowResult(true);
    }, 3000);

    return () => clearTimeout(delay);
  }, [selectedAnswer, currentIndex]);

  if (!currentQuestion) {
    return <div className="quiz-container">Memuat soal...</div>;
  }

  const chosenAnswer =
    selectedAnswer === null ? null : currentQuestion.answers[selectedAnswer];

  const isCorrect =
    selectedAnswer !== null && chosenAnswer === currentQuestion.correctAnswer;

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

      {timeLeft === 0 && selectedAnswer === null && (
        <p style={{ color: "#b45309", textAlign: "center" }}>
          Waktu habis! Kamu bisa lanjut ke soal berikutnya.
        </p>
      )}

      <div className="answers-container">
        {currentQuestion.answers.map((answer, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectAnswer = answer === currentQuestion.correctAnswer;

          let backgroundColor = "transparent";
          let borderColor = "transparent";

          if (showResult && isCorrectAnswer) {
            backgroundColor = "#d1fae5";
            borderColor = "#16a34a";
          } else if (showResult && isSelected && !isCorrectAnswer) {
            backgroundColor = "#fee2e2";
            borderColor = "#dc2626";
          }

          return (
            <div
              key={index}
              style={{
                borderRadius: 12,
                marginBottom: 10,
                backgroundColor,
                border: `2px solid ${borderColor}`,
                transition: "background-color 0.3s ease",
              }}
            >
              <AnswerButton
                answer={answer}
                isSelected={isSelected}
                onClick={() => {
                  if (selectedAnswer === null && timeLeft > 0) {
                    setSelectedAnswer(index);
                  }
                }}
              />
            </div>
          );
        })}
      </div>

      {selectedAnswer !== null && showResult && (
        <div
          style={{
            padding: 12,
            marginTop: 12,
            marginBottom: 8,
            borderRadius: 8,
            textAlign: "center",
            fontWeight: "bold",
            color: isCorrect ? "#166534" : "#b91c1c",
            background: isCorrect ? "#dcfce7" : "#fee2e2",
          }}
        >
          {isCorrect
            ? "🎉 Benar! Hebat!"
            : `❌ Kurang tepat! Jawaban benar: ${currentQuestion.correctAnswer}`}
        </div>
      )}

      {selectedAnswer !== null && !showResult && (
        <div
          style={{
            textAlign: "center",
            padding: 12,
            marginTop: 12,
            color: "#365846",
            background: "#edf3e6",
            borderRadius: 8,
          }}
        >
          ⏳ Memeriksa jawaban...
        </div>
      )}

      <button
        type="button"
        onClick={() => handleNextQuestion(true)}
        disabled={
          (selectedAnswer === null && timeLeft > 0) ||
          (selectedAnswer !== null && !showResult)
        }
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
