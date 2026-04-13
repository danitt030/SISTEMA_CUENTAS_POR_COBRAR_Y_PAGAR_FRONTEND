import { useState } from "react";
import "./facturaPorPagarList.css";

export const FacturaPorPagarList = ({
  facturas = [],
  onEdit = () => {},
  onToggleEstado = () => {},
  onVerSaldo = null,
  onVerificaLimite = null,
  onEliminarPermanente = null,
  loading = false,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  const getEstadoBadge = (estado) => {
    const styles = {
      PENDIENTE: "#ff9800",
      PARCIAL: "#ffc107",
      PAGADA: "#4caf50",
      VENCIDA: "#f44336",
    };
    return (
      <span className="estado-badge" style={{ backgroundColor: styles[estado] || "#999" }}>
        {estado}
      </span>
    );
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
    return <div className="factura-list"><p>Cargando facturas...</p></div>;
  }

  if (facturas.length === 0) {
    return <div className="factura-list"><p>No hay facturas disponibles</p></div>;
  }

  return (
    <div className="factura-list">
      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Proveedor</th>
            <th>Monto</th>
            <th>Fecha Emisión</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => {
            const isExpanded = expandedId === factura._id;
            const vencida = isVencida(factura.fechaVencimiento);
            const inactivo = factura.activo === false;
            return (
              <tr key={factura._id} className={`${vencida ? "vencida" : ""} ${inactivo ? "inactive-row" : ""}`}>
                <td>{factura.numeroFactura}</td>
                <td>{factura.proveedor?.nombre || factura.proveedorId}</td>
                <td>{formatCurrency(factura.monto, factura.moneda)}</td>
                <td>{formatDate(factura.fechaEmision)}</td>
                <td>{formatDate(factura.fechaVencimiento)}</td>
                <td>{getEstadoBadge(factura.estado)}</td>
                <td className="acciones">
                  <button onClick={() => setExpandedId(isExpanded ? null : factura._id)} className="btn-small">
                    {isExpanded ? "Ocultar" : "Ver"}
                  </button>
                  {onEdit && <button onClick={() => onEdit(factura)} className="btn-edit">Editar</button>}
                  {onVerSaldo && <button onClick={() => onVerSaldo(factura)} className="btn-info" title="Ver Saldo">💰</button>}
                  {onVerificaLimite && <button onClick={() => onVerificaLimite(factura)} className="btn-warning" title="Verificar Límite">💳</button>}
                  <button 
                    onClick={() => onToggleEstado(factura._id, factura.activo)} 
                    className={factura.activo === false ? "btn-reactivate" : "btn-pause"}
                    title={factura.activo === false ? "Reactivar" : "Desactivar"}
                  >
                    {factura.activo === false ? "▶ Reactivar" : "⏸ Desactivar"}
                  </button>
                  {onEliminarPermanente && <button onClick={() => onEliminarPermanente(factura._id)} className="btn-dark" title="Eliminar Permanentemente">❌</button>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
    </div>
  );
};
