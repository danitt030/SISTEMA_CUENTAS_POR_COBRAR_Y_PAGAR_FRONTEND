export const PagabilidadCard = ({ datos }) => {
  if (!datos.analisisPagabilidad) {
    return <div className="alert alert-error">No hay datos de pagabilidad</div>;
  }

  const a = datos.analisisPagabilidad;

  return (
    <div className="reporte-content">
      <h2>Análisis de Pagabilidad</h2>
      
      <div className="analisis-grid">
        <div className="analisis-card">
          <h3>Total de Facturas</h3>
          <div className="numero">{a.totalFacturas}</div>
          <p>Facturas por pagar</p>
        </div>

        <div className="analisis-card">
          <h3>Monto Total</h3>
          <div className="numero">Q {a.montoTotalFacturas.toFixed(2)}</div>
          <p>Monto total en facturas</p>
        </div>

        <div className="analisis-card success">
          <h3>Monto Pagado</h3>
          <div className="numero">Q {a.montoPagado.toFixed(2)}</div>
          <p>Dinero ya pagado</p>
        </div>

        <div className="analisis-card warning">
          <h3>Monto Pendiente</h3>
          <div className="numero">Q {a.montoPendiente.toFixed(2)}</div>
          <p>Aún por pagar</p>
        </div>
      </div>

      <div className="analisis-detalle">
        <div className="detalle-item">
          <span className="label">Porcentaje de Pagabilidad:</span>
          <div className="progress-bar large">
            <div 
              className="progress-fill" 
              style={{ width: a.porcentajePagabilidad.replace('%', '') + '%' }}
            ></div>
          </div>
          <span className="percentage bold">{a.porcentajePagabilidad}</span>
        </div>

        <div className="detalle-item">
          <span className="label">Cantidad Total de Pagos:</span>
          <span className="valor">{a.cantidadPagos}</span>
        </div>

        <div className="detalle-item">
          <span className="label">Monto Promedio por Pago:</span>
          <span className="valor">
            Q {a.cantidadPagos > 0 ? (a.montoPagado / a.cantidadPagos).toFixed(2) : "0.00"}
          </span>
        </div>
      </div>

      {a.porcentajePagabilidad >= "80%" && (
        <div className="alert alert-success">Excelente desempeño en pagos</div>
      )}
      {a.porcentajePagabilidad >= "60%" && a.porcentajePagabilidad < "80%" && (
        <div className="alert alert-info">Pagos en buen nivel</div>
      )}
      {a.porcentajePagabilidad < "60%" && (
        <div className="alert alert-warning">Pagos por debajo de lo esperado</div>
      )}
    </div>
  );
};
