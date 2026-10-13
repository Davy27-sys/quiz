import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CreateQuestion() {
  const navigate = useNavigate();
  const location = useLocation();
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const editMode = location.state?.mode === "edit";
  const editIndex = location.state?.index;
  const editQuestion = location.state?.question;

  useEffect(() => {
    if (editMode && editQuestion) {
      setQuestion(editQuestion.question || "");

      setAnswers(
        Array.isArray(editQuestion.answers) && editQuestion.answers.length === 4
          ? [...editQuestion.answers]
          : ["", "", "", ""],
      );

      let correctIndex = editQuestion.correctAnswerIndex;

      if (correctIndex === undefined) {
        correctIndex =
          typeof editQuestion.correctAnswer === "number"
            ? editQuestion.correctAnswer
            : editQuestion.answers?.indexOf(editQuestion.correctAnswer);
      }

      setCorrectAnswer(
        Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < 4
          ? correctIndex
          : null,
      );
    } else {
      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswer(null);
    }

    setErrors({});
    setSuccess("");
  }, [location.key, editMode, editQuestion]);

  const handleAnswerChange = (index, value) => {
    setAnswers((previous) =>
      previous.map((answer, i) => (i === index ? value : answer)),
    );

    setErrors((previous) => ({
      ...previous,
      answers: "",
      submit: "",
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

    if (
      !Number.isInteger(correctAnswer) ||
      correctAnswer < 0 ||
      correctAnswer > 3
    ) {
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

      if (!Array.isArray(parsedData)) {
        throw new Error("Data soal tidak valid.");
      }

      let updatedQuestions;

      if (editMode) {
        if (
          !Number.isInteger(editIndex) ||
          editIndex < 0 ||
          editIndex >= parsedData.length
        ) {
          setErrors({
            submit: "Soal yang ingin diedit tidak ditemukan.",
          });
          return;
        }

        updatedQuestions = [...parsedData];
        updatedQuestions[editIndex] = customQuestion;
      } else {
        updatedQuestions = [...parsedData, customQuestion];
      }

      localStorage.setItem(
        "custom_questions",
        JSON.stringify(updatedQuestions),
      );

      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswer(null);
      setErrors({});

      setSuccess(
        editMode
          ? "Soal berhasil diperbarui!"
          : "Soal berhasil dibuat dan disimpan!",
      );
    } catch (error) {
      console.error("Gagal menyimpan soal:", error);

      setErrors({
        submit: "Soal gagal disimpan. Silakan coba lagi.",
      });
    }
  };

  return (
    <div
      className="quiz-container"
      style={{
        maxWidth: 600,
        margin: "32px auto",
        padding: 24,
        width: "calc(100% - 24px)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 38 }}>🦕</div>

        <h2>{editMode ? "Edit Soal" : "Buat Soal Custom"}</h2>

        <p style={{ color: "#718096" }}>
          Tambahkan pertanyaan ke koleksi kuismu.
        </p>
      </div>

      {success && (
        <p
          style={{
            color: "#356b54",
            background: "#e4f1df",
            padding: 12,
            borderRadius: 8,
          }}
        >
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="custom-question">Pertanyaan</label>

        <textarea
          id="custom-question"
          value={question}
          onChange={(event) => {
            setQuestion(event.target.value);

            setErrors((previous) => ({
              ...previous,
              question: "",
              submit: "",
            }));

            setSuccess("");
          }}
          placeholder="Masukkan pertanyaan..."
          rows={4}
        />

        {errors.question && (
          <p style={{ color: "#c85c54" }}>{errors.question}</p>
        )}

        <strong>Pilihan jawaban</strong>

        {answers.map((answer, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <input
              type="radio"
              name="correctAnswer"
              aria-label={`Tandai pilihan ${index + 1} sebagai jawaban benar`}
              checked={correctAnswer === index}
              onChange={() => {
                setCorrectAnswer(index);

                setErrors((previous) => ({
                  ...previous,
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
            />
          </div>
        ))}

        {errors.answers && <p style={{ color: "#c85c54" }}>{errors.answers}</p>}

        {errors.correctAnswer && (
          <p style={{ color: "#c85c54" }}>{errors.correctAnswer}</p>
        )}

        {errors.submit && <p style={{ color: "#c85c54" }}>{errors.submit}</p>}

        <p style={{ fontSize: 13, color: "#718096" }}>
          Pilih radio button di samping jawaban yang benar.
        </p>

        <button
          type="submit"
          className="primary-button"
          style={{ width: "100%" }}
        >
          {editMode ? "Simpan Perubahan" : "Simpan Soal"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="button-secondary"
          style={{ width: "100%" }}
        >
          Kembali ke Kuis
        </button>
      </form>
    </div>
  );
}
