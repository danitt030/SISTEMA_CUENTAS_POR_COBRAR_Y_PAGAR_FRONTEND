import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import { FacturasPorCobrar } from "../../components/FacturasPorCobrar/FacturasPorCobrar";
import "./facturasCobrarPage.css";

export const FacturasCobrarPage = () => {
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
        <FacturasPorCobrar />
      </div>
    </>
  );
};
