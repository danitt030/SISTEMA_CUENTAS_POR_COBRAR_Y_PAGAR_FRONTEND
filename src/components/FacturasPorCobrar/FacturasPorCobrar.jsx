import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useFacturasPorCobrar } from "../../shared/hooks/useFacturasPorCobrar";
import { FacturaPorCobrarForm } from "./FacturaPorCobrarForm";
import { FacturaPorCobrarList } from "./FacturaPorCobrarList";
import { FacturaPorCobrarDetail } from "./FacturaPorCobrarDetail";
import { FacturaPorCobrarSearch } from "./FacturaPorCobrarSearch";
import { 
  puedeVerFacturasCobrar, 
  puedeEliminarFacturasCobrar, 
  puedeCrearFacturaCobrar, 
  puedeEditarFacturaCobrar, 
  puedeDesactivarFacturaCobrar,
  puedeVerSaldoFacturasCobrar,
  puedeVerFacturasClientesCobrar,
  puedeMarcarVencidaFacturasCobrar,
  puedeEnviarRecordatorioFacturasCobrar,
  puedeVerFacturasVencidasCobrar,
  puedeVerFacturasProximasCobrar,
  puedeExportarFacturasCobrar,
  puedeVerIA
} from "../../utils/roleUtils";
import toast from "react-hot-toast";
import "./facturasPorCobrar.css";

