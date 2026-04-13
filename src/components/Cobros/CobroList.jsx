import "./cobroList.css";

export const CobroList = ({ cobros = [], onEdit, onToggleEstado, onDeletePermanent, loading = false }) => {
  if (loading) {
    return <div className="cobro-list loading">Cargando cobros...</div>;
  }

  if (!cobros || cobros.length === 0) {
    return <div className="cobro-list empty">No hay cobros registrados</div>;
  }

  return (
    <div className="cobro-list">
      <table className="cobro-table">
        <thead>
          <tr>
            <th>Comprobante</th>
            <th>Factura</th>
            <th>Cliente</th>
            <th>Monto Cobrado</th>
            <th>Comisión</th>
            <th>Método Pago</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cobros.map((cobro) => (
            <tr key={cobro._id || cobro.id} className={cobro.activo ? "" : "inactive"}>
              <td className="comprobante">{cobro.numeroComprobante}</td>
              <td className="factura">{cobro.facturaPorCobrar?.numeroFactura || "N/A"}</td>
              <td className="cliente">{cobro.cliente?.nombre || "N/A"}</td>
              <td className="monto">Q {(cobro.montoCobrado || 0).toFixed(2)}</td>
              <td className="comision">Q {(cobro.comision || 0).toFixed(2)}</td>
              <td className="metodo">
                <span className={`badge badge-${cobro.metodoPago?.toLowerCase() || "unknown"}`}>
                  {cobro.metodoPago || "N/A"}
                </span>
              </td>
              <td className="fecha">{new Date(cobro.fechaCobro).toLocaleDateString("es-ES")}</td>
              <td className="estado">
                <span className={`status-badge ${cobro.activo ? "active" : "inactive"}`}>
                  {cobro.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="acciones">
                <button onClick={() => onEdit(cobro)} className="btn-icon btn-edit" title="Editar">
                  ✎
                </button>
                <button 
                  onClick={() => onToggleEstado(cobro._id || cobro.id, cobro.activo)} 
                  className={`btn-icon ${cobro.activo ? 'btn-delete' : 'btn-reactivate'}`} 
                  title={cobro.activo ? "Desactivar" : "Reactivar"}
                >
                  {cobro.activo ? '⏸' : '▶'}
                </button>
                {onDeletePermanent && (
                  <button onClick={() => onDeletePermanent(cobro._id || cobro.id)} className="btn-icon btn-delete-permanent" title="Eliminar permanentemente">
                    🗑️
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
