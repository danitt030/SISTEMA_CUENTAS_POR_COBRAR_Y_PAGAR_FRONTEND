import React from "react";
import "./ConversacionesSidebar.css";

const ConversacionesSidebar = ({
  conversaciones = [],
  conversacionActualId = null,
  cargandoConversaciones = false,
  onNuevaConversacion = () => {},
  onSeleccionarConversacion = () => {},
  onEliminarConversacion = () => {}
}) => {
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
    <div className="sidebar-container">
      {/* Botón Nueva Conversación */}
      <button 
        className="btn-nueva-conversacion"
        onClick={onNuevaConversacion}
        disabled={cargandoConversaciones}
      >
        <span>➕</span> Nuevo Chat
      </button>

      {/* Lista de Conversaciones */}
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
                  if (confirm("¿Eliminar esta conversación?")) {
                    onEliminarConversacion(conv._id);
                  }
                }}
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversacionesSidebar;
