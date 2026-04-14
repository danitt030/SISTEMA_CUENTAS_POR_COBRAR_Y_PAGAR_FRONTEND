import { useState, useCallback, useEffect } from "react";
import * as api from "../../services/api";

export const useIA = () => {
  // 1. TODOS LOS ESTADOS PRIMERO
  const [respuesta, setRespuesta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historialPreguntas, setHistorialPreguntas] = useState([]);

  // 2. TODOS LOS EFFECTS DESPUÉS
  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const historialLocal = localStorage.getItem("historialIA");
        if (historialLocal) {
          const parsed = JSON.parse(historialLocal);
          setHistorialPreguntas(parsed);
        }

        const response = await api.obtenerHistorialIA(50, 0, "todos");
        if (!response.error && response.data?.historial) {
          const historialBD = response.data.historial.map(item => ({
            ...item,
            timestamp: item.creadoEn
          }));
          setHistorialPreguntas(historialBD);
          localStorage.setItem("historialIA", JSON.stringify(historialBD));
        }
      } catch (err) {
        console.error("Error cargando historial:", err);
      }
    };

    cargarHistorial();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("historialIA", JSON.stringify(historialPreguntas));
    } catch (err) {
      console.error("Error guardando en localStorage:", err);
    }
  }, [historialPreguntas]);

  // 3. TODOS LOS CALLBACKS DESPUÉS
  const preguntarAsistenteIA = useCallback(async (pregunta, modulo = "cliente", documentoId = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.preguntarAsistenteIA(pregunta, modulo, documentoId);
      
      if (response.error) {
        const errorMsg = response.err?.response?.data?.message || response.err?.message || "Error al procesar la pregunta";
        setError(errorMsg);
        return { error: true, data: null };
      }

      const respuestaData = response.data || response;
      setRespuesta(respuestaData);
      
      const nuevoItem = {
        pregunta,
        respuesta: respuestaData.respuesta,
        contexto: respuestaData.contexto,
        modulo: modulo,
        timestamp: new Date().toISOString(),
        _id: Date.now().toString()
      };
      
      setHistorialPreguntas(prev => [nuevoItem, ...prev.slice(0, 9)]);

      return { error: false, data: respuestaData };
    } catch (err) {
      const errorMsg = err?.message || "Error desconocido";
      setError(errorMsg);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const limpiarRespuesta = useCallback(() => {
    setRespuesta(null);
    setError(null);
  }, []);

  const limpiarHistorial = useCallback(() => {
    setHistorialPreguntas([]);
    try {
      localStorage.removeItem("historialIA");
    } catch (err) {
      console.error("Error limpiando historial:", err);
    }
  }, []);

  const eliminarDelHistorial = useCallback(async (id) => {
    try {
      const response = await api.eliminarHistorialIA(id);
      if (!response.error) {
        setHistorialPreguntas(prev => prev.filter(item => item._id !== id));
      }
      return response;
    } catch (err) {
      console.error("Error eliminando del historial:", err);
      return { error: true, err };
    }
  }, []);

  return {
    respuesta,
    loading,
    error,
    historialPreguntas,
    preguntarAsistenteIA,
    limpiarRespuesta,
    limpiarHistorial,
    eliminarDelHistorial
  };
};
