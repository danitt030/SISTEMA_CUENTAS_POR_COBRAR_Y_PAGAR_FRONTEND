import { useState, useCallback } from "react";
import * as api from "../../services/api";
import toast from "react-hot-toast";

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerProveedores = useCallback(async (limite = 100, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerProveedores(limite, desde);
      
      if (response.error) {
        setError("Error al cargar proveedores");
        return { error: true, message: "Error al cargar proveedores" };
      }

      const proveedoresData = response.data?.proveedores || response.data?.data || response.proveedores || [];
      setProveedores(Array.isArray(proveedoresData) ? proveedoresData : []);
      return { error: false };
    } catch (err) {
      setError(err.message);
      return { error: true, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const crearProveedor = useCallback(async (data) => {
    try {
      const response = await api.crearProveedor(data);
      if (response.error) {
        return { error: true, message: response.err?.message || "Error al crear proveedor" };
      }
      toast.success("Proveedor creado exitosamente");
      return { error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }, []);

  const actualizarProveedorFunc = useCallback(async (id, data) => {
    try {
      const response = await api.actualizarProveedor(id, data);
      if (response.error) {
        return { error: true, message: response.err?.message || "Error al actualizar" };
      }
      toast.success("Proveedor actualizado exitosamente");
      return { error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }, []);

  const desactivarProveedorFunc = useCallback(async (id) => {
    try {
      const response = await api.desactivarProveedor(id);
      if (response.error) {
        return { error: true, message: response.err?.message || "Error al desactivar" };
      }
      toast.success("Proveedor desactivado");
      return { error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }, []);

  const eliminarProveedorFunc = useCallback(async (id) => {
    try {
      const response = await api.eliminarProveedor(id);
      if (response.error) {
        return { error: true, message: response.err?.message || "Error al eliminar" };
      }
      toast.success("Proveedor eliminado permanentemente");
      return { error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }, []);

  const obtenerSaldoProveedorFunc = useCallback(async (id) => {
    try {
      const response = await api.obtenerSaldoProveedor(id);
      if (response.error) {
        return { error: true, data: null, message: response.err?.message || "Error al obtener saldo" };
      }
      const saldoData = response.data?.saldo || response.data;
      return { error: false, data: saldoData };
    } catch (err) {
      return { error: true, data: null, message: err.message };
    }
  }, []);

  const exportarProveedoresFunc = useCallback(async () => {
    try {
      const response = await api.exportarProveedores();
      if (response.error) {
        return { error: true, data: null, message: response.err?.message || "Error al exportar" };
      }
      toast.success("Proveedores exportados exitosamente");
      return { error: false, data: response.data };
    } catch (err) {
      return { error: true, data: null, message: err.message };
    }
  }, []);

  return {
    proveedores,
    loading,
    error,
    obtenerProveedores,
    crearProveedor,
    actualizarProveedorFunc,
    desactivarProveedorFunc,
    eliminarProveedorFunc,
    obtenerSaldoProveedorFunc,
    exportarProveedoresFunc,
  };
};

export default useProveedores;
