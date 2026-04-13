import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import { usePagosProveedor } from "../../shared/hooks/usePagosProveedor";
import { useProveedores } from "../../shared/hooks/useProveedores";
import { useFacturasPorPagar } from "../../shared/hooks/useFacturasPorPagar";
import PagoForm from "./PagoForm";
import PagoList from "./PagoList";
import "./pagos.css";
import { AuthContext } from "../../context/AuthContext";
import { puedeVerPagos, puedeEliminarPagos, puedeCrearPago, puedeEditarPago, puedeDesactivarPago, puedeExportarPagos } from "../../utils/roleUtils";
import toast from "react-hot-toast";

const Pagos = () => {
  const { user } = useContext(AuthContext);
  const {
    pagos,
    loading,
    error,
    obtenerPagosProveedorFunc,
    obtenerPagoPorIdFunc,
    crearPagoFunc,
    actualizarPagoFunc,
    buscarPagosFiltradosFunc,
    desactivarPagoFunc,
    eliminarPagoFunc,
    obtenerSaldoPagoFunc,
    exportarPagosFunc,
  } = usePagosProveedor();

  const { proveedores, obtenerProveedores } = useProveedores();
  const { facturas: facturasPorPagar, obtenerFacturas } = useFacturasPorPagar();

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [searchProveedor, setSearchProveedor] = useState("");
  const [searchFechaInicio, setSearchFechaInicio] = useState("");
  const [searchFechaFin, setSearchFechaFin] = useState("");
  const [showDetalles, setShowDetalles] = useState(false);
  const [pagoDetalles, setPagoDetalles] = useState(null);
  const [loadingDetalles, setLoadingDetalles] = useState(false);
  const [saldos, setSaldos] = useState({});

  const stats = useMemo(() => {
    const total = pagos.filter((p) => p.activo).length;
    const suma = pagos
      .filter((p) => p.activo)
      .reduce((acc, p) => acc + (parseFloat(p.monto) || 0), 0);
    return { total, suma };
  }, [pagos]);

  const loadPagos = useCallback(async () => {
    await obtenerPagosProveedorFunc(1000, 0);
  }, [obtenerPagosProveedorFunc]);

  useEffect(() => {
    loadPagos();
    obtenerProveedores(1000, 0);
    obtenerFacturas(1000, 0);
  }, []);

  // ==================== VERIFICACIÓN DE RBAC ====================
  const tieneAcceso = puedeVerPagos(user?.rol);
  const puedeCrear = puedeCrearPago(user?.rol);
  const puedeEditar = puedeEditarPago(user?.rol);
  const puedeDesactivar = puedeDesactivarPago(user?.rol);
  const puedeExpo = puedeExportarPagos(user?.rol);

  if (!tieneAcceso) {
    return (
      <div className="pagos-container">
        <div className="alert alert-danger" style={{ margin: "20px" }}>
          <strong>Acceso Denegado</strong>
          <p>No tienes permisos para acceder al módulo de Pagos</p>
        </div>
      </div>
    );
  }

  const handleOpenForm = () => {
    setIsEditing(false);
    setSelectedPago(null);
    setShowForm(true);
  };

  const handleEditPago = (pago) => {
    if (!puedeEditar) {
      toast.error("No tienes permisos para editar pagos");
      return;
    }
    setIsEditing(true);
    setSelectedPago(pago);
    setShowForm(true);
  };

  const handleClosePago = () => {
    setShowForm(false);
    setIsEditing(false);
    setSelectedPago(null);
  };

  const handleSubmitForm = async (datos) => {
    try {
      if (isEditing && selectedPago) {
        const result = await actualizarPagoFunc(selectedPago._id || selectedPago.id, datos);
        if (!result.error) {
          handleClosePago();
          await loadPagos();
        }
      } else {
        const result = await crearPagoFunc(datos);
        if (!result.error) {
          handleClosePago();
          await loadPagos();
        }
      }
    } catch (err) {
      console.error("Error al guardar pago:", err);
    }
  };

  const handleDesactivarPago = async (id) => {
    if (!puedeDesactivar) {
      toast.error("No tienes permisos para desactivar pagos");
      return;
    }
    if (window.confirm("¿Desactivar este pago?")) {
      const result = await desactivarPagoFunc(id);
      if (result) {
        await loadPagos();
        toast.success("Pago desactivado correctamente");
      } else {
        toast.error("Error al desactivar el pago");
      }
    }
  };

  const handleEliminarPago = async (id) => {
    if (window.confirm("¿ELIMINAR PERMANENTEMENTE este pago?")) {
      const result = await eliminarPagoFunc(id);
      if (result) {
        await loadPagos();
        toast.success("Pago eliminado correctamente");
      } else {
        toast.error("Error al eliminar el pago");
      }
    }
  };

  const handleVerDetalles = async (pago) => {
    setLoadingDetalles(true);
    setPagoDetalles(pago);
    setShowDetalles(true);
    setLoadingDetalles(false);
  };

  const handleExportarPagos = async () => {
    if (!puedeExpo) {
      toast.error("No tienes permisos para exportar pagos");
      return;
    }
    const result = await exportarPagosFunc();
    if (!result.error) {
      console.log("Pagos exportados exitosamente");
      toast.success("Pagos exportados correctamente");
    }
  };

  const pagosFiltrados = pagos.filter((p) => {
    const nombreProveedor = (p.proveedor?.nombre || "").toLowerCase();
    const cumpleFiltroProveedor =
      searchProveedor === "" || nombreProveedor.includes(searchProveedor.toLowerCase());

    const fechaPago = new Date(p.fechaPago);
    const cumpleFiltroFecha =
      (!searchFechaInicio || fechaPago >= new Date(searchFechaInicio)) &&
      (!searchFechaFin || fechaPago <= new Date(searchFechaFin));

    return cumpleFiltroProveedor && cumpleFiltroFecha;
  });

  return (
    <div className="pagos-proveedor-container">
      <div className="header-section">
        <h1>Pagos a Proveedores</h1>
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-label">Total Pagos</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Suma Pagos</span>
            <span className="stat-value">Q{stats.suma.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-section">
        <input
          type="text"
          placeholder="Buscar por proveedor..."
          value={searchProveedor}
          onChange={(e) => setSearchProveedor(e.target.value)}
          className="filter-input"
        />
        <input
          type="date"
          value={searchFechaInicio}
          onChange={(e) => setSearchFechaInicio(e.target.value)}
          className="filter-input"
        />
        <input
          type="date"
          value={searchFechaFin}
          onChange={(e) => setSearchFechaFin(e.target.value)}
          className="filter-input"
        />
        <div className="search-buttons">
          {puedeExpo && (
            <button onClick={handleExportarPagos} className="btn btn-success">
              📥 Exportar
            </button>
          )}
          {puedeCrear && (
            <button onClick={handleOpenForm} className="btn btn-create">
              ➕ Nuevo Pago
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleClosePago}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? "Editar Pago" : "Crear Nuevo Pago"}</h2>
              <button onClick={handleClosePago} className="close-btn">✕</button>
            </div>
            <PagoForm
              pago={selectedPago}
              proveedores={proveedores}
              facturas={facturasPorPagar}
              onSubmit={handleSubmitForm}
              onCancel={handleClosePago}
              loading={loading}
            />
          </div>
        </div>
      )}

      <PagoList
        pagos={pagosFiltrados}
        loading={loading}
        onEdit={puedeEditar ? handleEditPago : null}
        onDesactivar={puedeDesactivar ? handleDesactivarPago : null}
        onEliminar={handleEliminarPago}
        onDetails={handleVerDetalles}
        canDelete={puedeEliminarPagos(user?.rol)}
      />

      {showDetalles && pagoDetalles && (
        <div className="modal-overlay" onClick={() => setShowDetalles(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del Pago</h2>
              <button onClick={() => setShowDetalles(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <p><strong>Número Recibo:</strong> {pagoDetalles.numeroRecibo}</p>
              <p><strong>Proveedor:</strong> {pagoDetalles.proveedor?.nombre}</p>
              <p><strong>Monto:</strong> Q{pagoDetalles.monto}</p>
              <p><strong>Fecha Pago:</strong> {new Date(pagoDetalles.fechaPago).toLocaleDateString()}</p>
              <p><strong>Método Pago:</strong> {pagoDetalles.metodoPago}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagos;
