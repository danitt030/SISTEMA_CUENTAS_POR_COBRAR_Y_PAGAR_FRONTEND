import { useState, useCallback } from "react";
import * as api from "../../services/api";
import toast from "react-hot-toast";

export const useFacturasPorPagar = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerFacturas = useCallback(async (limite = 100, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerFacturasPagar(limite, desde);
      
      if (response.error) {
        setError("Error al cargar facturas");
        return { error: true, message: "Error al cargar facturas" };
      }

      const facturasData = response.data?.facturas || response.data?.data || response.facturas || [];
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
      const response = await api.crearFacturaPagar(data);
      if (response.error) {
        const errorMsg = response.err?.response?.data?.message || response.err?.message || "Error al crear factura";
        console.error("Error crear factura:", errorMsg, response.err);
        return { error: true, message: errorMsg };
      }
      toast.success("Factura creada exitosamente");
      return { error: false };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error desconocido";
      console.error("Error catch crear:", errorMsg, err);
      return { error: true, message: errorMsg };
    }
  }, []);

  const actualizarFacturaFunc = useCallback(async (id, data) => {
    try {
      const response = await api.actualizarFacturaPagar(id, data);
      console.log('Respuesta actualizar factura pagar:', response);
      if (response.error) {
        console.error("Error respuesta backend:", response.err?.response?.data || response.err?.message);
        toast.error(response.err?.response?.data?.message || "Error al actualizar");
        return { error: true, message: response.err?.response?.data?.message || response.err?.message || "Error al actualizar" };
      }
      toast.success("Factura actualizada exitosamente");
      return { error: false, data: response.data };
    } catch (err) {
      console.error("Error catch actualizar:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Error al actualizar");
      return { error: true, message: err.response?.data?.message || err.message };
    }
  }, []);

  const desactivarFacturaFunc = useCallback(async (id) => {
    try {
      const response = await api.desactivarFacturaPagar(id);
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
      const response = await api.eliminarFacturaPagar(id);
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
      const response = await api.obtenerSaldoFacturaPagar(id);
      if (response.error) {
        return { error: true, data: null, message: response.err?.message || "Error al obtener saldo" };
      }
      const saldoData = response.data?.saldo || response.data;
      return { error: false, data: saldoData };
    } catch (err) {
      return { error: true, data: null, message: err.message };
    }
  }, []);

  const obtenerFacturasPorProveedorFunc = useCallback(async (proveedorId, limite = 10, desde = 0) => {
    try {
      const response = await api.obtenerFacturasPorProveedor(proveedorId, limite, desde);
      if (response.error) {
        return { error: true, data: [], message: response.err?.message || "Error al obtener facturas" };
      }
      const facturasData = response.data?.facturas || response.data?.data || [];
      return { error: false, data: facturasData, total: response.data?.total || 0 };
    } catch (err) {
      return { error: true, data: [], message: err.message };
    }
  }, []);

  const verificarLimiteCompraFunc = useCallback(async (proveedorId, montoNuevo = 0) => {
    try {
      const response = await api.verificarLimiteCompra(proveedorId, montoNuevo);
      if (response.error) {
        return { error: true, data: null, message: response.err?.message || "Error al verificar límite" };
      }
      return { error: false, data: response.data };
    } catch (err) {
      return { error: true, data: null, message: err.message };
    }
  }, []);

  const exportarFacturasFunc = useCallback(async () => {
    try {
      const response = await api.exportarFacturasPagar();
      if (response.error) {
        return { error: true, data: null, message: response.err?.message || "Error al exportar" };
      }
      toast.success("Facturas exportadas exitosamente");
      return { error: false, data: response.data };
    } catch (err) {
      return { error: true, data: null, message: err.message };
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
    obtenerFacturasPorProveedorFunc,
    verificarLimiteCompraFunc,
    exportarFacturasFunc,
  };
};
