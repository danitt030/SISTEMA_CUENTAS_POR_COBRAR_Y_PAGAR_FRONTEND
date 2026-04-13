import { useNavigate } from "react-router-dom";
import { Clientes } from "../../components/Clientes/Clientes";
import { Header } from "../../components/Layout/Header";
import "./clientesPage.css";

export const ClientesPage = () => {
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
        <Clientes />
      </div>
    </>
  );
};
