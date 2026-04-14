import { useState, useCallback, useEffect, useRef } from "react";
import API from "../services/api";

const useChat = (modulo = "general") => {
  const [conversacionActual, setConversacionActual] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [conversaciones, setConversaciones] = useState([]);
  const [cargandoConversaciones, setCargandoConversaciones] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);

  /**
   * Crear nueva conversación
   */
  const crearNuevaConversacion = useCallback(async (cliente = null) => {
    try {
      setCargando(true);
      setError(null);

      const payload = { 
        modulo,
        ...(cliente && { cliente })
      };

      const response = await API.post(
        "/ia/conversacion",
        payload
      );

      if (response.data?.success) {
        setConversacionActual(response.data.conversacion);
        setMensajes([]);
        setForceRefresh(prev => prev + 1);
        return response.data.conversacion;
      }
    } catch (err) {
      const mensaje = err.response?.data?.message || err.message;
      setError(mensaje);
      console.error("[ERROR] crearNuevaConversacion:", mensaje);
    } finally {
      setCargando(false);
    }
  }, [modulo]);

  /**
   * Obtener conversación por ID
   */
  const cargarConversacion = useCallback(async (conversacionId) => {
    try {
      setCargando(true);
      setError(null);

      const response = await API.get(
        `/ia/conversacion/${conversacionId}`
      );

      if (response.data?.success) {
        setConversacionActual(response.data.conversacion);
        setMensajes(response.data.conversacion.mensajes || []);
        return response.data.conversacion;
      }
    } catch (err) {
      const mensaje = err.response?.data?.message || err.message;
      setError(mensaje);
      console.error("[ERROR] cargarConversacion:", mensaje);
    } finally {
      setCargando(false);
    }
  }, []);

  /**
   * Enviar mensaje a la conversación actual
   */
  const enviarMensaje = useCallback(async (pregunta, documentoId = null) => {
    if (!conversacionActual) {
      setError("No hay conversación activa");
      return null;
    }

    if (!pregunta.trim()) {
      setError("La pregunta no puede estar vacía");
      return null;
    }

    try {
      setCargando(true);
      setError(null);

      // Agregar mensaje del usuario localmente para UX instantánea
      const mensajeUsuario = {
        tipo: "usuario",
        contenido: pregunta,
        timestamp: new Date().toISOString()
      };
      setMensajes(prev => [...prev, mensajeUsuario]);

      // Enviar pregunta a la IA
      const payload = {
        pregunta,
        modulo,
        conversacionId: conversacionActual._id,
        ...(documentoId && { documentoId })
      };

      const response = await API.post(
        "/ia/pregunta",
        payload
      );

      if (response.data?.success) {
        // Obtener conversación actualizada para sincronizar con BD
        await cargarConversacion(conversacionActual._id);
        return response.data;
      }
    } catch (err) {
      // Remover mensaje del usuario si hay error
      setMensajes(prev => prev.slice(0, -1));
      const mensaje = err.response?.data?.message || err.message;
      setError(mensaje);
      console.error("[ERROR] enviarMensaje:", mensaje);
    } finally {
      setCargando(false);
    }
  }, [conversacionActual, modulo, cargarConversacion]);

  /**
   * Obtener conversaciones del usuario
   */
  const obtenerConversacionesDelUsuario = useCallback(async () => {
    try {
      setCargandoConversaciones(true);
      const query = modulo && modulo !== "general" ? `?modulo=${modulo}` : "";
      
      const response = await API.get(
        `/ia/conversaciones${query}`
      );

      if (response.data?.success) {
        setConversaciones(response.data.conversaciones || []);
        return response.data.conversaciones;
      }
    } catch (err) {
      console.error("[ERROR] obtenerConversacionesDelUsuario:", err.message);
    } finally {
      setCargandoConversaciones(false);
    }
  }, [modulo]);

  /**
   * Eliminar conversación
   */
  const eliminarConversacion = useCallback(async (conversacionId) => {
    try {
      const response = await API.delete(
        `/ia/conversacion/${conversacionId}`
      );

      if (response.data?.success) {
        // Si se eliminó la conversación actual, limpiar
        if (conversacionActual?._id === conversacionId) {
          setConversacionActual(null);
          setMensajes([]);
        }
        setForceRefresh(prev => prev + 1);
        return true;
      }
    } catch (err) {
      const mensaje = err.response?.data?.message || err.message;
      setError(mensaje);
      console.error("[ERROR] eliminarConversacion:", mensaje);
      return false;
    }
  }, [conversacionActual]);

  /**
   * Cargar conversaciones al montar el componente y cuando cambia el módulo
   */
  useEffect(() => {
    obtenerConversacionesDelUsuario();
  }, [modulo, forceRefresh]);

  return {
    // Estado
    conversacionActual,
    mensajes,
    cargando,
    error,
    conversaciones,
    cargandoConversaciones,

    // Funciones
    crearNuevaConversacion,
    cargarConversacion,
    enviarMensaje,
    obtenerConversacionesDelUsuario,
    eliminarConversacion,
    setError
  };
};

export default useChat;
