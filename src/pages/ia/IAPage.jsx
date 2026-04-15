import { useNavigate } from "react-router-dom";
import { IA } from "../../components/IA/IA";
import { Header } from "../../components/Layout/Header";

export const IAPage = () => {
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
        <IA />
      </div>
    </>
  );
};
