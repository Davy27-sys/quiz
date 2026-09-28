import React from "react";

export default function AnswerButton({ answer, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: isSelected ? "#4CAF50" : "#f9f9f9",
        color: isSelected ? "white" : "black",
        border: "1px solid #ccc",
        borderRadius: "5px",
        textAlign: "left",
      }}
    >
      {answer}
    </button>
  );
}
