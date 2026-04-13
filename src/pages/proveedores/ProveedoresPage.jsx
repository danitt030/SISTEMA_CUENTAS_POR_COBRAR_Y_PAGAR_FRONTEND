import { useNavigate } from "react-router-dom";
import { Proveedores } from "../../components/Proveedores/Proveedores";
import { Header } from "../../components/Layout/Header";
import "./proveedoresPage.css";

export const ProveedoresPage = () => {
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
        <Proveedores />
      </div>
    </>
  );
};
