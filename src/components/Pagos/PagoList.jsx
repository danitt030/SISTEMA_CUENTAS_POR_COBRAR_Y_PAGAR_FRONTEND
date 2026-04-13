import React from "react";
import "./pagoList.css";

const PagoList = ({ pagos = [], loading, onEdit, onDesactivar, onEliminar, onDetails, canDelete = false }) => {
  if (loading) {
    return <div className="loading">Cargando pagos...</div>;
  }

  if (!pagos || pagos.length === 0) {
    return <div className="no-data">No hay pagos registrados</div>;
  }

  return (
    <div className="pago-list">
      <table className="table">
        <thead>
          <tr>
            <th>Número Recibo</th>
            <th>Proveedor</th>
            <th>Monto</th>
            <th>Fecha Pago</th>
            <th>Método</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago) => (
            <tr key={pago._id || pago.id}>
              <td>{pago.numeroRecibo}</td>
              <td>{pago.proveedor?.nombre || "N/A"}</td>
              <td>Q{parseFloat(pago.monto).toFixed(2)}</td>
              <td>{new Date(pago.fechaPago).toLocaleDateString()}</td>
              <td>{pago.metodoPago}</td>
              <td>{pago.activo ? "Activo" : "Inactivo"}</td>
              <td className="actions">
                <button
                  onClick={() => onDetails(pago)}
                  className="btn btn-sm btn-info"
                  title="Ver detalles"
                >
                  👁️
                </button>
                {onEdit && (
                  <button
                    onClick={() => onEdit(pago)}
                    className="btn btn-sm btn-warning"
                    title="Editar"
                  >
                    ✏️
                  </button>
                )}
                {onDesactivar && (
                  <button
                    onClick={() => onDesactivar(pago._id || pago.id)}
                    className="btn btn-sm btn-secondary"
                    title="Desactivar"
                  >
                    ⚠️
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onEliminar(pago._id || pago.id)}
                    className="btn btn-sm btn-danger"
                    title="Eliminar permanentemente"
                  >
                    🗑️
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PagoList;
