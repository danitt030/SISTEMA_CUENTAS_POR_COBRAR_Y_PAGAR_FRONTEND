import { useNavigate } from "react-router-dom";
import "./facturaPorPagarDetail.css";

export const FacturaPorPagarDetail = ({ factura }) => {
  const navigate = useNavigate();

  if (!factura) {
    return <div className="factura-detail"><p>Factura no encontrada</p></div>;
  }

  const getEstadoColor = (estado) => {
    const colors = {
      PENDIENTE: "#ff9800",
      PARCIAL: "#ffc107",
      PAGADA: "#4caf50",
      VENCIDA: "#f44336",
    };
    return colors[estado] || "#999";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    const symbols = { GTQ: "Q", USD: "$", EUR: "€" };
    return `${symbols[factura.moneda] || factura.moneda} ${parseFloat(amount || 0).toFixed(2)}`;
  };

  return (
    <div className="factura-detail">
      <button onClick={() => navigate(-1)} className="btn-back">← Atrás</button>

      <div className="detail-header">
        <h2>{factura.numeroFactura}</h2>
        <span
          className="estado-badge"
          style={{ backgroundColor: getEstadoColor(factura.estado) }}
        >
          {factura.estado}
        </span>
      </div>

      <div className="detail-grid">
        <div className="detail-item">
          <label>Proveedor:</label>
          <p>{factura.proveedor?.nombre || factura.proveedorId}</p>
        </div>
        <div className="detail-item">
          <label>Monto:</label>
          <p className="monto">{formatCurrency(factura.monto)}</p>
        </div>
        <div className="detail-item">
          <label>Moneda:</label>
          <p>{factura.moneda}</p>
        </div>
        <div className="detail-item">
          <label>Fecha Emisión:</label>
          <p>{formatDate(factura.fechaEmision)}</p>
        </div>
        <div className="detail-item">
          <label>Fecha Vencimiento:</label>
          <p>{formatDate(factura.fechaVencimiento)}</p>
        </div>
        <div className="detail-item full-width">
          <label>Descripción:</label>
          <p>{factura.descripcion || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};
