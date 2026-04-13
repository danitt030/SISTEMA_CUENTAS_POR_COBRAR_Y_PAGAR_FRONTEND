import { useState, useCallback, useEffect } from "react";
import * as api from "../../services/api";

export const useClientesStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    contado: 0,
    credito: 0,
    activos: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarEstadisticas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener TODOS los clientes (sin límite)
      const clientesResponse = await api.obtenerClientes(1000, 0);
      
      if (clientesResponse.error) {
        const errorMsg = clientesResponse.err?.message || "Error al cargar clientes";
        setError(errorMsg);
        setStats({
          total: 0,
          contado: 0,
          credito: 0,
          activos: 0,
        });
        return;
      }

      // Extraer clientes de la respuesta - probar múltiples rutas
      let clientes = [];
      
      if (clientesResponse.data?.clientes) {
        clientes = clientesResponse.data.clientes;
      } else if (clientesResponse.data?.data) {
        clientes = clientesResponse.data.data;
      } else if (clientesResponse.clientes) {
        clientes = clientesResponse.clientes;
      } else if (Array.isArray(clientesResponse.data)) {
        clientes = clientesResponse.data;
      }

      // Calcular estadísticas
      const total = clientes.length;
      const contado = clientes.filter(c => c.condicionPago === "CONTADO").length;
      const credito = clientes.filter(c => c.condicionPago === "CRÉDITO" || c.condicionPago === "CREDITO").length;
      const activos = clientes.filter(c => c.estado === true).length;

      setStats({
        total,
        contado,
        credito,
        activos,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  return {
    stats,
    loading,
    error,
    cargarEstadisticas
  };
};
