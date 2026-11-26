import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultScreen({ containerStyle, buttonStyle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const quizData = location.state;

  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [questionChanged, setQuestionChanged] = useState(false);

  useEffect(() => {
    if (!quizData) {
      navigate("/", { replace: true });
    }
  }, [quizData, navigate]);

  if (!quizData) return null;

  const { score, total, kategori_id, jawaban } = quizData;

  const handleSave = async (event) => {
    event.preventDefault();

    if (saving || saved) return;

    const namaPemain = playerName.trim() || "Pemain Anonim";

    if (!kategori_id) {
      setErrorMessage("Kategori kuis tidak ditemukan. Silakan ulangi kuis.");
      return;
    }
    if (!Array.isArray(jawaban)) {
      setErrorMessage("Data jawaban tidak valid.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      // Simpan riwayat ke backend terlebih dahulu.
      const response = await fetch("http://localhost:3001/riwayat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_pemain: namaPemain,
          kategori_id,
          jawaban,
          total,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.pesan ||
            result.message ||
            "Gagal menyimpan riwayat ke backend.",
        );
      }

      // Backend berhasil, lanjut simpan leaderboard lokal.
      const newEntry = {
        name: namaPemain,
        score,
        total,
        date: new Date().toLocaleDateString("id-ID"),
      };

      const savedData = localStorage.getItem("quizHistory");
      const history = savedData ? JSON.parse(savedData) : [];

      if (!Array.isArray(history)) {
        throw new Error("Data leaderboard lokal tidak valid.");
      }

      localStorage.setItem(
        "quizHistory",
        JSON.stringify([...history, newEntry]),
      );

      setSaved(true);
      navigate("/leaderboard");
    } catch (error) {
      console.error("Gagal menyimpan skor:", error);

      if (error instanceof TypeError) {
        setErrorMessage(
          "Tidak dapat terhubung ke server. Periksa koneksi server, lalu coba simpan kembali.",
        );
      } else if (
        error.message ===
        "Jumlah soal tidak sesuai dengan soal aktif pada kategori"
      ) {
        setQuestionChanged(true);
        setErrorMessage(
          "Data soal berubah saat kuis berlangsung. Skor tetap ditampilkan, tetapi tidak dapat disimpan. Silakan tekan Main Lagi untuk memulai sesi baru.",
        );
      } else {
        setErrorMessage(
          error.message || "Skor gagal disimpan. Silakan coba kembali.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="result-page">
      <div
        className="quiz-container"
        style={{
          ...containerStyle,
          width: "100%",
          maxWidth: 500,
          textAlign: "center",
          padding: 28,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>🦖</div>

        <p style={{ color: "#4d8b70", fontWeight: 800 }}>PETUALANGAN SELESAI</p>

        <h2 style={{ margin: "8px 0" }}>Kuis Selesai!</h2>

        <p style={{ color: "#718096" }}>Ini hasil petualanganmu hari ini.</p>

        <div
          style={{
            background: "#e4f1df",
            border: "2px solid #cbdcc5",
            borderRadius: 10,
            padding: "20px 12px",
            margin: "22px 0",
          }}
        >
          <p style={{ margin: 0 }}>Skor kamu</p>

          <h1
            style={{
              fontSize: 46,
              margin: "8px 0",
              color: "#356b54",
            }}
          >
            {score} / {total}
          </h1>
        </div>

        {!saved && (
          <form onSubmit={handleSave}>
            <label style={{ textAlign: "left" }}>Nama pemain</label>

            <input
              type="text"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Masukkan nama kamu"
              maxLength={30}
            />

            {errorMessage && (
              <p
                role="alert"
                style={{
                  color: "#b91c1c",
                  fontSize: 14,
                  margin: "12px 0",
                }}
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="primary-button"
              style={{ width: "100%" }}
              disabled={saving || questionChanged}
            >
              {saving
                ? "Menyimpan..."
                : questionChanged
                  ? "Sesi Tidak Berlaku"
                  : "Simpan Skor"}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="primary-button"
          style={{
            ...buttonStyle,
            width: "100%",
            marginTop: 16,
          }}
        >
          Main Lagi
        </button>
      </div>
    </div>
  );
}
