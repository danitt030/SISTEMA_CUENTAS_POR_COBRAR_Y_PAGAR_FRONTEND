import { useState, useCallback } from "react";
import { obtenerCobros } from "../../services/api";

export const useCobrosStats = () => {
  const [stats, setStats] = useState({
    totalCobros: 0,
    montoCobrado: 0,
    comisiones: 0,
    netoCobrado: 0,
  });
  const [loading, setLoading] = useState(false);

  const obtenerStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await obtenerCobros(1000, 0);
      if (!response.error && response.data?.cobros) {
        const cobrosList = response.data.cobros;
        const totalCobros = cobrosList.length;
        const montoCobrado = cobrosList.reduce((sum, c) => sum + (c.montoCobrado || 0), 0);
        const comisiones = cobrosList.reduce((sum, c) => sum + (c.comision || 0), 0);
        const netoCobrado = cobrosList.reduce((sum, c) => sum + (c.netoCobrado || 0), 0);

        setStats({
          totalCobros,
          montoCobrado,
          comisiones,
          netoCobrado,
        });
      }
    } catch (err) {
      console.error("Error al obtener estadísticas de cobros:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    obtenerStats,
  };
};
