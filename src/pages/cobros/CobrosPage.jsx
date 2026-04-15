import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import { Cobros } from "../../components/Cobros/Cobros";

export const CobrosPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="page-container">
        <Cobros onBack={() => navigate(-1)} />
      </div>
    </>
  );
};
