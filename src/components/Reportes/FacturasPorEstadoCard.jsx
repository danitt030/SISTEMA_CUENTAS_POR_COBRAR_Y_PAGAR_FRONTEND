export const FacturasPorEstadoCard = ({ datos }) => {
  if (!datos.porCobrar && !datos.porPagar) {
    return <div className="alert alert-error">No hay datos de estados</div>;
  }

  return (
    <div className="reporte-content">
      <h2>Facturas por Estado</h2>
      
      <div className="estado-grid">
        {/* Por Cobrar */}
        {datos.porCobrar && datos.porCobrar.length > 0 && (
          <div className="estado-seccion">
            <h3>Por Cobrar</h3>
            <div className="estado-items">
              {datos.porCobrar.map((estado) => (
                <div key={`cobrar-${estado.estado}`} className="estado-item">
                  <div className="estado-badge">{estado.estado}</div>
                  <div className="estado-stats">
                    <div className="stat">
                      <span className="label">Cantidad:</span>
                      <span className="valor">{estado.cantidad}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Monto:</span>
                      <span className="valor">Q {estado.monto.toFixed(2)}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Promedio:</span>
                      <span className="valor">Q {(estado.monto / estado.cantidad).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pie-section">
                    <div className="pie" style={{ 
                      background: `conic-gradient(#4CAF50 0deg ${(estado.cantidad / datos.porCobrar.reduce((s, e) => s + e.cantidad, 0)) * 360}deg, #ddd ${(estado.cantidad / datos.porCobrar.reduce((s, e) => s + e.cantidad, 0)) * 360}deg)`
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Por Pagar */}
        {datos.porPagar && datos.porPagar.length > 0 && (
          <div className="estado-seccion">
            <h3>Por Pagar</h3>
            <div className="estado-items">
              {datos.porPagar.map((estado) => (
                <div key={`pagar-${estado.estado}`} className="estado-item">
                  <div className="estado-badge">{estado.estado}</div>
                  <div className="estado-stats">
                    <div className="stat">
                      <span className="label">Cantidad:</span>
                      <span className="valor">{estado.cantidad}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Monto:</span>
                      <span className="valor">Q {estado.monto.toFixed(2)}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Promedio:</span>
                      <span className="valor">Q {(estado.monto / estado.cantidad).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pie-section">
                    <div className="pie" style={{ 
                      background: `conic-gradient(#FF9800 0deg ${(estado.cantidad / datos.porPagar.reduce((s, e) => s + e.cantidad, 0)) * 360}deg, #ddd ${(estado.cantidad / datos.porPagar.reduce((s, e) => s + e.cantidad, 0)) * 360}deg)`
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
