import { useState, useCallback } from "react";
import * as api from "../../services/api";
import toast from "react-hot-toast";

export const useFacturasPorCobrar = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerFacturas = useCallback(async (limite = 100, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerFacturasCobrar(limite, desde);
      
      if (response.error) {
        setError("Error al cargar facturas");
        return { error: true, message: "Error al cargar facturas" };
      }

      // Manejar diferentes estructuras de respuesta
      let facturasData = [];
      if (Array.isArray(response.data)) {
        facturasData = response.data;
      } else if (response.data?.facturas) {
        facturasData = response.data.facturas;
      } else if (response.data?.data) {
        facturasData = response.data.data;
      } else if (response.facturas) {
        facturasData = response.facturas;
      }
      
      setFacturas(Array.isArray(facturasData) ? facturasData : []);
      return { error: false };
    } catch (err) {
      setError(err.message);
      return { error: true, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const crearFactura = useCallback(async (data) => {
    try {
      const response = await api.crearFacturaCobrar(data);
      if (response.error) {
        const errorMsg = response.err?.response?.data?.message || response.err?.message || "Error al crear factura";
        return { error: true, message: errorMsg };
      }
      toast.success("Factura creada exitosamente");
      return { error: false };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error desconocido";
      return { error: true, message: errorMsg };
    }
  }, []);

  const actualizarFacturaFunc = useCallback(async (id, data) => {
    try {
      const response = await api.actualizarFacturaCobrar(id, data);
      if (response.error) {
        toast.error(response.err?.response?.data?.message || "Error al actualizar");
        return { error: true, message: response.err?.response?.data?.message || response.err?.message || "Error al actualizar" };
      }
      toast.success("Factura actualizada exitosamente");
      return { error: false, data: response.data };
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al actualizar");
      return { error: true, message: err.response?.data?.message || err.message };
    }
  }, []);

  const desactivarFacturaFunc = useCallback(async (id) => {
    try {
      const response = await api.desactivarFacturaCobrar(id);
      if (response.error) {
        return { error: true, message: response.err?.message || "Error al desactivar" };
      }
      toast.success("Factura desactivada");
      return { error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }, []);

  const eliminarFacturaFunc = useCallback(async (id) => {
    try {
      const response = await api.eliminarFacturaCobrar(id);
      if (response.error) {
        return { error: true, message: response.err?.message || "Error al eliminar" };
      }
      toast.success("Factura eliminada permanentemente");
      return { error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }, []);

  const obtenerSaldoFacturaFunc = useCallback(async (id) => {
    try {
      const response = await api.obtenerSaldoFacturaCobrar(id);
      if (response.error) {
        return { error: true, data: null, message: response.err?.message || "Error al obtener saldo" };
      }
      return { error: false, data: response.data };
    } catch (err) {
      return { error: true, data: null, message: err.message };
    }
  }, []);

  const obtenerFacturasPorClienteFunc = useCallback(async (clienteId, limite, desde) => {
    try {
      const response = await api.obtenerFacturasPorCliente(clienteId, limite, desde);
      if (response.error) {
        return { error: true, data: [], message: response.err?.message || "Error al obtener facturas" };
      }
      // Manejar diferentes estructuras de respuesta
      let facturasData = [];
      if (Array.isArray(response.data)) {
        facturasData = response.data;
      } else if (response.data?.facturas) {
        facturasData = response.data.facturas;
      } else if (response.data?.data) {
        facturasData = response.data.data;
      }
      return { error: false, data: facturasData, total: response.data?.total || 0 };
    } catch (err) {
      return { error: true, data: [], message: err.message };
    }
  }, []);

  const obtenerFacturasVencidasFunc = useCallback(async (limite, desde) => {
    try {
      const response = await api.obtenerFacturasVencidas(limite, desde);
      if (response.error) {
        return { error: true, data: [], message: response.err?.message || "Error al obtener facturas" };
      }
      // Manejar diferentes estructuras de respuesta
      let facturasData = [];
      if (Array.isArray(response.data)) {
        facturasData = response.data;
      } else if (response.data?.facturas) {
        facturasData = response.data.facturas;
      } else if (response.data?.data) {
        facturasData = response.data.data;
      }
      return { error: false, data: facturasData, total: response.data?.total || 0 };
    } catch (err) {
      return { error: true, data: [], message: err.message };
    }
  }, []);

  const obtenerFacturasProximasFunc = useCallback(async (dias, limite, desde) => {
    try {
      const response = await api.obtenerFacturasProximas(dias, limite, desde);
      if (response.error) {
        return { error: true, data: [], message: response.err?.message || "Error al obtener facturas" };
      }
      // Manejar diferentes estructuras de respuesta
      let facturasData = [];
      if (Array.isArray(response.data)) {
        facturasData = response.data;
      } else if (response.data?.facturas) {
        facturasData = response.data.facturas;
      } else if (response.data?.data) {
        facturasData = response.data.data;
      }
      return { error: false, data: facturasData, total: response.data?.total || 0 };
    } catch (err) {
      return { error: true, data: [], message: err.message };
    }
  }, []);

  const marcarFacturaVencidaFunc = useCallback(async (id) => {
    try {
      const response = await api.marcarFacturaVencida(id);
      if (response.error) {
        return { error: true, message: response.err?.message || "Error al marcar factura" };
      }
      toast.success("Factura marcada como vencida");
      return { error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }, []);

  const enviarRecordatorioFunc = useCallback(async (id) => {
    try {
      const response = await api.enviarRecordatorio(id);
      if (response.error) {
        return { error: true, message: response.err?.message || "Error al enviar recordatorio" };
      }
      toast.success("Recordatorio enviado exitosamente");
      return { error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }, []);

  const exportarFacturasFunc = useCallback(async () => {
    try {
      const response = await api.exportarFacturasCobrar();
      
      if (response?.error) {
        return { error: true, message: response.err?.message || "Error al exportar" };
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
      link.setAttribute("download", `Facturas_Cobrar_${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Archivo Excel generado correctamente");
      return { error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }, []);

  return {
    facturas,
    loading,
    error,
    obtenerFacturas,
    crearFactura,
    actualizarFacturaFunc,
    desactivarFacturaFunc,
    eliminarFacturaFunc,
    obtenerSaldoFacturaFunc,
    obtenerFacturasPorClienteFunc,
    obtenerFacturasVencidasFunc,
    obtenerFacturasProximasFunc,
    marcarFacturaVencidaFunc,
    enviarRecordatorioFunc,
    exportarFacturasFunc,
  };
};
