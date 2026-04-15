import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import "../../styles/modules.css";

export const IAMainPage = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: "cliente",
      title: "Análisis de Clientes",
      description: "Analiza información de clientes, límites de crédito y riesgos",
      icon: "CL",
      path: "/ia/cliente",
      color: "#3498db",
    },
    {
      id: "facturas",
      title: "Análisis de Facturas por Cobrar",
      description: "Analiza facturas pendientes, vencimientos y cobrabilidad",
      icon: "FC",
      path: "/ia/facturas",
      color: "#e74c3c",
    },
    {
      id: "cobros",
      title: "Análisis de Cobros y Comisiones",
      description: "Analiza cobros realizados, comisiones y métodos de pago",
      icon: "CB",
      path: "/ia/cobros",
      color: "#27ae60",
    },
    {
      id: "reportes",
      title: "Análisis de Reportes",
      description: "Analiza reportes generales del sistema y tendencias",
      icon: "RP",
      path: "/ia/reportes",
      color: "#9b59b6",
    },
  ];

  return (
    <>
      <Header />
      <div className="module-container ia-main-container">
        <section className="ia-hero">
          <div className="ia-hero-main">
            <div className="ia-hero-top">
              <button onClick={() => navigate(-1)} className="btn btn-secondary">
                ← Volver
              </button>
              <span className="ia-live-badge">Asistente activo</span>
            </div>

            <h1>Asistente IA Empresarial</h1>
            <p>
              Analiza clientes, facturas, cobros y reportes en formato conversacional tipo ChatGPT,
              con contexto por modulo y respuestas accionables.
            </p>
          </div>

          <div className="ia-hero-stats">
            <article>
              <p className="label">Modulos IA</p>
              <p className="value">{modules.length}</p>
            </article>
            <article>
              <p className="label">Modo</p>
              <p className="value small">Analisis asistido</p>
            </article>
          </div>
        </section>

        <div className="ia-main-header">
          <h2>Selecciona un modulo de analisis</h2>
          <p className="subtitle">Cada modulo usa datos reales del sistema para responder con precision.</p>
        </div>

        <div className="modules-grid">
          {modules.map((module) => (
            <div
              key={module.id}
              className="module-card"
              style={{ "--module-color": module.color }}
              onClick={() => navigate(module.path)}
              role="button"
              tabIndex={0}
            >
              <div className="card-icon">{module.icon}</div>
              <h2>{module.title}</h2>
              <p>{module.description}</p>
              <button className="btn-enter">
                Acceder →
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
