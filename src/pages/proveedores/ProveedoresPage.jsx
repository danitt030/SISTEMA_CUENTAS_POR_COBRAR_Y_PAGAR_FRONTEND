import { useNavigate } from "react-router-dom";
import { Proveedores } from "../../components/Proveedores/Proveedores";
import { Header } from "../../components/Layout/Header";

export const ProveedoresPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="page-container">
        <Proveedores onBack={() => navigate(-1)} />
      </div>
    </>
  );
};
