import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/auth");
  };

  const handleMiPerfil = () => {
    navigate(`/mi-perfil/${user?.uid}`);
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <h2 className="text-2xl font-bold text-white">Sistema Cuentas por Cobrar y Pagar</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="font-semibold text-white text-lg">{user?.nombre} {user?.apellido}</span>
            <span className="text-sm text-white font-semibold uppercase tracking-wide">{user?.rol}</span>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 hover:scale-105 text-base" 
            onClick={handleMiPerfil} 
            title="Mi Perfil"
          >
            Perfil
          </button>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 hover:scale-105 text-base"
            onClick={handleLogout}
            title="Cerrar Sesión"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};
