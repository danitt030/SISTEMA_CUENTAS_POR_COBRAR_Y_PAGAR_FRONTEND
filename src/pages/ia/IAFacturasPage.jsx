import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import { ClientSelector } from "../../components/IA/ClientSelector";
import { FacturaSelector } from "../../components/IA/FacturaSelector";
import ChatComponent from "../../components/IA/ChatComponent";
import ChatForm from "../../components/IA/ChatForm";
import ConversacionesSidebar from "../../components/IA/ConversacionesSidebar";
import { FacturasDisplay } from "../../components/IA/FacturasDisplay";
import useChat from "../../hooks/useChat";
import { obtenerClientes } from "../../services/api";
import "./IAClienteChatPage.css";

export const IAFacturasPage = () => {
  const navigate = useNavigate();
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clienteNombre, setClienteNombre] = useState("");
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
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
  } = useChat("facturaPorCobrar");

  // Obtener el nombre del cliente seleccionado
  useEffect(() => {
    if (!clienteSeleccionado) {
      setClienteNombre("");
      return;
    }

    const obtenerNombreCliente = async () => {
      try {
        const resultado = await obtenerClientes(100, 0);
        const clientes = Array.isArray(resultado?.data?.clientes)
          ? resultado.data.clientes
          : [];
        const cliente = clientes.find(c => (c._id || c.id) === clienteSeleccionado);
        setClienteNombre(cliente?.nombre || "Cliente");
      } catch (err) {
        console.error("Error obteniendo nombre del cliente:", err);
        setClienteNombre("Cliente");
      }
    };

    obtenerNombreCliente();
  }, [clienteSeleccionado]);

  const handleNuevaConversacion = async () => {
    await crearNuevaConversacion(clienteSeleccionado);
  };

  const handleEnviarPregunta = async (pregunta) => {
    // Siempre enviar el cliente como documentoId
    // La factura seleccionada es contextual para el usuario
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
          <h1>📋 Chat IA - Facturas por Cobrar</h1>
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
              <>
                <FacturasDisplay 
                  clienteId={clienteSeleccionado}
                  clienteNombre={clienteNombre}
                />
                <ChatForm
                  onEnviar={handleEnviarPregunta}
                  cargando={cargando}
                  requiereCliente={false}
                  clienteSeleccionado={clienteSeleccionado}
                  clientSelector={
                    <>
                      <ClientSelector 
                        onSelect={(clienteId) => {
                          setClienteSeleccionado(clienteId);
                          setFacturaSeleccionada(null); // Limpiar factura seleccionada
                        }}
                        selected={clienteSeleccionado} 
                        optional={true}
                      />
                      {clienteSeleccionado && (
                        <FacturaSelector
                          clienteId={clienteSeleccionado}
                          onSelect={setFacturaSeleccionada}
                          selected={facturaSeleccionada}
                          optional={true}
                        />
                      )}
                    </>
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
