
import React, { useState } from "react";

export default function CreateQuestion() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!question.trim()) {
      alert("Pertanyaan harus diisi.");
      return;
    }

    if (answers.some((answer) => !answer.trim())) {
      alert("Semua pilihan jawaban harus diisi.");
      return;
    }

    if (!correctAnswer) {
      alert("Pilih jawaban yang benar.");
      return;
    }

    const customQuestion = {
      question: question.trim(),
      answers: answers.map((answer) => answer.trim()),
      correctAnswer: correctAnswer,
    };

    console.log("Soal custom:", customQuestion);

    alert("Soal berhasil dibuat!");

    setQuestion("");
    setAnswers(["", "", "", ""]);
    setCorrectAnswer("");
  };

  return (
    <div
      className="quiz-container"
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "25px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Buat Soal Custom</h2>

      <form onSubmit={handleSubmit}>
        {/* Pertanyaan */}
        <label>
          <strong>Pertanyaan:</strong>
        </label>

        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Masukkan pertanyaan..."
          rows="4"
          style={{
            width: "100%",
            marginTop: "8px",
            marginBottom: "20px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        {/* Pilihan jawaban */}
        <strong>Pilihan Jawaban:</strong>

        {answers.map((answer, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "12px",
            }}
          >
            <input
              type="radio"
              name="correctAnswer"
              value={answer}
              checked={correctAnswer === answer && answer !== ""}
              onChange={() => setCorrectAnswer(answer)}
            />

            <input
              type="text"
              value={answer}
              onChange={(event) =>
                handleAnswerChange(index, event.target.value)
              }
              placeholder={`Pilihan ${index + 1}`}
              style={{
                flex: 1,
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        ))}

        <p style={{ fontSize: "14px", color: "#666" }}>
          Pilih radio button di sebelah pilihan yang merupakan jawaban benar.
        </p>

        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            fontSize: "16px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Buat Soal
        </button>
      </form>
    </div>
  );
}

