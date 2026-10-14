import React from "react";

export default function AnswerButton({
  answer,
  isSelected,
  onClick,
  disabled = false,
  result = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`answer-option ${isSelected ? "selected" : ""} ${
        result === "correct"
          ? "answer-correct"
          : result === "wrong"
            ? "answer-wrong"
            : ""
      }`}
      style={{
        width: "100%",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
      }}
    >
      <span className="answer-letter">
        {result === "correct"
          ? "✓"
          : result === "wrong"
            ? "✕"
            : isSelected
              ? "✓"
              : "›"}
      </span>

      <span>{answer}</span>
    </button>
  );
}
