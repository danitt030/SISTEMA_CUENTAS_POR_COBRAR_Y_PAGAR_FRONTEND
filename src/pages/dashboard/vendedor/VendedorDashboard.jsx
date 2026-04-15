import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { StatsSection } from "../../../components/Common/StatsSection";
import { useDashboardStats } from "../../../shared/hooks/useDashboardStats";
import { getModulesByRole } from "../../../utils/roleUtils";

export const VendedorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const modules = getModulesByRole(user?.rol);
  const { stats, loading } = useDashboardStats();

  const statsMapped = [
    { label: "Clientes", value: stats.clientes.toString(), color: "#198754" },
    { label: "Facturas", value: stats.facturas.toString(), color: "#dc3545" },
    { label: "Cobros", value: stats.cobros.toString(), color: "#28a745" },
    { label: "Pagos", value: stats.pagos.toString(), color: "#6f42c1" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#08142b] via-[#0b1e43] to-[#13326a] p-4 md:p-8 relative dashboard-shell">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Dashboard Vendedor</h1>
          <p className="text-slate-300">Bienvenido, {user?.nombre} {user?.apellido}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Mi Desempeno</h3>
          <StatsSection stats={statsMapped} loading={loading} />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">
            Modulos Disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {modules.map((mod) => (
              <button
                key={mod.path}
                onClick={() => navigate(mod.path)}
                className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-left border-l-4 hover:scale-105 active:scale-95"
                style={{ borderLeftColor: mod.color }}
              >
                <span className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{mod.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </>
  );
};
