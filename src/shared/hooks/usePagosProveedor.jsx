import { useState, useCallback } from "react";
import {
  crearPagoProveedor,
  obtenerPagosProveedor,
  obtenerPagoPorId,
  actualizarPagoProveedor,
  buscarPagosActivosProveedor,
  desactivarPagoProveedor,
  eliminarPagoProveedor,
  obtenerSaldoPagoProveedor,
  obtenerPagosPorProveedor,
  exportarPagosProveedor,
} from "../../services/api";

export const usePagosProveedor = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerPagosProveedorFunc = useCallback(async (limite = 1000, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await obtenerPagosProveedor(limite, desde);
      if (!response.error) {
        setPagos(response.data?.data || response.data?.pagos || []);
      } else {
        throw response.err;
      }
    } catch (err) {
      console.error("Error al obtener pagos:", err);
      setError("Error al obtener los pagos");
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerPagoPorIdFunc = useCallback(async (id) => {
    try {
      const response = await obtenerPagoPorId(id);
      if (!response.error) {
        return response.data?.pago || response.data?.data || response.data;
      } else {
        throw response.err;
      }
    } catch (err) {
      console.error("Error al obtener pago por ID:", err);
      setError("Error al obtener el pago");
      return null;
    }
  }, []);

  const crearPagoFunc = useCallback(async (datos) => {
    try {
      if (!datos.fechaPago) {
        throw new Error("La fecha de pago es requerida");
      }

      const fechaDate = new Date(datos.fechaPago);
      if (isNaN(fechaDate.getTime())) {
        throw new Error("Formato de fecha inválido");
      }

      const payload = {
        numeroRecibo: datos.numeroRecibo,
        facturaPorPagar: datos.facturaPorPagarId,
        proveedor: datos.proveedorId,
        monto: parseFloat(datos.monto),
        moneda: datos.moneda || "GTQ",
        metodoPago: datos.metodoPago,
        fechaPago: fechaDate.toISOString(),
        referencia: datos.referencia || "",
        descripcion: datos.descripcion || "",
      };

      console.log("Payload para crear pago:", payload);

      const response = await crearPagoProveedor(payload);
      if (!response.error) {
        console.log("Pago creado exitosamente:", response.data);
        return true;
      } else {
        throw response.err;
      }
    } catch (err) {
      console.error("Error al crear pago:", err);
      setError("Error al crear el pago");
      return false;
    }
  }, []);

  const actualizarPagoFunc = useCallback(async (id, datos) => {
    try {
      // Si solo contiene activo (para desactivar/reactivar), enviar directamente
      if (Object.keys(datos).length === 1 && datos.activo !== undefined) {
        const response = await actualizarPagoProveedor(id, { activo: datos.activo });
        if (!response.error) {
          console.log("Pago actualizado exitosamente:", response.data);
          return true;
        } else {
          throw response.err;
        }
      }

      // Si es actualización completa, validar fecha
      if (!datos.fechaPago) {
        throw new Error("La fecha de pago es requerida");
      }

      const fechaDate = new Date(datos.fechaPago);
      if (isNaN(fechaDate.getTime())) {
        throw new Error("Formato de fecha inválido");
      }

      const payload = {
        numeroRecibo: datos.numeroRecibo,
        monto: parseFloat(datos.monto),
        moneda: datos.moneda,
        metodoPago: datos.metodoPago,
        fechaPago: fechaDate.toISOString(),
        referencia: datos.referencia || "",
        descripcion: datos.descripcion || "",
      };

      console.log("Payload para actualizar pago:", payload);

      const response = await actualizarPagoProveedor(id, payload);
      if (!response.error) {
        console.log("Pago actualizado exitosamente:", response.data);
        return true;
      } else {
        throw response.err;
      }
    } catch (err) {
      console.error("Error al actualizar pago:", err);
      setError("Error al actualizar el pago");
      return false;
    }
  }, []);

  const buscarPagosFiltradosFunc = useCallback(async (proveedor = "", fechaInicio = "", fechaFin = "", limite = 100, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await buscarPagosActivosProveedor(proveedor, fechaInicio, fechaFin, limite, desde);
      if (!response.error) {
        setPagos(response.data?.data || response.data?.pagos || []);
      } else {
        throw response.err;
      }
    } catch (err) {
      console.error("Error al buscar pagos:", err);
      setError("Error al buscar los pagos");
    } finally {
      setLoading(false);
    }
  }, []);

  const desactivarPagoFunc = useCallback(async (id) => {
    try {
      const response = await desactivarPagoProveedor(id);
      if (!response.error) {
        console.log("Pago desactivado exitosamente");
        return true;
      } else {
        throw response.err;
      }
    } catch (err) {
      console.error("Error al desactivar pago:", err);
      setError("Error al desactivar el pago");
      return false;
    }
  }, []);

  const eliminarPagoFunc = useCallback(async (id) => {
    try {
      const response = await eliminarPagoProveedor(id);
      if (!response.error) {
        console.log("Pago eliminado exitosamente");
        return true;
      } else {
        throw response.err;
      }
    } catch (err) {
      console.error("Error al eliminar pago:", err);
      setError("Error al eliminar el pago");
      return false;
    }
  }, []);

  const obtenerSaldoPagoFunc = useCallback(async (id) => {
    try {
      const response = await obtenerSaldoPagoProveedor(id);
      if (!response.error) {
        return response.data?.data || response.data;
      } else {
        throw response.err;
      }
    } catch (err) {
      console.error("Error al obtener saldo del pago:", err);
      return null;
    }
  }, []);

  const obtenerPagosPorProveedorFunc = useCallback(async (proveedorId, limite = 100, desde = 0) => {
    try {
      const response = await obtenerPagosPorProveedor(proveedorId, limite, desde);
      if (!response.error) {
        return response.data?.data || response.data?.pagos || [];
      } else {
        throw response.err;
      }
    } catch (err) {
      console.error("Error al obtener pagos del proveedor:", err);
      return [];
    }
  }, []);

  const exportarPagosFunc = useCallback(async () => {
    try {
      const response = await exportarPagosProveedor();
      
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
      link.setAttribute("download", `Pagos_Proveedor_${new Date().toISOString().split("T")[0]}.xlsx`);
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
    pagos,
    loading,
    error,
    obtenerPagosProveedorFunc,
    obtenerPagoPorIdFunc,
    crearPagoFunc,
    actualizarPagoFunc,
    buscarPagosFiltradosFunc,
    desactivarPagoFunc,
    eliminarPagoFunc,
    obtenerSaldoPagoFunc,
    obtenerPagosPorProveedorFunc,
    exportarPagosFunc,
  };
};
