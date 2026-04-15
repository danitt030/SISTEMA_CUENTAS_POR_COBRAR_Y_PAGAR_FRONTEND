import { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useFacturasPorCobrar } from "../../shared/hooks/useFacturasPorCobrar";
import { StatsSection } from "../Common/StatsSection";
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
import "../../styles/modules.css";

export const FacturasPorCobrar = ({ onBack }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Estados para modales
  const [modalSaldo, setModalSaldo] = useState({ visible: false, factura: null, saldo: null });
  const [modalCliente, setModalCliente] = useState({ visible: false, clienteId: null, facturas: null });
  const [modalVencidas, setModalVencidas] = useState({ visible: false, facturas: null });
  const [modalProximas, setModalProximas] = useState({ visible: false, facturas: null });
  const [modalExportar, setModalExportar] = useState(false);
  const [modalDesactivar, setModalDesactivar] = useState({ visible: false, factura: null });
  const [modalEliminar, setModalEliminar] = useState({ visible: false, factura: null });
  const [modalMarcarVencida, setModalMarcarVencida] = useState({ visible: false, facturaId: null });

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
  }, [obtenerFacturas]);

  // Filtrar facturas por estado (valor derivado - sin setState en effect)
  const facturasFiltradas = useMemo(() => {
    if (filtroEstado) {
      return facturas.filter((f) => f.estado === filtroEstado);
    }
    return facturas;
  }, [facturas, filtroEstado]);

  const statsMapped = useMemo(() => {
    const total = facturas.length;
    const pendientes = facturas.filter((f) => f.estado === "PENDIENTE").length;
    const parciales = facturas.filter((f) => f.estado === "PARCIAL").length;
    const cobradas = facturas.filter((f) => f.estado === "COBRADA").length;

    return [
      { label: "Total Facturas", value: total.toString(), color: "#0d6efd" },
      { label: "Pendientes", value: pendientes.toString(), color: "#f59e0b" },
      { label: "Parciales", value: parciales.toString(), color: "#06b6d4" },
      { label: "Cobradas", value: cobradas.toString(), color: "#22c55e" },
    ];
  }, [facturas]);

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

  const handleToggleEstadoFactura = async (factura) => {
    if (!puedeDesactivarFactura) {
      toast.error("No tienes permisos para desactivar facturas");
      return;
    }
    setModalDesactivar({ visible: true, factura });
  };

  const handleConfirmarDesactivar = async () => {
    if (!modalDesactivar.factura) return;
    
    const factura = modalDesactivar.factura;
    const esActivo = factura.activo !== false;
    
    let exito;
    if (esActivo === false) {
      // Reactivar
      exito = await actualizarFacturaFunc(factura._id, { activo: true });
    } else {
      // Desactivar
      exito = await desactivarFacturaFunc(factura._id);
    }
    
    if (exito && !exito.error) {
      toast.success(esActivo ? "Factura desactivada" : "Factura reactivada");
      setModalDesactivar({ visible: false, factura: null });
      obtenerFacturas();
      setShowDetail(false);
    } else {
      toast.error("Error al procesar la acción");
    }
  };

  const handleEliminarPermanente = async (factura) => {
    setModalEliminar({ visible: true, factura });
  };

  const handleConfirmarEliminar = async () => {
    if (!modalEliminar.factura) return;

    const result = await eliminarFacturaFunc(modalEliminar.factura._id);
    if (!result.error) {
      toast.success("Factura eliminada permanentemente");
      setModalEliminar({ visible: false, factura: null });
      await obtenerFacturas();
    } else {
      toast.error(result.message || "Error al eliminar factura");
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

  // const handleDetalleClick = (factura) => {
  //   setSelectedFactura(factura);
  //   setShowDetail(true);
  // };

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

    setModalMarcarVencida({ visible: true, facturaId: id });
  };

  const handleConfirmarMarcarVencida = async () => {
    if (!modalMarcarVencida.facturaId) return;

    const result = await marcarFacturaVencidaFunc(modalMarcarVencida.facturaId);
    if (!result.error) {
      toast.success("Factura marcada como vencida");
      setModalMarcarVencida({ visible: false, facturaId: null });
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
      <div className="module-container">
        <div className="alert alert-danger" style={{ margin: "20px" }}>
          <strong>Acceso Denegado</strong>
          <p>No tienes permisos para acceder al módulo de Facturas por Cobrar</p>
          <p>Para ver tus facturas, accede a "Mi Portal" desde tu dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="module-container table-density-compact">
      <div className="module-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          {onBack && (
            <button
              onClick={onBack}
              className="btn btn-primary"
              style={{ padding: '8px 12px', fontSize: '14px' }}
            >
              ← Volver
            </button>
          )}
          <h2>Facturas por Cobrar</h2>
        </div>
        <div className="header-acciones">
          {puedeCrearFactura && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-primary"
            >
              {showForm ? "Cancelar" : "Nueva Factura"}
            </button>
          )}
          {puedeVerVencidas && (
            <button onClick={handleVerVencidas} className="btn btn-warning" title="Ver Facturas Vencidas">Vencidas</button>
          )}
          {puedeVerProximas && (
            <button onClick={handleVerProximas} className="btn btn-info" title="Ver Facturas Próximas a Vencer">Próximas</button>
          )}
          {puedeExportar && (
            <button onClick={() => setModalExportar(true)} className="btn btn-secondary" title="Exportar a Excel">Exportar</button>
          )}
          {puedeAccederIA && (
            <button onClick={handlePreguntarIA} className="btn btn-ia" title="Preguntar IA sobre Facturas">Preguntar IA</button>
          )}
        </div>
      </div>

      <div className="facturas-cobrar-stats">
        <StatsSection stats={statsMapped} loading={loading} />
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>{isEditing ? "Editar Factura" : "Nueva Factura"}</h3>
              <button className="close-btn" onClick={handleCloseForm}>×</button>
            </div>
            <div className="modal-body">
              <FacturaPorCobrarForm
                onSubmit={isEditing ? handleEditarFactura : handleCrearFactura}
                factura={isEditing ? selectedFactura : null}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        </div>
      )}

      {showDetail && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Detalle de Factura</h3>
              <button className="close-btn" onClick={handleCloseDetail}>×</button>
            </div>
            <div className="modal-body">
              <FacturaPorCobrarDetail
                factura={selectedFactura}
                onClose={handleCloseDetail}
              />
            </div>
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
          onToggleEstado={puedeDesactivarFactura ? (factura) => handleToggleEstadoFactura(factura) : null}
          onVerSaldo={puedeVerSaldo ? handleVerSaldo : null}
          onVerFacturasCliente={puedeVerFacturasCliente ? handleVerFacturasCliente : null}
          onMarcarVencida={puedeMarcarVencida ? handleMarcarVencida : null}
          onEnviarRecordatorio={puedeEnviarRecordatorio ? handleEnviarRecordatorio : null}
          onEliminarPermanente={puedeEliminarFactura ? (factura) => handleEliminarPermanente(factura) : null}
          loading={loading}
        />
      </div>

      {/* MODAL SALDO */}
      {modalSaldo.visible && (
        <div className="modal-overlay" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Saldo de Facturas - {modalSaldo.factura?.cliente?.nombre}</h3>
              <button onClick={() => setModalSaldo({ ...modalSaldo, visible: false })} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              {modalSaldo.saldo && (
                <div className="saldo-info">
                  <div className="info-item">
                    <span className="label">Total Asignado:</span>
                    <span className="value">Q {modalSaldo.saldo.saldo?.totalAsignado?.toLocaleString() || 0}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Total Cobrado:</span>
                    <span className="value success">Q {modalSaldo.saldo.saldo?.totalCobrado?.toLocaleString() || 0}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Total Pendiente:</span>
                    <span className="value warning">Q {modalSaldo.saldo.saldo?.totalPendiente?.toLocaleString() || 0}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setModalSaldo({ ...modalSaldo, visible: false })} className="btn btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FACTURAS POR CLIENTE */}
      {modalCliente.visible && (
        <div className="modal-overlay" onClick={() => setModalCliente({ ...modalCliente, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Facturas del Cliente {modalCliente.clienteNombre ? `- ${modalCliente.clienteNombre}` : ""}</h3>
              <button onClick={() => setModalCliente({ ...modalCliente, visible: false })} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              {modalCliente.facturas && modalCliente.facturas.length > 0 ? (
                <ul className="facturas-list">
                  {modalCliente.facturas.map(f => (
                    <li key={f._id || f.id}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}>{f.numeroFactura}</span>
                        <span style={{ fontSize: '13px', color: '#666' }}>{new Date(f.fechaEmision).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '700' }}>Q {f.monto?.toLocaleString()}</span>
                        <span className={`status-badge status-${f.estado?.toLowerCase()}`}>{f.estado}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p>No hay facturas para este cliente</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setModalCliente({ ...modalCliente, visible: false })} className="btn btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FACTURAS VENCIDAS */}
      {modalVencidas.visible && (
        <div className="modal-overlay" onClick={() => setModalVencidas({ ...modalVencidas, visible: false })}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Facturas Vencidas</h3>
              <button onClick={() => setModalVencidas({ ...modalVencidas, visible: false })} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              {modalVencidas.facturas && modalVencidas.facturas.length > 0 ? (
                <ul className="facturas-list">
                  {modalVencidas.facturas.map(f => (
                    <li key={f._id || f.id}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}>{f.numeroFactura} - {f.cliente?.nombre}</span>
                        <span style={{ fontSize: '12px', color: '#ef4444' }}>Venció: {new Date(f.fechaVencimiento).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '700' }}>Q {f.monto?.toLocaleString()}</span>
                        <span className="status-badge status-vencida">Vencida</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p>No hay facturas vencidas</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setModalVencidas({ ...modalVencidas, visible: false })} className="btn btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FACTURAS PRÓXIMAS */}
      {modalProximas.visible && (
        <div className="modal-overlay" onClick={() => setModalProximas({ ...modalProximas, visible: false })}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Facturas Próximas a Vencer</h3>
              <button onClick={() => setModalProximas({ ...modalProximas, visible: false })} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              {modalProximas.facturas && modalProximas.facturas.length > 0 ? (
                <ul className="facturas-list">
                  {modalProximas.facturas.map(f => (
                    <li key={f._id || f.id}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}>{f.numeroFactura} - {f.cliente?.nombre}</span>
                        <span style={{ fontSize: '12px', color: '#f59e0b' }}>Vence el: {new Date(f.fechaVencimiento).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '700' }}>Q {f.monto?.toLocaleString()}</span>
                        <span className="status-badge status-pendiente">Próxima</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p>No hay facturas próximas a vencer</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setModalProximas({ ...modalProximas, visible: false })} className="btn btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXPORTAR */}
      {modalExportar && (
        <div className="modal-overlay" onClick={() => setModalExportar(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Exportar Facturas por Cobrar</h3>
              <button onClick={() => setModalExportar(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#374151', marginBottom: '12px' }}>¿Deseas exportar todas las facturas a un archivo Excel?</p>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>Total facturas: <strong style={{ color: '#111827' }}>{facturas.length}</strong></p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setModalExportar(false)} className="btn btn-secondary">Cancelar</button>
              <button onClick={handleExportar} className="btn btn-success" disabled={loading}>
                {loading ? "Exportando..." : "Exportar a Excel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR DESACTIVAR */}
      {modalDesactivar.visible && (
        <div className="modal-overlay" onClick={() => setModalDesactivar({ visible: false, factura: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Desactivar Factura</h3>
              <button className="close-btn" onClick={() => setModalDesactivar({ visible: false, factura: null })}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#374151', marginBottom: '12px' }}>¿Está seguro de que desea desactivar la factura <strong>{modalDesactivar.factura?.numeroFactura}</strong>?</p>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>La factura será marcada como inactiva pero sus datos se conservarán.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalDesactivar({ visible: false, factura: null })}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleConfirmarDesactivar} style={{ backgroundColor: '#dc2626' }}>Sí, Desactivar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINAR */}
      {modalEliminar.visible && (
        <div className="modal-overlay" onClick={() => setModalEliminar({ visible: false, factura: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Eliminar Factura Permanentemente</h3>
              <button className="close-btn" onClick={() => setModalEliminar({ visible: false, factura: null })}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#dc2626', marginBottom: '12px', fontWeight: 'bold' }}>ADVERTENCIA: Esta accion es irreversible.</p>
              <p style={{ color: '#374151', marginBottom: '8px' }}>¿Está seguro de que desea eliminar permanentemente la factura <strong>{modalEliminar.factura?.numeroFactura}</strong>?</p>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>Todos los datos asociados serán eliminados del sistema.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalEliminar({ visible: false, factura: null })}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleConfirmarEliminar} style={{ backgroundColor: '#000000' }}>Si, eliminar permanentemente</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR MARCAR VENCIDA */}
      {modalMarcarVencida.visible && (
        <div className="modal-overlay" onClick={() => setModalMarcarVencida({ visible: false, facturaId: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ animation: 'fadeInZoom 0.3s ease-out' }}>
            <div className="modal-header">
              <h3>Marcar factura como vencida</h3>
              <button className="close-btn" onClick={() => setModalMarcarVencida({ visible: false, facturaId: null })}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#374151', marginBottom: '12px' }}>¿Deseas marcar esta factura como vencida?</p>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>Esta acción actualizará su estado para priorizar seguimiento.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalMarcarVencida({ visible: false, facturaId: null })}>Cancelar</button>
              <button className="btn btn-warning" onClick={handleConfirmarMarcarVencida}>Sí, marcar vencida</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
