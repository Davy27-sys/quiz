import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdventureMap.css";

const islands = [
  {
    id: 1,
    name: "Hutan Dino",
    subtitle: "Awal Petualangan",
    dinosaur: "🦕",
    symbol: "🌿",
  },
  {
    id: 2,
    name: "Lembah Fosil",
    subtitle: "Jejak Masa Lalu",
    dinosaur: "🦴",
    symbol: "⛰️",
  },
  {
    id: 3,
    name: "Gunung T-Rex",
    subtitle: "Tantangan Dino",
    dinosaur: "🦖",
    symbol: "🌋",
  },
  {
    id: 4,
    name: "Danau Purba",
    subtitle: "Misteri Perairan",
    dinosaur: "🦕",
    symbol: "💧",
  },
  {
    id: 5,
    name: "Pulau Legenda",
    subtitle: "Petualangan Terakhir",
    dinosaur: "🏆",
    symbol: "⭐",
  },
];

export default function AdventureMap() {
  const navigate = useNavigate();

  function startAdventure(level) {
    navigate("/", {
      state: { adventureLevel: level },
    });
  }

  return (
    <main className="adventure-page">
      <div className="adventure-container">
        <button
          type="button"
          className="adventure-back"
          onClick={() => navigate("/")}
        >
          ← Kembali ke Kuis
        </button>

        <header className="adventure-header">
          <span className="adventure-eyebrow">DINO QUIZ EXPLORER</span>

          <h1>Peta Petualangan Dino</h1>

          <p>Jelajahi dunia purba dan mulai petualanganmu!</p>
        </header>

        <section className="adventure-stats">
          <div className="adventure-stat">
            <span className="adventure-stat-icon">🌎</span>
            <div>
              <strong>5 Wilayah</strong>
              <small>Dunia dinosaurus</small>
            </div>
          </div>

          <div className="adventure-stat">
            <span className="adventure-stat-icon">🧭</span>
            <div>
              <strong>5 Perhentian</strong>
              <small>Pilih tujuanmu</small>
            </div>
          </div>
        </section>

        <section className="adventure-map">
          <header className="adventure-map-header">
            <h2>Dunia Prasejarah</h2>
            <p>Pilih wilayah untuk memulai petualangan.</p>
          </header>

          <div className="adventure-islands">
            {islands.map((island, index) => (
              <React.Fragment key={island.id}>
                <button
                  type="button"
                  className="adventure-island"
                  onClick={() => startAdventure(island.id)}
                  aria-label={`Mulai petualangan ${island.name}`}
                >
                  <div className="adventure-island-content">
                    <div className="adventure-dinosaur">{island.dinosaur}</div>

                    <div className="adventure-island-info">
                      <span className="adventure-level">
                        LEVEL {String(island.id).padStart(2, "0")}
                      </span>

                      <h3>{island.name}</h3>

                      <p>{island.subtitle}</p>
                    </div>

                    <span className="adventure-island-symbol">
                      {island.symbol}
                    </span>
                  </div>

                  <span className="adventure-play">Mulai Petualangan →</span>
                </button>

                {index < islands.length - 1 && (
                  <div className="adventure-path" aria-hidden="true">
                    · · · · ·
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <footer className="adventure-map-footer">
            Setiap perjalanan dimulai dari satu langkah.
            <br />
            Siap menguji pengetahuan dinosaurusmu?
          </footer>
        </section>

        <button
          type="button"
          className="adventure-start"
          onClick={() => startAdventure(1)}
        >
          Mulai Kuis Dino →
        </button>
      </div>
    </main>
  );
}
