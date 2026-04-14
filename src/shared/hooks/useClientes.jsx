import { useState, useCallback } from "react";
import * as api from "../../services/api";

export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerClientes = useCallback(async (limite = 10, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerClientes(limite, desde);
      
      if (response.error) {
        const errorMsg = response.err?.message || "Error al obtener clientes";
        setError(errorMsg);
        return { error: true, data: null };
      }
      
      const clienteData = response.data?.clientes || response.data?.data || response?.clientes || [];
      
      setClientes(clienteData);
      return { error: false, data: clienteData };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerClientePorId = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerClientePorId(id);
      if (response.error) {
        setError(response.err?.message || "Error al obtener cliente");
        return { error: true, data: null };
      }
      const clienteData = response.data?.cliente || response.data?.data || null;
      return { error: false, data: clienteData };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const crearCliente = useCallback(async (datos) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.crearCliente(datos);
      if (response.error) {
        setError(response.err?.message || "Error al crear cliente");
        return { error: true, data: null };
      }
      const nuevoCliente = response.data?.cliente || response.data;
      setClientes(prev => [nuevoCliente, ...prev]);
      return { error: false, data: nuevoCliente };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarClienteFunc = useCallback(async (id, datosActualizados) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.actualizarCliente(id, datosActualizados);
      if (response.error) {
        setError(response.err?.message || "Error al actualizar cliente");
        return { error: true, data: null };
      }
      const clienteActualizado = response.data?.cliente || response.data;
      setClientes(prev =>
        prev.map(c => c.id === id || c._id === id ? clienteActualizado : c)
      );
      return { error: false, data: clienteActualizado };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const desactivarClienteFunc = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.desactivarCliente(id);
      if (response.error) {
        setError(response.err?.message || "Error al desactivar cliente");
        return { error: true };
      }
      setClientes(prev =>
        prev.map(c => c.id === id || c._id === id ? { ...c, estado: false } : c)
      );
      return { error: false };
    } catch (err) {
      setError(err.message);
      return { error: true };
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarClienteFunc = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.eliminarCliente(id);
      if (response.error) {
        setError(response.err?.message || "Error al eliminar cliente");
        return { error: true };
      }
      setClientes(prev => prev.filter(c => c.id !== id && c._id !== id));
      return { error: false };
    } catch (err) {
      setError(err.message);
      return { error: true };
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerSaldoClienteFunc = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerSaldoCliente(id);
      if (response.error) {
        setError(response.err?.message || "Error al obtener saldo del cliente");
        return { error: true, data: null };
      }
      const saldoData = response.data?.saldo || response.data;
      return { error: false, data: saldoData };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerClientesPorGerenteFunc = useCallback(async (gerenteId, limite = 10, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerClientesPorGerente(gerenteId, limite, desde);
      if (response.error) {
        setError(response.err?.message || "Error al obtener clientes del gerente");
        return { error: true, data: [] };
      }
      const clientesData = response.data?.clientes || response.data?.data || [];
      return { error: false, data: clientesData, total: response.data?.total || 0 };
    } catch (err) {
      setError(err.message);
      return { error: true, data: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const verificarLimiteCreditoFunc = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.verificarLimiteCredito(id);
      if (response.error) {
        setError(response.err?.message || "Error al verificar límite de crédito");
        return { error: true, data: null };
      }
      const verificacionData = response.data?.verificacion || response.data;
      return { error: false, data: verificacionData };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const exportarClientesFunc = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.exportarClientes();
      
      // Verificar si es un error (API retorna {error: true, err: ...})
      if (response?.error) {
        setError(response.err?.message || "Error al exportar clientes");
        return { error: true };
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
      link.setAttribute("download", `Clientes_${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { error: false };
    } catch (err) {
      setError(err.message);
      return { error: true };
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarClientes = useCallback((termino) => {
    if (!termino) return clientes;
    const lowerTermino = termino.toLowerCase();
    return clientes.filter(c =>
      c.nombre?.toLowerCase().includes(lowerTermino) ||
      c.numeroDocumento?.toLowerCase().includes(lowerTermino) ||
      c.nit?.toLowerCase().includes(lowerTermino) ||
      c.correo?.toLowerCase().includes(lowerTermino)
    );
  }, [clientes]);

  // ==================== PORTAL CLIENTE - FUNCIONES ====================

  const obtenerMiPerfilFunc = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerMiPerfil();
      if (response.error) {
        setError(response.err?.message || "Error al obtener tu perfil");
        return { error: true, data: null };
      }
      const miPerfilData = response.data?.cliente || response.data;
      return { error: false, data: miPerfilData };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerMisFacturasFunc = useCallback(async (limite = 10, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerMisFacturas(limite, desde);
      if (response.error) {
        setError(response.err?.message || "Error al obtener tus facturas");
        return { error: true, data: [] };
      }
      const facturasData = response.data?.facturas || response.data?.data || [];
      return { error: false, data: facturasData, total: response.data?.total || 0 };
    } catch (err) {
      setError(err.message);
      return { error: true, data: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerDetalleFacturaFunc = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerDetalleFactura(id);
      if (response.error) {
        setError(response.err?.message || "Error al obtener detalle de factura");
        return { error: true, data: null };
      }
      const detalleData = response.data?.factura || response.data;
      return { error: false, data: detalleData };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerMisCobrosFunc = useCallback(async (limite = 10, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerMisCobros(limite, desde);
      if (response.error) {
        setError(response.err?.message || "Error al obtener tus cobros");
        return { error: true, data: [] };
      }
      const cobrosData = response.data?.cobros || response.data?.data || [];
      return { error: false, data: cobrosData, total: response.data?.total || 0 };
    } catch (err) {
      setError(err.message);
      return { error: true, data: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerMiSaldoFunc = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerMiSaldo();
      if (response.error) {
        setError(response.err?.message || "Error al obtener tu saldo");
        return { error: true, data: null };
      }
      const saldoData = response.data?.saldo || response.data;
      return { error: false, data: saldoData };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerMisFacturasVencidasFunc = useCallback(async (limite = 10, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerMisFacturasVencidas(limite, desde);
      if (response.error) {
        setError(response.err?.message || "Error al obtener facturas vencidas");
        return { error: true, data: [] };
      }
      const facturasData = response.data?.facturas || response.data?.data || [];
      return { error: false, data: facturasData, total: response.data?.total || 0 };
    } catch (err) {
      setError(err.message);
      return { error: true, data: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const registrarMiPagoFunc = useCallback(async (facturaId, datosCobroCliente) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.registrarMiPago(facturaId, datosCobroCliente);
      if (response.error) {
        setError(response.err?.message || "Error al registrar el pago");
        return { error: true, data: null };
      }
      const cobroData = response.data?.cobro || response.data;
      return { error: false, data: cobroData };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clientes,
    loading,
    error,
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarClienteFunc,
    desactivarClienteFunc,
    eliminarClienteFunc,
    obtenerSaldoClienteFunc,
    obtenerClientesPorGerenteFunc,
    verificarLimiteCreditoFunc,
    exportarClientesFunc,
    buscarClientes,
    obtenerMiPerfilFunc,
    obtenerMisFacturasFunc,
    obtenerDetalleFacturaFunc,
    obtenerMisCobrosFunc,
    obtenerMiSaldoFunc,
    obtenerMisFacturasVencidasFunc,
    registrarMiPagoFunc,
  };
};
