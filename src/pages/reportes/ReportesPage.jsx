import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import { useReportes } from "../../shared/hooks/useReportes";
import { ResumenSaldosCard } from "../../components/Reportes/ResumenSaldosCard";
import { ResumenProveedorCard } from "../../components/Reportes/ResumenProveedorCard";
import { ResumenClienteCard } from "../../components/Reportes/ResumenClienteCard";
import { FacturasPorVencerCard } from "../../components/Reportes/FacturasPorVencerCard";
import { FacturasVencidasCard } from "../../components/Reportes/FacturasVencidasCard";
import { CobrabilidadCard } from "../../components/Reportes/CobrabilidadCard";
import { PagabilidadCard } from "../../components/Reportes/PagabilidadCard";
import { FacturasPorEstadoCard } from "../../components/Reportes/FacturasPorEstadoCard";
import { TopClientesCard } from "../../components/Reportes/TopClientesCard";
import { TopProveedoresCard } from "../../components/Reportes/TopProveedoresCard";
import { ComisionesCard } from "../../components/Reportes/ComisionesCard";
import "./reportesPage.css";
import { AuthContext } from "../../context/AuthContext";
import { puedeVerReportes, getReportesByRole } from "../../utils/roleUtils";

export const ReportesPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    error,
    resumenSaldosFunc,
    resumenProveedorFunc,
    resumenClienteFunc,
    facturasPorVencerFunc,
    facturasVencidasFunc,
    cobrabilidadFunc,
    pagabilidadFunc,
    facturasPorEstadoFunc,
    topClientesFunc,
    topProveedoresFunc,
    analisisComisionesFunc,
    exportarReporteFunc
  } = useReportes();

  const [datos, setDatos] = useState({});
  const [reporteActivo, setReporteActivo] = useState(null);
  const [cargandoReporte, setCargandoReporte] = useState(false);

  const reportes = getReportesByRole(user?.rol);

  const generarReporte = async (tipo) => {
    try {
      setCargandoReporte(true);
      setReporteActivo(tipo);
      setDatos({});

      let resultado;
      switch (tipo) {
        case "saldos":
          resultado = await resumenSaldosFunc();
          break;
        case "proveedor":
          resultado = await resumenProveedorFunc();
          break;
        case "cliente":
          resultado = await resumenClienteFunc();
          break;
        case "vencer":
          resultado = await facturasPorVencerFunc();
          break;
        case "vencidas":
          resultado = await facturasVencidasFunc();
          break;
        case "cobrabilidad":
          resultado = await cobrabilidadFunc();
          break;
        case "pagabilidad":
          resultado = await pagabilidadFunc();
          break;
        case "estado":
          resultado = await facturasPorEstadoFunc();
          break;
        case "topClientes":
          resultado = await topClientesFunc(10);
          break;
        case "topProveedores":
          resultado = await topProveedoresFunc(10);
          break;
        case "comisiones":
          resultado = await analisisComisionesFunc();
          break;
        default:
          resultado = { error: true, message: "Tipo de reporte inválido" };
      }

      if (!resultado.error) {
        setDatos(resultado.data);
      }
    } finally {
      setCargandoReporte(false);
    }
  };

  const handleExportar = async () => {
    try {
      const resultado = await exportarReporteFunc();
      if (!resultado.error) {
        alert("✅ Reporte exportado exitosamente");
        // Aquí podrías descargar el archivo si lo deseas
      }
    } catch {
      alert("❌ Error al exportar reporte");
    }
  };

  const handlePreguntarIA = () => {
    navigate("/ia/reportes");
  };

  // ==================== VERIFICACIÓN DE RBAC ====================
  const tieneAcceso = puedeVerReportes(user?.rol);

  if (!tieneAcceso) {
    return (
      <>
        <Header />
        <div className="reportes-container">
          <div className="alert alert-danger" style={{ margin: "20px" }}>
            <strong>Acceso Denegado</strong>
            <p>No tienes permisos para acceder al módulo de Reportes.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="reportes-container">
        <div className="reportes-header">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-secondary back-btn"
          >
            ← Volver
          </button>
          <h1>📊 Reportes del Sistema</h1>
          <div className="header-buttons">
            <button 
              onClick={handleExportar}
              className="btn btn-primary export-btn"
              disabled={cargandoReporte}
            >
              📥 Exportar a Excel
            </button>
            <button 
              onClick={handlePreguntarIA}
              className="btn btn-ia"
            >
              🤖 Preguntar IA
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            ❌ {error}
          </div>
        )}

        <div className="reportes-grid">
          {reportes.map((reporte) => (
            <button
              key={reporte.id}
              onClick={() => generarReporte(reporte.id)}
              className={`reporte-card ${reporteActivo === reporte.id ? "active" : ""} ${
                cargandoReporte && reporteActivo === reporte.id ? "loading" : ""
              }`}
              disabled={cargandoReporte && reporteActivo !== reporte.id}
            >
              <span className="reporte-icono">{reporte.icono}</span>
              <span className="reporte-nombre">{reporte.nombre}</span>
              {reporteActivo === reporte.id && cargandoReporte && (
                <span className="spinner-loader"></span>
              )}
            </button>
          ))}
        </div>

        {reporteActivo && datos && !cargandoReporte && (
          <div className="reporte-resultado">
            {reporteActivo === "saldos" && <ResumenSaldosCard datos={datos} />}
            {reporteActivo === "proveedor" && <ResumenProveedorCard datos={datos} />}
            {reporteActivo === "cliente" && <ResumenClienteCard datos={datos} />}
            {reporteActivo === "vencer" && <FacturasPorVencerCard datos={datos} />}
            {reporteActivo === "vencidas" && <FacturasVencidasCard datos={datos} />}
            {reporteActivo === "cobrabilidad" && <CobrabilidadCard datos={datos} />}
            {reporteActivo === "pagabilidad" && <PagabilidadCard datos={datos} />}
            {reporteActivo === "estado" && <FacturasPorEstadoCard datos={datos} />}
            {reporteActivo === "topClientes" && <TopClientesCard datos={datos} />}
            {reporteActivo === "topProveedores" && <TopProveedoresCard datos={datos} />}
            {reporteActivo === "comisiones" && <ComisionesCard datos={datos} />}
          </div>
        )}
      </div>
    </>
  );
};
