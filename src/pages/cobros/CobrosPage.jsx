import { Header } from "../../components/Layout/Header";
import { Cobros } from "../../components/Cobros/Cobros";
import "./cobrosPage.css";

export const CobrosPage = () => {
  return (
    <>
      <Header />
      <div className="page-container">
        <Cobros />
      </div>
    </>
  );
};
