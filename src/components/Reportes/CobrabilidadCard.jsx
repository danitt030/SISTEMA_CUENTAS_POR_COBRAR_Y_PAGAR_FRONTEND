export const CobrabilidadCard = ({ datos }) => {
  if (!datos.analisisCobrabilidad) {
    return <div className="alert alert-error">No hay datos de cobrabilidad</div>;
  }

  const a = datos.analisisCobrabilidad;

  return (
    <div className="reporte-content">
      <h2>Análisis de Cobrabilidad</h2>
      
      <div className="analisis-grid">
        <div className="analisis-card">
          <h3>Total de Facturas</h3>
          <div className="numero">{a.totalFacturas}</div>
          <p>Facturas emitidas por cobrar</p>
        </div>

        <div className="analisis-card">
          <h3>Monto Total</h3>
          <div className="numero">Q {a.montoTotalFacturas.toFixed(2)}</div>
          <p>Monto total en facturas</p>
        </div>

        <div className="analisis-card success">
          <h3>Monto Cobrado</h3>
          <div className="numero">Q {a.montoCobrado.toFixed(2)}</div>
          <p>Dinero ya recibido</p>
        </div>

        <div className="analisis-card warning">
          <h3>Monto Pendiente</h3>
          <div className="numero">Q {a.montoPendiente.toFixed(2)}</div>
          <p>Aún por cobrar</p>
        </div>
      </div>

      <div className="analisis-detalle">
        <div className="detalle-item">
          <span className="label">Porcentaje de Cobrabilidad:</span>
          <div className="progress-bar large">
            <div 
              className="progress-fill" 
              style={{ width: a.porcentajeCobrabilidad.replace('%', '') + '%' }}
            ></div>
          </div>
          <span className="percentage bold">{a.porcentajeCobrabilidad}</span>
        </div>

        <div className="detalle-item">
          <span className="label">Total de Comisiones Pagadas:</span>
          <span className="valor">Q {a.totalComisiones.toFixed(2)}</span>
        </div>

        <div className="detalle-item">
          <span className="label">Monto Neto Cobrado (sin comisiones):</span>
          <span className="valor success">Q {a.montoNetoCobrado.toFixed(2)}</span>
        </div>

        <div className="detalle-item">
          <span className="label">Tasa de Comisión Promedio:</span>
          <span className="valor">{a.tasaComision}</span>
        </div>
      </div>

      {a.porcentajeCobrabilidad >= "80%" && (
        <div className="alert alert-success">Excelente desempeño en cobranza</div>
      )}
      {a.porcentajeCobrabilidad >= "60%" && a.porcentajeCobrabilidad < "80%" && (
        <div className="alert alert-info">Cobranza en buen nivel</div>
      )}
      {a.porcentajeCobrabilidad < "60%" && (
        <div className="alert alert-warning">Cobranza por debajo de lo esperado</div>
      )}
    </div>
  );
};
