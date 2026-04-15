import { useEffect, useState, useContext } from "react";
import { useFacturasPorPagar } from "../../shared/hooks/useFacturasPorPagar";
import { FacturaPorPagarForm } from "./FacturaPorPagarForm";
import { FacturaPorPagarList } from "./FacturaPorPagarList";
import { FacturaPorPagarDetail } from "./FacturaPorPagarDetail";
import { FacturaPorPagarSearch } from "./FacturaPorPagarSearch";
import { StatsSection } from "../Common/StatsSection";
import { useFacturasPorPagarStats } from "../../shared/hooks/useFacturasPorPagarStats";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { puedeVerFacturasPagar, puedeEliminarFacturasPagar, puedeCrearFacturaPagar, puedeEditarFacturaPagar, puedeDesactivarFacturaPagar } from "../../utils/roleUtils";
import "../../styles/modules.css";

export const FacturasPorPagar = ({ onBack }) => {
  const { user } = useContext(AuthContext);
  const { facturas, loading, obtenerFacturas, crearFactura, actualizarFacturaFunc, desactivarFacturaFunc, eliminarFacturaFunc, obtenerSaldoFacturaFunc, verificarLimiteCompraFunc, exportarFacturasFunc } = useFacturasPorPagar();
  const { stats, loading: statsLoading } = useFacturasPorPagarStats();
  
  // Agregar estados faltantes
  const [filtroEstado, setFiltroEstado] = useState("");
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [facturaEditar, setFacturaEditar] = useState(null);
  const [modalSaldo, setModalSaldo] = useState({ visible: false, factura: null, saldo: null });
  const [modalLimite, setModalLimite] = useState({ visible: false, factura: null, limite: null });
  const [modalExportar, setModalExportar] = useState(false);

  const [modalAgregar, setModalAgregar] = useState({ visible: false });
  const [modalEditar, setModalEditar] = useState({ visible: false, factura: null });
  const [modalDesactivar, setModalDesactivar] = useState({ visible: false, factura: null });
  const [modalEliminar, setModalEliminar] = useState({ visible: false, factura: null });
  const [modalVerDetalle, setModalVerDetalle] = useState({ visible: false, factura: null });

  useEffect(() => {
    obtenerFacturas();
  }, [obtenerFacturas]);

  // Filtrar facturas por estado
  useEffect(() => {
    if (filtroEstado) {
      setFacturasFiltradas(
        facturas.filter((f) => f.estado === filtroEstado)
      );
    } else {
      setFacturasFiltradas(facturas);
    }
  }, [facturas, filtroEstado]);

  const handleSubmitFactura = async (data) => {
    if (facturaEditar) {
      const result = await actualizarFacturaFunc(facturaEditar._id || facturaEditar.id, data);
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
    let exito;
    if (esActivo === false) {
      // Reactivar - directo
      exito = await actualizarFacturaFunc(id, { activo: true });
    } else {
      // Desactivar - desde modal
      exito = await desactivarFacturaFunc(id);
    }
    if (exito && !exito.error) {
      setModalDesactivar({ visible: false, factura: null });
      toast.success(esActivo === false ? "Factura reactivada" : "Factura desactivada");
      await obtenerFacturas();
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
    const result = await eliminarFacturaFunc(id);
    if (!result.error) {
      toast.success("Factura eliminada permanentemente");
      setModalEliminar({ visible: false, factura: null });
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

  const mostrarFacturasActuales = facturasFiltradas;

  // ==================== VERIFICACIÓN DE RBAC ====================
  const tieneAcceso = puedeVerFacturasPagar(user?.rol);
  const puedeCrearFactura = puedeCrearFacturaPagar(user?.rol);
  const puedeEditarFactura = puedeEditarFacturaPagar(user?.rol);
  const puedeDesactivarFactura = puedeDesactivarFacturaPagar(user?.rol);
  const puedeEliminarFactura = puedeEliminarFacturasPagar(user?.rol);

  if (!tieneAcceso) {
    return (
      <div className="module-container">
        <div className="alert alert-danger" style={{ margin: "20px" }}>
          <strong>Acceso Denegado</strong>
          <p>No tienes permisos para acceder al módulo de Facturas por Pagar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="module-container table-density-compact">
      <div className="module-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          {typeof onBack === 'function' && (
            <button
              onClick={onBack}
              className="btn btn-primary"
              style={{ padding: '8px 12px', fontSize: '14px' }}
            >
              ← Volver
            </button>
          )}
          <h2>Facturas por Pagar</h2>
        </div>
        <div className="header-acciones">
          {puedeCrearFactura && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setFacturaEditar(null);
                setMostrarFormulario(true);
              }}
            >
              Nueva Factura
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={() => setModalExportar(true)}
            title="Exportar a Excel"
          >
            Exportar
          </button>
        </div>
      </div>

      <StatsSection stats={mapStats()} loading={statsLoading} />

      <div className="facturas-contenido">
        <div className="search-section">
          <FacturaPorPagarSearch onSearch={setFiltroEstado} />
        </div>

        <div className="table-section">
          <FacturaPorPagarList
            facturas={mostrarFacturasActuales}
            onVerDetalle={(factura) => setModalVerDetalle({ visible: true, factura })}
            onEdit={puedeEditarFactura ? (factura) => {
              setFacturaEditar(factura);
              setMostrarFormulario(true);
            } : null}
            onToggleEstado={puedeDesactivarFactura ? (id, esActivo) => {
              if (esActivo === false) {
                handleToggleEstadoFactura(id, false);
              } else {
                setModalDesactivar({ visible: true, factura: { id } });
              }
            } : null}
            onVerSaldo={handleVerSaldo}
            onVerificaLimite={handleVerificaLimite}
            onEliminarPermanente={puedeEliminarFactura ? (id) => setModalEliminar({ visible: true, factura: { id } }) : null}
            loading={loading}
          />
        </div>
      </div>

      {/* MODAL FORMULARIO FACTURA */}
      {mostrarFormulario && (
        <div className="modal-overlay" onClick={() => { setMostrarFormulario(false); setFacturaEditar(null); }}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>{facturaEditar ? "Editar Factura" : "Crear Nueva Factura"}</h3>
              <button className="btn-close" onClick={() => { setMostrarFormulario(false); setFacturaEditar(null); }}>×</button>
            </div>
            <div className="modal-body p-6 form-readable">
              <FacturaPorPagarForm
                factura={facturaEditar}
                onSubmit={handleSubmitFactura}
                loading={loading}
                onCancel={() => { setMostrarFormulario(false); setFacturaEditar(null); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL SALDO */}
      {modalSaldo.visible && (
        <div className="modal-overlay" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header border-b border-blue-500/30">
              <h3 className="text-blue-400">Saldo de Factura: {modalSaldo.factura?.numeroFactura}</h3>
              <button className="btn-close" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>×</button>
            </div>
            <div className="modal-body text-center p-6 bg-blue-950/20">
              {modalSaldo.saldo && (
                <>
                  <p className="text-gray-300 mb-2">Total Adeudado: <span className="font-bold text-white">Q {modalSaldo.saldo.totalAdeudado?.toLocaleString() || "0"}</span></p>
                  <p className="text-gray-400 mb-2">Total Pagado: <span>Q {modalSaldo.saldo.totalPagado?.toLocaleString() || "0"}</span></p>
                  <div className="mt-4 p-4 rounded-xl bg-blue-900/30 border border-blue-500/30">
                    <p className="text-lg text-blue-200">Total Pendiente</p>
                    <p className="text-3xl font-bold text-blue-400">Q {modalSaldo.saldo.totalPendiente?.toLocaleString() || "0"}</p>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Límite Crédito Proveedor: Q {modalSaldo.saldo.limiteCreditoProveedor?.toLocaleString() || "0"}
                  </div>
                </>
              )}
              <button className="btn btn-primary mt-6 w-full" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>Aceptar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LÍMITE COMPRA */}
      {modalLimite.visible && (
        <div className="modal-overlay" onClick={() => setModalLimite({ ...modalLimite, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header border-b border-purple-500/30">
              <h3 className="text-purple-400">Límite de Compra</h3>
              <button className="btn-close" onClick={() => setModalLimite({ ...modalLimite, visible: false })}>×</button>
            </div>
            <div className="modal-body p-6 bg-purple-950/20">
              {modalLimite.limite && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                    <span className="text-gray-400">Proveedor:</span>
                    <span className="font-bold text-white">{modalLimite.limite.proveedor?.nombre}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                    <span className="text-gray-400">Límite Autorizado:</span>
                    <span className="font-bold text-white">Q {modalLimite.limite.limiteCredito?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                    <span className="text-gray-400">Saldo Pendiente:</span>
                    <span className="font-bold text-orange-400">Q {modalLimite.limite.saldoPendiente?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                    <span className="text-gray-400">Crédito Disponible:</span>
                    <span className="font-bold text-green-400">Q {modalLimite.limite.creditoDisponible?.toLocaleString() || "0"}</span>
                  </div>
                  
                  {modalLimite.limite.puedeComprar ? (
                    <div className="mt-4 p-4 rounded-xl bg-green-900/30 border border-green-500/30 text-center">
                      <p className="text-green-300 font-bold">La factura está dentro del límite permitido</p>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 rounded-xl bg-red-900/30 border border-red-500/30 text-center">
                      <p className="text-red-300 font-bold">La factura excede el límite de compra autorizado</p>
                    </div>
                  )}
                </div>
              )}
              <button className="btn btn-secondary mt-6 w-full" onClick={() => setModalLimite({ ...modalLimite, visible: false })}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VER DETALLE */}
      {modalVerDetalle.visible && (
        <div className="modal-overlay" onClick={() => setModalVerDetalle({ visible: false, factura: null })}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Detalles de Factura: {modalVerDetalle.factura?.numeroFactura}</h3>
              <button className="btn-close" onClick={() => setModalVerDetalle({ visible: false, factura: null })}>×</button>
            </div>
            <div className="modal-body p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Proveedor</p>
                  <p className="font-semibold text-lg text-gray-900 dark:text-white">
                    {modalVerDetalle.factura?.proveedor?.nombre || modalVerDetalle.factura?.proveedorId || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estado</p>
                  <p className="font-semibold text-lg text-gray-900 dark:text-white">
                    {modalVerDetalle.factura?.estado || "PENDIENTE"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Fecha Emisión</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {modalVerDetalle.factura?.fechaEmision ? new Date(modalVerDetalle.factura.fechaEmision).toLocaleDateString("es-GT") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Fecha Vencimiento</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {modalVerDetalle.factura?.fechaVencimiento ? new Date(modalVerDetalle.factura.fechaVencimiento).toLocaleDateString("es-GT") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Monto/Moneda</p>
                  <p className="font-bold text-xl text-blue-600 dark:text-blue-400">
                    {modalVerDetalle.factura?.moneda || "GTQ"} {parseFloat(modalVerDetalle.factura?.monto || 0).toFixed(2)}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Descripción</p>
                  <p className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                    {modalVerDetalle.factura?.descripcion || "Sin descripción"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
              <button 
                className="px-6 py-2.5 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                onClick={() => setModalVerDetalle({ visible: false, factura: null })}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DESACTIVAR FACTURA / RESTAURAR */}
      {modalDesactivar.visible && (
        <div className="modal-overlay" onClick={() => setModalDesactivar({ visible: false, factura: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ animation: 'fadeInZoom 0.3s ease-out' }}>
            <div className="modal-header">
              <h3>Confirmar Desactivación</h3>
              <button className="btn-close" onClick={() => setModalDesactivar({ visible: false, factura: null })}>×</button>
            </div>
            <div className="modal-body text-center p-6">
              <p className="text-gray-900 dark:text-gray-300 mb-6 font-medium">¿Estás seguro que deseas desactivar esta factura? Podrás reactivarla o visualizarla después.</p>
              <div className="flex justify-center space-x-4">
                <button className="btn btn-secondary px-6" onClick={() => setModalDesactivar({ visible: false, factura: null })}>Cancelar</button>
                <button className="btn btn-danger px-6 font-bold shadow-md hover:shadow-red-500/30 bg-red-600 hover:bg-red-700 text-white" onClick={() => handleToggleEstadoFactura(modalDesactivar.factura.id, true)}>Desactivar Factura</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR FACTURA */}
      {modalEliminar.visible && (
        <div className="modal-overlay" onClick={() => setModalEliminar({ visible: false, factura: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ animation: 'fadeInZoom 0.3s ease-out' }}>
            <div className="modal-header border-b border-red-500/30">
              <h3 className="text-red-600 dark:text-red-400">Eliminar Permanente</h3>
              <button className="btn-close" onClick={() => setModalEliminar({ visible: false, factura: null })}>×</button>
            </div>
            <div className="modal-body text-center p-6 bg-red-50 dark:bg-red-950/20">
              <p className="text-red-600 dark:text-red-300 mb-2 font-bold text-lg">ADVERTENCIA</p>
              <p className="text-red-700 dark:text-red-200/80 mb-6 font-medium">Esta acción no se puede deshacer. La factura será eliminada permanentemente de la base de datos.</p>
              <div className="flex justify-center space-x-4">
                <button className="btn btn-secondary px-6 border dark:border-gray-600" onClick={() => setModalEliminar({ visible: false, factura: null })}>Cancelar</button>
                <button className="btn px-6 bg-red-600 hover:bg-red-700 text-white font-bold" style={{boxShadow: '0 0 15px rgba(220, 38, 38, 0.4)'}} onClick={() => handleEliminarPermanente(modalEliminar.factura.id)}>Sí, Eliminar</button>
              </div>
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
            <div className="modal-body p-6 text-center">
              <p className="mb-4">¿Deseas exportar todas las facturas activas a un archivo Excel?</p>
              <p className="total-facturas mb-4">Total facturas a exportar: <strong>{facturas.filter(f => f.activo).length}</strong></p>
              <div className="flex justify-center space-x-4 mt-6">
                <button className="btn btn-secondary px-6" onClick={() => setModalExportar(false)}>
                  Cancelar
                </button>
                <button className="btn btn-primary px-6" onClick={handleExportar} disabled={loading}>
                  {loading ? "Exportando..." : "Exportar a Excel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
