import { useState, useEffect } from "react";
import * as api from "../../services/api";

export const useFacturasPorCobrarStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    cobradas: 0,
    montoTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const response = await api.obtenerFacturasCobrar(1000, 0);
        
        if (!response.error && response.data?.facturas) {
          const facturas = response.data.facturas;
          const total = facturas.length;
          const pendientes = facturas.filter(f => f.estado === "PENDIENTE" || f.estado === "PARCIAL").length;
          const cobradas = facturas.filter(f => f.estado === "COBRADA").length;
          const montoTotal = facturas.reduce((sum, f) => sum + (f.monto || 0), 0);
          
          setStats({
            total,
            pendientes,
            cobradas,
            montoTotal,
          });
        }
      } catch (err) {
        console.error("Error cargando stats:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarStats();
  }, []);

  return { stats, loading };
};
