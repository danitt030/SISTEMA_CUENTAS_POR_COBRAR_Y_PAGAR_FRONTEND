import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import useProveedores from "../../shared/hooks/useProveedores";
import useProveedoresStats from "../../shared/hooks/useProveedoresStats";
import { StatsSection } from "../Common/StatsSection";
import { ProveedorForm } from "./ProveedorForm";
import { ProveedorList } from "./ProveedorList";
import { puedeCrearProveedor, puedeEditarProveedor, puedeDesactivarProveedor, puedeEliminarProveedores, puedeVerProveedores, puedeObtenerSaldoProveedor, puedeExportarProveedores } from "../../utils/roleUtils";
import toast from "react-hot-toast";
import "./proveedor.css";

export const Proveedores = ({ onBack }) => {
  const { user } = useContext(AuthContext);
  const {
    proveedores,
    loading,
    error,
    obtenerProveedores,
    crearProveedor,
    actualizarProveedorFunc,
    desactivarProveedorFunc,
    eliminarProveedorFunc,
    obtenerSaldoProveedorFunc,
    exportarProveedoresFunc,
  } = useProveedores();

  const { stats, loading: statsLoading } = useProveedoresStats();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proveedorEditar, setProveedorEditar] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [modalSaldo, setModalSaldo] = useState({ visible: false, proveedor: null, saldo: null });
  const [modalExportar, setModalExportar] = useState(false);
  const [modalDesactivar, setModalDesactivar] = useState({ visible: false, proveedor: null });
  const [modalEliminar, setModalEliminar] = useState({ visible: false, proveedor: null });

  useEffect(() => {
    cargarProveedores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obtenerProveedores]);

  const cargarProveedores = async () => {
    const resultado = await obtenerProveedores(100, 0);
    if (resultado.error) {
      toast.error(resultado.message || "Error al cargar proveedores");
    }
  };

  const handleSubmitProveedor = async (datos) => {
    try {
      if (proveedorEditar) {
        const resultado = await actualizarProveedorFunc(proveedorEditar.id, datos);
        if (!resultado.error) {
          setProveedorEditar(null);
          setMostrarFormulario(false);
          await cargarProveedores();
          return { error: false };
        }
        return resultado;
      } else {
        const resultado = await crearProveedor(datos);
        if (!resultado.error) {
          setMostrarFormulario(false);
          await cargarProveedores();
          return { error: false };
        }
        return resultado;
      }
    } catch (err) {
      return { error: true, message: err.message };
    }
  };

  const handleDesactivar = async (id) => {
    const resultado = await desactivarProveedorFunc(id);
    if (!resultado.error) {
      toast.success("Proveedor desactivado");
      setModalDesactivar({ visible: false, proveedor: null });
      await cargarProveedores();
    } else {
      toast.error(resultado.message || "Error al desactivar");
    }
  };

  const handleVerSaldo = async (proveedor) => {
    if (!puedeVerSaldo) {
      toast.error("No tienes permisos para ver el saldo");
      return;
    }
    const resultado = await obtenerSaldoProveedorFunc(proveedor.id || proveedor._id);
    if (!resultado.error) {
      setModalSaldo({ visible: true, proveedor, saldo: resultado.data });
    } else {
      toast.error("Error al obtener saldo del proveedor");
    }
  };

  const handleEliminarPermanente = async (id) => {
    const resultado = await eliminarProveedorFunc(id);
    if (!resultado.error) {
      toast.success("Proveedor eliminado permanentemente");
      setModalEliminar({ visible: false, proveedor: null });
      await cargarProveedores();
    } else {
      toast.error("Error al eliminar proveedor");
    }
  };

  const handleExportar = async () => {
    if (!puedeExportarFunc) {
      toast.error("No tienes permisos para exportar proveedores");
      return;
    }
    const resultado = await exportarProveedoresFunc();
    if (!resultado.error) {
      toast.success("Archivo Excel generado correctamente");
      setModalExportar(false);
    } else {
      toast.error("Error al exportar proveedores");
    }
  };

  const proveedoresFiltrados = proveedores.filter((p) => {
    // Si no hay búsqueda, retorna todos
    if (!busqueda || busqueda.trim() === "") {
      return true;
    }

    const busquedaLower = busqueda.toLowerCase().trim();
    return (
      (p.nombre || "").toLowerCase().includes(busquedaLower) ||
      (p.nombreContacto || "").toLowerCase().includes(busquedaLower) ||
      (p.numeroDocumento || "").toLowerCase().includes(busquedaLower) ||
      (p.nit || "").toLowerCase().includes(busquedaLower) ||
      (p.correo || "").toLowerCase().includes(busquedaLower) ||
      (p.correoContacto || "").toLowerCase().includes(busquedaLower)
    );
  });

  // Verificar permisos del usuario actual
  const tieneAcceso = puedeVerProveedores(user?.rol);
  const puedeCrearProveedores = puedeCrearProveedor(user?.rol);
  const puedeEditarProveedores = puedeEditarProveedor(user?.rol);
  const puedeDesactivarProveedores = puedeDesactivarProveedor(user?.rol);
  const puedeEliminarProveedoresFunc = puedeEliminarProveedores(user?.rol);
  const puedeVerSaldo = puedeObtenerSaldoProveedor(user?.rol);
  const puedeExportarFunc = puedeExportarProveedores(user?.rol);

  // Mapear estadísticas para el componente
  const statsMapped = [
    { label: "Total Proveedores", value: stats.total.toString(), color: "#0d6efd" },
    { label: "Contado", value: stats.contado.toString(), color: "#198754" },
    { label: "Crédito", value: stats.credito.toString(), color: "#fd7e14" },
    { label: "Activos", value: stats.activos.toString(), color: "#28a745" },
  ];

  if (!tieneAcceso) {
    return (
      <div className="proveedores-container">
        <div className="alert alert-danger" style={{ margin: "20px" }}>
          <strong>Acceso Denegado</strong>
          <p>No tienes permisos para acceder al módulo de Proveedores</p>
        </div>
      </div>
    );
  }

  const handleCrearProveedor = async (datos) => {
    const resultado = await handleSubmitProveedor(datos);
    return resultado;
  };

  return (
    <div className="proveedores-container module-container table-density-compact">
      <div className="proveedores-header module-header">
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
          <h2>Gestión de Proveedores</h2>
        </div>
        {puedeCrearProveedores && (
          <button
            className="btn btn-primary"
            onClick={() => setMostrarFormulario(true)}
          >
            Nuevo Proveedor
          </button>
        )}
      </div>

      {/* ESTADÍSTICAS RÁPIDAS */}
      <StatsSection stats={statsMapped} loading={statsLoading} />

      {error && <div className="alert alert-danger">{error}</div>}

      {/* MODAL CREAR PROVEEDOR */}
      {mostrarFormulario && puedeCrearProveedores && (
        <div className="modal-overlay" onClick={() => { setMostrarFormulario(false); setProveedorEditar(null); }}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>{proveedorEditar ? "Editar Proveedor" : "Nuevo Proveedor"}</h3>
              <button className="close-btn" onClick={() => { setMostrarFormulario(false); setProveedorEditar(null); }}>×</button>
            </div>
            <div className="modal-body">
              <ProveedorForm
                proveedor={proveedorEditar}
                onSubmit={handleSubmitProveedor}
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR PROVEEDOR */}
      {proveedorEditar && mostrarFormulario && puedeEditarProveedores && (
        <div className="modal-overlay" onClick={() => { setMostrarFormulario(false); setProveedorEditar(null); }}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Editar Proveedor</h3>
              <button className="close-btn" onClick={() => { setMostrarFormulario(false); setProveedorEditar(null); }}>×</button>
            </div>
            <div className="modal-body">
              <ProveedorForm
                proveedor={proveedorEditar}
                onSubmit={handleSubmitProveedor}
                loading={loading}
              />
            </div>
          </div>
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

      <ProveedorList
        proveedores={proveedoresFiltrados}
        loading={loading}
        onEdit={(p) => {
          if (!puedeEditarProveedores) {
            toast.error("No tienes permiso para editar proveedores");
            return;
          }
          setProveedorEditar(p);
          setMostrarFormulario(true);
        }}
        onDelete={puedeDesactivarProveedores ? (proveedor) => setModalDesactivar({ visible: true, proveedor }) : null}
        onVerSaldo={puedeVerSaldo ? handleVerSaldo : null}
        onEliminarPermanente={puedeEliminarProveedoresFunc ? (proveedor) => setModalEliminar({ visible: true, proveedor }) : null}
      />

      {/* MODAL SALDO */}
      {modalSaldo.visible && (
        <div className="modal-overlay" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Saldo de {modalSaldo.proveedor?.nombre}</h3>
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

      {/* MODAL EXPORTAR */}
      {modalExportar && (
        <div className="modal-overlay" onClick={() => setModalExportar(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Exportar Proveedores</h3>
              <button className="close-btn" onClick={() => setModalExportar(false)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#374151', marginBottom: '12px' }}>¿Deseas exportar todos los proveedores activos a un archivo Excel?</p>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>Total proveedores a exportar: <strong style={{ color: '#111827' }}>{proveedores.filter(p => p.estado).length}</strong></p>
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

      {/* MODAL CONFIRMAR DESACTIVAR */}
      {modalDesactivar.visible && (
        <div className="modal-overlay" onClick={() => setModalDesactivar({ visible: false, proveedor: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Desactivar Proveedor</h3>
              <button className="close-btn" onClick={() => setModalDesactivar({ visible: false, proveedor: null })}>×</button>
            </div>
            <div className="modal-body">
              <p>¿Está seguro de que desea desactivar a <strong>{modalDesactivar.proveedor?.nombre}</strong>?</p>
              <p style={{ marginTop: '10px', color: '#6b7280', fontSize: '14px' }}>El proveedor será marcado como inactivo pero sus datos se conservarán.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalDesactivar({ visible: false, proveedor: null })}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={() => {
                if (modalDesactivar.proveedor) {
                  handleDesactivar(modalDesactivar.proveedor.id || modalDesactivar.proveedor._id);
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
        <div className="modal-overlay" onClick={() => setModalEliminar({ visible: false, proveedor: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Eliminar Proveedor Permanentemente</h3>
              <button className="close-btn" onClick={() => setModalEliminar({ visible: false, proveedor: null })}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>ADVERTENCIA:</strong> Esta acción es IRREVERSIBLE.</p>
              <p>¿Está seguro de que desea eliminar permanentemente a <strong>{modalEliminar.proveedor?.nombre}</strong>?</p>
              <p style={{ marginTop: '10px', color: '#991b1b', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
                Todos los datos asociados a este proveedor serán eliminados del sistema.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalEliminar({ visible: false, proveedor: null })}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={() => {
                if (modalEliminar.proveedor) {
                  handleEliminarPermanente(modalEliminar.proveedor.id || modalEliminar.proveedor._id);
                }
              }} style={{ backgroundColor: '#000000' }}>
                Sí, Eliminar Permanentemente
              </button>
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
