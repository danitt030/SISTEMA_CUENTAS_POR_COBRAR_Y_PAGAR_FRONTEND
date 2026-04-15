import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import { usePagosProveedor } from "../../shared/hooks/usePagosProveedor";
import { useProveedores } from "../../shared/hooks/useProveedores";
import { useFacturasPorPagar } from "../../shared/hooks/useFacturasPorPagar";
import PagoForm from "./PagoForm";
import PagoList from "./PagoList";
import { AuthContext } from "../../context/AuthContext";
import { puedeVerPagos, puedeEliminarPagos, puedeCrearPago, puedeEditarPago, puedeDesactivarPago, puedeExportarPagos } from "../../utils/roleUtils";
import toast from "react-hot-toast";
import "../../styles/modules.css";

const Pagos = ({ onBack }) => {
  const { user } = useContext(AuthContext);
  const {
    pagos,
    loading,
    error,
    obtenerPagosProveedorFunc,
    crearPagoFunc,
    actualizarPagoFunc,
    desactivarPagoFunc,
    eliminarPagoFunc,
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
  const [modalDesactivar, setModalDesactivar] = useState({ visible: false, pago: null });
  const [modalEliminar, setModalEliminar] = useState({ visible: false, pago: null });

  const stats = useMemo(() => {
    const activos = pagos.filter((p) => p.activo);
    const total = activos.length;
    const suma = activos.reduce((acc, p) => acc + (parseFloat(p.monto) || 0), 0);
    const inactivos = pagos.length - total;
    const promedio = total > 0 ? suma / total : 0;
    return { total, suma, inactivos, promedio };
  }, [pagos]);

  const loadPagos = useCallback(async () => {
    await obtenerPagosProveedorFunc(1000, 0);
  }, [obtenerPagosProveedorFunc]);

  useEffect(() => {
    loadPagos();
    obtenerProveedores(1000, 0);
    obtenerFacturas(1000, 0);
  }, [loadPagos, obtenerProveedores, obtenerFacturas]);

  // ==================== VERIFICACIÓN DE RBAC ====================
  const tieneAcceso = puedeVerPagos(user?.rol);
  const puedeCrear = puedeCrearPago(user?.rol);
  const puedeEditar = puedeEditarPago(user?.rol);
  const puedeDesactivar = puedeDesactivarPago(user?.rol);
  const puedeExpo = puedeExportarPagos(user?.rol);
  const canDelete = puedeEliminarPagos(user?.rol);

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
          // Mostrar toast con saldo actualizado si está disponible
          if (result.saldo) {
            toast.success(
              `Pago actualizado\n` +
              `Pagado: Q${result.saldo.montoPagado.toFixed(2)}\n` +
              `Pendiente: Q${result.saldo.montoPendiente.toFixed(2)}`,
              { duration: 4000 }
            );
          } else {
            toast.success("Pago actualizado exitosamente");
          }
          handleClosePago();
          await loadPagos();
        } else {
          toast.error("Error al actualizar el pago");
        }
      } else {
        const result = await crearPagoFunc(datos);
        if (!result.error) {
          toast.success("Pago creado exitosamente");
          handleClosePago();
          await loadPagos();
        } else {
          toast.error("Error al crear el pago");
        }
      }
    } catch (err) {
      toast.error("Error al procesar el formulario");
    }
  };

  const handleDesactivarPago = async (id) => {
    if (!puedeDesactivar || !id) {
      toast.error("No tienes permisos para desactivar pagos");
      return;
    }
    const result = await desactivarPagoFunc(id);
    if (result) {
      await loadPagos();
      toast.success("Pago desactivado correctamente");
    } else {
      toast.error("Error al desactivar el pago");
    }
  };

  const handleEliminarPago = async (id) => {
    const result = await eliminarPagoFunc(id);
    if (result) {
      await loadPagos();
      toast.success("Pago eliminado correctamente");
    } else {
      toast.error("Error al eliminar el pago");
    }
  };

  const handleVerDetalles = async (pago) => {
    setPagoDetalles(pago);
    setShowDetalles(true);
  };

  const handleExportarPagos = async () => {
    if (!puedeExpo) {
      toast.error("No tienes permisos para exportar pagos");
      return;
    }
    const result = await exportarPagosFunc();
    if (!result.error) {
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
    <div className="module-container table-density-compact">
      <div className="module-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          {typeof onBack === "function" && (
            <button
              onClick={onBack}
              className="btn btn-primary"
              style={{ padding: '8px 12px', fontSize: '14px' }}
            >
              ← Volver
            </button>
          )}
          <h2>Pagos a Proveedores</h2>
        </div>
        <div className="header-acciones">
          {puedeCrear && (
            <button className="btn btn-primary" onClick={handleOpenForm} disabled={loading}>
              Nuevo Pago
            </button>
          )}
          {puedeExpo && (
            <button className="btn btn-secondary" onClick={handleExportarPagos} disabled={loading}>
              Exportar
            </button>
          )}
        </div>
      </div>

      <div className="mb-7">
        <h3 className="text-2xl font-bold text-slate-100 mb-4">
          Estadísticas Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl p-5 shadow border-l-4" style={{ borderLeftColor: "#3B82F6" }}>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pagos Activos</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="relative bg-white dark:bg-gray-800 rounded-xl p-5 shadow border-l-4" style={{ borderLeftColor: "#10B981" }}>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Pagado</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">Q {stats.suma.toFixed(2)}</p>
          </div>
          <div className="relative bg-white dark:bg-gray-800 rounded-xl p-5 shadow border-l-4" style={{ borderLeftColor: "#F59E0B" }}>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Promedio por Pago</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">Q {stats.promedio.toFixed(2)}</p>
          </div>
          <div className="relative bg-white dark:bg-gray-800 rounded-xl p-5 shadow border-l-4" style={{ borderLeftColor: "#EF4444" }}>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pagos Inactivos</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.inactivos}</p>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-section bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-sm font-semibold text-black dark:text-gray-200 mb-1">Proveedor</label>
            <input
              type="text"
              placeholder="Buscar por proveedor..."
              value={searchProveedor}
              onChange={(e) => setSearchProveedor(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black dark:text-gray-200 mb-1">Fecha Inicio</label>
            <input
              type="date"
              value={searchFechaInicio}
              onChange={(e) => setSearchFechaInicio(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black dark:text-gray-200 mb-1">Fecha Fin</label>
            <input
              type="date"
              value={searchFechaFin}
              onChange={(e) => setSearchFechaFin(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-gray-100"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSearchProveedor("");
                setSearchFechaInicio("");
                setSearchFechaFin("");
              }}
              className="flex-1 px-3 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-semibold dark:bg-gray-700 dark:text-gray-100"
              type="button"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleClosePago}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{ animation: "fadeInZoom 0.3s ease-out" }}>
            <div className="modal-header">
              <h3>{isEditing ? "Editar Pago" : "Crear Nuevo Pago"}</h3>
              <button onClick={handleClosePago} className="btn-close">×</button>
            </div>
            <div className="modal-body p-6 form-readable">
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
        </div>
      )}

      <PagoList
        pagos={pagosFiltrados}
        loading={loading}
        onEdit={puedeEditar ? handleEditPago : null}
        onDesactivar={puedeDesactivar ? (id) => setModalDesactivar({ visible: true, pago: { id } }) : null}
        onEliminar={canDelete ? (id) => setModalEliminar({ visible: true, pago: { id } }) : null}
        onDetails={handleVerDetalles}
        canDelete={canDelete}
      />

      {modalDesactivar.visible && (
        <div className="modal-overlay" onClick={() => setModalDesactivar({ visible: false, pago: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ animation: "fadeInZoom 0.3s ease-out" }}>
            <div className="modal-header">
              <h3>Confirmar Desactivación</h3>
              <button className="btn-close" onClick={() => setModalDesactivar({ visible: false, pago: null })}>×</button>
            </div>
            <div className="modal-body p-6 text-center">
              <p className="text-black dark:text-gray-200 mb-6 font-medium">¿Deseas desactivar este pago?</p>
              <div className="flex justify-center gap-3">
                <button className="btn btn-secondary" onClick={() => setModalDesactivar({ visible: false, pago: null })}>Cancelar</button>
                <button
                  className="btn btn-warning text-white"
                  onClick={async () => {
                    await handleDesactivarPago(modalDesactivar.pago?.id);
                    setModalDesactivar({ visible: false, pago: null });
                  }}
                >
                  Desactivar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalEliminar.visible && (
        <div className="modal-overlay" onClick={() => setModalEliminar({ visible: false, pago: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ animation: "fadeInZoom 0.3s ease-out" }}>
            <div className="modal-header border-b border-red-500/30">
              <h3 className="text-red-600 dark:text-red-400">Eliminar Pago</h3>
              <button className="btn-close" onClick={() => setModalEliminar({ visible: false, pago: null })}>×</button>
            </div>
            <div className="modal-body p-6 text-center bg-red-50 dark:bg-red-950/20">
              <p className="text-red-700 dark:text-red-300 mb-6 font-medium">Esta acción es permanente y no se puede deshacer.</p>
              <div className="flex justify-center gap-3">
                <button className="btn btn-secondary" onClick={() => setModalEliminar({ visible: false, pago: null })}>Cancelar</button>
                <button
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                  onClick={async () => {
                    await handleEliminarPago(modalEliminar.pago?.id);
                    setModalEliminar({ visible: false, pago: null });
                  }}
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetalles && pagoDetalles && (
        <div className="modal-overlay" onClick={() => setShowDetalles(false)}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{ animation: "fadeInZoom 0.3s ease-out" }}>
            <div className="modal-header border-b border-slate-200 dark:border-slate-700">
              <h3>🔎 Detalles del Pago</h3>
              <button onClick={() => setShowDetalles(false)} className="btn-close">×</button>
            </div>
            <div className="modal-body p-6 bg-slate-50 dark:bg-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-300">Monto</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">Q{parseFloat(pagoDetalles.monto || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-300">Método</p>
                  <p className="text-lg font-bold text-black dark:text-white">{pagoDetalles.metodoPago || "N/A"}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-300">Estado</p>
                  <p className={`text-lg font-bold ${pagoDetalles.activo ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                    {pagoDetalles.activo ? "Activo" : "Inactivo"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Número Recibo</p>
                  <p className="font-semibold text-black dark:text-white">{pagoDetalles.numeroRecibo || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Proveedor</p>
                  <p className="font-semibold text-black dark:text-white">{pagoDetalles.proveedor?.nombre || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Factura</p>
                  <p className="font-semibold text-black dark:text-white">{pagoDetalles.facturaPorPagar?.numeroFactura || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Fecha Pago</p>
                  <p className="font-semibold text-black dark:text-white">{new Date(pagoDetalles.fechaPago).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Moneda</p>
                  <p className="font-semibold text-black dark:text-white">{pagoDetalles.moneda || "GTQ"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Referencia</p>
                  <p className="font-semibold text-black dark:text-white">{pagoDetalles.referencia || "No especificada"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-slate-500 dark:text-slate-300">Descripción</p>
                  <p className="font-semibold text-black dark:text-white">{pagoDetalles.descripcion || "Sin descripción"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagos;
