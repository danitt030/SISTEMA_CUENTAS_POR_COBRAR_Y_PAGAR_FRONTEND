
import { motion, useReducedMotion } from "framer-motion";

const MotionDiv = motion.div;
const MotionRow = motion.tr;

export const FacturaPorCobrarList = ({ 
  facturas, 
  onEdit, 
  onToggleEstado, 
  onVerSaldo,
  onVerFacturasCliente,
  onMarcarVencida,
  onEnviarRecordatorio,
  onEliminarPermanente,
  loading 
}) => {
  const reduceMotion = useReducedMotion();

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "usuario-role-gerencia";
      case "PARCIAL":
        return "usuario-role-contador";
      case "COBRADA":
        return "usuario-role-gerente";
      case "VENCIDA":
        return "usuario-role-admin";
      default:
        return "usuario-role-default";
    }
  };

  const formatoMoneda = (monto, moneda) => {
    const simbolos = { GTQ: "Q ", USD: "$ ", EUR: "€ " };
    return (simbolos[moneda] || "") + monto.toFixed(2);
  };

  if (loading) return <div className="usuarios-empty-state">Cargando...</div>;
  if (!facturas || facturas.length === 0) return <div className="usuarios-empty-state">No hay facturas</div>;

  return (
    <MotionDiv
      className="usuarios-table-shell"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="overflow-x-auto">
      <table className="usuarios-table">
        <thead className="usuarios-table-head">
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Vencimiento</th>
            <th className="usuarios-actions-col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura, index) => (
            <MotionRow
              key={factura._id}
              className={`usuarios-row ${factura.activo === false ? "usuarios-row-disabled" : ""}`}
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.18,
                delay: reduceMotion ? 0 : Math.min(index * 0.02, 0.18),
              }}
            >
              <td className="usuarios-cell usuario-name">{factura.numeroFactura}</td>
              <td className="usuarios-cell usuario-mail">{factura.cliente?.nombre || "N/A"}</td>
              <td className="usuarios-cell">{formatoMoneda(factura.monto, factura.moneda)}</td>
              <td className="usuarios-cell">
                <span className={`usuario-role-chip ${getEstadoBadgeColor(factura.estado)}`}>
                  {factura.estado}
                </span>
              </td>
              <td className="usuarios-cell usuario-mail">{new Date(factura.fechaVencimiento).toLocaleDateString()}</td>
                <td className="usuarios-cell usuarios-actions-col">
                <div className="usuarios-actions">
                {onEdit && (
                  <button 
                    onClick={() => onEdit(factura)} 
                      className="action-btn action-btn-edit"
                    title="Editar factura"
                  >
                      Editar
                  </button>
                )}
                {onVerSaldo && (
                  <button 
                    onClick={() => onVerSaldo(factura)} 
                      className="action-btn action-btn-success"
                    title="Ver saldo pendiente"
                  >
                      Saldo
                  </button>
                )}
                {onVerFacturasCliente && (
                  <button 
                    onClick={() => onVerFacturasCliente(factura)} 
                      className="action-btn action-btn-info"
                    title="Ver facturas del cliente"
                  >
                      Facturas
                  </button>
                )}
                {onMarcarVencida && (
                  <button 
                    onClick={() => onMarcarVencida(factura._id)} 
                      className="action-btn action-btn-warning"
                    title="Marcar como vencida"
                  >
                      Vencida
                  </button>
                )}
                {onEnviarRecordatorio && (
                  <button 
                    onClick={() => onEnviarRecordatorio(factura._id)} 
                      className="action-btn action-btn-purple"
                    title="Enviar recordatorio de pago"
                  >
                      Recordar
                  </button>
                )}
                {onToggleEstado && (
                  <button 
                    onClick={() => onToggleEstado(factura)} 
                      className={factura.activo === false ? "action-btn action-btn-success" : "action-btn action-btn-danger"}
                    title={factura.activo === false ? "Reactivar factura" : "Desactivar factura"}
                  >
                      {factura.activo === false ? "Activar" : "Desactivar"}
                  </button>
                )}
                {onEliminarPermanente && (
                  <button 
                    onClick={() => onEliminarPermanente(factura)} 
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
