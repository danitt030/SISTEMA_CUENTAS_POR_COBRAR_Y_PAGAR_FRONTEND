import React, { useState } from "react";

const ConversacionesSidebar = ({
  conversaciones = [],
  conversacionActualId = null,
  cargandoConversaciones = false,
  onNuevaConversacion = () => {},
  onSeleccionarConversacion = () => {},
  onEliminarConversacion = () => {}
}) => {
  const [modalEliminar, setModalEliminar] = useState({ visible: false, conversacionId: null });

  const truncarTexto = (texto, longitud = 30) => {
    if (!texto) return "Conversación sin título";
    if (texto.length > longitud) {
      return texto.substring(0, longitud) + "...";
    }
    return texto;
  };

  const formatoFecha = (timestamp) => {
    if (!timestamp) return "";
    const fecha = new Date(timestamp);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    if (fecha.toDateString() === hoy.toDateString()) {
      return fecha.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
    } else if (fecha.toDateString() === ayer.toDateString()) {
      return "Ayer";
    } else {
      return fecha.toLocaleDateString("es-CO", { month: "short", day: "numeric" });
    }
  };

  return (
    <aside className="sidebar-container ia-sidebar">
      <div className="ia-sidebar-header">
        <h3>Conversaciones</h3>
        <p>Historial reciente</p>
      </div>

      <button 
        className="btn-nueva-conversacion"
        onClick={onNuevaConversacion}
        disabled={cargandoConversaciones}
      >
        Nuevo Chat
      </button>

      <div className="conversaciones-lista">
        {cargandoConversaciones ? (
          <div className="cargando">Cargando conversaciones...</div>
        ) : conversaciones.length === 0 ? (
          <div className="vacio">
            <p>No hay conversaciones</p>
            <p className="hint">Crea una nueva para empezar</p>
          </div>
        ) : (
          conversaciones.map((conv) => (
            <div
              key={conv._id}
              className={`conversacion-item ${
                conversacionActualId === conv._id ? "activa" : ""
              }`}
              onClick={() => onSeleccionarConversacion(conv._id)}
                role="button"
                tabIndex={0}
            >
              <div className="conversacion-info">
                <h4 className="conversacion-titulo">
                  {truncarTexto(conv.titulo, 25)}
                </h4>
                <p className="conversacion-fecha">
                  {formatoFecha(conv.actualizadoEn)}
                </p>
              </div>
              <button
                className="btn-eliminar"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalEliminar({ visible: true, conversacionId: conv._id });
                }}
                  title="Eliminar conversacion"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>

      {modalEliminar.visible && (
        <div className="modal-overlay" onClick={() => setModalEliminar({ visible: false, conversacionId: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Eliminar conversación</h3>
              <button className="close-btn" onClick={() => setModalEliminar({ visible: false, conversacionId: null })}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ color: "#111827", marginBottom: "8px" }}>¿Deseas eliminar esta conversación?</p>
              <p style={{ color: "#6b7280", fontSize: "13px" }}>Se eliminará el historial del chat seleccionado.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalEliminar({ visible: false, conversacionId: null })}>Cancelar</button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  onEliminarConversacion(modalEliminar.conversacionId);
                  setModalEliminar({ visible: false, conversacionId: null });
                }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default ConversacionesSidebar;
