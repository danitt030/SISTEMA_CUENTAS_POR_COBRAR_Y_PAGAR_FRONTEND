import React, { useEffect, useRef } from "react";

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
    let html = String(texto)
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
      .replace(/^(\d+)\. (.*?)$/gm, '<li class="list-item">$1. $2</li>')
      // Líneas divisoras
      .replace(/^---$/gm, '<hr class="divisor">')
      // Saltos de línea
      .replace(/\n\n/g, '</p><p class="parrafo">')
      .replace(/\n/g, '<br/>')
      // Envolver en párrafos
      .replace(/^(?!<h|<li|<hr)/gm, '<p class="parrafo">');

    // Agrupar listas en bloques ul para mejor lectura
    html = html.replace(/((?:<li class="list-item">.*?<\/li>\s*)+)/g, '<ul class="lista-custom">$1</ul>');

    return html;
  };

  return (
    <section className="chat-container chatgpt-shell">
      <div className="chat-surface-header">
        <span className="chat-surface-title">Asistente IA</span>
        <span className="chat-surface-subtitle">Respuestas contextuales y analisis financiero</span>
      </div>

      <div className="mensajes-scroll chat-scroll-area">
        {mensajes.length === 0 ? (
          <div className="mensaje-vacio chat-empty-state">
            <h3>Listo para ayudarte</h3>
            <p>Haz una pregunta y recibiras analisis en tiempo real sobre tus datos.</p>
          </div>
        ) : (
          mensajes.map((msg, idx) => (
            <div 
              key={idx} 
              className={`mensaje mensaje-${msg.tipo} chat-row`}
            >
              <div className={`chat-avatar ${msg.tipo === "usuario" ? "avatar-user" : "avatar-ai"}`}>
                {msg.tipo === "usuario" ? "TU" : "IA"}
              </div>
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
                <div className="mensaje-hora">
                  {formatoHora(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}

        {cargando && (
          <div className="mensaje mensaje-asistente chat-row">
            <div className="chat-avatar avatar-ai">IA</div>
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
    </section>
  );
};

export default ChatComponent;
