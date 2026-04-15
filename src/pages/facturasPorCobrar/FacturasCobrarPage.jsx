import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import { FacturasPorCobrar } from "../../components/FacturasPorCobrar/FacturasPorCobrar";

export const FacturasCobrarPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="page-container">
        <FacturasPorCobrar onBack={() => navigate(-1)} />
      </div>
    </>
  );
};
