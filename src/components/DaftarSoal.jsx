import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DaftarSoal() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedQuestions = localStorage.getItem("custom_questions");

      if (!savedQuestions) {
        setQuestions([]);
        return;
      }

      const parsedQuestions = JSON.parse(savedQuestions);

      setQuestions(Array.isArray(parsedQuestions) ? parsedQuestions : []);
    } catch (error) {
      console.error("Gagal membaca soal:", error);
      setQuestions([]);
    }
  }, []);

  const handleDelete = (indexToDelete) => {
    if (!window.confirm("Yakin ingin menghapus soal ini?")) {
      return;
    }

    try {
      const saved = localStorage.getItem("custom_questions");
      const storedQuestions = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(storedQuestions)) {
        throw new Error("Data soal tidak valid.");
      }

      const updatedQuestions = storedQuestions.filter(
        (_, index) => index !== indexToDelete,
      );

      localStorage.setItem(
        "custom_questions",
        JSON.stringify(updatedQuestions),
      );

      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Gagal menghapus soal:", error);
      alert("Soal gagal dihapus. Silakan coba lagi.");
    }
  };

  const handleEdit = (index, item) => {
    navigate("/buat-soal", {
      state: {
        mode: "edit",
        index,
        question: item,
      },
    });
  };

  return (
    <div className="custom-list-page">
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 42 }}>🦖</div>

          <h1>Soal Custom</h1>

          <p style={{ color: "#718096" }}>Koleksi pertanyaan buatanmu</p>
        </header>

        {questions.length === 0 ? (
          <div
            style={{
              padding: 28,
              textAlign: "center",
              background: "#fffaf0",
              border: "2px solid #d7d8c8",
              borderRadius: 12,
            }}
          >
            <p>Belum ada soal custom.</p>

            <button
              type="button"
              className="primary-button"
              onClick={() => navigate("/buat-soal")}
            >
              Buat Soal Pertama
            </button>
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
              : typeof item.correctAnswer === "number"
                ? item.correctAnswer
                : answers.indexOf(item.correctAnswer);

            return (
              <article
                key={index}
                style={{
                  padding: 20,
                  marginBottom: 18,
                  background: "#fffaf0",
                  border: "2px solid #d7d8c8",
                  borderRadius: 12,
                  boxShadow: "0 4px 0 rgba(38,57,75,0.10)",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#4d8b70",
                    marginBottom: 8,
                  }}
                >
                  PERTANYAAN {index + 1}
                </div>

                <h2 style={{ marginTop: 0, fontSize: 20 }}>{item.question}</h2>

                <div style={{ display: "grid", gap: 8 }}>
                  {answers.map((answer, answerIndex) => {
                    const isCorrect = hasCorrectIndex
                      ? answerIndex === item.correctAnswerIndex
                      : answerIndex === legacyCorrectIndex;

                    return (
                      <div
                        key={answerIndex}
                        style={{
                          padding: "11px 13px",
                          borderRadius: 8,
                          border: `1px solid ${
                            isCorrect ? "#a9cba0" : "#d7d8c8"
                          }`,
                          background: isCorrect ? "#e4f1df" : "#fffdf7",
                          color: "#26394b",
                        }}
                      >
                        <strong>
                          {String.fromCharCode(65 + answerIndex)}.
                        </strong>{" "}
                        {answer}
                        {isCorrect && (
                          <span
                            style={{
                              display: "block",
                              marginTop: 4,
                              color: "#356b54",
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            ✓ Jawaban benar
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 16,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleEdit(index, item)}
                    style={{
                      flex: 1,
                      background: "#e4f1df",
                      color: "#356b54",
                      border: "1px solid #a9cba0",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    style={{
                      flex: 1,
                      background: "#f8e8e4",
                      color: "#a0443e",
                      border: "1px solid #e8c5bd",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </article>
            );
          })
        )}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="primary-button"
          style={{
            width: "100%",
            marginTop: 8,
          }}
        >
          Kembali ke Kuis
        </button>
      </div>
    </div>
  );
}
