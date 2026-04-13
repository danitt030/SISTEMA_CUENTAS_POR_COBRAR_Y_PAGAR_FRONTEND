import "./facturaPorCobrarList.css";

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

  const formatoMoneda = (monto, moneda) => {
    const simbolos = { GTQ: "Q ", USD: "$ ", EUR: "€ " };
    return (simbolos[moneda] || "") + monto.toFixed(2);
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (!facturas || facturas.length === 0) return <div className="no-data">No hay facturas</div>;

  return (
    <div className="facturas-list">
      <table className="table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Vencimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura._id} className={factura.activo === false ? "inactive-row" : ""}>
              <td>{factura.numeroFactura}</td>
              <td>{factura.cliente?.nombre || "N/A"}</td>
              <td>{formatoMoneda(factura.monto, factura.moneda)}</td>
              <td>
                <span className={`badge ${getEstadoBadgeColor(factura.estado)}`}>
                  {factura.estado}
                </span>
              </td>
              <td>{new Date(factura.fechaVencimiento).toLocaleDateString()}</td>
              <td className="actions">
                <button onClick={() => onEdit(factura)} className="btn-edit">Editar</button>
                {onVerSaldo && <button onClick={() => onVerSaldo(factura)} className="btn-info" title="Ver Saldo">💰</button>}
                {onVerFacturasCliente && <button onClick={() => onVerFacturasCliente(factura)} className="btn-primary" title="Facturas del Cliente">📋</button>}
                {onMarcarVencida && <button onClick={() => onMarcarVencida(factura._id)} className="btn-warning" title="Marcar Vencida">⏰</button>}
                {onEnviarRecordatorio && <button onClick={() => onEnviarRecordatorio(factura._id)} className="btn-secondary" title="Enviar Recordatorio">📧</button>}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};
