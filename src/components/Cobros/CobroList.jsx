
export const CobroList = ({ cobros = [], onVerDetalle, onEdit, onToggleEstado, onDeletePermanent, loading = false }) => {
  if (loading) {
    return <div className="cobro-list loading">Cargando cobros...</div>;
  }

  if (!cobros || cobros.length === 0) {
    return <div className="cobro-list empty">No hay cobros registrados</div>;
  }

  return (
    <div className="cobro-list bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              <th className="p-3 font-semibold text-sm">Comprobante</th>
              <th className="p-3 font-semibold text-sm">Factura</th>
              <th className="p-3 font-semibold text-sm">Cliente</th>
              <th className="p-3 font-semibold text-sm">Monto Cobrado</th>
              <th className="p-3 font-semibold text-sm">Comisión</th>
              <th className="p-3 font-semibold text-sm">Método Pago</th>
              <th className="p-3 font-semibold text-sm">Fecha</th>
              <th className="p-3 font-semibold text-sm">Estado</th>
              <th className="p-3 font-semibold text-sm text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cobros.map((cobro) => (
              <tr 
                key={cobro._id || cobro.id} 
                className={`border-b last:border-b-0 ${
                  cobro.activo 
                    ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700" 
                    : "bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 opacity-75"
                }`}
              >
                <td className="p-3 font-medium text-gray-900 dark:text-gray-100">{cobro.numeroComprobante}</td>
                <td className="p-3 text-gray-900 dark:text-gray-300">{cobro.facturaPorCobrar?.numeroFactura || "N/A"}</td>
                <td className="p-3 text-gray-900 dark:text-gray-300">{cobro.cliente?.nombre || "N/A"}</td>
                <td className="p-3 text-green-600 dark:text-green-400 font-semibold">Q {(cobro.montoCobrado || 0).toFixed(2)}</td>
                <td className="p-3 text-orange-500 dark:text-orange-400">Q {(cobro.comision || 0).toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    cobro.metodoPago === 'TRANSFERENCIA' ? 'bg-blue-100 text-blue-700' :
                    cobro.metodoPago === 'EFECTIVO' ? 'bg-green-100 text-green-700' :
                    cobro.metodoPago === 'CHEQUE' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {cobro.metodoPago || "N/A"}
                  </span>
                </td>
                <td className="p-3 text-gray-900 dark:text-gray-300">{new Date(cobro.fechaCobro).toLocaleDateString("es-ES")}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    cobro.activo 
                      ? "bg-green-100 text-green-700 border border-green-200" 
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}>
                    {cobro.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-3 acciones flex justify-center gap-2 flex-wrap">
                {onVerDetalle && (
                  <button 
                    onClick={() => onVerDetalle(cobro)} 
                    className="action-btn action-btn-view"
                    title="Ver detalle"
                  >
                    Detalle
                  </button>
                )}
                {onEdit && (
                  <button 
                    onClick={() => onEdit(cobro)} 
                    className="action-btn action-btn-edit"
                    title="Editar cobro"
                  >
                    Editar
                  </button>
                )}
                {onToggleEstado && (
                  <button 
                    onClick={() => onToggleEstado(cobro._id || cobro.id, cobro.activo)} 
                    className={cobro.activo ? "action-btn action-btn-danger" : "action-btn action-btn-success"}
                    title={cobro.activo ? "Desactivar cobro" : "Reactivar cobro"}
                  >
                    {cobro.activo ? 'Desactivar' : 'Activar'}
                  </button>
                )}
                {onDeletePermanent && (
                  <button 
                    onClick={() => onDeletePermanent(cobro._id || cobro.id)} 
                    className="action-btn action-btn-dark"
                    title="Eliminar permanentemente"
                  >
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};
