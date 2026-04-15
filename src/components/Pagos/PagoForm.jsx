import React, { useState, useEffect } from "react";
import api from "../../services/api.jsx";

const PagoForm = ({ pago, proveedores = [], facturas = [], onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    numeroRecibo: "",
    proveedorId: "",
    facturaPorPagarId: "",
    monto: "",
    moneda: "GTQ",
    metodoPago: "TRANSFERENCIA",
    fechaPago: new Date().toISOString().split("T")[0],
    referencia: "",
    descripcion: "",
  });

  const [facturasProveedorSeleccionado, setFacturasProveedorSeleccionado] = useState([]);
  const [proveedorOriginal, setProveedorOriginal] = useState(null);
  const [montoFactura, setMontoFactura] = useState(0);
  const [montoPagado, setMontoPagado] = useState(0);
  const [saldoPendiente, setSaldoPendiente] = useState(0);
  const [cargandoSaldo, setCargandoSaldo] = useState(false);

  useEffect(() => {
    if (pago) {
      // Extraer proveedorId - soporta múltiples formatos
      const proveedorId = (() => {
        if (pago.proveedor) {
          if (typeof pago.proveedor === "object") {
            return pago.proveedor._id || pago.proveedor.id || "";
          }
          return String(pago.proveedor);
        }
        return pago.proveedorId || "";
      })();

      // Extraer facturaPorPagarId - soporta múltiples formatos
      const facturaPorPagarId = (() => {
        if (pago.facturaPorPagar) {
          if (typeof pago.facturaPorPagar === "object") {
            return pago.facturaPorPagar._id || pago.facturaPorPagar.id || "";
          }
          return String(pago.facturaPorPagar);
        }
        return pago.facturaPorPagarId || "";
      })();

      // eslint-disable-next-line
      setProveedorOriginal(proveedorId);
      setFormData({
        numeroRecibo: pago.numeroRecibo || "",
        proveedorId,
        facturaPorPagarId,
        monto: pago.monto || "", // Será reemplazado por saldoPendiente después
        moneda: pago.moneda || "GTQ",
        metodoPago: pago.metodoPago || "TRANSFERENCIA",
        fechaPago: pago.fechaPago ? new Date(pago.fechaPago).toISOString().split("T")[0] : "",
        referencia: pago.referencia || "",
        descripcion: pago.descripcion || "",
      });

      // ====== CARGAR SALDO INMEDIATAMENTE AL ABRIRSE EL MODAL =======
      if (facturaPorPagarId && pago.facturaPorPagar) {
        setCargandoSaldo(true);
        
        api
          .get(`/pagoProveedor/saldo/${facturaPorPagarId}`)
          .then((response) => {
            if (response.data.success && response.data.saldo) {
              const saldo = response.data.saldo;
              setMontoFactura(saldo.montoFactura || 0);
              setMontoPagado(saldo.montoPagado || 0);
              setSaldoPendiente(saldo.montoPendiente || 0);
              
              // IMPORTANTE: Cuando editas, el campo Monto debe ser el saldoPendiente
              setFormData((prev) => ({
                ...prev,
                monto: saldo.montoPendiente || 0
              }));
            }
          })
          // eslint-disable-next-line no-unused-vars
          .catch((_error) => {
            // Fallback a datos del pago
            if (pago.facturaPorPagar) {
              const montoPendiente = (pago.facturaPorPagar.monto || 0) - (pago.facturaPorPagar.montoPagado || 0);
              setMontoFactura(pago.facturaPorPagar.monto || 0);
              setMontoPagado(pago.facturaPorPagar.montoPagado || 0);
              setSaldoPendiente(montoPendiente);
              
              setFormData((prev) => ({
                ...prev,
                monto: montoPendiente
              }));
            }
          })
          .finally(() => {
            setCargandoSaldo(false);
          });
      }
    } else {
      // Limpiar cuando no hay pago (formulario nuevo)
      setProveedorOriginal(null);
      setFormData({
        numeroRecibo: "",
        proveedorId: "",
        facturaPorPagarId: "",
        monto: "",
        moneda: "GTQ",
        metodoPago: "TRANSFERENCIA",
        fechaPago: new Date().toISOString().split("T")[0],
        referencia: "",
        descripcion: "",
      });
      setMontoFactura(0);
      setMontoPagado(0);
      setSaldoPendiente(0);
    }
  }, [pago]);

  // ==================== OBTENER SALDO DE FACTURA DESDE BACKEND ====================
  const pagoId = pago?.id || pago?._id;
  const facturaId = formData.facturaPorPagarId;

  useEffect(() => {
    const cargarSaldo = async () => {
      if (pagoId && facturaId) {
        setCargandoSaldo(true);
      
      
        api
          .get(`/pagoProveedor/saldo/${facturaId}`)
          .then((response) => {
            
            if (response.data.success && response.data.saldo) {
              setMontoFactura(response.data.saldo.montoFactura || 0);
              setMontoPagado(response.data.saldo.montoPagado || 0);
              setSaldoPendiente(response.data.saldo.montoPendiente || 0);
            }
          })
          // eslint-disable-next-line no-unused-vars
          .catch((_error) => {
            
            
            // FALLBACK: También intentar desde el pago que viene del servidor
            if (pago?.facturaPorPagar) {
              const factura = pago.facturaPorPagar;
              const monto = factura.monto || 0;
              const montoPagado = factura.montoPagado || 0;
              
              
              setMontoFactura(monto);
              setMontoPagado(montoPagado);
              setSaldoPendiente(monto - montoPagado);
            } else {
              // FALLBACK FINAL: Array local
              const facturaSeleccionada = facturas.find(
                (f) => String(f._id || f.id) === String(facturaId)
              );

              if (facturaSeleccionada) {
                const monto = facturaSeleccionada.monto || 0;
                const totalPagado = facturaSeleccionada.montoPagado || 0;
                
                
                setMontoFactura(monto);
                setMontoPagado(totalPagado);
                setSaldoPendiente(monto - totalPagado);
              }
            }
          })
          .finally(() => {
            setCargandoSaldo(false);
          });
      }
    };
    cargarSaldo();
  }, [pagoId, facturaId, pago, facturas]);

  // ==================== FILTRAR FACTURAS POR PROVEEDOR ====================
  useEffect(() => {
    if (formData.proveedorId) {
      // Obtener el proveedor seleccionado
      const proveedorSeleccionado = proveedores.find(
        (p) => String(p._id || p.id) === String(formData.proveedorId)
      );

      if (proveedorSeleccionado) {
        // Convertir IDs a strings para comparación segura
        const proveedorIdStr = String(proveedorSeleccionado._id || proveedorSeleccionado.id);

        // Filtrar facturas que pertenecen al proveedor seleccionado
        let facturasDelProveedor = facturas.filter((f) => {
          const facturaProveedorId = String(
            (typeof f.proveedor === "object" ? f.proveedor?.id || f.proveedor?._id : f.proveedor) || 
            f.proveedorId || 
            ""
          ).trim();
          
          return facturaProveedorId === proveedorIdStr;
        });

        // Si estamos editando (pago existe) y la factura original no está en la lista filtrada,
        // la agregamos para que siempre esté disponible
        if (pago && formData.facturaPorPagarId) {
          const facturaOriginalExiste = facturasDelProveedor.some(
            (f) => String(f._id || f.id) === String(formData.facturaPorPagarId)
          );

          if (!facturaOriginalExiste) {
            // Buscar la factura original en la lista completa
            const facturaOriginal = facturas.find(
              (f) => String(f._id || f.id) === String(formData.facturaPorPagarId)
            );

            // Si la encontramos, la agregamos a la lista
            if (facturaOriginal) {
              facturasDelProveedor = [facturaOriginal, ...facturasDelProveedor];
            }
          }
        }

        const setupFacturas = () => {
          setFacturasProveedorSeleccionado(facturasDelProveedor);
        };
        setupFacturas();

        // Solo resetear factura si el proveedor CAMBIÓ (es diferente del original)
        // Si es edición y el proveedor sigue siendo el mismo, mantener la factura original
        const proveedorCambio = String(formData.proveedorId) !== String(proveedorOriginal);

        if (proveedorCambio && formData.facturaPorPagarId) {
          // El usuario cambió de proveedor, resetear factura
          const facturaEsValida = facturasDelProveedor.some(
            (f) => String(f._id || f.id) === String(formData.facturaPorPagarId)
          );

          if (!facturaEsValida) {
            // eslint-disable-next-line
            setFormData((prev) => ({
              ...prev,
              facturaPorPagarId: "",
              monto: "",
            }));
          }
        }
      }
    } else {
      setFacturasProveedorSeleccionado([]);
      
      // Solo resetear si no estamos en edición (pago null) o si proveedorOriginal no está set
      // Esto previene que se limpie facturaPorPagarId mientras se carga un pago para editar
      if (!pagoId && !proveedorOriginal) {
        setFormData((prev) => ({
          ...prev,
          facturaPorPagarId: "",
          monto: "",
        }));
      }
    }
  }, [formData.proveedorId, formData.facturaPorPagarId, facturas, proveedores, proveedorOriginal, pagoId, pago]);

  // ==================== CALCULAR SALDO CUANDO CAMBIA LA FACTURA SELECCIONADA (Solo en creación) ====================
  useEffect(() => {
    // Si estamos editando (pago existe), no ejecutar esto - será manejado por el useEffect anterior
    if (!pagoId && formData.facturaPorPagarId && facturas.length > 0) {
      const facturaSeleccionada = facturas.find(
        (f) => String(f._id || f.id) === String(formData.facturaPorPagarId)
      );

      if (facturaSeleccionada) {
        const monto = facturaSeleccionada.monto || 0;
        const updateMonto = () => {
          setMontoFactura(monto);
        };
        updateMonto();

        // Usar montoPagado del backend (que incluye TODOS los pagos previos)
        const totalPagado = facturaSeleccionada.montoPagado || 0;
        // eslint-disable-next-line
        setMontoPagado(totalPagado);
        setSaldoPendiente(monto - totalPagado);
      } else {
        setMontoFactura(0);
        setMontoPagado(0);
        setSaldoPendiente(0);
      }
    } else if (!formData.facturaPorPagarId) {
      setMontoFactura(0);
      setMontoPagado(0);
      setSaldoPendiente(0);
    }
  }, [formData.facturaPorPagarId, facturas, pagoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-black dark:text-gray-200 mb-1">Número Recibo</label>
          <input
            type="text"
            name="numeroRecibo"
            value={formData.numeroRecibo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-gray-100 outline-none"
            placeholder="Ej: PAGO-001"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-black dark:text-gray-200 mb-1">Proveedor</label>
          <select
            name="proveedorId"
            value={formData.proveedorId}
            onChange={handleChange}
            required
            disabled={Boolean(pago)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-gray-100 outline-none disabled:bg-gray-100 disabled:dark:bg-gray-800"
          >
            <option value="">-- Selecciona un proveedor --</option>
            {proveedores.map((p) => (
              <option key={p._id || p.id} value={p._id || p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-semibold text-black dark:text-gray-200 mb-1">Factura por Pagar</label>
          <select
            name="facturaPorPagarId"
            value={formData.facturaPorPagarId}
            onChange={handleChange}
            required
            disabled={!formData.proveedorId || Boolean(pago)}
            aria-label="Selecciona una factura del proveedor"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-gray-100 outline-none disabled:bg-gray-100 disabled:dark:bg-gray-800"
          >
            <option value="">
              {formData.proveedorId
                ? facturasProveedorSeleccionado.length === 0
                  ? "-- No hay facturas para este proveedor --"
                  : "-- Selecciona una factura --"
                : "-- Selecciona un proveedor primero --"}
            </option>
            {facturasProveedorSeleccionado && facturasProveedorSeleccionado.length > 0 ? (
              facturasProveedorSeleccionado.map((f) => (
                <option key={f._id || f.id} value={f._id || f.id}>
                  {f.numeroFactura} - Q{f.monto}
                </option>
              ))
            ) : (
              <option value="">-- Cargando facturas... --</option>
            )}
          </select>
        </div>
      </div>

      {formData.facturaPorPagarId && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {cargandoSaldo ? (
            <div className="md:col-span-3 text-center text-sm font-medium text-slate-600 dark:text-slate-300">Consultando saldo de factura...</div>
          ) : (
            <>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                <p className="text-xs text-slate-500 dark:text-slate-300">Monto Factura</p>
                <p className="text-lg font-bold text-black dark:text-white">Q{montoFactura.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                <p className="text-xs text-slate-500 dark:text-slate-300">Pagado</p>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">Q{montoPagado.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                <p className="text-xs text-slate-500 dark:text-slate-300">Pendiente</p>
                <p className={`text-lg font-bold ${saldoPendiente > 0 ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                  Q{saldoPendiente.toFixed(2)}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-black dark:text-gray-200 mb-1">Monto</label>
          <input
            type="number"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-gray-100 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-black dark:text-gray-200 mb-1">Moneda</label>
          <select
            name="moneda"
            value={formData.moneda}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-gray-100 outline-none"
          >
            <option value="GTQ">GTQ</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-black dark:text-gray-200 mb-1">Método de Pago</label>
          <select
            name="metodoPago"
            value={formData.metodoPago}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-gray-100 outline-none"
          >
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="CHEQUE">Cheque</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-black dark:text-gray-200 mb-1">Fecha de Pago</label>
          <input
            type="date"
            name="fechaPago"
            value={formData.fechaPago}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-gray-100 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-black dark:text-gray-200 mb-1">Referencia (Transacción)</label>
          <input
            type="text"
            name="referencia"
            value={formData.referencia}
            onChange={handleChange}
            placeholder="Ej: TRX123456"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-gray-100 outline-none"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-semibold text-black dark:text-gray-200 mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-gray-100 outline-none resize-none"
            placeholder="Detalle del pago, observaciones, tipo de soporte..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-semibold dark:bg-gray-700 dark:text-gray-100">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-60">
          {loading ? "Guardando..." : pago ? "Guardar Cambios" : "Guardar Pago"}
        </button>
      </div>
    </form>
  );
};

export default PagoForm;
