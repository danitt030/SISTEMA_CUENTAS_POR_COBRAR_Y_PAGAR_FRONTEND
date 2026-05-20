import { useEffect, useState } from "react";
import { obtenerHistorialIA, eliminarHistorialIATodo } from "../../services/api";

const formatearFecha = (fecha) => {
  if (!fecha) return "";
  const date = new Date(fecha);
  return date.toLocaleString("es-GT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};

const truncar = (texto, limite = 500) => {
  if (!texto) return "";
  const limpio = String(texto);
  return limpio.length > limite ? `${limpio.slice(0, limite)}...` : limpio;
};

const renderizarMarkdown = (texto) => {
  if (!texto) return "";

  let html = String(texto)
    .replace(/^### (.*?)$/gm, '<h4 class="ia-history-h4">$1</h4>')
    .replace(/^## (.*?)$/gm, '<h3 class="ia-history-h3">$1</h3>')
    .replace(/^# (.*?)$/gm, '<h2 class="ia-history-h2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/^- (.*?)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.*?)$/gm, '<li>$1. $2</li>')
    .replace(/^---$/gm, '<hr class="ia-history-divider">')
    .replace(/\n\n/g, '</p><p class="ia-history-paragraph">')
    .replace(/\n/g, '<br/>')
    .replace(/^(?!<h|<li|<hr)/gm, '<p class="ia-history-paragraph">');

  html = html.replace(/((?:<li>.*?<\/li>\s*)+)/g, '<ul class="ia-history-list">$1</ul>');

  return html;
};

const nombreModulo = (modulo) => {
  const nombres = {
    cliente: "Cliente",
    facturaPorCobrar: "Facturas",
    cobroCliente: "Cobros",
    reportes: "Reportes",
    general: "General"
  };

  return nombres[modulo] || (modulo ? modulo.toUpperCase() : "General");
};

const renderContexto = (contexto) => {
  if (!contexto) {
    return (
      <div className="ia-history-context ia-history-context-empty">
        Sin contexto asociado.
      </div>
    );
  }

  const clienteNombre = contexto?.cliente?.nombre || "N/A";
  const metricas = contexto?.metricas || {};
  const items = [
    { label: "Riesgo", value: metricas.riesgoNivel },
    { label: "Riesgo score", value: metricas.riesgoScore },
    { label: "Total facturas", value: metricas.totalFacturas },
    { label: "Facturas vencidas", value: metricas.facturasVencidas },
    { label: "Total cobros", value: metricas.totalCobros }
  ];

  return (
    <div className="ia-history-context">
      <div className="ia-history-context-head">
        <span className="ia-history-label">Cliente</span>
        <span className="ia-history-value">{clienteNombre}</span>
      </div>
      <div className="ia-history-context-grid">
        {items.map((item) => (
          <div key={item.label} className="ia-history-metric">
            <span>{item.label}</span>
            <strong>{item.value ?? "N/A"}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

const HistorialIAModal = ({ open, onClose, modulo = "todos" }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limpiando, setLimpiando] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const cargarHistorial = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await obtenerHistorialIA(50, 0, modulo || "todos");
      if (response?.error) {
        const mensaje = response.err?.message || "Error al cargar historial";
        setError(mensaje);
        setHistorial([]);
        return;
      }

      setHistorial(response?.data?.historial || []);
    } catch (err) {
      setError(err?.message || "Error al cargar historial");
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    cargarHistorial();
  }, [open, modulo]);

  const handleLimpiar = async () => {
    const confirmar = window.confirm("Se eliminara el historial del modulo seleccionado. Deseas continuar?");
    if (!confirmar) return;

    setLimpiando(true);
    setError(null);

    try {
      const response = await eliminarHistorialIATodo(modulo || "todos");
      if (response?.error) {
        const mensaje = response.err?.message || "Error al eliminar historial";
        setError(mensaje);
        return;
      }
      setHistorial([]);
    } catch (err) {
      setError(err?.message || "Error al eliminar historial");
    } finally {
      setLimpiando(false);
    }
  };

  const toggleExpand = (key) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ia-history-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="ia-history-header">
            <h3>Historial IA</h3>
            <span className="ia-history-chip">Modulo: {nombreModulo(modulo === "todos" ? "general" : modulo)}</span>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {loading && (
            <div className="auditoria-loading-state">
              <div className="reporte-loading-spinner"></div>
              <p>Cargando historial...</p>
            </div>
          )}

          {!loading && error && (
            <div className="alert alert-error">{error}</div>
          )}

          {!loading && !error && historial.length === 0 && (
            <div className="auditoria-empty-state">
              <p className="title">Sin historial</p>
              <p className="subtitle">Aun no hay consultas registradas.</p>
            </div>
          )}

          {!loading && !error && historial.length > 0 && (
            <div className="ia-history-list">
              {historial.map((item, index) => (
                <div key={item._id || index} className="ia-history-card">
                  <div className="ia-history-meta">
                    <div className="ia-history-meta-left">
                      <span className="ia-history-chip">{nombreModulo(item.modulo || "general")}</span>
                      {item.contexto?.cliente?.nombre && (
                        <span className="ia-history-client">
                          Cliente: {item.contexto.cliente.nombre}
                        </span>
                      )}
                    </div>
                    <span className="ia-history-date">{formatearFecha(item.creadoEn || item.timestamp)}</span>
                  </div>
                  <div className="ia-history-block">
                    <span className="ia-history-label">Pregunta</span>
                    <p className="ia-history-text">{item.pregunta}</p>
                  </div>
                  <div className="ia-history-block">
                    <span className="ia-history-label">Respuesta</span>
                    {(() => {
                      const itemKey = item._id || index;
                      const isExpanded = Boolean(expandedItems[itemKey]);
                      const respuestaTexto = isExpanded
                        ? item.respuesta
                        : truncar(item.respuesta, 700);

                      return (
                        <>
                          <div
                            className="ia-history-markdown"
                            dangerouslySetInnerHTML={{ __html: renderizarMarkdown(respuestaTexto) }}
                          />
                          {item.respuesta && item.respuesta.length > 700 && (
                            <button
                              type="button"
                              className="ia-history-toggle"
                              onClick={() => toggleExpand(itemKey)}
                            >
                              {isExpanded ? "Ver menos" : "Ver mas"}
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  {renderContexto(item.contexto)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer ia-history-footer">
          <button
            className="btn btn-danger"
            onClick={handleLimpiar}
            disabled={limpiando}
          >
            {limpiando ? "Limpiando..." : "Limpiar historial"}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default HistorialIAModal;
