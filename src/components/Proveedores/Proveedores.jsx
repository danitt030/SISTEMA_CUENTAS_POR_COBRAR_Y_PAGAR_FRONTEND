import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import useProveedores from "../../shared/hooks/useProveedores";
import useProveedoresStats from "../../shared/hooks/useProveedoresStats";
import { StatsSection } from "../Common/StatsSection";
import { ProveedorForm } from "./ProveedorForm";
import { ProveedorList } from "./ProveedorList";
import { puedeCrearProveedor, puedeEditarProveedor, puedeDesactivarProveedor, puedeEliminarProveedores, puedeVerProveedores, puedeObtenerSaldoProveedor, puedeExportarProveedores } from "../../utils/roleUtils";
import toast from "react-hot-toast";
import "./proveedores.css";

export const Proveedores = () => {
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

  return (
    <div className="proveedores-container">
      <div className="proveedores-header">
        <h2>Gestión de Proveedores</h2>
        <div className="header-acciones">
          {puedeCrearProveedores && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setMostrarFormulario(!mostrarFormulario);
                setProveedorEditar(null);
              }}
            >
              {mostrarFormulario ? "Cancelar" : "+ Nuevo Proveedor"}
            </button>
          )}
          {puedeExportarFunc && (
            <button
              className="btn btn-secondary"
              onClick={() => setModalExportar(true)}
              title="Exportar a Excel"
            >
              📊 Exportar
            </button>
          )}
        </div>
      </div>

      {/* ESTADÍSTICAS RÁPIDAS */}
      <StatsSection stats={statsMapped} loading={statsLoading} />

      {error && <div className="alert alert-danger">{error}</div>}

      {mostrarFormulario && (puedeCrearProveedores || puedeEditarProveedores) && (
        <div className="formulario-section">
          <h3>{proveedorEditar ? "Editar Proveedor" : "Crear Nuevo Proveedor"}</h3>
          <ProveedorForm
            proveedor={proveedorEditar}
            onSubmit={handleSubmitProveedor}
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
        onDelete={puedeDesactivarProveedores ? (id) => handleDesactivar(id) : null}
        onVerSaldo={puedeVerSaldo ? handleVerSaldo : null}
        onEliminarPermanente={puedeEliminarProveedoresFunc ? (id) => handleEliminarPermanente(id) : null}
      />

      {/* MODAL SALDO */}
      {modalSaldo.visible && (
        <div className="modal-overlay" onClick={() => setModalSaldo({ ...modalSaldo, visible: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Exportar Proveedores</h3>
              <button className="close-btn" onClick={() => setModalExportar(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>¿Deseas exportar todos los proveedores activos a un archivo Excel?</p>
              <p className="total-proveedores">Total proveedores a exportar: <strong>{proveedores.filter(p => p.estado).length}</strong></p>
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
    </div>
  );
};
