import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { getModulesByRole } from "../../../utils/roleUtils";
import "./auxiliarDashboard.css";

export const AuxiliarDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const modules = getModulesByRole(user?.rol);

  const stats = [
    { label: "Clientes Registrados", value: "0", color: "#198754" },
    { label: "Total Facturas", value: "0", color: "#dc3545" },
    { label: "Tareas Hoy", value: "0", color: "#ffc107" },
    { label: "Estado", value: "Activo", color: "#0d6efd" },
  ];

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard Auxiliar</h1>
          <p>Bienvenido, {user?.nombre} {user?.apellido}</p>
        </div>

        <div className="stats-section">
          <h3>Mi Información</h3>
          <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card" style={{ borderLeftColor: stat.color }}>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="modules-section">
          <h3>Módulos Disponibles</h3>
          <div className="modules-grid">
            {modules.map((mod) => (
              <button
                key={mod.path}
                onClick={() => navigate(mod.path)}
                className="module-card"
                style={{ borderLeftColor: mod.color }}
              >
                <span className="module-icon">{mod.icon}</span>
                <span className="module-label">{mod.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
