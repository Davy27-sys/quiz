import React from "react";

export default function AnswerButton({ answer, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`answer-option ${isSelected ? "selected" : ""}`}
    >
      <span className="answer-letter">{isSelected ? "✓" : "›"}</span>

      <span>{answer}</span>
    </button>
  );
}
