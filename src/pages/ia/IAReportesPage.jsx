import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import { ReporteSelector } from "../../components/IA/ReporteSelector";
import ChatComponent from "../../components/IA/ChatComponent";
import ChatForm from "../../components/IA/ChatForm";
import ConversacionesSidebar from "../../components/IA/ConversacionesSidebar";
import useChat from "../../hooks/useChat";
import "./IAClienteChatPage.css";

export const IAReportesPage = () => {
  const navigate = useNavigate();
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
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
  } = useChat("reportes");

  const handleNuevaConversacion = async () => {
    await crearNuevaConversacion();
  };

  const handleEnviarPregunta = async (pregunta) => {
    // Contextualizar con el reporte seleccionado
    let preguntaCompleta = pregunta;
    if (reporteSeleccionado) {
      const reporteNombre = {
        saldos: "Resumen de Saldos",
        proveedores: "Resumen por Proveedor",
        clientes: "Resumen por Cliente",
        vencer: "Facturas por Vencer",
        vencidas: "Facturas Vencidas",
        cobrabilidad: "Cobrabilidad",
        pagabilidad: "Pagabilidad",
        estado: "Facturas por Estado",
        topdeudores: "Top Clientes Deudores",
        topproveedores: "Top Proveedores",
        comisiones: "Análisis de Comisiones"
      }[reporteSeleccionado];
      
      preguntaCompleta = `Respecto al reporte de ${reporteNombre}: ${pregunta}`;
    }
    await enviarMensaje(preguntaCompleta);
  };

  return (
    <>
      <Header />
      <div className="ia-chat-container">
        <div className="ia-chat-header">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Volver
          </button>
          <h1>📊 Chat IA - Reportes y Análisis</h1>
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
                    <p>Comienza una nueva conversación para consultar reportes</p>
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
                <ReporteSelector 
                  onSelect={setReporteSeleccionado}
                  selected={reporteSeleccionado}
                />
                <ChatForm
                  onEnviar={handleEnviarPregunta}
                  cargando={cargando}
                  requiereCliente={false}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
