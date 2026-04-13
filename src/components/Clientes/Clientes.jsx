import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useClientes } from "../../shared/hooks/useClientes";
import { useClientesStats } from "../../shared/hooks/useClientesStats";
import { StatsSection } from "../Common/StatsSection";
import { ClienteForm } from "./ClienteForm";
import { ClienteList } from "./ClienteList";
import toast from "react-hot-toast";
import {
  puedeVerClientes,
  puedeCrearCliente,
  puedeEditarCliente,
  puedeDesactivarCliente,
  puedeEliminarCliente,
  puedeExportarClientes,
  puedeVerClientesPorGerente
} from "../../utils/roleUtils";
import "./clientes.css";

export const Clientes = () => {
  const { user } = useContext(AuthContext);
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
    obtenerClientesPorGerenteFunc,
    verificarLimiteCreditoFunc,
    exportarClientesFunc,
  } = useClientes();

  const { stats, loading: statsLoading } = useClientesStats();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [modalSaldo, setModalSaldo] = useState({ visible: false, cliente: null, saldo: null });
  const [modalCredito, setModalCredito] = useState({ visible: false, cliente: null, verificacion: null });
  const [modalExportar, setModalExportar] = useState(false);
  const [modalPorGerente, setModalPorGerente] = useState({ visible: false, gerenteId: null, clientes: [], loading: false });

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
      if (clienteEditar) {
        const resultado = await actualizarClienteFunc(clienteEditar.id, datos);
        if (!resultado.error) {
          setClienteEditar(null);
          setMostrarFormulario(false);
          await cargarClientes();
          return { error: false };
        }
        return resultado;
      } else {
        const resultado = await crearCliente(datos);
        if (!resultado.error) {
          setMostrarFormulario(false);
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
    const resultado = await obtenerSaldoClienteFunc(cliente.id || cliente._id);
    if (!resultado.error) {
      setModalSaldo({ visible: true, cliente, saldo: resultado.data });
    } else {
      toast.error("Error al obtener saldo del cliente");
    }
  };

  const handleVerificaCredito = async (cliente) => {
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

  const handleVerClientesPorGerente = async (gerenteId) => {
    setModalPorGerente({ ...modalPorGerente, loading: true });
    const resultado = await obtenerClientesPorGerenteFunc(gerenteId, 100, 0);
    if (!resultado.error) {
      setModalPorGerente({
        visible: true,
        gerenteId,
        clientes: resultado.data || [],
        loading: false
      });
    } else {
      toast.error("Error al obtener clientes del gerente");
      setModalPorGerente({ ...modalPorGerente, loading: false });
    }
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.numeroDocumento?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.nit?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.correo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ==================== VERIFICACIONES DE PERMISOS ====================
  const tieneAcceso = puedeVerClientes(user?.rol);
  const puedeCr = puedeCrearCliente(user?.rol);
  const puedeEd = puedeEditarCliente(user?.rol);
  const puedeDesc = puedeDesactivarCliente(user?.rol);
  const puedeElim = puedeEliminarCliente(user?.rol);
  const puedeExp = puedeExportarClientes(user?.rol);
  const puedeVerPorGer = puedeVerClientesPorGerente(user?.rol);

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
    <div className="clientes-container">
      <div className="clientes-header">
        <h2>Gestión de Clientes</h2>
        <div className="header-acciones">
          {puedeCr && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setMostrarFormulario(!mostrarFormulario);
                setClienteEditar(null);
              }}
            >
              {mostrarFormulario ? "Cancelar" : "+ Nuevo Cliente"}
            </button>
          )}
          {puedeExp && (
            <button
              className="btn btn-secondary"
              onClick={() => setModalExportar(true)}
              title="Exportar a Excel"
            >
              📊 Exportar
            </button>
          )}
          {puedeVerPorGer && (
            <button
              className="btn btn-info"
              onClick={() => setModalPorGerente({ ...modalPorGerente, visible: true })}
              title="Ver Clientes por Gerente"
            >
              👤 Ver por Gerente
            </button>
          )}
        </div>
      </div>

      {/* ESTADÍSTICAS RÁPIDAS */}
      <StatsSection stats={statsMapped} loading={statsLoading} />

      {error && <div className="alert alert-danger">{error}</div>}

      {mostrarFormulario && puedeCr && (
        <div className="formulario-section">
          <h3>{clienteEditar ? "Editar Cliente" : "Crear Nuevo Cliente"}</h3>
          <ClienteForm
            cliente={clienteEditar}
            onSubmit={handleSubmitCliente}
            loading={loading}
          />
        </div>
      )}

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
          setClienteEditar(c);
          setMostrarFormulario(true);
        }}
        onDelete={(id) => {
          if (!puedeDesc) {
            toast.error("No tienes permiso para desactivar clientes");
            return;
          }
          handleDesactivar(id);
        }}
        onVerSaldo={handleVerSaldo}
        onVerificaCredito={handleVerificaCredito}
        onEliminarPermanente={(id) => {
          if (!puedeElim) {
            toast.error("No tienes permiso para eliminar clientes");
            return;
          }
          handleEliminarPermanente(id);
        }}
      />

      {/* MODAL SALDO */}
      {modalSaldo.visible && (
        <div className="modal-overlay" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                    <span>{modalCredito.verificacion.puedeCreditoAdicional ? "✅ Sí" : "❌ No"}</span>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                {loading ? "Exportando..." : "📊 Exportar a Excel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CLIENTES POR GERENTE */}
      {modalPorGerente.visible && (
        <div className="modal-overlay" onClick={() => setModalPorGerente({ ...modalPorGerente, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>👤 Clientes por Gerente</h3>
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
    </div>
  );
};
