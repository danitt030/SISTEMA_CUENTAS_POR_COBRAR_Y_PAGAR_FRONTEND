import { useNavigate } from "react-router-dom";
import { Usuarios } from "../../components/Usuarios/Usuarios";
import { Header } from "../../components/Layout/Header";
import "./usuariosPage.css";

export const UsuariosPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="back-button-container">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-secondary back-btn"
          >
            ← Volver
          </button>
        </div>
        <Usuarios />
      </div>
    </>
  );
};
