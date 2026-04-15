import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { StatsSection } from "../../../components/Common/StatsSection";
import { useDashboardStats } from "../../../shared/hooks/useDashboardStats";

export const ClienteDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { stats, loading } = useDashboardStats();

  const statsMapped = [
    { label: "Facturas", value: stats.facturas.toString(), color: "#0d6efd" },
    { label: "Cobros", value: stats.cobros.toString(), color: "#198754" },
    { label: "Pagos", value: stats.pagos.toString(), color: "#6f42c1" },
    { label: "Movimientos", value: (stats.facturas + stats.cobros + stats.pagos).toString(), color: "#f59e0b" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#08142b] via-[#0b1e43] to-[#13326a] p-4 md:p-8 relative dashboard-shell">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Bienvenido, <span className="text-blue-200">{user?.nombre}</span></h1>
          <p className="text-slate-300">Portal de Cliente</p>
        </div>

        <div className="mb-8">
          <StatsSection stats={statsMapped} loading={loading} />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">
            Acceso Rapido
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/cliente-portal")}
              className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg border border-blue-400/50 overflow-hidden"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <h3 className="text-white font-semibold text-lg">Mi Portal de Cliente</h3>
                <p className="text-blue-100 text-sm mt-2">Ver facturas, pagos y saldo</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
