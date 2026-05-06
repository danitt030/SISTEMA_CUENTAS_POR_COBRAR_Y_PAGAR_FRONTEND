import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const MotionDiv = motion.div;
const MotionRow = motion.tr;

export const FacturaPorPagarList = ({
  facturas = [],
  onEdit = () => {},
  onToggleEstado = () => {},
  onVerSaldo = null,
  onVerificaLimite = null,
  onEliminarPermanente = null,
  onVerDetalle = null,
  loading = false,
}) => {
  const reduceMotion = useReducedMotion();
  const [expandedId, _setExpandedId] = useState(null);

  const getEstadoBadgeClass = (estado) => {
    const classes = {
      PENDIENTE: "usuario-role-gerencia",
      PARCIAL: "usuario-role-contador",
      PAGADA: "usuario-role-gerente",
      VENCIDA: "usuario-role-admin",
    };

    return classes[estado] || "usuario-role-default";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-GT");
  };

  const formatCurrency = (amount, currency = "GTQ") => {
    const symbols = { GTQ: "Q", USD: "$", EUR: "€" };
    return `${symbols[currency] || currency} ${parseFloat(amount || 0).toFixed(2)}`;
  };

  const isVencida = (fechaVencimiento) => {
    return new Date(fechaVencimiento) < new Date();
  };

  if (loading) {
    return <div className="usuarios-empty-state">Cargando facturas...</div>;
  }

  if (facturas.length === 0) {
    return <div className="usuarios-empty-state">No hay facturas disponibles</div>;
  }

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
            <th>Proveedor</th>
            <th>Monto</th>
            <th>Fecha Emisión</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th className="usuarios-actions-col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura, index) => {
            const vencida = isVencida(factura.fechaVencimiento);
            const inactivo = factura.activo === false;
            return (
              <MotionRow
                key={factura._id}
                className={`usuarios-row ${vencida ? "vencida" : ""} ${inactivo ? "usuarios-row-disabled" : ""}`}
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.18,
                  delay: reduceMotion ? 0 : Math.min(index * 0.02, 0.18),
                }}
              >
                <td className="usuarios-cell usuario-name">{factura.numeroFactura}</td>
                <td className="usuarios-cell usuario-mail">{factura.proveedor?.nombre || factura.proveedorId}</td>
                <td className="usuarios-cell">{formatCurrency(factura.monto, factura.moneda)}</td>
                <td className="usuarios-cell usuario-mail">{formatDate(factura.fechaEmision)}</td>
                <td className="usuarios-cell usuario-mail">{formatDate(factura.fechaVencimiento)}</td>
                <td className="usuarios-cell">
                  <span className={`usuario-role-chip ${getEstadoBadgeClass(factura.estado)}`}>
                    {factura.estado}
                  </span>
                </td>
                <td className="usuarios-cell usuarios-actions-col">
                  <div className="usuarios-actions">
                  {onVerDetalle && (
                    <button 
                      onClick={() => onVerDetalle(factura)} 
                      className="action-btn action-btn-view"
                      title="Ver detalles de la factura"
                    >
                      Ver
                    </button>
                  )}
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
                  {onVerificaLimite && (
                    <button 
                      onClick={() => onVerificaLimite(factura)} 
                      className="action-btn action-btn-warning"
                      title="Verificar límite de crédito"
                    >
                      Limite
                    </button>
                  )}
                  <button 
                    onClick={() => onToggleEstado(factura._id, factura.activo)} 
                    className={factura.activo === false ? "action-btn action-btn-success" : "action-btn action-btn-danger"}
                    title={factura.activo === false ? "Reactivar factura" : "Desactivar factura"}
                  >
                    {factura.activo === false ? "Activar" : "Desactivar"}
                  </button>
                  {onEliminarPermanente && (
                    <button 
                      onClick={() => onEliminarPermanente(factura._id)} 
                      className="action-btn action-btn-dark"
                      title="Eliminar permanentemente"
                    >
                      Eliminar
                    </button>
                  )}
                  </div>
                </td>
              </MotionRow>
            );
          })}
        </tbody>
      </table>
      </div>

      {expandedId && (
        <div className="factura-detail-expanded">
          {facturas.find(f => f._id === expandedId) && (
            <div className="detail-content">
              <h4>Detalles de Factura</h4>
              <p><strong>Descripción:</strong> {facturas.find(f => f._id === expandedId).descripcion || "N/A"}</p>
            </div>
          )}
        </div>
      )}
    </MotionDiv>
  );
};
