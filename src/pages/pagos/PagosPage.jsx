import { Header } from "../../components/Layout/Header";
import Pagos from "../../components/Pagos/Pagos";
import "./pagosPage.css";

export const PagosPage = () => {
  return (
    <>
      <Header />
      <div className="page-container">
        <Pagos />
      </div>
    </>
  );
};
