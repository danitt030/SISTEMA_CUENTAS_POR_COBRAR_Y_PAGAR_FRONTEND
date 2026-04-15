import React, { useState } from "react";

/* eslint-disable no-unused-vars */
const ChatForm = ({ 
  onEnviar = () => {}, 
  cargando = false,
  _requiereCliente = false,
  _clienteSeleccionado = null,
  clientSelector = null
}) => {
  const [pregunta, setPregunta] = useState("");

  const handleEnviar = async () => {
    if (pregunta.trim()) {
      await onEnviar(pregunta);
      setPregunta("");
    }
  };

  const handleKeyDown = (e) => {
    // Enter = Enviar, Shift+Enter = Salto de línea
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  // Solo deshabilitar si está cargando, no por cliente no seleccionado
  const estaDeshabilitado = cargando;

  return (
    <div className="chat-form-container chat-form-pro">
      {clientSelector && (
        <div className="chat-form-selector ia-context-selectors">
          {clientSelector}
        </div>
      )}

      <div className="chat-form-input prompt-composer">
        <textarea
          placeholder="Escribe tu consulta... Enter para enviar, Shift+Enter para salto de linea"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={estaDeshabilitado}
          rows={3}
        />

        <button
          className="btn-enviar"
          onClick={handleEnviar}
          disabled={estaDeshabilitado || !pregunta.trim()}
          title={
            estaDeshabilitado 
              ? "Cargando..."
              : "Enviar pregunta (Enter)"
          }
        >
          {cargando ? (
            <>
              <span className="spinner"></span>
              Enviando
            </>
          ) : (
            <>
              <span>➤</span>
              Preguntar
            </>
          )}
        </button>
      </div>
      <p className="chat-form-hint">La IA responde con contexto del modulo actual y tu historial de conversacion.</p>
    </div>
  );
};

export default ChatForm;
