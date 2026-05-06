
import { motion, useReducedMotion } from "framer-motion";

const MotionDiv = motion.div;
const MotionRow = motion.tr;

export const CobroList = ({ cobros = [], onVerDetalle, onEdit, onToggleEstado, onDeletePermanent, loading = false }) => {
  const reduceMotion = useReducedMotion();

  const getMetodoClass = (metodo) => {
    if (metodo === "TRANSFERENCIA") return "usuario-role-contador";
    if (metodo === "EFECTIVO") return "usuario-role-gerente";
    if (metodo === "CHEQUE") return "usuario-role-cliente";
    return "usuario-role-default";
  };

  if (loading) {
    return <div className="usuarios-empty-state">Cargando cobros...</div>;
  }

  if (!cobros || cobros.length === 0) {
    return <div className="usuarios-empty-state">No hay cobros registrados</div>;
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
              <th>Comprobante</th>
              <th>Factura</th>
              <th>Cliente</th>
              <th>Monto Cobrado</th>
              <th>Comisión</th>
              <th>Método Pago</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th className="usuarios-actions-col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cobros.map((cobro, index) => (
              <MotionRow
                key={cobro._id || cobro.id} 
                className={`usuarios-row ${
                  cobro.activo 
                    ? ""
                    : "usuarios-row-disabled"
                }`}
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.18,
                  delay: reduceMotion ? 0 : Math.min(index * 0.02, 0.18),
                }}
              >
                <td className="usuarios-cell usuario-name">{cobro.numeroComprobante}</td>
                <td className="usuarios-cell usuario-mail">{cobro.facturaPorCobrar?.numeroFactura || "N/A"}</td>
                <td className="usuarios-cell usuario-mail">{cobro.cliente?.nombre || "N/A"}</td>
                <td className="usuarios-cell">Q {(cobro.montoCobrado || 0).toFixed(2)}</td>
                <td className="usuarios-cell">Q {(cobro.comision || 0).toFixed(2)}</td>
                <td className="usuarios-cell">
                  <span className={`usuario-role-chip ${getMetodoClass(cobro.metodoPago)}`}>
                    {cobro.metodoPago || "N/A"}
                  </span>
                </td>
                <td className="usuarios-cell usuario-mail">{new Date(cobro.fechaCobro).toLocaleDateString("es-ES")}</td>
                <td className="usuarios-cell">
                  <span className={`usuario-status-chip ${
                    cobro.activo 
                      ? "usuario-status-active"
                      : "usuario-status-inactive"
                  }`}>
                    {cobro.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="usuarios-cell usuarios-actions-col">
                <div className="usuarios-actions">
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
