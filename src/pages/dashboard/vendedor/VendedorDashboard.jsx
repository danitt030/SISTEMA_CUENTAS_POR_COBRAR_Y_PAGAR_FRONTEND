import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { getModulesByRole } from "../../../utils/roleUtils";
import "./vendedorDashboard.css";

export const VendedorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const modules = getModulesByRole(user?.rol);

  const stats = [
    { label: "Mis Clientes", value: "0", color: "#198754" },
    { label: "Mis Facturas", value: "0", color: "#dc3545" },
    { label: "Cobros Este Mes", value: "Q0.00", color: "#28a745" },
    { label: "Comisión", value: "Q0.00", color: "#6f42c1" },
  ];

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard Vendedor</h1>
          <p>Bienvenido, {user?.nombre} {user?.apellido}</p>
        </div>

        <div className="stats-section">
          <h3>Mi Desempeño</h3>
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
