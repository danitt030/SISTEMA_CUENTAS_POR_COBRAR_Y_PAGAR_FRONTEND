import { useState } from "react";

export const CobroDetail = ({ cobro = null, onClose, onEdit, obtenerSaldoCobroFunc, obtenerCobroPorIdFunc }) => {
  const [saldo, setSaldo] = useState(null);
  const [loadingSaldo, setLoadingSaldo] = useState(false);

  if (!cobro) {
    return null;
  }

  const netoCobrado = (cobro.montoCobrado || 0) - (cobro.comision || 0);

  const handleVerSaldo = async () => {
    if (!obtenerSaldoCobroFunc) return;
    
    setLoadingSaldo(true);
    try {
      const facturaId = cobro.facturaPorCobrar?.id || cobro.facturaPorCobrar?._id || cobro.facturaPorCobrar;
      const resultado = await obtenerSaldoCobroFunc(facturaId);
      if (resultado) {
        setSaldo(resultado.saldo || resultado);
      }
    } catch (err) {
    } finally {
      setLoadingSaldo(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content-large max-w-6xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fadeInZoom 0.3s ease-out" }}
      >
        <div className="modal-header border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-black dark:text-white font-bold text-xl">🔎 Detalle del Cobro</h3>
          <button onClick={onClose} className="btn-close">
            ×
          </button>
        </div>

        <div className="modal-body p-6 bg-slate-50 dark:bg-slate-900 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="rounded-xl border border-blue-200 dark:border-blue-900/40 bg-white dark:bg-slate-800 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Monto Cobrado</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">Q {(cobro.montoCobrado || 0).toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-slate-800 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Neto Cobrado</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">Q {netoCobrado.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-white dark:bg-slate-800 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Estado</p>
              <p className={`text-xl font-bold mt-1 ${cobro.activo ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                {cobro.activo ? "Activo" : "Inactivo"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <h4 className="text-black dark:text-white font-semibold mb-3">Información del Comprobante</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-black dark:text-slate-100">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Número Comprobante</p>
                  <p className="font-semibold">{cobro.numeroComprobante || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Fecha Cobro</p>
                  <p className="font-semibold">{new Date(cobro.fechaCobro).toLocaleDateString("es-ES")}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Moneda</p>
                  <p className="font-semibold">{cobro.moneda || "GTQ"}</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <h4 className="text-black dark:text-white font-semibold mb-3">Información de la Factura</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-black dark:text-slate-100">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Número Factura</p>
                  <p className="font-semibold">{cobro.facturaPorCobrar?.numeroFactura || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Monto Factura</p>
                  <p className="font-semibold">Q {(cobro.montoFactura || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Referencia</p>
                  <p className="font-semibold">{cobro.referencia || "No especificada"}</p>
                </div>
              </div>

              {obtenerSaldoCobroFunc && (
                <div className="mt-4">
                  <button
                    onClick={handleVerSaldo}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-[0_0_12px_rgba(79,70,229,0.35)] hover:shadow-[0_0_16px_rgba(79,70,229,0.5)] transition-all"
                    disabled={loadingSaldo}
                  >
                    {loadingSaldo ? "Consultando saldo..." : "Ver saldo de la factura"}
                  </button>
                </div>
              )}

              {saldo && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-300">Monto Factura</p>
                    <p className="font-bold text-black dark:text-white">Q {(saldo.montoFactura || 0).toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-300">Monto Cobrado</p>
                    <p className="font-bold text-black dark:text-white">Q {(saldo.montoCobrado || 0).toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-300">Monto Pendiente</p>
                    <p className="font-bold text-black dark:text-white">Q {(saldo.montoPendiente || 0).toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-300">Porcentaje Cobrado</p>
                    <p className="font-bold text-black dark:text-white">{saldo.porcentajeCobrado || "0%"}</p>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <h4 className="text-black dark:text-white font-semibold mb-3">Cliente y Cobro</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-black dark:text-slate-100">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Nombre Cliente</p>
                  <p className="font-semibold">{cobro.cliente?.nombre || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Documento</p>
                  <p className="font-semibold">{cobro.cliente?.numeroDocumento || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Método de Pago</p>
                  <p className="font-semibold">{cobro.metodoPago || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Comisión</p>
                  <p className="font-semibold">Q {(cobro.comision || 0).toFixed(2)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-slate-500 dark:text-slate-300">Descripción</p>
                  <p className="font-semibold">{cobro.descripcion || "Sin descripción"}</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <h4 className="text-black dark:text-white font-semibold mb-3">Auditoría</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-black dark:text-slate-100">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Creado por</p>
                  <p className="font-semibold">{cobro.creadoPor?.nombre || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Fecha creación</p>
                  <p className="font-semibold">{cobro.creadoEn ? new Date(cobro.creadoEn).toLocaleString("es-ES") : "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Última actualización</p>
                  <p className="font-semibold">{cobro.actualizadoEn ? new Date(cobro.actualizadoEn).toLocaleString("es-ES") : "N/A"}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="modal-footer p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-white dark:bg-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-black font-semibold transition-all"
          >
            Cerrar
          </button>
          <button
            onClick={() => onEdit(cobro)}
            className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all shadow-[0_0_12px_rgba(8,145,178,0.35)] hover:shadow-[0_0_16px_rgba(8,145,178,0.55)]"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};
