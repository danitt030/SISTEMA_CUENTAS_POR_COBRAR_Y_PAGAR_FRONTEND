import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./header.css";

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
    <header className="header">
      <div className="header-left">
        <h2>CP y P</h2>
      </div>

      <div className="header-right">
        <div className="user-info">
          <span className="user-name">{user?.nombre} {user?.apellido}</span>
          <span className="user-rol">{user?.rol}</span>
        </div>
        <button className="perfil-btn" onClick={handleMiPerfil} title="Mi Perfil">
          👤 Perfil
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};