export const FacturasPorCobrar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);

  // Estados para modales
  const [modalSaldo, setModalSaldo] = useState({ visible: false, factura: null, saldo: null });
  const [modalCliente, setModalCliente] = useState({ visible: false, clienteId: null, facturas: null });
  const [modalVencidas, setModalVencidas] = useState({ visible: false, facturas: null });
  const [modalProximas, setModalProximas] = useState({ visible: false, facturas: null });
  const [modalExportar, setModalExportar] = useState(false);

  const {
    facturas,
    loading,
    error,
    obtenerFacturas,
    crearFactura,
    actualizarFacturaFunc,
    desactivarFacturaFunc,
    eliminarFacturaFunc,
    obtenerSaldoFacturaFunc,
    obtenerFacturasPorClienteFunc,
    obtenerFacturasVencidasFunc,
    obtenerFacturasProximasFunc,
    marcarFacturaVencidaFunc,
    enviarRecordatorioFunc,
    exportarFacturasFunc,
  } = useFacturasPorCobrar();

  // Cargar facturas al montar
  useEffect(() => {
    obtenerFacturas();
  }, []);

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

  const handleCrearFactura = async (datos) => {
    const exito = await crearFactura(datos);
    if (exito) {
      setShowForm(false);
      obtenerFacturas();
    }
  };

  const handleEditarFactura = async (id, datos) => {
    const exito = await actualizarFacturaFunc(id, datos);
    if (exito) {
      setShowForm(false);
      setSelectedFactura(null);
      setIsEditing(false);
      obtenerFacturas();
    }
  };

  const handleToggleEstadoFactura = async (id, esActivo) => {
    if (!puedeDesactivarFactura) {
      toast.error("No tienes permisos para desactivar facturas");
      return;
    }
    const accion = esActivo === false ? "reactivar" : "desactivar";
    if (confirm(`¿${accion.charAt(0).toUpperCase() + accion.slice(1)} esta factura?`)) {
      let exito;
      if (esActivo === false) {
        // Reactivar
        exito = await actualizarFacturaFunc(id, { activo: true });
      } else {
        // Desactivar
        exito = await desactivarFacturaFunc(id);
      }
      if (exito && !exito.error) {
        obtenerFacturas();
        setShowDetail(false);
      } else {
      }
    }
  };

  const handleEditClick = (factura) => {
    if (!puedeEditarFactura) {
      toast.error("No tienes permisos para editar facturas");
      return;
    }
    setSelectedFactura(factura);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDetalleClick = (factura) => {
    setSelectedFactura(factura);
    setShowDetail(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedFactura(null);
    setIsEditing(false);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedFactura(null);
  };

  const handleSearch = (estado) => {
    setFiltroEstado(estado);
  };

  const handleVerSaldo = async (factura) => {
    if (!puedeVerSaldo) {
      toast.error("No tienes permisos para ver el saldo");
      return;
    }
    const result = await obtenerSaldoFacturaFunc(factura._id || factura.id);
    if (!result.error) {
      setModalSaldo({ visible: true, factura, saldo: result.data });
    } else {
      toast.error("Error al obtener saldo");
    }
  };

  const handleVerFacturasCliente = async (factura) => {
    if (!puedeVerFacturasCliente) {
      toast.error("No tienes permisos para ver facturas del cliente");
      return;
    }
    // Extraer el ID del cliente correctamente (puede ser string u objeto)
    const clienteId = typeof factura.cliente === 'string' ? factura.cliente : (factura.cliente?._id || factura.cliente?.id);
    const result = await obtenerFacturasPorClienteFunc(clienteId, 100, 0);
    if (!result.error) {
      setModalCliente({ visible: true, clienteId, clienteNombre: factura.cliente?.nombre, facturas: result.data });
    } else {
      toast.error("Error al obtener facturas del cliente");
    }
  };

  const handleVerVencidas = async () => {
    if (!puedeVerVencidas) {
      toast.error("No tienes permisos para ver facturas vencidas");
      return;
    }
    const result = await obtenerFacturasVencidasFunc(100, 0);
    if (!result.error) {
      setModalVencidas({ visible: true, facturas: result.data });
    } else {
      toast.error("Error al obtener facturas vencidas");
    }
  };

  const handleVerProximas = async () => {
    if (!puedeVerProximas) {
      toast.error("No tienes permisos para ver facturas próximas");
      return;
    }
    const result = await obtenerFacturasProximasFunc(15, 100, 0);
    if (!result.error) {
      setModalProximas({ visible: true, facturas: result.data });
    } else {
      toast.error("Error al obtener facturas próximas");
    }
  };

  const handleMarcarVencida = async (id) => {
    if (!puedeMarcarVencida) {
      toast.error("No tienes permisos para marcar facturas como vencidas");
      return;
    }
    const confirmed = window.confirm("¿Marcar esta factura como vencida?");
    if (!confirmed) return;

    const result = await marcarFacturaVencidaFunc(id);
    if (!result.error) {
      await obtenerFacturas();
    } else {
      toast.error(result.message);
    }
  };

  const handleEnviarRecordatorio = async (id) => {
    if (!puedeEnviarRecordatorio) {
      toast.error("No tienes permisos para enviar recordatorios");
      return;
    }
    const result = await enviarRecordatorioFunc(id);
    if (!result.error) {
      toast.success("Recordatorio enviado");
    } else {
      toast.error(result.message);
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
    if (!puedeExportar) {
      toast.error("No tienes permisos para exportar facturas");
      return;
    }
    const result = await exportarFacturasFunc();
    if (!result.error) {
      toast.success("Archivo Excel generado correctamente");
      setModalExportar(false);
    } else {
      toast.error("Error al exportar facturas");
    }
  };

  const handlePreguntarIA = () => {
    navigate("/ia/facturas");
  };

  // ==================== VERIFICACIÓN DE RBAC ====================
  const tieneAcceso = puedeVerFacturasCobrar(user?.rol);
  const puedeCrearFactura = puedeCrearFacturaCobrar(user?.rol);
  const puedeEditarFactura = puedeEditarFacturaCobrar(user?.rol);
  const puedeDesactivarFactura = puedeDesactivarFacturaCobrar(user?.rol);
  const puedeEliminarFactura = puedeEliminarFacturasCobrar(user?.rol);
  const puedeVerSaldo = puedeVerSaldoFacturasCobrar(user?.rol);
  const puedeVerFacturasCliente = puedeVerFacturasClientesCobrar(user?.rol);
  const puedeMarcarVencida = puedeMarcarVencidaFacturasCobrar(user?.rol);
  const puedeEnviarRecordatorio = puedeEnviarRecordatorioFacturasCobrar(user?.rol);
  const puedeVerVencidas = puedeVerFacturasVencidasCobrar(user?.rol);
  const puedeVerProximas = puedeVerFacturasProximasCobrar(user?.rol);
  const puedeExportar = puedeExportarFacturasCobrar(user?.rol);
  const puedeAccederIA = puedeVerIA(user?.rol);

  if (!tieneAcceso) {
    return (
      <div className="facturas-por-cobrar-container">
        <div className="alert alert-danger" style={{ margin: "20px" }}>
          <strong>Acceso Denegado</strong>
          <p>No tienes permisos para acceder al módulo de Facturas por Cobrar</p>
          <p>Para ver tus facturas, accede a "Mi Portal" desde tu dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="facturas-por-cobrar-container">
      <div className="header">
        <h1>Facturas por Cobrar</h1>
        <div className="header-acciones">
          {puedeCrearFactura && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
            >
              {showForm ? "Cancelar" : "Nueva Factura"}
            </button>
          )}
          {puedeVerVencidas && (
            <button onClick={handleVerVencidas} className="btn-warning" title="Ver Facturas Vencidas">⏰ Vencidas</button>
          )}
          {puedeVerProximas && (
            <button onClick={handleVerProximas} className="btn-info" title="Ver Facturas Próximas a Vencer">📅 Próximas</button>
          )}
          {puedeExportar && (
            <button onClick={() => setModalExportar(true)} className="btn-secondary" title="Exportar a Excel">📊 Exportar</button>
          )}
          {puedeAccederIA && (
            <button onClick={handlePreguntarIA} className="btn-ia" title="Preguntar IA sobre Facturas">🤖 Preguntar IA</button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-section">
          <div className="form-card">
            <FacturaPorCobrarForm
              onSubmit={isEditing ? handleEditarFactura : handleCrearFactura}
              factura={isEditing ? selectedFactura : null}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      {showDetail && (
        <div className="detail-section">
          <div className="detail-card">
            <FacturaPorCobrarDetail
              factura={selectedFactura}
              onClose={handleCloseDetail}
            />
          </div>
        </div>
      )}

      <div className="search-section">
        <FacturaPorCobrarSearch onSearch={handleSearch} />
      </div>

      <div className="list-section">
        <FacturaPorCobrarList
          facturas={facturasFiltradas}
          onEdit={puedeEditarFactura ? handleEditClick : null}
          onToggleEstado={puedeDesactivarFactura ? handleToggleEstadoFactura : null}
          onVerSaldo={puedeVerSaldo ? handleVerSaldo : null}
          onVerFacturasCliente={puedeVerFacturasCliente ? handleVerFacturasCliente : null}
          onMarcarVencida={puedeMarcarVencida ? handleMarcarVencida : null}
          onEnviarRecordatorio={puedeEnviarRecordatorio ? handleEnviarRecordatorio : null}
          onEliminarPermanente={puedeEliminarFactura ? handleEliminarPermanente : null}
          loading={loading}
        />
      </div>

      {/* MODAL SALDO */}
      {modalSaldo.visible && (
        <div className="modal-overlay" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Saldo de Facturas - {modalSaldo.factura?.cliente?.nombre}</h3>
              <button onClick={() => setModalSaldo({ ...modalSaldo, visible: false })} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              {modalSaldo.saldo && (
                <div className="saldo-info">
                  <div className="info-item">
                    <span className="label">Total Asignado:</span>
                    <span className="value">Q {modalSaldo.saldo.saldo?.totalAsignado || 0}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Total Cobrado:</span>
                    <span className="value success">Q {modalSaldo.saldo.saldo?.totalCobrado || 0}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Total Pendiente:</span>
                    <span className="value warning">Q {modalSaldo.saldo.saldo?.totalPendiente || 0}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setModalSaldo({ ...modalSaldo, visible: false })} className="btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FACTURAS POR CLIENTE */}
      {modalCliente.visible && (
        <div className="modal-overlay" onClick={() => setModalCliente({ ...modalCliente, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Facturas del Cliente {modalCliente.clienteNombre ? `- ${modalCliente.clienteNombre}` : ""}</h3>
              <button onClick={() => setModalCliente({ ...modalCliente, visible: false })} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              {modalCliente.facturas && modalCliente.facturas.length > 0 ? (
                <ul className="facturas-list">
                  {modalCliente.facturas.map(f => (
                    <li key={f._id || f.id}>
                      <span>{f.numeroFactura}</span>
                      <span>Q {f.monto} - {f.estado}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay facturas para este cliente</p>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setModalCliente({ ...modalCliente, visible: false })} className="btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FACTURAS VENCIDAS */}
      {modalVencidas.visible && (
        <div className="modal-overlay" onClick={() => setModalVencidas({ ...modalVencidas, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Facturas Vencidas</h3>
              <button onClick={() => setModalVencidas({ ...modalVencidas, visible: false })} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              {modalVencidas.facturas && modalVencidas.facturas.length > 0 ? (
                <ul className="facturas-list">
                  {modalVencidas.facturas.map(f => (
                    <li key={f._id || f.id}>
                      <span>{f.numeroFactura} - {f.cliente?.nombre}</span>
                      <span>Q {f.monto} - Vence: {new Date(f.fechaVencimiento).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay facturas vencidas</p>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setModalVencidas({ ...modalVencidas, visible: false })} className="btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FACTURAS PRÓXIMAS */}
      {modalProximas.visible && (
        <div className="modal-overlay" onClick={() => setModalProximas({ ...modalProximas, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Facturas Próximas a Vencer</h3>
              <button onClick={() => setModalProximas({ ...modalProximas, visible: false })} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              {modalProximas.facturas && modalProximas.facturas.length > 0 ? (
                <ul className="facturas-list">
                  {modalProximas.facturas.map(f => (
                    <li key={f._id || f.id}>
                      <span>{f.numeroFactura} - {f.cliente?.nombre}</span>
                      <span>Q {f.monto} - Vence: {new Date(f.fechaVencimiento).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay facturas próximas a vencer</p>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setModalProximas({ ...modalProximas, visible: false })} className="btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXPORTAR */}
      {modalExportar && (
        <div className="modal-overlay" onClick={() => setModalExportar(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Exportar Facturas por Cobrar</h3>
              <button onClick={() => setModalExportar(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <p>¿Deseas exportar todas las facturas por cobrar a un archivo Excel?</p>
              <p className="info">Se exportarán <strong>{facturas.length}</strong> facturas.</p>
            </div>
            <div className="modal-footer">
              <button onClick={handleExportar} className="btn-success">Exportar</button>
              <button onClick={() => setModalExportar(false)} className="btn-secondary">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
