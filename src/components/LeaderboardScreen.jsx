import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LeaderboardScreen({ containerStyle, buttonStyle }) {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadHistory = async () => {
      try {
        const response = await fetch("http://localhost:3001/leaderboard", {
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.pesan || "Gagal mengambil data leaderboard.");
        }

        if (!Array.isArray(result.data)) {
          throw new Error("Format data leaderboard tidak valid.");
        }

        setHistory(result.data);
        setErrorMessage("");
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Gagal memuat leaderboard:", error);
        setErrorMessage(
          "Leaderboard tidak dapat dimuat. Pastikan backend berjalan.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      controller.abort();
    };
  }, [retryCount]);

  const categories = [
    ...new Set(history.map((item) => item.kategori || "Tanpa Kategori")),
  ];

  const sortedHistory = [...history].sort(
    (a, b) => Number(b.nilai) - Number(a.nilai),
  );

  return (
    <div
      className="quiz-container"
      style={{
        ...containerStyle,
        background: "#fffaf0",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 40 }}>🏆</div>
        <h2>Leaderboard</h2>
        <p style={{ color: "#718096" }}>
          Para penjelajah dengan skor tertinggi
        </p>
      </div>

      {loading ? (
        <div style={{ padding: 24, textAlign: "center" }}>
          Memuat leaderboard...
        </div>
      ) : errorMessage ? (
        <div
          style={{
            padding: 24,
            background: "#fee2e2",
            borderRadius: 8,
            textAlign: "center",
            color: "#991b1b",
          }}
        >
          <p>{errorMessage}</p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setRetryCount((count) => count + 1);
            }}
          >
            Coba Lagi
          </button>
        </div>
      ) : history.length === 0 ? (
        <div
          style={{
            padding: 24,
            background: "#edf3e6",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          Belum ada riwayat permainan. Yuk, mulai bermain!
        </div>
      ) : (
        categories.map((category) => {
          const categoryHistory = sortedHistory.filter(
            (item) => (item.kategori || "Tanpa Kategori") === category,
          );

          return (
            <div key={category} style={{ marginBottom: 24 }}>
              <h3>{category}</h3>

              <ol style={{ paddingLeft: 26 }}>
                {categoryHistory.map((item) => (
                  <li key={item.id} style={{ marginBottom: 16 }}>
                    <strong>{item.nama_pemain || "Pemain Anonim"}</strong>

                    <div style={{ marginTop: 6 }}>Skor: {item.nilai}</div>

                    <small style={{ color: "#718096" }}>{item.tanggal}</small>
                  </li>
                ))}
              </ol>
            </div>
          );
        })
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
        Kembali ke Kuis
      </button>
    </div>
  );
}
