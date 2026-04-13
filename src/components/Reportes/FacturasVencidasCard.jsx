export const FacturasVencidasCard = ({ datos }) => {
  if (!datos.porCobrar && !datos.porPagar) {
    return <div className="alert alert-success">✅ No hay facturas vencidas</div>;
  }

  return (
    <div className="reporte-content">
      <h2>⚠️ Facturas Vencidas</h2>
      
      <div className="resumen-rapido">
        <div className="item">
          <span className="label">Por Cobrar:</span>
          <span className="valor danger">Q {datos.montoVencidoPorCobrar?.toFixed(2) || "0.00"}</span>
          <span className="cantidad">({datos.totalVencidasPorCobrar || 0} facturas)</span>
        </div>
        <div className="item">
          <span className="label">Por Pagar:</span>
          <span className="valor danger">Q {datos.montoVencidoPorPagar?.toFixed(2) || "0.00"}</span>
          <span className="cantidad">({datos.totalVencidasPorPagar || 0} facturas)</span>
        </div>
        {datos.diasPromedioPorCobrar > 0 && (
          <div className="item">
            <span className="label">Días Promedio Vencidas (Por Cobrar):</span>
            <span className="valor danger">{datos.diasPromedioPorCobrar} días</span>
          </div>
        )}
        {datos.diasPromedioPorPagar > 0 && (
          <div className="item">
            <span className="label">Días Promedio Vencidas (Por Pagar):</span>
            <span className="valor danger">{datos.diasPromedioPorPagar} días</span>
          </div>
        )}
      </div>

      {datos.porCobrar && datos.porCobrar.length > 0 && (
        <div className="tabla-seccion">
          <h3>📥 Por Cobrar (Vencidas)</h3>
          <div className="table-container">
            <table className="reporte-table vencidas">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Vencimiento</th>
                  <th>Días Vencida</th>
                </tr>
              </thead>
              <tbody>
                {datos.porCobrar.map((factura) => {
                  const hoy = new Date();
                  const venc = new Date(factura.fechaVencimiento);
                  const diasVencida = Math.abs(Math.floor((hoy - venc) / (1000 * 60 * 60 * 24)));
                  return (
                    <tr key={factura._id} className="vencida-row">
                      <td className="bold">{factura.numeroFactura}</td>
                      <td>{factura.cliente?.nombre}</td>
                      <td className="text-right danger">Q {factura.monto.toFixed(2)}</td>
                      <td className="text-center">{new Date(factura.fechaVencimiento).toLocaleDateString()}</td>
                      <td className="text-center danger bold">👆 {diasVencida} días</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {datos.porPagar && datos.porPagar.length > 0 && (
        <div className="tabla-seccion">
          <h3>📤 Por Pagar (Vencidas)</h3>
          <div className="table-container">
            <table className="reporte-table vencidas">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Proveedor</th>
                  <th>Monto</th>
                  <th>Vencimiento</th>
                  <th>Días Vencida</th>
                </tr>
              </thead>
              <tbody>
                {datos.porPagar.map((factura) => {
                  const hoy = new Date();
                  const venc = new Date(factura.fechaVencimiento);
                  const diasVencida = Math.abs(Math.floor((hoy - venc) / (1000 * 60 * 60 * 24)));
                  return (
                    <tr key={factura._id} className="vencida-row">
                      <td className="bold">{factura.numeroFactura}</td>
                      <td>{factura.proveedor?.nombre}</td>
                      <td className="text-right danger">Q {factura.monto.toFixed(2)}</td>
                      <td className="text-center">{new Date(factura.fechaVencimiento).toLocaleDateString()}</td>
                      <td className="text-center danger bold">👆 {diasVencida} días</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(!datos.porCobrar || datos.porCobrar.length === 0) && (!datos.porPagar || datos.porPagar.length === 0) && (
        <div className="alert alert-success">✅ Excelente! No hay facturas vencidas</div>
      )}
    </div>
  );
};
