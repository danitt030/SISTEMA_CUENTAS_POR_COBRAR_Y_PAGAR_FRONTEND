import { useEffect, useState, useContext } from "react";
import { useFacturasPorPagar } from "../../shared/hooks/useFacturasPorPagar";
import { FacturaPorPagarForm } from "./FacturaPorPagarForm";
import { FacturaPorPagarList } from "./FacturaPorPagarList";
import { FacturaPorPagarDetail } from "./FacturaPorPagarDetail";
import { FacturaPorPagarSearch } from "./FacturaPorPagarSearch";
import { StatsSection } from "../Common/StatsSection";
import { useFacturasPorPagarStats } from "../../shared/hooks/useFacturasPorPagarStats";
import toast from "react-hot-toast";
import "./facturasPorPagar.css";
import { AuthContext } from "../../context/AuthContext";
import { puedeVerFacturasPagar, puedeEliminarFacturasPagar, puedeCrearFacturaPagar, puedeEditarFacturaPagar, puedeDesactivarFacturaPagar } from "../../utils/roleUtils";

export const FacturasPorPagar = () => {
  const { user } = useContext(AuthContext);
  const { facturas, loading, obtenerFacturas, crearFactura, actualizarFacturaFunc, desactivarFacturaFunc, eliminarFacturaFunc, obtenerSaldoFacturaFunc, verificarLimiteCompraFunc, exportarFacturasFunc } = useFacturasPorPagar();
  const { stats, loading: statsLoading } = useFacturasPorPagarStats();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [facturaEditar, setFacturaEditar] = useState(null);
  const [busqueda, setBusqueda] = useState([]);
  const [modalSaldo, setModalSaldo] = useState({ visible: false, factura: null, saldo: null });
  const [modalLimite, setModalLimite] = useState({ visible: false, factura: null, limite: null });
  const [modalExportar, setModalExportar] = useState(false);

  useEffect(() => {
    obtenerFacturas();
  }, [obtenerFacturas]);

  const handleSubmitFactura = async (data) => {
    if (facturaEditar) {
      const result = await actualizarFacturaFunc(facturaEditar._id, data);
      if (!result.error) {
        setFacturaEditar(null);
        setMostrarFormulario(false);
        await obtenerFacturas();
      }
      return result;
    } else {
      const result = await crearFactura(data);
      if (!result.error) {
        setMostrarFormulario(false);
        await obtenerFacturas();
      }
      return result;
    }
  };

  const handleToggleEstadoFactura = async (id, esActivo) => {
    const accion = esActivo === false ? "reactivar" : "desactivar";
    console.log(`Iniciando ${accion} para factura:`, id, "esActivo:", esActivo);
    if (confirm(`¿${accion.charAt(0).toUpperCase() + accion.slice(1)} esta factura?`)) {
      let exito;
      if (esActivo === false) {
        console.log("Reactivando factura pagar...");
        // Reactivar
        exito = await actualizarFacturaFunc(id, { activo: true });
      } else {
        console.log("Desactivando factura pagar...");
        // Desactivar
        exito = await desactivarFacturaFunc(id);
      }
      console.log("Resultado del toggle:", exito);
      if (exito && !exito.error) {
        console.log("Éxito! Recargando facturas...");
        await obtenerFacturas();
      } else {
        console.error("Error en toggle:", exito?.message);
      }
    }
  };

  const handleVerSaldo = async (factura) => {
    const result = await obtenerSaldoFacturaFunc(factura._id || factura.id);
    if (!result.error) {
      setModalSaldo({ visible: true, factura, saldo: result.data });
    } else {
      toast.error("Error al obtener saldo");
    }
  };

  const handleVerificaLimite = async (factura) => {
    // Obtener el ID del proveedor correctamente (puede ser string o objeto)
    const proveedorId = typeof factura.proveedor === 'string' ? factura.proveedor : (factura.proveedor?._id || factura.proveedor?.id);
    const result = await verificarLimiteCompraFunc(proveedorId, factura.monto);
    if (!result.error) {
      setModalLimite({ visible: true, factura, limite: result.data });
    } else {
      toast.error("Error al verificar límite");
    }
  };

  const handleEliminarPermanente = async (id) => {
    const confirmed = window.confirm("⚠️ ¿ELIMINAR PERMANENTEMENTE esta factura? Esta acción no se puede deshacer.");
    if (!confirmed) return;

    const result = await eliminarFacturaFunc(id);
    if (!result.error) {
      await obtenerFacturas();
    } else {
      toast.error(result.message);
    }
  };

  const handleExportar = async () => {
    const result = await exportarFacturasFunc();
    if (!result.error) {
      toast.success("Archivo Excel generado correctamente");
      setModalExportar(false);
    } else {
      toast.error("Error al exportar");
    }
  };

  const mapStats = () => {
    return [
      {
        label: "Total Facturas",
        value: stats.total,
        color: "#2196F3",
      },
      {
        label: "Pendientes",
        value: stats.pendientes,
        color: "#FF9800",
      },
      {
        label: "Pagadas",
        value: stats.pagadas,
        color: "#4CAF50",
      },
      {
        label: "Monto Total",
        value: `Q ${parseFloat(stats.montoTotal || 0).toFixed(2)}`,
        color: "#9C27B0",
      },
    ];
  };

  const mostrarFacturasActuales = busqueda.length > 0 ? busqueda : facturas;

  // ==================== VERIFICACIÓN DE RBAC ====================
  const tieneAcceso = puedeVerFacturasPagar(user?.rol);
  const puedeCrearFactura = puedeCrearFacturaPagar(user?.rol);
  const puedeEditarFactura = puedeEditarFacturaPagar(user?.rol);
  const puedeDesactivarFactura = puedeDesactivarFacturaPagar(user?.rol);

  if (!tieneAcceso) {
    return (
      <div className="facturas-por-pagar-container">
        <div className="alert alert-danger" style={{ margin: "20px" }}>
          <strong>Acceso Denegado</strong>
          <p>No tienes permisos para acceder al módulo de Facturas por Pagar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="facturas-por-pagar-container">
      <div className="facturas-header">
        <h1>Facturas por Pagar</h1>
        <div className="header-acciones">
          {puedeCrearFactura && (
            <button
              className="btn-primary"
              onClick={() => {
                setFacturaEditar(null);
                setMostrarFormulario(!mostrarFormulario);
              }}
            >
              {mostrarFormulario ? "Cancelar" : "+ Nueva Factura"}
            </button>
          )}
          <button
            className="btn-secondary"
            onClick={() => setModalExportar(true)}
            title="Exportar a Excel"
          >
            📊 Exportar
          </button>
        </div>
      </div>

      <StatsSection stats={mapStats()} loading={statsLoading} />

      <div className="facturas-contenido">
        {mostrarFormulario && (
          <div className="formulario-section">
            <h2>{facturaEditar ? "Editar Factura" : "Crear Nueva Factura"}</h2>
            <FacturaPorPagarForm
              factura={facturaEditar}
              onSubmit={handleSubmitFactura}
              loading={loading}
            />
          </div>
        )}

        <div className="search-section">
          <FacturaPorPagarSearch onResultados={setBusqueda} />
        </div>

        <div className="lista-section">
          <FacturaPorPagarList
            facturas={mostrarFacturasActuales}
            onEdit={(factura) => {
              setFacturaEditar(factura);
              setMostrarFormulario(true);
            }}
            onToggleEstado={handleToggleEstadoFactura}
            onVerSaldo={handleVerSaldo}
            onVerificaLimite={handleVerificaLimite}
            onEliminarPermanente={puedeEliminarFacturasPagar(user?.rol) ? handleEliminarPermanente : null}
            loading={loading}
          />
        </div>
      </div>

      {/* MODAL SALDO */}
      {modalSaldo.visible && (
        <div className="modal-overlay" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Saldo de {modalSaldo.factura?.numeroFactura}</h3>
              <button className="close-btn" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>×</button>
            </div>
            <div className="modal-body">
              {modalSaldo.saldo && (
                <div className="saldo-info">
                  <div className="saldo-item">
                    <label>Total Adeudado:</label>
                    <span>Q{modalSaldo.saldo.totalAdeudado?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="saldo-item">
                    <label>Total Pagado:</label>
                    <span>Q{modalSaldo.saldo.totalPagado?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="saldo-item">
                    <label>Total Pendiente:</label>
                    <span className="pendiente">Q{modalSaldo.saldo.totalPendiente?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="saldo-item">
                    <label>Límite Crédito Proveedor:</label>
                    <span>Q{modalSaldo.saldo.limiteCreditoProveedor?.toLocaleString() || "0"}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LÍMITE COMPRA */}
      {modalLimite.visible && (
        <div className="modal-overlay" onClick={() => setModalLimite({ ...modalLimite, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Verificación de Límite de Compra</h3>
              <button className="close-btn" onClick={() => setModalLimite({ ...modalLimite, visible: false })}>×</button>
            </div>
            <div className="modal-body">
              {modalLimite.limite && (
                <div className="limite-info">
                  <div className="limite-item">
                    <label>Proveedor:</label>
                    <span>{modalLimite.limite.proveedor?.nombre}</span>
                  </div>
                  <div className="limite-item">
                    <label>Límite de Crédito:</label>
                    <span>Q{modalLimite.limite.limiteCredito?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="limite-item">
                    <label>Saldo Pendiente:</label>
                    <span>Q{modalLimite.limite.saldoPendiente?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="limite-item">
                    <label>Crédito Disponible:</label>
                    <span className="disponible">Q{modalLimite.limite.creditoDisponible?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="limite-item">
                    <label>¿Puede Comprar?</label>
                    <span className={modalLimite.limite.puedeComprar ? "si" : "no"}>
                      {modalLimite.limite.puedeComprar ? "✅ Sí" : "❌ No"}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalLimite({ ...modalLimite, visible: false })}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXPORTAR */}
      {modalExportar && (
        <div className="modal-overlay" onClick={() => setModalExportar(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Exportar Facturas por Pagar</h3>
              <button className="close-btn" onClick={() => setModalExportar(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>¿Deseas exportar todas las facturas activas a un archivo Excel?</p>
              <p className="total-facturas">Total facturas a exportar: <strong>{facturas.filter(f => f.activo).length}</strong></p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalExportar(false)}>
                Cancelar
              </button>
              <button className="btn-success" onClick={handleExportar} disabled={loading}>
                {loading ? "Exportando..." : "📊 Exportar a Excel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
