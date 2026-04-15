import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import { ClientSelector } from "../../components/IA/ClientSelector";
import { CobroSelector } from "../../components/IA/CobroSelector";
import ChatComponent from "../../components/IA/ChatComponent";
import ChatForm from "../../components/IA/ChatForm";
import ConversacionesSidebar from "../../components/IA/ConversacionesSidebar";
import { CobrosDisplay } from "../../components/IA/CobrosDisplay";
import useChat from "../../hooks/useChat";
import { obtenerClientes } from "../../services/api";
import "../../styles/modules.css";

export const IACobroPage = () => {
  const navigate = useNavigate();
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clienteNombre, setClienteNombre] = useState("");
  const [cobroSeleccionado, setCobroSeleccionado] = useState(null);
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
  } = useChat("cobroCliente");

  // Obtener el nombre del cliente seleccionado
  useEffect(() => {
    if (!clienteSeleccionado) {
      const resetNombre = () => {
        setClienteNombre("");
      };
      resetNombre();
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
    // El cobro seleccionado es contextual para el usuario
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
            <h1>Chat IA - Cobros y Comisiones</h1>
            <p>Analiza recaudacion, comisiones y patrones de cobro con contexto financiero.</p>
          </div>
          <span className="ia-module-badge">Cobros</span>
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
                      Consulta proyecciones de cobro, comision neta y tendencias por cliente.
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
              <>
                <CobrosDisplay
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
                          setCobroSeleccionado(null);
                        }}
                        selected={clienteSeleccionado}
                        optional={true}
                      />
                      {clienteSeleccionado && (
                        <CobroSelector
                          clienteId={clienteSeleccionado}
                          onSelect={setCobroSeleccionado}
                          selected={cobroSeleccionado}
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
