import { useState, useCallback, useEffect } from "react";
import { useClientes } from "./useClientes";

export const useDashboardStatsCliente = () => {
  const [stats, setStats] = useState({
    facturas: 0,
    pagos: 0,
    cobros: 0,
    saldoPendiente: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    obtenerMisFacturasFunc,
    obtenerMisCobrosFunc,
    obtenerMiSaldoFunc,
  } = useClientes();

  const cargarEstadisticas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener mis facturas
      const facturasResponse = await obtenerMisFacturasFunc(1000, 0);
      const facturasCount = !facturasResponse.error && facturasResponse.data
        ? facturasResponse.data.length || 0
        : 0;

      // Obtener mis cobros
      const cobrosResponse = await obtenerMisCobrosFunc(1000, 0);
      const cobrosCount = !cobrosResponse.error && cobrosResponse.data
        ? cobrosResponse.data.length || 0
        : 0;

      // Obtener mi saldo
      const saldoResponse = await obtenerMiSaldoFunc();
      const saldo = !saldoResponse.error && saldoResponse.data
        ? saldoResponse.data
        : { totalPagado: 0, saldoPendiente: 0 };

      setStats({
        facturas: facturasCount,
        pagos: saldo.totalPagado || 0,
        cobros: cobrosCount,
        saldoPendiente: saldo.saldoPendiente || 0,
      });
    } catch (err) {
      console.error("Error loading client stats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [obtenerMisFacturasFunc, obtenerMisCobrosFunc, obtenerMiSaldoFunc]);

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
