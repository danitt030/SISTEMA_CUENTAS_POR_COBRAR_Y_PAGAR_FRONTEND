import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { getModulesByRole } from "../../../utils/roleUtils";
import "./clienteDashboard.css";

export const ClienteDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const modules = getModulesByRole(user?.rol);

  const stats = [
    { label: "Facturas Pendientes", value: "0", color: "#dc3545" },
    { label: "Facturas Pagadas", value: "0", color: "#28a745" },
    { label: "Saldo por Pagar", value: "Q0.00", color: "#ffc107" },
    { label: "Última Actividad", value: "Hoy", color: "#0d6efd" },
  ];

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Mi Portal - Cliente</h1>
          <p>Bienvenido, {user?.nombre} {user?.apellido}</p>
        </div>

        <div className="stats-section">
          <h3>Mi Resumen</h3>
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
          <h3>Mis Opciones</h3>
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
