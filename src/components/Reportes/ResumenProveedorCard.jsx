export const ResumenProveedorCard = ({ datos }) => {
  if (!datos.proveedores || datos.proveedores.length === 0) {
    return <div className="alert alert-error">No hay proveedores con facturas</div>;
  }

  return (
    <div className="reporte-content">
      <h2>🏭 Resumen por Proveedor</h2>
      <p className="subtitle">Total de proveedores: {datos.cantidad}</p>
      
      <div className="table-container">
        <table className="reporte-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Proveedor</th>
              <th>Total Facturas</th>
              <th>Cantidad</th>
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody>
            {datos.proveedores.map((proveedor, idx) => (
              <tr key={proveedor._id} className={idx % 2 === 0 ? "even" : "odd"}>
                <td className="text-center">{idx + 1}</td>
                <td className="proveedor-name">{proveedor.nombreProveedor}</td>
                <td className="text-right valor">Q {proveedor.totalFacturas.toFixed(2)}</td>
                <td className="text-center">{proveedor.cantidad}</td>
                <td className="text-right">Q {(proveedor.totalFacturas / proveedor.cantidad).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="totals-row">
              <td colSpan="2" className="text-right">TOTAL</td>
              <td className="text-right valor bold">
                Q {datos.proveedores.reduce((sum, p) => sum + p.totalFacturas, 0).toFixed(2)}
              </td>
              <td className="text-center bold">
                {datos.proveedores.reduce((sum, p) => sum + p.cantidad, 0)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
