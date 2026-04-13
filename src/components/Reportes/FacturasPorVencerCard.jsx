export const FacturasPorVencerCard = ({ datos }) => {
  if (!datos.porCobrar && !datos.porPagar) {
    return <div className="alert alert-error">No hay facturas próximas a vencer</div>;
  }

  return (
    <div className="reporte-content">
      <h2>⏰ Facturas por Vencer (Próximos 30 días)</h2>
      
      <div className="resumen-rapido">
        <div className="item">
          <span className="label">Por Cobrar:</span>
          <span className="valor">Q {datos.montoTotalPorCobrar?.toFixed(2) || "0.00"}</span>
          <span className="cantidad">({datos.totalPorCobrar || 0} facturas)</span>
        </div>
        <div className="item">
          <span className="label">Por Pagar:</span>
          <span className="valor">Q {datos.montoTotalPorPagar?.toFixed(2) || "0.00"}</span>
          <span className="cantidad">({datos.totalPorPagar || 0} facturas)</span>
        </div>
      </div>

      {datos.porCobrar && datos.porCobrar.length > 0 && (
        <div className="tabla-seccion">
          <h3>📥 Por Cobrar</h3>
          <div className="table-container">
            <table className="reporte-table">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Vencimiento</th>
                  <th>Días</th>
                </tr>
              </thead>
              <tbody>
                {datos.porCobrar.map((factura) => {
                  const hoy = new Date();
                  const venc = new Date(factura.fechaVencimiento);
                  const dias = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={factura._id} className={dias <= 7 ? "urgente" : ""}>
                      <td className="bold">{factura.numeroFactura}</td>
                      <td>{factura.cliente?.nombre}</td>
                      <td className="text-right">Q {factura.monto.toFixed(2)}</td>
                      <td className="text-center">{new Date(factura.fechaVencimiento).toLocaleDateString()}</td>
                      <td className="text-center">{dias}</td>
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
          <h3>📤 Por Pagar</h3>
          <div className="table-container">
            <table className="reporte-table">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Proveedor</th>
                  <th>Monto</th>
                  <th>Vencimiento</th>
                  <th>Días</th>
                </tr>
              </thead>
              <tbody>
                {datos.porPagar.map((factura) => {
                  const hoy = new Date();
                  const venc = new Date(factura.fechaVencimiento);
                  const dias = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={factura._id} className={dias <= 7 ? "urgente" : ""}>
                      <td className="bold">{factura.numeroFactura}</td>
                      <td>{factura.proveedor?.nombre}</td>
                      <td className="text-right">Q {factura.monto.toFixed(2)}</td>
                      <td className="text-center">{new Date(factura.fechaVencimiento).toLocaleDateString()}</td>
                      <td className="text-center">{dias}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
