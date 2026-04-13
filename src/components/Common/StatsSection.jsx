import React from "react";
import "./statsSection.css";

export const StatsSection = ({ stats, loading }) => {
  return (
    <div className="stats-section">
      <h3>Estadísticas Rápidas {loading && <span className="loading-text">(cargando...)</span>}</h3>
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
