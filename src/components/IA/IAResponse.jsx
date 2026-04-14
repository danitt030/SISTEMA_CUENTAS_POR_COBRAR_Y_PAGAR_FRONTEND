import { useEffect, useState } from "react";
import "./iaResponse.css";

export const IAResponse = ({ respuesta, loading = false, error = null, onLimpiar }) => {
  const [mostrarCompleto, setMostrarCompleto] = useState(false);

  useEffect(() => {
    const resetMostrar = () => {
      setMostrarCompleto(false);
    };
    resetMostrar();
  }, [respuesta]);

  if (loading) {
    return (
      <div className="ia-response ia-loading">
        <div className="ia-spinner"></div>
        <p>Claude está analizando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ia-response ia-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={onLimpiar} className="ia-btn-secondary">
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!respuesta) {
    return null;
  }

  const { respuesta: textoRespuesta, contexto } = respuesta;
  const { cliente, riesgo, riesgoScore } = contexto?.datosAnalizados || {};

  return (
    <div className="ia-response ia-success">
      <div className="ia-response-header">
        <h3>Análisis de IA - {cliente}</h3>
        {riesgo && (
          <div className={`ia-risk-badge ia-risk-${riesgo.toLowerCase()}`}>
            {riesgo} ({riesgoScore}/100)
          </div>
        )}
      </div>

      <div className="ia-response-texto">
        <div className={`ia-response-content ${mostrarCompleto ? "expanded" : "collapsed"}`}>
          {textoRespuesta.split('\n').map((linea, idx) => (
            <p key={idx}>{linea}</p>
          ))}
        </div>
      </div>

      <div className="ia-response-footer">
        {textoRespuesta.length > 300 && (
          <button
            onClick={() => setMostrarCompleto(!mostrarCompleto)}
            className="ia-btn-toggle"
          >
            {mostrarCompleto ? "Mostrar menos" : "Mostrar más"}
          </button>
        )}
        <button onClick={onLimpiar} className="ia-btn-secondary">
          Nueva Pregunta
        </button>
      </div>
    </div>
  );
};
