import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { getDashboardByRole } from "../../utils/roleUtils";
import { LoginForm } from "./LoginForm";
import toast from "react-hot-toast";

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await loginUser(data);

      if (response.success) {
        toast.success(response.message);
        const dashboardUrl = getDashboardByRole(response.data?.rol);
        setTimeout(() => {
          navigate(dashboardUrl);
        }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Error inesperado al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#08142b] via-[#0b1e43] to-[#13326a] flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative bg-slate-800 rounded-full p-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Gestión Financiera
          </h1>
          <p className="text-slate-400 text-sm">Cuentas por Cobrar y Pagar</p>
        </div>

        {/* Card Principal - Con bordes y sombra mejorada */}
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          {/* Card */}
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden hover:border-slate-600 transition-all duration-300">
            {/* Top gradient accent */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>
            
            <div className="p-8 sm:p-10 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-1">Iniciar Sesión</h2>
                <p className="text-slate-400 text-sm">Accede a tu cuenta</p>
              </div>

              <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* Bottom accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">
          © 2026 Sistema de Gestión Financiera • Acceso Seguro
        </p>
      </div>
    </section>
  );
};
