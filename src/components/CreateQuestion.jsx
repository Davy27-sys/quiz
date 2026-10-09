import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateQuestion() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);

    setErrors((prev) => ({
      ...prev,
      answers: "",
    }));

    setSuccess("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({});
    setSuccess("");

    const newErrors = {};

    if (!question.trim()) {
      newErrors.question = "Pertanyaan harus diisi.";
    }

    if (answers.some((answer) => !answer.trim())) {
      newErrors.answers = "Semua pilihan jawaban harus diisi.";
    }

    if (correctAnswer === null) {
      newErrors.correctAnswer = "Pilih jawaban yang benar.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const customQuestion = {
      question: question.trim(),
      answers: answers.map((answer) => answer.trim()),
      correctAnswerIndex: correctAnswer,
    };

    try {
      const savedData = localStorage.getItem("custom_questions");
      const parsedData = savedData ? JSON.parse(savedData) : [];

      const savedQuestions = Array.isArray(parsedData) ? parsedData : [];

      const updatedQuestions = [...savedQuestions, customQuestion];

      localStorage.setItem(
        "custom_questions",
        JSON.stringify(updatedQuestions),
      );

      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswer(null);
      setSuccess("Soal berhasil dibuat dan disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan soal:", error);
      setErrors({
        submit: "Soal gagal disimpan. Silakan coba lagi.",
      });
    }
  };

  const handleBackToQuiz = () => {
    navigate("/");
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

      {success && (
        <p
          style={{
            color: "#059669",
            backgroundColor: "#d1fae5",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          <strong>Pertanyaan:</strong>
        </label>

        <textarea
          value={question}
          onChange={(event) => {
            setQuestion(event.target.value);
            setErrors((prev) => ({
              ...prev,
              question: "",
            }));
            setSuccess("");
          }}
          placeholder="Masukkan pertanyaan..."
          rows="4"
          style={{
            width: "100%",
            marginTop: "8px",
            marginBottom: "5px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        {errors.question && (
          <p style={{ color: "#dc2626", marginTop: "5px" }}>
            {errors.question}
          </p>
        )}

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
              value={index}
              checked={correctAnswer === index}
              onChange={() => {
                setCorrectAnswer(index);

                setErrors((prev) => ({
                  ...prev,
                  correctAnswer: "",
                  submit: "",
                }));

                setSuccess("");
              }}
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

        {errors.answers && (
          <p style={{ color: "#dc2626", marginTop: "5px" }}>{errors.answers}</p>
        )}

        {errors.correctAnswer && (
          <p style={{ color: "#dc2626", marginTop: "5px" }}>
            {errors.correctAnswer}
          </p>
        )}

        {errors.submit && (
          <p style={{ color: "#dc2626", marginTop: "5px" }}>{errors.submit}</p>
        )}

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

        <button
          type="button"
          onClick={handleBackToQuiz}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "12px",
            fontSize: "16px",
            backgroundColor: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Kembali ke Kuis
        </button>
      </form>
    </div>
  );
}
