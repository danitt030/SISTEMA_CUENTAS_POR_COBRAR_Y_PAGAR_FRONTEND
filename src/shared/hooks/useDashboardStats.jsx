import { useState, useCallback, useEffect } from "react";
import * as api from "../../services/api";

export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    usuarios: 0,
    clientes: 0,
    proveedores: 0,
    facturas: 0,
    cobros: 0,
    pagos: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarEstadisticas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener conteo de usuarios
      const usuariosResponse = await api.obtenerConteoUsuarios();
      
      setStats(prev => ({
        ...prev,
        usuarios: usuariosResponse.error ? 0 : usuariosResponse.total,
        // Los demás modules aún no están implementados, mostrar 0
        clientes: 0,
        proveedores: 0,
        facturas: 0,
        cobros: 0,
        pagos: 0,
      }));
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar estadísticas:", err);
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
