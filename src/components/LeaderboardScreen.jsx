import React from "react";

function Leaderboard({ scores }) {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="leaderboard-container">
      <h2>Papan Peringkat Kuis</h2>
      {sortedScores.length === 0 ? (
        <p>Belum ada skor yang tercatat.</p>
      ) : (
        <ol>
          {sortedScores.map((player, index) => (
            <li key={index} className="leaderboard-item">
              <span className="player-name">{player.name}</span>
              <span className="player-score">{player.score} poin</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Leaderboard;
