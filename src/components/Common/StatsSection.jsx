import React from "react";

export const StatsSection = ({ stats, loading }) => {
  return (
    <div className="mb-8 stats-section-root">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 stats-section-title">
        Estadisticas rapidas {loading && <span className="text-sm text-gray-500">(cargando...)</span>}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 stats-section-card"
            style={{ borderLeftColor: stat.color }}
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
