import React from "react";

export default function AnswerButton({ answer, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: isSelected ? "#4CAF50" : "#f9f9f9",
        color: isSelected ? "white" : "black",
        border: isSelected ? "2px solid #4CAF50" : "1px solid #ccc",
        borderRadius: "5px",
        textAlign: "left",
      }}
    >
      {answer}
    </button>
  );
}
