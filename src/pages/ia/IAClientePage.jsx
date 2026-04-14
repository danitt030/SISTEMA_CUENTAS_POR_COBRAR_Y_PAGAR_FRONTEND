import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import { ClientSelector } from "../../components/IA/ClientSelector";
import ChatComponent from "../../components/IA/ChatComponent";
import ChatForm from "../../components/IA/ChatForm";
import ConversacionesSidebar from "../../components/IA/ConversacionesSidebar";
import useChat from "../../hooks/useChat";
import "./IAClienteChatPage.css";

export const IAClientePage = () => {
  const navigate = useNavigate();
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const {
    conversacionActual,
    mensajes,
    cargando,
    error,
    conversaciones,
    cargandoConversaciones,
    crearNuevaConversacion,
    cargarConversacion,
    enviarMensaje,
    eliminarConversacion,
    setError
  } = useChat("cliente");

  const handleNuevaConversacion = async () => {
    await crearNuevaConversacion(clienteSeleccionado);
  };

  const handleEnviarPregunta = async (pregunta) => {
    await enviarMensaje(pregunta, clienteSeleccionado);
  };

  return (
    <>
      <Header />
      <div className="ia-chat-container">
        <div className="ia-chat-header">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Volver
          </button>
          <h1>👥 Chat IA - Análisis de Clientes</h1>
        </div>

        <div className="ia-chat-wrapper">
          {/* Sidebar con conversaciones */}
          <ConversacionesSidebar
            conversaciones={conversaciones}
            conversacionActualId={conversacionActual?._id}
            cargandoConversaciones={cargandoConversaciones}
            onNuevaConversacion={handleNuevaConversacion}
            onSeleccionarConversacion={cargarConversacion}
            onEliminarConversacion={eliminarConversacion}
          />

          {/* Área principal del chat */}
          <div className="ia-chat-main">
            {error && (
              <div className="alert alert-error" onClick={() => setError(null)}>
                {error} ✕
              </div>
            )}

            <div className="ia-chat-content">
              {!conversacionActual ? (
                <div className="chat-vacio">
                  <div className="chat-vacio-contenido">
                    <h2>👋 Hola!</h2>
                    <p>Comienza una nueva conversación. Puedes hacer preguntas generales o seleccionar un cliente para análisis más específicos.</p>
                    <button 
                      className="btn-crear-chat"
                      onClick={handleNuevaConversacion}
                    >
                      ➕ Crear Nueva Conversación
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <ChatComponent 
                    mensajes={mensajes}
                    cargando={cargando}
                  />
                </>
              )}
            </div>

            {/* Formulario de entrada */}
            {conversacionActual && (
              <ChatForm
                onEnviar={handleEnviarPregunta}
                cargando={cargando}
                requiereCliente={false}
                clienteSeleccionado={clienteSeleccionado}
                clientSelector={
                  <ClientSelector 
                    onSelect={setClienteSeleccionado} 
                    selected={clienteSeleccionado} 
                    optional={true}
                  />
                }
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
