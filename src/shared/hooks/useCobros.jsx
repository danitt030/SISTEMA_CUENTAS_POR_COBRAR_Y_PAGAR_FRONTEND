import { useState, useCallback } from "react";
import {
  crearCobro,
  obtenerCobros,
  obtenerCobroPorId,
  actualizarCobro,
  buscarCobrosActivos,
  desactivarCobro,
  eliminarCobro,
  obtenerSaldoCobro,
  obtenerCobrosPorCliente,
  obtenerComisionesTotales,
  exportarCobros,
} from "../../services/api";

export const useCobros = () => {
  const [cobros, setCobros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerCobrosFunc = useCallback(async (limite = 1000, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await obtenerCobros(limite, desde);
      if (!response.error) {
        setCobros(response.data?.data || response.data?.cobros || []);
      } else {
        throw response.err;
      }
    } catch {
      setError("Error al obtener los cobros");
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerCobroPorIdFunc = useCallback(async (id) => {
    try {
      const response = await obtenerCobroPorId(id);
      if (!response.error) {
        return response.data?.data || response.data;
      } else {
        throw response.err;
      }
    } catch {
      setError("Error al obtener el cobro");
      return null;
    }
  }, []);

  const crearCobroFunc = useCallback(async (datos) => {
    try {
      // Validar que la fecha sea válida
      if (!datos.fechaCobro) {
        throw new Error("La fecha de cobro es requerida");
      }

      const fechaDate = new Date(datos.fechaCobro);
      if (isNaN(fechaDate.getTime())) {
        throw new Error("Formato de fecha inválido");
      }

      const payload = {
        numeroComprobante: datos.numeroComprobante,
        facturaPorCobrar: datos.facturaPorCobrarId,
        cliente: datos.clienteId,
        montoFactura: parseFloat(datos.montoFactura),
        montoCobrado: parseFloat(datos.montoCobrado),
        moneda: datos.moneda || "GTQ",
        metodoPago: datos.metodoPago,
        fechaCobro: fechaDate.toISOString(),
        referencia: datos.referencia || "",
        comision: datos.comision ? parseFloat(datos.comision) : 0,
        descripcion: datos.descripcion || "",
      };

      const response = await crearCobro(payload);
      if (!response.error) {
        return true;
      } else {
        throw response.err;
      }
    } catch {
      setError("Error al crear el cobro");
      return false;
    }
  }, []);

  const actualizarCobroFunc = useCallback(async (id, datos) => {
    try {
      // Si solo contiene activo (para reactivar/desactivar), enviar directamente
      if (Object.keys(datos).length === 1 && datos.activo !== undefined) {
        const response = await actualizarCobro(id, { activo: datos.activo });
        if (!response.error) {
          return true;
        } else {
          throw response.err;
        }
      }

      // Si es actualización completa, validar fecha
      if (!datos.fechaCobro) {
        throw new Error("La fecha de cobro es requerida");
      }

      const fechaDate = new Date(datos.fechaCobro);
      if (isNaN(fechaDate.getTime())) {
        throw new Error("Formato de fecha inválido");
      }

      const payload = {
        montoCobrado: parseFloat(datos.montoCobrado),
        metodoPago: datos.metodoPago,
        fechaCobro: fechaDate.toISOString(),
        referencia: datos.referencia || "",
        comision: datos.comision ? parseFloat(datos.comision) : 0,
        descripcion: datos.descripcion || "",
      };

      const response = await actualizarCobro(id, payload);
      if (!response.error) {
        return true;
      } else {
        throw response.err;
      }
    } catch {
      setError("Error al actualizar el cobro");
      return false;
    }
  }, []);

  const buscarCobrosFiltradosFunc = useCallback(async (cliente = "", fechaInicio = "", fechaFin = "", metodoPago = "", limite = 100, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await buscarCobrosActivos(cliente, fechaInicio, fechaFin, metodoPago, limite, desde);
      if (!response.error) {
        setCobros(response.data?.data || response.data?.cobros || []);
      } else {
        throw response.err;
      }
    } catch {
      setError("Error al buscar los cobros");
    } finally {
      setLoading(false);
    }
  }, []);

  const desactivarCobroFunc = useCallback(async (id) => {
    try {
      const response = await desactivarCobro(id);
      if (!response.error) {
        return true;
      } else {
        throw response.err;
      }
    } catch {
      setError("Error al desactivar el cobro");
      return false;
    }
  }, []);

  const eliminarCobroFunc = useCallback(async (id) => {
    try {
      const response = await eliminarCobro(id);
      if (!response.error) {
        return true;
      } else {
        throw response.err;
      }
    } catch {
      setError("Error al eliminar el cobro");
      return false;
    }
  }, []);

  const obtenerSaldoCobroFunc = useCallback(async (id) => {
    try {
      const response = await obtenerSaldoCobro(id);
      if (!response.error) {
        return response.data?.data || response.data;
      } else {
        throw response.err;
      }
    } catch {
      return null;
    }
  }, []);

  const obtenerCobrosPorClienteFunc = useCallback(async (clienteId, limite = 100, desde = 0) => {
    try {
      const response = await obtenerCobrosPorCliente(clienteId, limite, desde);
      if (!response.error) {
        return response.data?.data || response.data?.cobros || [];
      } else {
        throw response.err;
      }
    } catch {
      return [];
    }
  }, []);

  const obtenerComisionesTotalesFunc = useCallback(async (fechaInicio = "", fechaFin = "") => {
    try {
      const response = await obtenerComisionesTotales(fechaInicio, fechaFin);
      if (!response.error) {
        return response.data?.data || response.data;
      } else {
        throw response.err;
      }
    } catch {
      return null;
    }
  }, []);

  const exportarCobrosFunc = useCallback(async () => {
    try {
      const response = await exportarCobros();
      
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
      link.setAttribute("download", `Cobros_${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch {
      return null;
    }
  }, []);

  return {
    cobros,
    loading,
    error,
    obtenerCobrosFunc,
    obtenerCobroPorIdFunc,
    crearCobroFunc,
    actualizarCobroFunc,
    buscarCobrosFiltradosFunc,
    desactivarCobroFunc,
    eliminarCobroFunc,
    obtenerSaldoCobroFunc,
    obtenerCobrosPorClienteFunc,
    obtenerComisionesTotalesFunc,
    exportarCobrosFunc,
  };
};
