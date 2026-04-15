import { useNavigate } from "react-router-dom";
import { Usuarios } from "../../components/Usuarios/Usuarios";
import { Header } from "../../components/Layout/Header";

export const UsuariosPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Usuarios onBack={() => navigate(-1)} />
    </>
  );
};
