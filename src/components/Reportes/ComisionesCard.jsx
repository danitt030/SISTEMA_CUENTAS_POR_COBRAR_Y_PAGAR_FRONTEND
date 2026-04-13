export const ComisionesCard = ({ datos }) => {
  if (!datos.comisiones) {
    return <div className="alert alert-error">No hay datos de comisiones</div>;
  }

  const c = datos.comisiones;

  return (
    <div className="reporte-content">
      <h2>💵 Análisis de Comisiones</h2>
      
      <div className="comisiones-grid">
        <div className="comision-card">
          <h3>💰 Total de Comisiones</h3>
          <div className="numero">Q {c.totalComisiones.toFixed(2)}</div>
          <p>Comisiones cobradas</p>
        </div>

        <div className="comision-card">
          <h3>🤝 Total de Cobros</h3>
          <div className="numero">Q {c.totalCobros.toFixed(2)}</div>
          <p>Dinero total cobrado</p>
        </div>

        <div className="comision-card">
          <h3>✅ Monto Neto</h3>
          <div className="numero">Q {c.totalNeto.toFixed(2)}</div>
          <p>Después de comisiones</p>
        </div>

        <div className="comision-card">
          <h3>📊 Cantidad de Cobros</h3>
          <div className="numero">{c.cantidadCobros}</div>
          <p>Total de operaciones</p>
        </div>
      </div>

      <div className="comisiones-detalle">
        <div className="detalle-seccion">
          <h3>📈 Estadísticas</h3>
          
          <div className="detalle-item">
            <span className="label">Comisión Promedio por Cobro:</span>
            <span className="valor">Q {c.comisionPromedio}</span>
          </div>

          <div className="detalle-item">
            <span className="label">Tasa de Comisión Promedio:</span>
            <span className="valor">{c.tasaComisionPromedio}</span>
          </div>

          <div className="detalle-item">
            <span className="label">Comisión vs Cobros:</span>
            <div className="progress-bar large">
              <div 
                className="progress-fill warning" 
                style={{ width: c.tasaComisionPromedio.replace('%', '') + '%' }}
              ></div>
            </div>
            <span className="percentage">{c.tasaComisionPromedio}</span>
          </div>

          <div className="detalle-item">
            <span className="label">Rentabilidad Neta:</span>
            <span className="valor success">
              {((c.totalCobros - c.totalComisiones) / c.totalCobros * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="comisiones-resumen">
          <table className="comisiones-tabla">
            <tbody>
              <tr>
                <td className="label">Total Cobros:</td>
                <td className="valor">Q {c.totalCobros.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="label">(-) Comisiones:</td>
                <td className="valor danger">Q {c.totalComisiones.toFixed(2)}</td>
              </tr>
              <tr className="totals-row">
                <td className="label bold">→ Ingreso Neto:</td>
                <td className="valor bold success">Q {c.totalNeto.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {parseFloat(c.tasaComisionPromedio) <= 5 && (
        <div className="alert alert-success">✅ Tasa de comisiones excelente</div>
      )}
      {parseFloat(c.tasaComisionPromedio) > 5 && parseFloat(c.tasaComisionPromedio) <= 10 && (
        <div className="alert alert-info">ℹ️ Tasa de comisiones adecuada</div>
      )}
      {parseFloat(c.tasaComisionPromedio) > 10 && (
        <div className="alert alert-warning">⚠️ Tasa de comisiones alta</div>
      )}
    </div>
  );
};
