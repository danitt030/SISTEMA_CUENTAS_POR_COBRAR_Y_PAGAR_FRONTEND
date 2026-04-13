import { useState } from "react";
import "./cobroDetail.css";

export const CobroDetail = ({ cobro = null, onClose, onEdit, obtenerSaldoCobroFunc, obtenerCobroPorIdFunc }) => {
  const [saldo, setSaldo] = useState(null);
  const [loadingSaldo, setLoadingSaldo] = useState(false);

  if (!cobro) {
    return null;
  }

  const netoCobrado = (cobro.montoCobrado || 0) - (cobro.comision || 0);

  const handleVerSaldo = async () => {
    if (!obtenerSaldoCobroFunc) return;
    
    setLoadingSaldo(true);
    try {
      const facturaId = cobro.facturaPorCobrar?.id || cobro.facturaPorCobrar?._id || cobro.facturaPorCobrar;
      const resultado = await obtenerSaldoCobroFunc(facturaId);
      if (resultado) {
        setSaldo(resultado.saldo || resultado);
      }
    } catch (err) {
    } finally {
      setLoadingSaldo(false);
    }
  };

  return (
    <div className="cobro-detail-modal">
      <div className="cobro-detail-content">
        <div className="detail-header">
          <h2>Detalle del Cobro</h2>
          <button onClick={onClose} className="btn-close">
            ✕
          </button>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <h3>Información del Comprobante</h3>
            <div className="detail-row">
              <div className="detail-item">
                <label>Número Comprobante</label>
                <p>{cobro.numeroComprobante}</p>
              </div>
              <div className="detail-item">
                <label>Fecha Cobro</label>
                <p>{new Date(cobro.fechaCobro).toLocaleDateString("es-ES")}</p>
              </div>
              <div className="detail-item">
                <label>Estado</label>
                <p>
                  <span className={`status-badge ${cobro.activo ? "active" : "inactive"}`}>
                    {cobro.activo ? "Activo" : "Inactivo"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Información de la Factura</h3>
            <div className="detail-row">
              <div className="detail-item">
                <label>Número Factura</label>
                <p>{cobro.facturaPorCobrar?.numeroFactura || "N/A"}</p>
              </div>
              <div className="detail-item">
                <label>Monto Factura</label>
                <p>Q {(cobro.montoFactura || 0).toFixed(2)}</p>
              </div>
              <div className="detail-item">
                <label>Moneda</label>
                <p>{cobro.moneda || "GTQ"}</p>
              </div>
            </div>
            {obtenerSaldoCobroFunc && (
              <button onClick={handleVerSaldo} className="btn-ver-saldo" disabled={loadingSaldo}>
                {loadingSaldo ? "Cargando..." : "📊 Ver Saldo de Factura"}
              </button>
            )}
            {saldo && (
              <div className="saldo-info">
                <p><strong>Monto Factura:</strong> Q {(saldo.montoFactura || 0).toFixed(2)}</p>
                <p><strong>Monto Cobrado:</strong> Q {(saldo.montoCobrado || 0).toFixed(2)}</p>
                <p><strong>Monto Pendiente:</strong> Q {(saldo.montoPendiente || 0).toFixed(2)}</p>
                <p><strong>Porcentaje Cobrado:</strong> {saldo.porcentajeCobrado || "0%"}</p>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3>Información del Cliente</h3>
            <div className="detail-row">
              <div className="detail-item">
                <label>Nombre Cliente</label>
                <p>{cobro.cliente?.nombre || "N/A"}</p>
              </div>
              <div className="detail-item">
                <label>Documento</label>
                <p>{cobro.cliente?.numeroDocumento || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Información del Cobro</h3>
            <div className="detail-row">
              <div className="detail-item">
                <label>Monto Cobrado</label>
                <p className="highlight">Q {(cobro.montoCobrado || 0).toFixed(2)}</p>
              </div>
              <div className="detail-item">
                <label>Comisión</label>
                <p>Q {(cobro.comision || 0).toFixed(2)}</p>
              </div>
              <div className="detail-item">
                <label>Neto Cobrado</label>
                <p className="highlight">Q {netoCobrado.toFixed(2)}</p>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <label>Método Pago</label>
                <p>
                  <span className={`badge badge-${cobro.metodoPago?.toLowerCase() || "unknown"}`}>
                    {cobro.metodoPago || "N/A"}
                  </span>
                </p>
              </div>
              <div className="detail-item">
                <label>Referencia</label>
                <p>{cobro.referencia || "No especificada"}</p>
              </div>
            </div>
          </div>

          {cobro.descripcion && (
            <div className="detail-section">
              <h3>Descripción</h3>
              <p className="description">{cobro.descripcion}</p>
            </div>
          )}

          <div className="detail-section">
            <h3>Auditoría</h3>
            <div className="detail-row">
              <div className="detail-item">
                <label>Creado Por</label>
                <p>{cobro.creadoPor?.nombre || "N/A"}</p>
              </div>
              <div className="detail-item">
                <label>Fecha Creación</label>
                <p>{new Date(cobro.creadoEn).toLocaleString("es-ES")}</p>
              </div>
              <div className="detail-item">
                <label>Última Actualización</label>
                <p>{new Date(cobro.actualizadoEn).toLocaleString("es-ES")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-footer">
          <button onClick={onClose} className="btn-cancel">
            Cerrar
          </button>
          <button onClick={() => onEdit(cobro)} className="btn-submit">
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};
