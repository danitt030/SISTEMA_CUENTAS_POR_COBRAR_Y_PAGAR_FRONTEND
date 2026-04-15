import React from "react";

const PagoList = ({ pagos = [], loading, onEdit, onDesactivar, onEliminar, onDetails, canDelete = false }) => {
  if (loading) {
    return <div className="loading">Cargando pagos...</div>;
  }

  if (!pagos || pagos.length === 0) {
    return <div className="no-data">No hay pagos registrados</div>;
  }

  return (
    <div className="pago-list bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <th className="p-3 font-semibold text-sm">Número Recibo</th>
            <th className="p-3 font-semibold text-sm">Proveedor</th>
            <th className="p-3 font-semibold text-sm">Monto</th>
            <th className="p-3 font-semibold text-sm">Fecha Pago</th>
            <th className="p-3 font-semibold text-sm">Método</th>
            <th className="p-3 font-semibold text-sm">Estado</th>
            <th className="p-3 font-semibold text-sm text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago) => (
            <tr key={pago._id || pago.id} className={`border-b last:border-b-0 ${pago.activo ? "bg-white dark:bg-gray-800" : "bg-red-50/50 dark:bg-red-900/10 opacity-80"}`}>
              <td className="p-3 font-medium text-black dark:text-gray-100">{pago.numeroRecibo}</td>
              <td className="p-3 text-black dark:text-gray-300">{pago.proveedor?.nombre || "N/A"}</td>
              <td className="p-3 text-green-700 dark:text-green-400 font-semibold">Q{parseFloat(pago.monto || 0).toFixed(2)}</td>
              <td className="p-3 text-black dark:text-gray-300">{new Date(pago.fechaPago).toLocaleDateString()}</td>
              <td className="p-3">
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
                  {pago.metodoPago || "N/A"}
                </span>
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${pago.activo ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                  {pago.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="p-3 actions flex justify-center gap-2 flex-wrap">
                <button
                  onClick={() => onDetails(pago)}
                  className="action-btn action-btn-view"
                  title="Ver detalles"
                >
                  Ver
                </button>
                {onEdit && (
                  <button
                    onClick={() => onEdit(pago)}
                    className="action-btn action-btn-edit"
                    title="Editar pago"
                  >
                    Editar
                  </button>
                )}
                {onDesactivar && (
                  <button
                    onClick={() => onDesactivar(pago._id || pago.id)}
                    className="action-btn action-btn-warning"
                    title="Desactivar pago"
                  >
                    Desactivar
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onEliminar(pago._id || pago.id)}
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

export default PagoList;
