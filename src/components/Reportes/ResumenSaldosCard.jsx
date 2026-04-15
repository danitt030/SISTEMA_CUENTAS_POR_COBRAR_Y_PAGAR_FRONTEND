export const ResumenSaldosCard = ({ datos }) => {
  if (!datos.resumen) return <div className="alert alert-error">No hay datos disponibles</div>;

  const r = datos.resumen;

  return (
    <div className="reporte-content">
      <h2>Resumen de Saldos</h2>
      
      <div className="saldos-grid">
        {/* Facturas por Pagar */}
        <div className="saldo-card pagar">
          <h3>Facturas por Pagar</h3>
          <div className="saldo-item">
            <span className="label">Total:</span>
            <span className="valor">Q {r.facturasPorPagar.total.toFixed(2)}</span>
          </div>
          <div className="saldo-item">
            <span className="label">Pagado:</span>
            <span className="valor success">Q {r.facturasPorPagar.pagado.toFixed(2)}</span>
          </div>
          <div className="saldo-item">
            <span className="label">Pendiente:</span>
            <span className="valor warning">Q {r.facturasPorPagar.pendiente.toFixed(2)}</span>
          </div>
          <div className="saldo-item">
            <span className="label">Progreso:</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: r.facturasPorPagar.porcentajePagado }}
              ></div>
            </div>
            <span className="percentage">{r.facturasPorPagar.porcentajePagado}</span>
          </div>
        </div>

        {/* Facturas por Cobrar */}
        <div className="saldo-card cobrar">
          <h3>Facturas por Cobrar</h3>
          <div className="saldo-item">
            <span className="label">Total:</span>
            <span className="valor">Q {r.facturasPorCobrar.total.toFixed(2)}</span>
          </div>
          <div className="saldo-item">
            <span className="label">Cobrado:</span>
            <span className="valor success">Q {r.facturasPorCobrar.cobrado.toFixed(2)}</span>
          </div>
          <div className="saldo-item">
            <span className="label">Pendiente:</span>
            <span className="valor warning">Q {r.facturasPorCobrar.pendiente.toFixed(2)}</span>
          </div>
          <div className="saldo-item">
            <span className="label">Progreso:</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: r.facturasPorCobrar.porcentajeCobrado }}
              ></div>
            </div>
            <span className="percentage">{r.facturasPorCobrar.porcentajeCobrado}</span>
          </div>
        </div>

        {/* Posición Financiera */}
        <div className="saldo-card financiera">
          <h3>Posición Financiera</h3>
          <div className="saldo-item">
            <span className="label">Debe Recibir:</span>
            <span className="valor success">Q {r.posicionFinanciera.debeRecibir.toFixed(2)}</span>
          </div>
          <div className="saldo-item">
            <span className="label">Debe Pagar:</span>
            <span className="valor danger">Q {r.posicionFinanciera.debePagar.toFixed(2)}</span>
          </div>
          <div className="saldo-item">
            <span className="label">Diferencia:</span>
            <span className={`valor ${r.posicionFinanciera.diferencia >= 0 ? 'success' : 'danger'}`}>
              Q {r.posicionFinanciera.diferencia.toFixed(2)}
            </span>
          </div>
          <p className="info-text">
            {r.posicionFinanciera.diferencia >= 0 
              ? "Posición favorable" 
              : "Deuda neta"}
          </p>
        </div>
      </div>
    </div>
  );
};
