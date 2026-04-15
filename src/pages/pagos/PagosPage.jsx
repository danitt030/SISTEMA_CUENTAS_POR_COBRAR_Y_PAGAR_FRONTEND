import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import Pagos from "../../components/Pagos/Pagos";

export const PagosPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="page-container">
        <Pagos onBack={() => navigate(-1)} />
      </div>
    </>
  );
};
