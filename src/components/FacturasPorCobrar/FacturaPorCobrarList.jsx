
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
