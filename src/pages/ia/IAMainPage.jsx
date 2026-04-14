import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import "./iaMainPage.css";

export const IAMainPage = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: "cliente",
      title: "Análisis de Clientes",
      description: "Analiza información de clientes, límites de crédito y riesgos",
      icon: "👥",
      path: "/ia/cliente",
      color: "#3498db",
    },
    {
      id: "facturas",
      title: "Análisis de Facturas por Cobrar",
      description: "Analiza facturas pendientes, vencimientos y cobrabilidad",
      icon: "📋",
      path: "/ia/facturas",
      color: "#e74c3c",
    },
    {
      id: "cobros",
      title: "Análisis de Cobros y Comisiones",
      description: "Analiza cobros realizados, comisiones y métodos de pago",
      icon: "💰",
      path: "/ia/cobros",
      color: "#27ae60",
    },
    {
      id: "reportes",
      title: "Análisis de Reportes",
      description: "Analiza reportes generales del sistema y tendencias",
      icon: "📊",
      path: "/ia/reportes",
      color: "#9b59b6",
    },
  ];

  return (
    <>
      <Header />
      <div className="ia-main-container">
        <div className="ia-main-header">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Volver
          </button>
          <h1>🤖 Asistente de Inteligencia Artificial</h1>
          <p className="subtitle">Selecciona un módulo para obtener análisis inteligente</p>
        </div>

        <div className="modules-grid">
          {modules.map((module) => (
            <div
              key={module.id}
              className="module-card"
              style={{ borderLeftColor: module.color }}
              onClick={() => navigate(module.path)}
            >
              <div className="card-icon">{module.icon}</div>
              <h2>{module.title}</h2>
              <p>{module.description}</p>
              <button className="btn-enter" style={{ backgroundColor: module.color }}>
                Acceder →
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
