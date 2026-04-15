export const TopClientesCard = ({ datos }) => {
  if (!datos.topDeudores || datos.topDeudores.length === 0) {
    return <div className="alert alert-success">No hay clientes con deuda</div>;
  }

  const totalDeuda = datos.topDeudores.reduce((sum, c) => sum + c.totalDeuda, 0);

  return (
    <div className="reporte-content">
      <h2>Top Clientes Deudores</h2>
      <p className="subtitle">Total de clientes con deuda: {datos.cantidad}</p>
      
      <div className="top-list">
        {datos.topDeudores.map((cliente, idx) => {
          const porcentaje = (cliente.totalDeuda / totalDeuda) * 100;
          return (
            <div key={cliente._id} className="top-item">
              <div className="top-rank">#{idx + 1}</div>
              <div className="top-info">
                <div className="top-nombre">{cliente.nombreCliente}</div>
                <div className="top-detalles">
                  <span className="detalle">Deuda: Q {cliente.totalDeuda.toFixed(2)}</span>
                  <span className="detalle">Facturas: {cliente.cantidadFacturas}</span>
                </div>
              </div>
              <div className="top-stats">
                <div className="top-porcentaje">{porcentaje.toFixed(1)}%</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill danger" 
                    style={{ width: porcentaje + '%' }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="top-summary">
        <div className="summary-item">
          <span className="label">Deuda Total:</span>
          <span className="valor danger bold">Q {totalDeuda.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Deuda Promedio:</span>
          <span className="valor">Q {(totalDeuda / datos.topDeudores.length).toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Mayor Deuda:</span>
          <span className="valor danger">
            Q {Math.max(...datos.topDeudores.map(c => c.totalDeuda)).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
