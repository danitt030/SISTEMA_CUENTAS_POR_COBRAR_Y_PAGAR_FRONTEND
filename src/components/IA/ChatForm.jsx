import React, { useState } from "react";
import "./ChatForm.css";

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
    <div className="chat-form-container">
      {clientSelector && (
        <div className="chat-form-selector">
          {clientSelector}
        </div>
      )}

      <div className="chat-form-input">
        <textarea
          placeholder="Escribe tu pregunta... (Enter para enviar, Shift+Enter para salto de línea)"
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
              Enviando...
            </>
          ) : (
            <>
              <span>📤</span>
              Enviar
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatForm;
