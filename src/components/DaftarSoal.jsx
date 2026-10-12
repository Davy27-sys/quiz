import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DaftarSoal() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedQuestions = localStorage.getItem("custom_questions");

    if (!savedQuestions) {
      setQuestions([]);
      return;
    }

    try {
      const parsedQuestions = JSON.parse(savedQuestions);

      if (Array.isArray(parsedQuestions)) {
        setQuestions(parsedQuestions);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error("Gagal membaca custom_questions:", error);
      setQuestions([]);
    }
  }, []);

  const handleDelete = (indexToDelete) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus soal ini?");

    if (!confirmDelete) return;

    const updatedQuestions = questions.filter(
      (_, index) => index !== indexToDelete,
    );

    localStorage.setItem("custom_questions", JSON.stringify(updatedQuestions));

    setQuestions(updatedQuestions);
  };

  const handleEdit = (index, item) => {
    navigate("/buat-soal", {
      state: {
        mode: "edit",
        index: index,
        question: item,
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            marginBottom: "20px",
            color: "#ffffff",
          }}
        >
          Daftar Soal Custom
        </h1>

        {questions.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              color: "#111827",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <p>Belum ada soal custom.</p>
          </div>
        ) : (
          questions.map((item, index) => {
            const answers = Array.isArray(item.answers) ? item.answers : [];

            const hasCorrectIndex =
              Number.isInteger(item.correctAnswerIndex) &&
              item.correctAnswerIndex >= 0 &&
              item.correctAnswerIndex < answers.length;

            const legacyCorrectIndex = hasCorrectIndex
              ? -1
              : answers.findIndex((answer) => answer === item.correctAnswer);

            return (
              <div
                key={index}
                style={{
                  background: "rgba(15, 23, 42, 0.85)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "18px",
                }}
              >
                <h2
                  style={{
                    fontSize: "24px",
                    marginTop: "0",
                    marginBottom: "16px",
                    color: "#ffffff",
                  }}
                >
                  {index + 1}. {item.question}
                </h2>

                <div>
                  {answers.map((answer, answerIndex) => {
                    const isCorrect = hasCorrectIndex
                      ? answerIndex === item.correctAnswerIndex
                      : answerIndex === legacyCorrectIndex;

                    return (
                      <div
                        key={answerIndex}
                        style={{
                          padding: "10px 14px",
                          marginBottom: "7px",
                          borderRadius: "8px",
                          backgroundColor: isCorrect ? "#d1fae5" : "#f3f4f6",
                          color: isCorrect ? "#065f46" : "#111827",
                          fontSize: "16px",
                          fontWeight: isCorrect ? "600" : "400",
                        }}
                      >
                        <strong>
                          {String.fromCharCode(65 + answerIndex)}.
                        </strong>{" "}
                        {answer}
                        {isCorrect && (
                          <span style={{ marginLeft: "10px" }}>
                            ✅ Jawaban benar
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Tombol Edit */}
                <button
                  type="button"
                  onClick={() => handleEdit(index, item)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 16px",
                    marginTop: "15px",
                    fontSize: "15px",
                    fontWeight: "600",
                    backgroundColor: "#f59e0b",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  ✏️ Edit Soal
                </button>

                {/* Tombol Hapus */}
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 16px",
                    marginTop: "10px",
                    fontSize: "15px",
                    fontWeight: "600",
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  🗑️ Hapus Soal
                </button>
              </div>
            );
          })
        )}

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            display: "block",
            width: "100%",
            padding: "12px 20px",
            marginTop: "25px",
            marginBottom: "20px",
            fontSize: "16px",
            fontWeight: "600",
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🏠 Kembali ke Kuis
        </button>
      </div>
    </div>
  );
}
