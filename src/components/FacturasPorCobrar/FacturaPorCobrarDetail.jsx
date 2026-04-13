export const FacturaPorCobrarDetail = ({ factura, onClose }) => {
  if (!factura) return null;

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "badge-warning";
      case "PARCIAL":
        return "badge-info";
      case "COBRADA":
        return "badge-success";
      case "VENCIDA":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  return (
    <div className="factura-detail">
      <div className="detail-header">
        <h2>Detalle Factura: {factura.numeroFactura}</h2>
        <button onClick={onClose} className="btn-close">×</button>
      </div>

      <div className="detail-content">
        <div className="detail-grid">
          <div className="detail-item">
            <label>Cliente:</label>
            <span>{factura.cliente?.nombre || "N/A"}</span>
          </div>

          <div className="detail-item">
            <label>Número de Factura:</label>
            <span>{factura.numeroFactura}</span>
          </div>

          <div className="detail-item">
            <label>Monto:</label>
            <span>{factura.monto.toFixed(2)} {factura.moneda}</span>
          </div>

          <div className="detail-item">
            <label>Estado:</label>
            <span className={`badge ${getEstadoBadgeColor(factura.estado)}`}>
              {factura.estado}
            </span>
          </div>

          <div className="detail-item">
            <label>Fecha de Emisión:</label>
            <span>{new Date(factura.fechaEmision).toLocaleDateString()}</span>
          </div>

          <div className="detail-item">
            <label>Fecha de Vencimiento:</label>
            <span>{new Date(factura.fechaVencimiento).toLocaleDateString()}</span>
          </div>

          <div className="detail-item full-width">
            <label>Descripción:</label>
            <span>{factura.descripcion || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
