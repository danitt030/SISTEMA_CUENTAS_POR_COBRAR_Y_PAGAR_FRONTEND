import { useNavigate } from "react-router-dom";
import { MiPerfil } from "../../components/MiPerfil/MiPerfil";
import { Header } from "../../components/Layout/Header";
import "./miPerfilPage.css";

export const MiPerfilPage = () => {
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
        <MiPerfil />
      </div>
    </>
  );
};
