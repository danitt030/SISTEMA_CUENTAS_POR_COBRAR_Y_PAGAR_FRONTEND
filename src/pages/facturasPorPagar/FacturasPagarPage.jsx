import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import { FacturasPorPagar } from "../../components/FacturasPorPagar/FacturasPorPagar";

export const FacturasPagarPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="page-container">
        <FacturasPorPagar onBack={() => navigate(-1)} />
      </div>
    </>
  );
};
