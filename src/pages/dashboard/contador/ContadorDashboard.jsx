import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { StatsSection } from "../../../components/Common/StatsSection";
import { useDashboardStats } from "../../../shared/hooks/useDashboardStats";
import { getModulesByRole } from "../../../utils/roleUtils";

export const ContadorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const modules = getModulesByRole(user?.rol);
  const { stats, loading } = useDashboardStats();

  const statsMapped = [
    { label: "Facturas", value: stats.facturas.toString(), color: "#dc3545" },
    { label: "Cobros", value: stats.cobros.toString(), color: "#28a745" },
    { label: "Pagos", value: stats.pagos.toString(), color: "#17a2b8" },
    { label: "Proveedores", value: stats.proveedores.toString(), color: "#0d6efd" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#08142b] via-[#0b1e43] to-[#13326a] p-4 md:p-8 relative dashboard-shell">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Dashboard Contador</h1>
          <p className="text-slate-300">Bienvenido, {user?.nombre} {user?.apellido}</p>
        </div>

        <div className="mb-8">
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
                className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden animate-slideUp"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/10 group-hover:to-primary-600/10 transition-all duration-300"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-gray-900 dark:text-white font-semibold text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{mod.label}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }
          .animate-slideUp {
            animation: slideUp 0.6s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    </>
  );
};
