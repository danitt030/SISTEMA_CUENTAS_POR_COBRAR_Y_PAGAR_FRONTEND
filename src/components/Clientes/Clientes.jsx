import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useClientes } from "../../shared/hooks/useClientes";
import { useClientesStats } from "../../shared/hooks/useClientesStats";
import { StatsSection } from "../Common/StatsSection";
import { ClienteForm } from "./ClienteForm";
import { ClienteList } from "./ClienteList";
import toast from "react-hot-toast";
import {
  puedeVerClientes,
  puedeEditarCliente,
  puedeDesactivarCliente,
  puedeEliminarCliente,
  puedeExportarClientes,
  puedeVerClientesPorGerente,
  puedeObtenerSaldoCliente,
  puedeVerificaLimiteCredito
} from "../../utils/roleUtils";
import "./clientes.css";

export const Clientes = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    clientes,
    loading,
    error,
    obtenerClientes,
    crearCliente,
    actualizarClienteFunc,
    desactivarClienteFunc,
    eliminarClienteFunc,
    obtenerSaldoClienteFunc,
    verificarLimiteCreditoFunc,
    exportarClientesFunc,
  } = useClientes();

  const { stats, loading: statsLoading } = useClientesStats();

  const [busqueda, setBusqueda] = useState("");
  const [modalSaldo, setModalSaldo] = useState({ visible: false, cliente: null, saldo: null });
  const [modalCredito, setModalCredito] = useState({ visible: false, cliente: null, verificacion: null });
  const [modalExportar, setModalExportar] = useState(false);
  const [modalPorGerente, setModalPorGerente] = useState({ visible: false, gerenteId: null, clientes: [], loading: false });
  const [modalDesactivar, setModalDesactivar] = useState({ visible: false, cliente: null });
  const [modalEliminar, setModalEliminar] = useState({ visible: false, cliente: null });
  const [modalEditar, setModalEditar] = useState({ visible: false, cliente: null });

  useEffect(() => {
    cargarClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obtenerClientes]);

  const cargarClientes = async () => {
    const resultado = await obtenerClientes(100, 0);
    if (resultado.error) {
      toast.error(resultado.message || "Error al cargar clientes");
    }
  };

  const handleSubmitCliente = async (datos) => {
    try {
      if (modalEditar.cliente) {
        const resultado = await actualizarClienteFunc(modalEditar.cliente.id, datos);
        if (!resultado.error) {
          setModalEditar({ visible: false, cliente: null });
          await cargarClientes();
          return { error: false };
        }
        return resultado;
      } else {
        const resultado = await crearCliente(datos);
        if (!resultado.error) {
          await cargarClientes();
          return { error: false };
        }
        return resultado;
      }
    } catch (err) {
      return { error: true, message: err.message };
    }
  };

  const handleDesactivar = async (id) => {
    const resultado = await desactivarClienteFunc(id);
    if (!resultado.error) {
      toast.success("Cliente desactivado");
      await cargarClientes();
    } else {
      toast.error(resultado.message || "Error al desactivar");
    }
  };

  const handleVerSaldo = async (cliente) => {
    if (!puedeSaldo) {
      toast.error("No tienes permisos para ver el saldo");
      return;
    }
    const resultado = await obtenerSaldoClienteFunc(cliente.id || cliente._id);
    if (!resultado.error) {
      setModalSaldo({ visible: true, cliente, saldo: resultado.data });
    } else {
      toast.error("Error al obtener saldo del cliente");
    }
  };

  const handleVerificaCredito = async (cliente) => {
    if (!puedeCredito) {
      toast.error("No tienes permisos para verificar el límite de crédito");
      return;
    }
    const resultado = await verificarLimiteCreditoFunc(cliente.id || cliente._id);
    if (!resultado.error) {
      setModalCredito({ visible: true, cliente, verificacion: resultado.data });
    } else {
      toast.error("Error al verificar límite de crédito");
    }
  };

  const handleEliminarPermanente = async (id) => {
    const resultado = await eliminarClienteFunc(id);
    if (!resultado.error) {
      toast.success("Cliente eliminado permanentemente");
      await cargarClientes();
    } else {
      toast.error("Error al eliminar cliente");
    }
  };

  const handleExportar = async () => {
    const resultado = await exportarClientesFunc();
    if (!resultado.error) {
      toast.success("Archivo Excel generado correctamente");
      setModalExportar(false);
      // Opcional: descargar el archivo
    } else {
      toast.error("Error al exportar clientes");
    }
  };

  const clientesFiltrados = clientes.filter((c) => {
    // Si no hay búsqueda, retorna todos
    if (!busqueda || busqueda.trim() === "") {
      return true;
    }

    const busquedaLower = busqueda.toLowerCase().trim();
    return (
      (c.nombre || "").toLowerCase().includes(busquedaLower) ||
      (c.nombreContacto || "").toLowerCase().includes(busquedaLower) ||
      (c.numeroDocumento || "").toLowerCase().includes(busquedaLower) ||
      (c.nit || "").toLowerCase().includes(busquedaLower) ||
      (c.correo || "").toLowerCase().includes(busquedaLower) ||
      (c.correoContacto || "").toLowerCase().includes(busquedaLower)
    );
  });

  // ==================== VERIFICACIONES DE PERMISOS ====================
  const tieneAcceso = puedeVerClientes(user?.rol);
  const puedeEd = puedeEditarCliente(user?.rol);
  const puedeDesc = puedeDesactivarCliente(user?.rol);
  const puedeElim = puedeEliminarCliente(user?.rol);
  const puedeExp = puedeExportarClientes(user?.rol);
  const puedeVerPorGer = puedeVerClientesPorGerente(user?.rol);
  const puedeSaldo = puedeObtenerSaldoCliente(user?.rol);
  const puedeCredito = puedeVerificaLimiteCredito(user?.rol);

  // Objeto permisos con callbacks
  const permisos = {
    puedeEditar: puedeEd,
    puedeDesactivar: puedeDesc,
    puedeEliminar: puedeElim,
  };

  if (!tieneAcceso) {
    return (
      <div className="clientes-container">
        <div className="alert alert-danger" style={{ margin: "20px" }}>
          <strong>Acceso Denegado</strong>
          <p>No tienes permisos para acceder al módulo de Clientes</p>
        </div>
      </div>
    );
  }

  // Mapear estadísticas para el componente
  const statsMapped = [
    { label: "Total Clientes", value: stats.total.toString(), color: "#0d6efd" },
    { label: "Contado", value: stats.contado.toString(), color: "#198754" },
    { label: "Crédito", value: stats.credito.toString(), color: "#fd7e14" },
    { label: "Activos", value: stats.activos.toString(), color: "#28a745" },
  ];

  return (
    <div className="clientes-container module-container table-density-compact">
      <div className="clientes-header module-header">
        <h2>Gestión de Clientes</h2>
        <div className="header-acciones">
          {puedeExp && (
            <button
              className="btn btn-secondary"
              onClick={() => setModalExportar(true)}
              title="Exportar a Excel"
            >
              Exportar
            </button>
          )}
          <button
            className="btn btn-ia"
            onClick={() => navigate("/ia/cliente")}
            title="Preguntar IA sobre Clientes"
          >
            Preguntar IA
          </button>
          {puedeVerPorGer && (
            <button
              className="btn btn-info"
              onClick={() => setModalPorGerente({ ...modalPorGerente, visible: true })}
              title="Ver Clientes por Gerente"
            >
              Ver por Gerente
            </button>
          )}
        </div>
      </div>

      {/* ESTADÍSTICAS RÁPIDAS */}
      <div className="clientes-stats">
        <StatsSection stats={statsMapped} loading={statsLoading} />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="search-section">
        <input
          type="text"
          placeholder="Buscar por nombre, documento, NIT o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
      </div>

      <ClienteList
        clientes={clientesFiltrados}
        loading={loading}
        permisos={permisos}
        onEdit={(c) => {
          if (!puedeEd) {
            toast.error("No tienes permiso para editar clientes");
            return;
          }
          setModalEditar({ visible: true, cliente: c });
        }}
        onDelete={puedeDesc ? (cliente) => setModalDesactivar({ visible: true, cliente }) : null}
        onVerSaldo={puedeSaldo ? handleVerSaldo : null}
        onVerificaCredito={puedeCredito ? handleVerificaCredito : null}
        onEliminarPermanente={puedeElim ? (cliente) => setModalEliminar({ visible: true, cliente }) : null}
      />

      {/* MODAL SALDO */}
      {modalSaldo.visible && (
        <div className="modal-overlay" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Saldo de {modalSaldo.cliente?.nombre}</h3>
              <button className="close-btn" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>×</button>
            </div>
            <div className="modal-body">
              {modalSaldo.saldo && (
                <div className="saldo-info">
                  <div className="saldo-item">
                    <label>Saldo Pendiente:</label>
                    <span>Q{modalSaldo.saldo.saldoPendiente?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="saldo-item">
                    <label>Total Facturas:</label>
                    <span>Q{modalSaldo.saldo.totalFacturas?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="saldo-item">
                    <label>Total Pagado:</label>
                    <span>Q{modalSaldo.saldo.totalPagado?.toLocaleString() || "0"}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VERIFICACIÓN CRÉDITO */}
      {modalCredito.visible && (
        <div className="modal-overlay" onClick={() => setModalCredito({ ...modalCredito, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Verificación de Crédito - {modalCredito.cliente?.nombre}</h3>
              <button className="close-btn" onClick={() => setModalCredito({ ...modalCredito, visible: false })}>×</button>
            </div>
            <div className="modal-body">
              {modalCredito.verificacion && (
                <div className="credito-info">
                  <div className="credito-item">
                    <label>Límite de Crédito del Mes:</label>
                    <span>Q{modalCredito.verificacion.limiteCreditoMes?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="credito-item">
                    <label>Crédito Disponible:</label>
                    <span className="disponible">Q{modalCredito.verificacion.creditoDisponible?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="credito-item">
                    <label>Crédito Utilizado:</label>
                    <span>Q{modalCredito.verificacion.creditoUtilizado?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="credito-item">
                    <label>¿Puede Crédito Adicional?</label>
                    <span>{modalCredito.verificacion.puedeCreditoAdicional ? "Si" : "No"}</span>
                  </div>
                  <div className="credito-item">
                    <label>Condición de Pago:</label>
                    <span>{modalCredito.verificacion.condicionPago}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalCredito({ ...modalCredito, visible: false })}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXPORTAR */}
      {modalExportar && (
        <div className="modal-overlay" onClick={() => setModalExportar(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Exportar Clientes</h3>
              <button className="close-btn" onClick={() => setModalExportar(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>¿Deseas exportar todos los clientes activos a un archivo Excel?</p>
              <p className="total-clientes">Total clientes a exportar: <strong>{clientes.filter(c => c.estado).length}</strong></p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalExportar(false)}>
                Cancelar
              </button>
              <button className="btn btn-success" onClick={handleExportar} disabled={loading}>
                {loading ? "Exportando..." : "Exportar a Excel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CLIENTES POR GERENTE */}
      {modalPorGerente.visible && (
        <div className="modal-overlay" onClick={() => setModalPorGerente({ ...modalPorGerente, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Clientes por Gerente</h3>
              <button className="close-btn" onClick={() => setModalPorGerente({ ...modalPorGerente, visible: false })}>×</button>
            </div>
            <div className="modal-body">
              {modalPorGerente.loading ? (
                <p>Cargando clientes...</p>
              ) : modalPorGerente.clientes.length === 0 ? (
                <p>No hay clientes asignados a este gerente</p>
              ) : (
                <div className="clientes-por-gerente-list">
                  <table>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Documento</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Condición Pago</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalPorGerente.clientes.map((cliente) => (
                        <tr key={cliente.id || cliente._id}>
                          <td>{cliente.nombre}</td>
                          <td>{cliente.tipoDocumento}: {cliente.numeroDocumento}</td>
                          <td>{cliente.correo}</td>
                          <td>{cliente.telefono}</td>
                          <td>
                            <span style={{
                              backgroundColor: cliente.condicionPago === "CONTADO" ? "#28a745" : "#fd7e14",
                              color: "#fff",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                            }}>
                              {cliente.condicionPago === "CONTADO" ? "Contado" : "Crédito"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalPorGerente({ ...modalPorGerente, visible: false })}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR DESACTIVAR */}
      {modalDesactivar.visible && (
        <div className="modal-overlay" onClick={() => setModalDesactivar({ visible: false, cliente: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Desactivar Cliente</h3>
              <button className="close-btn" onClick={() => setModalDesactivar({ visible: false, cliente: null })}>×</button>
            </div>
            <div className="modal-body">
              <p>¿Está seguro de que desea desactivar a <strong>{modalDesactivar.cliente?.nombre}</strong>?</p>
              <p style={{ marginTop: '10px', color: '#6b7280', fontSize: '14px' }}>El cliente será marcado como inactivo pero sus datos se conservarán.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalDesactivar({ visible: false, cliente: null })}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={() => {
                if (modalDesactivar.cliente) {
                  handleDesactivar(modalDesactivar.cliente.id || modalDesactivar.cliente._id);
                  setModalDesactivar({ visible: false, cliente: null });
                }
              }} style={{ backgroundColor: '#dc2626' }}>
                Sí, Desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINAR */}
      {modalEliminar.visible && (
        <div className="modal-overlay" onClick={() => setModalEliminar({ visible: false, cliente: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Eliminar Cliente Permanentemente</h3>
              <button className="close-btn" onClick={() => setModalEliminar({ visible: false, cliente: null })}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Advertencia:</strong> Esta accion es irreversible.</p>
              <p>¿Está seguro de que desea eliminar permanentemente a <strong>{modalEliminar.cliente?.nombre}</strong>?</p>
              <p style={{ marginTop: '10px', color: '#991b1b', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
                Todos los datos asociados a este cliente serán eliminados del sistema.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalEliminar({ visible: false, cliente: null })}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={() => {
                if (modalEliminar.cliente) {
                  handleEliminarPermanente(modalEliminar.cliente.id || modalEliminar.cliente._id);
                  setModalEliminar({ visible: false, cliente: null });
                }
              }} style={{ backgroundColor: '#000000' }}>
                Si, eliminar permanentemente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR CLIENTE */}
      {modalEditar.visible && (
        <div className="modal-overlay" onClick={() => setModalEditar({ visible: false, cliente: null })}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Editar Cliente</h3>
              <button className="close-btn" onClick={() => setModalEditar({ visible: false, cliente: null })}>×</button>
            </div>
            <div className="modal-body">
              <ClienteForm
                cliente={modalEditar.cliente}
                onSubmit={async (datos) => {
                  const resultado = await handleSubmitCliente(datos);
                  if (!resultado.error) {
                    setModalEditar({ visible: false, cliente: null });
                  }
                  return resultado;
                }}
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInZoom {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};
