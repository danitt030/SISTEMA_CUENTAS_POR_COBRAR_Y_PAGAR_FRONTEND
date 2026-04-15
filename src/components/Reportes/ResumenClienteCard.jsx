export const ResumenClienteCard = ({ datos }) => {
  if (!datos.clientes || datos.clientes.length === 0) {
    return <div className="alert alert-error">No hay clientes con facturas</div>;
  }

  return (
    <div className="reporte-content">
      <h2>👥 Resumen por Cliente</h2>
      <p className="subtitle">Total de clientes: {datos.cantidad}</p>
      
      <div className="table-container table-container-white">
        <table className="reporte-table reporte-table-white reporte-table-resumen-cliente">
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Total Facturas</th>
              <th>Cantidad</th>
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody>
            {datos.clientes.map((cliente, idx) => (
              <tr key={cliente._id} className={idx % 2 === 0 ? "even" : "odd"}>
                <td className="text-center">{idx + 1}</td>
                <td className="cliente-name">{cliente.nombreCliente}</td>
                <td className="text-right valor">Q {cliente.totalFacturas.toFixed(2)}</td>
                <td className="text-center">{cliente.cantidad}</td>
                <td className="text-right">Q {(cliente.totalFacturas / cliente.cantidad).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="totals-row">
              <td colSpan="2" className="text-right">TOTAL</td>
              <td className="text-right valor bold">
                Q {datos.clientes.reduce((sum, c) => sum + c.totalFacturas, 0).toFixed(2)}
              </td>
              <td className="text-center bold">
                {datos.clientes.reduce((sum, c) => sum + c.cantidad, 0)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
