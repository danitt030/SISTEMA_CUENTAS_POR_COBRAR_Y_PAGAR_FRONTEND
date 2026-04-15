import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import { ClientSelector } from "../../components/IA/ClientSelector";
import ChatComponent from "../../components/IA/ChatComponent";
import ChatForm from "../../components/IA/ChatForm";
import ConversacionesSidebar from "../../components/IA/ConversacionesSidebar";
import useChat from "../../hooks/useChat";
import "../../styles/modules.css";

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
      <div className="module-container ia-chat-container">
        <section className="ia-chat-header">
          <div>
            <button onClick={() => navigate(-1)} className="btn btn-secondary ia-back-btn">
              ← Volver
            </button>
            <h1>Chat IA - Analisis de Clientes</h1>
            <p>Consulta saldos, limites de credito, riesgos y comportamiento de pago.</p>
          </div>
          <span className="ia-module-badge">Clientes</span>
        </section>

        <div className="ia-chat-wrapper">
          <ConversacionesSidebar
            conversaciones={conversaciones}
            conversacionActualId={conversacionActual?._id}
            cargandoConversaciones={cargandoConversaciones}
            onNuevaConversacion={handleNuevaConversacion}
            onSeleccionarConversacion={cargarConversacion}
            onEliminarConversacion={eliminarConversacion}
          />

          <div className="ia-chat-main">
            {error && (
              <div className="alert alert-error" onClick={() => setError(null)}>
                {error} Cerrar
              </div>
            )}

            <div className="ia-chat-content">
              {!conversacionActual ? (
                <div className="chat-vacio">
                  <div className="chat-vacio-contenido">
                    <h2>Inicia un nuevo analisis</h2>
                    <p>
                      Crea una conversacion para consultar clientes en lenguaje natural.
                    </p>
                    <button
                      className="btn btn-primary btn-crear-chat"
                      onClick={handleNuevaConversacion}
                    >
                      Crear Nueva Conversacion
                    </button>
                  </div>
                </div>
              ) : (
                <ChatComponent
                  mensajes={mensajes}
                  cargando={cargando}
                />
              )}
            </div>

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
