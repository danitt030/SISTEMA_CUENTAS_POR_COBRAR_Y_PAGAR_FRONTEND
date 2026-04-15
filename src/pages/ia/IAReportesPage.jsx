import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Header";
import { ReporteSelector } from "../../components/IA/ReporteSelector";
import ChatComponent from "../../components/IA/ChatComponent";
import ChatForm from "../../components/IA/ChatForm";
import ConversacionesSidebar from "../../components/IA/ConversacionesSidebar";
import useChat from "../../hooks/useChat";
import "../../styles/modules.css";

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
      <div className="module-container ia-chat-container">
        <section className="ia-chat-header">
          <div>
            <button onClick={() => navigate(-1)} className="btn btn-secondary ia-back-btn">
              ← Volver
            </button>
            <h1>Chat IA - Reportes y Analisis</h1>
            <p>Conecta tus reportes financieros con preguntas estrategicas para decisiones rapidas.</p>
          </div>
          <span className="ia-module-badge">Reportes</span>
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
                    <p>Activa una conversacion y pregunta por tendencias, riesgos y oportunidades.</p>
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
