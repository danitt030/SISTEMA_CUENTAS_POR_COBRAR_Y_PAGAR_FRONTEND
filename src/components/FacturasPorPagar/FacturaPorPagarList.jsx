import { useState } from "react";

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
  const [expandedId, _setExpandedId] = useState(null);

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
