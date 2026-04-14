import React, { useEffect, useRef } from "react";
import "./ChatComponent.css";

const ChatComponent = ({ mensajes = [], cargando = false }) => {
  const mensajesEndRef = useRef(null);

  // Auto scroll al último mensaje
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const formatoHora = (timestamp) => {
    if (!timestamp) return "";
    const fecha = new Date(timestamp);
    return fecha.toLocaleTimeString("es-CO", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  // Procesar markdown a HTML mejorado
  const renderizarMensaje = (texto) => {
    if (!texto) return "";

    // Convertir markdown a HTML con mejor formato
    let html = texto
      // Títulos h1, h2, h3
      .replace(/^### (.*?)$/gm, '<h3 class="titulo-seccion">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 class="titulo-principal">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 class="titulo-grande">$1</h1>')
      // Negritas
      .replace(/\*\*(.*?)\*\*/g, '<strong class="destaque">$1</strong>')
      .replace(/__(.*?)__/g, '<strong class="destaque">$1</strong>')
      // Cursivas
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Guiones y listas
      .replace(/^- (.*?)$/gm, '<li class="list-item">$1</li>')
      .replace(/^(\d+)\. (.*?)$/gm, '<li class="list-item-numerado">$1. $2</li>')
      // Líneas divisoras
      .replace(/^---$/gm, '<hr class="divisor">')
      // Saltos de línea
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>')
      // Envolver en párrafos
      .replace(/^(?!<h|<li|<hr)/gm, '<p class="parrafo">');

    // Envolver listas en ul
    html = html.replace(/(<li class="list-item">.*?)<\/li>\n(?!<li)/g, '$1</li></ul>')
              .replace(/(<li class="list-item[^>]*>)/g, (match, p1, offset) => {
                if (html[offset - 1] !== '>') return '<ul class="lista-custom">' + match;
                return match;
              });

    return html;
  };

  return (
    <div className="chat-container">
      <div className="mensajes-scroll">
        {mensajes.length === 0 ? (
          <div className="mensaje-vacio">
            <p>📝 Inicia una conversación haciendo tu primera pregunta</p>
          </div>
        ) : (
          mensajes.map((msg, idx) => (
            <div 
              key={idx} 
              className={`mensaje mensaje-${msg.tipo}`}
            >
              <div className="mensaje-contenido">
                {msg.tipo === "asistente" ? (
                  <div 
                    className="contenido-formateado"
                    dangerouslySetInnerHTML={{ 
                      __html: renderizarMensaje(msg.contenido) 
                    }}
                  />
                ) : (
                  <p className="parrafo">{msg.contenido}</p>
                )}
              </div>
              <div className="mensaje-hora">
                {formatoHora(msg.timestamp)}
              </div>
            </div>
          ))
        )}

        {cargando && (
          <div className="mensaje mensaje-asistente">
            <div className="mensaje-contenido">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={mensajesEndRef} />
      </div>
    </div>
  );
};

export default ChatComponent;
