import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { useDashboardStats } from "../../../shared/hooks/useDashboardStats";
import { getModulesByRole } from "../../../utils/roleUtils";
import toast from "react-hot-toast";

export const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const modules = getModulesByRole(user?.rol);
  const { stats, loading } = useDashboardStats();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/auth");
  };

  const handleMiPerfil = () => {
    navigate(`/mi-perfil/${user?.uid}`);
  };

  const statsMapped = [
    { label: "Usuarios", value: stats.usuarios.toString(), color: "from-blue-500 to-blue-600", short: "US" },
    { label: "Clientes", value: stats.clientes.toString(), color: "from-green-500 to-green-600", short: "CL" },
    { label: "Proveedores", value: stats.proveedores.toString(), color: "from-orange-500 to-orange-600", short: "PR" },
    { label: "Facturas", value: stats.facturas.toString(), color: "from-red-500 to-red-600", short: "FA" },
    { label: "Cobros", value: stats.cobros.toString(), color: "from-emerald-500 to-emerald-600", short: "CO" },
    { label: "Pagos", value: stats.pagos.toString(), color: "from-cyan-500 to-cyan-600", short: "PA" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#08142b] via-[#0b1e43] to-[#13326a] p-4 md:p-8 relative dashboard-shell">
      {/* Welcome Section */}
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          Bienvenido, <span className="text-blue-200">{user?.nombre} {user?.apellido}</span>
        </h1>
        <p className="text-slate-300">Sistema de Gestion de Cuentas por Cobrar y Pagar</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))
        ) : (
          statsMapped.map((stat, i) => (
            <div
              key={i}
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 animate-slideUp"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className="rounded-lg bg-slate-100 px-3 py-2 text-base font-black tracking-wide text-slate-700">{stat.short}</div>
              </div>

              {/* Bottom Accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl`}></div>
            </div>
          ))
        )}
      </div>

      {/* Modules Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">
          Modulos Disponibles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map((mod, i) => (
            <button
              key={mod.path}
              onClick={() => navigate(mod.path)}
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden animate-slideUp"
              style={{ animationDelay: `${(6 + i) * 50}ms` }}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/10 group-hover:to-primary-600/10 transition-all duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <h3 className="text-gray-900 dark:text-white font-semibold text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{mod.label}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Acceder</p>
              </div>

              {/* Border Animation */}
              <div className="absolute inset-0 rounded-xl border-2 border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-indigo-500/30">
          <h3 className="text-sm font-medium opacity-90 mb-2">Total de Registros</h3>
          <p className="text-3xl font-bold">{(stats.usuarios + stats.clientes + stats.proveedores + stats.facturas + stats.cobros + stats.pagos).toString()}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
          <h3 className="text-sm font-medium opacity-90 mb-2">Transacciones</h3>
          <p className="text-3xl font-bold">{(stats.cobros + stats.pagos).toString()}</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
          <h3 className="text-sm font-medium opacity-90 mb-2">Documentos</h3>
          <p className="text-3xl font-bold">{stats.facturas.toString()}</p>
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
