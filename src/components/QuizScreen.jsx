import React from "react";
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
