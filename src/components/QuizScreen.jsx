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
    setTimeLeft(15);
  }, [currentIndex]);

  useEffect(() => {
    if (selectedAnswer) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, selectedAnswer, handleNextQuestion]);

  if (!questions || questions.length === 0 || !questions[currentIndex]) {
    return <div>Memuat soal...</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="quiz-container" style={containerStyle}>
      {/* Judul */}
      <h3 className="quiz-title">Kuis Trivia Online 🌍</h3>

      {/* Jumlah soal */}
      <div className="question-number">
        Soal {currentIndex + 1} dari {questions.length}
      </div>

      {/* Pertanyaan */}
      <h2 className="question">{currentQuestion.question}</h2>

      {/* Timer */}
      <h3 className={`timer ${timeLeft <= 5 ? "timer-danger" : ""}`}>
        ⏱️ Waktu: {timeLeft} detik
      </h3>

      {/* Pilihan jawaban */}
      <div className="answers-container">
        {currentQuestion.answers.map((answer, index) => (
          <AnswerButton
            key={index}
            answer={answer}
            isSelected={selectedAnswer === answer}
            onClick={() => setSelectedAnswer(answer)}
          />
        ))}
      </div>

      {/* Tombol berikutnya */}
      <button
        type="button"
        onClick={handleNextQuestion}
        disabled={!selectedAnswer}
        className="primary-button"
        style={buttonStyle}
      >
        {currentIndex === questions.length - 1
          ? "Selesai 🎉"
          : "Soal Berikutnya →"}
      </button>
    </div>
  );
}
