export const TopProveedoresCard = ({ datos }) => {
  if (!datos.topAcreedores || datos.topAcreedores.length === 0) {
    return <div className="alert alert-success">✅ No hay proveedores con deuda</div>;
  }

  const totalDeuda = datos.topAcreedores.reduce((sum, p) => sum + p.totalDeuda, 0);

  return (
    <div className="reporte-content">
      <h2>🥈 Top Proveedores Acreedores</h2>
      <p className="subtitle">Total de proveedores a los que se debe: {datos.cantidad}</p>
      
      <div className="top-list">
        {datos.topAcreedores.map((proveedor, idx) => {
          const porcentaje = (proveedor.totalDeuda / totalDeuda) * 100;
          return (
            <div key={proveedor._id} className="top-item">
              <div className="top-rank">#{idx + 1}</div>
              <div className="top-info">
                <div className="top-nombre">{proveedor.nombreProveedor}</div>
                <div className="top-detalles">
                  <span className="detalle">Deuda: Q {proveedor.totalDeuda.toFixed(2)}</span>
                  <span className="detalle">Facturas: {proveedor.cantidadFacturas}</span>
                </div>
              </div>
              <div className="top-stats">
                <div className="top-porcentaje">{porcentaje.toFixed(1)}%</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill warning" 
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
          <span className="valor warning bold">Q {totalDeuda.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Deuda Promedio:</span>
          <span className="valor">Q {(totalDeuda / datos.topAcreedores.length).toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Mayor Deuda:</span>
          <span className="valor warning">
            Q {Math.max(...datos.topAcreedores.map(p => p.totalDeuda)).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
