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
      
      // Obtener conteo de clientes
      const clientesResponse = await api.obtenerClientes(1000, 0);
      const clientesCount = !clientesResponse.error && clientesResponse.data 
        ? (clientesResponse.data.total || clientesResponse.data.clientes?.length || Object.keys(clientesResponse.data).length)
        : 0;

      // Obtener conteo de proveedores
      const proveedoresResponse = await api.obtenerProveedores(1000, 0);
      const proveedoresCount = !proveedoresResponse.error && proveedoresResponse.data
        ? (proveedoresResponse.data.total || proveedoresResponse.data.proveedores?.length || Object.keys(proveedoresResponse.data).length)
        : 0;

      // Obtener conteo de facturas (cobrar + pagar)
      const facturasCobrarResponse = await api.obtenerFacturasCobrar(1000, 0);
      const facturasPagarResponse = await api.obtenerFacturasPagar(1000, 0);
      
      const facturasCobrCount = !facturasCobrarResponse.error && facturasCobrarResponse.data
        ? (facturasCobrarResponse.data.total || facturasCobrarResponse.data.facturas?.length || Object.keys(facturasCobrarResponse.data).length)
        : 0;
      
      const facturasPagCount = !facturasPagarResponse.error && facturasPagarResponse.data
        ? (facturasPagarResponse.data.total || facturasPagarResponse.data.facturas?.length || Object.keys(facturasPagarResponse.data).length)
        : 0;
      
      const facturasCount = facturasCobrCount + facturasPagCount;

      // Obtener conteo de cobros
      const cobrosResponse = await api.obtenerCobros(1000, 0);
      const cobrosCount = !cobrosResponse.error && cobrosResponse.data
        ? (cobrosResponse.data.total || cobrosResponse.data.cobros?.length || Object.keys(cobrosResponse.data).length)
        : 0;

      // Obtener conteo de pagos
      const pagosResponse = await api.obtenerPagosProveedor(1000, 0);
      const pagosCount = !pagosResponse.error && pagosResponse.data
        ? (pagosResponse.data.total || pagosResponse.data.pagos?.length || Object.keys(pagosResponse.data).length)
        : 0;

      setStats({
        usuarios: usuariosResponse.error ? 0 : usuariosResponse.total,
        clientes: clientesCount,
        proveedores: proveedoresCount,
        facturas: facturasCount,
        cobros: cobrosCount,
        pagos: pagosCount,
      });
    } catch (err) {
      console.error("Error loading stats:", err);
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
