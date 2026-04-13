import { useState, useCallback } from "react";
import {
  obtenerResumenSaldos,
  obtenerResumenProveedor,
  obtenerResumenCliente,
  obtenerFacturasPorVencer,
  obtenerFacturasVencidasReporte,
  obtenerCobrabilidad,
  obtenerPagabilidad,
  obtenerFacturasPorEstado,
  obtenerTopClientesDeudores,
  obtenerTopProveedoresAcreedores,
  obtenerAnalisisComisiones,
  exportarReporte
} from "../../services/api";

export const useReportes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Resumen de Saldos
  const resumenSaldosFunc = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerResumenSaldos();
      return { error: false, data: response };
    } catch (err) {
      const message = err.message || "Error obteniendo resumen de saldos";
      setError(message);
      return { error: true, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Resumen por Proveedor
  const resumenProveedorFunc = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerResumenProveedor();
      return { error: false, data: response };
    } catch (err) {
      const message = err.message || "Error obteniendo resumen por proveedor";
      setError(message);
      return { error: true, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Resumen por Cliente
  const resumenClienteFunc = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerResumenCliente();
      return { error: false, data: response };
    } catch (err) {
      const message = err.message || "Error obteniendo resumen por cliente";
      setError(message);
      return { error: true, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. Facturas por Vencer
  const facturasPorVencerFunc = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerFacturasPorVencer();
      return { error: false, data: response };
    } catch (err) {
      const message = err.message || "Error obteniendo facturas por vencer";
      setError(message);
      return { error: true, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 5. Facturas Vencidas
  const facturasVencidasFunc = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerFacturasVencidasReporte();
      return { error: false, data: response };
    } catch (err) {
      const message = err.message || "Error obteniendo facturas vencidas";
      setError(message);
      return { error: true, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 6. Cobrabilidad
  const cobrabilidadFunc = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerCobrabilidad();
      return { error: false, data: response };
    } catch (err) {
      const message = err.message || "Error obteniendo cobrabilidad";
      setError(message);
      return { error: true, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 7. Pagabilidad
  const pagabilidadFunc = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerPagabilidad();
      return { error: false, data: response };
    } catch (err) {
      const message = err.message || "Error obteniendo pagabilidad";
      setError(message);
      return { error: true, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 8. Facturas por Estado
  const facturasPorEstadoFunc = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerFacturasPorEstado();
      return { error: false, data: response };
    } catch (err) {
      const message = err.message || "Error obteniendo facturas por estado";
      setError(message);
      return { error: true, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 9. Top Clientes Deudores
  const topClientesFunc = useCallback(async (limite = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerTopClientesDeudores(limite);
      return { error: false, data: response };
    } catch (err) {
      const message = err.message || "Error obteniendo top clientes";
      setError(message);
      return { error: true, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 10. Top Proveedores Acreedores
  const topProveedoresFunc = useCallback(async (limite = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerTopProveedoresAcreedores(limite);
      return { error: false, data: response };
    } catch (err) {
      const message = err.message || "Error obteniendo top proveedores";
      setError(message);
      return { error: true, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 11. Análisis de Comisiones
  const analisisComisionesFunc = useCallback(async (fechaInicio, fechaFin) => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerAnalisisComisiones(fechaInicio, fechaFin);
      return { error: false, data: response };
    } catch (err) {
      const message = err.message || "Error obteniendo análisis de comisiones";
      setError(message);
      return { error: true, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 12. Exportar Reporte
  const exportarReporteFunc = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await exportarReporte();
      
      if (response?.error) {
        throw response.err;
      }

      // Validar que sea un Blob
      const isBlob = response instanceof Blob;
      
      if (!isBlob) {
        throw new Error("La respuesta no es un archivo válido (no es Blob)");
      }
      
      // Crear descarga del archivo
      const url = window.URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Reporte_${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { error: false };
    } catch (err) {
      const message = err?.message || "Error exportando reporte";
      setError(message);
      return { error: true, message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    resumenSaldosFunc,
    resumenProveedorFunc,
    resumenClienteFunc,
    facturasPorVencerFunc,
    facturasVencidasFunc,
    cobrabilidadFunc,
    pagabilidadFunc,
    facturasPorEstadoFunc,
    topClientesFunc,
    topProveedoresFunc,
    analisisComisionesFunc,
    exportarReporteFunc
  };
};
