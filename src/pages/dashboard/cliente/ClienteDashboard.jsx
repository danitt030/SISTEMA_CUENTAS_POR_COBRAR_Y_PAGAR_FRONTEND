import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import "./clienteDashboard.css";

export const ClienteDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Bienvenido, {user?.nombre}</h1>
          <p>Portal de Cliente</p>
        </div>

        <div className="modules-section">
          <div className="modules-grid">
            <button
              onClick={() => navigate("/cliente-portal")}
              className="module-card module-card-primary"
              style={{ 
                borderLeftColor: "#667eea",
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px"
              }}
            >
              <span className="module-icon" style={{ fontSize: "64px" }}>🏠</span>
              <span className="module-label" style={{ fontSize: "20px", fontWeight: "600" }}>Mi Portal de Cliente</span>
              <span style={{ fontSize: "12px", color: "#999" }}>Ver facturas, pagos y saldo</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
