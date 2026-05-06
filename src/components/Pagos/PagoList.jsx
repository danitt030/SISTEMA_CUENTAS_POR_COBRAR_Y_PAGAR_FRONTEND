import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const MotionDiv = motion.div;
const MotionRow = motion.tr;

const PagoList = ({ pagos = [], loading, onEdit, onDesactivar, onEliminar, onDetails, canDelete = false }) => {
  const reduceMotion = useReducedMotion();

  const getMetodoClass = (metodo) => {
    if (metodo === "TRANSFERENCIA") return "usuario-role-contador";
    if (metodo === "EFECTIVO") return "usuario-role-gerente";
    if (metodo === "CHEQUE") return "usuario-role-cliente";
    return "usuario-role-default";
  };

  if (loading) {
    return <div className="usuarios-empty-state">Cargando pagos...</div>;
  }

  if (!pagos || pagos.length === 0) {
    return <div className="usuarios-empty-state">No hay pagos registrados</div>;
  }

  return (
    <MotionDiv
      className="usuarios-table-shell"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="overflow-x-auto">
      <table className="w-full usuarios-table">
        <thead className="usuarios-table-head">
          <tr>
            <th>Número Recibo</th>
            <th>Proveedor</th>
            <th>Monto</th>
            <th>Fecha Pago</th>
            <th>Método</th>
            <th>Estado</th>
            <th className="usuarios-actions-col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago, index) => (
            <MotionRow
              key={pago._id || pago.id}
              className={`usuarios-row ${pago.activo ? "" : "usuarios-row-disabled"}`}
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.18,
                delay: reduceMotion ? 0 : Math.min(index * 0.02, 0.18),
              }}
            >
              <td className="usuarios-cell usuario-name">{pago.numeroRecibo}</td>
              <td className="usuarios-cell usuario-mail">{pago.proveedor?.nombre || "N/A"}</td>
              <td className="usuarios-cell">Q{parseFloat(pago.monto || 0).toFixed(2)}</td>
              <td className="usuarios-cell usuario-mail">{new Date(pago.fechaPago).toLocaleDateString()}</td>
              <td className="usuarios-cell">
                <span className={`usuario-role-chip ${getMetodoClass(pago.metodoPago)}`}>
                  {pago.metodoPago || "N/A"}
                </span>
              </td>
              <td className="usuarios-cell">
                <span className={`usuario-status-chip ${pago.activo ? "usuario-status-active" : "usuario-status-inactive"}`}>
                  {pago.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="usuarios-cell usuarios-actions-col">
                <div className="usuarios-actions">
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
                </div>
              </td>
            </MotionRow>
          ))}
        </tbody>
      </table>
      </div>
    </MotionDiv>
  );
};

export default PagoList;
