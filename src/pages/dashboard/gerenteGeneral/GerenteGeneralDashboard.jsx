import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { StatsSection } from "../../../components/Common/StatsSection";
import { useDashboardStats } from "../../../shared/hooks/useDashboardStats";
import { getModulesByRole } from "../../../utils/roleUtils";
import "./gerenteGeneralDashboard.css";

export const GerenteGeneralDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const modules = getModulesByRole(user?.rol);
  const { stats, loading } = useDashboardStats();

  const statsMapped = [
    { label: "Clientes", value: stats.clientes.toString(), color: "#198754" },
    { label: "Facturas", value: stats.facturas.toString(), color: "#dc3545" },
    { label: "Cobros", value: stats.cobros.toString(), color: "#28a745" },
    { label: "Pagos", value: stats.pagos.toString(), color: "#17a2b8" },
  ];

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard Gerente General</h1>
          <p>Bienvenido, {user?.nombre} {user?.apellido}</p>
        </div>

        <StatsSection stats={statsMapped} loading={loading} />

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
