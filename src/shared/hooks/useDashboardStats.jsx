import { useState, useCallback, useEffect } from "react";
import * as api from "../../services/api";
import {
  puedeVerClientes,
  puedeVerCobros,
  puedeVerFacturasCobrar,
  puedeVerFacturasPagar,
  puedeVerPagos,
  puedeVerProveedores,
  puedeVerUsuarios,
} from "../../utils/roleUtils";

const getNumericCount = (value) => {
  const count = Number(value);
  return Number.isFinite(count) ? count : 0;
};

const extractCountFromResponse = (response, keys = []) => {
  if (!response || response.error) {
    return 0;
  }

  const firstLevel = response.data;
  const secondLevel = response.data?.data;
  const levels = [firstLevel, secondLevel].filter((level) => level && typeof level === "object");

  for (const level of levels) {
    if (typeof level.total === "number") {
      return getNumericCount(level.total);
    }

    for (const key of keys) {
      if (Array.isArray(level[key])) {
        return level[key].length;
      }
    }

    if (Array.isArray(level.data)) {
      return level.data.length;
    }
  }

  return 0;
};

const resolveSettledValue = (result) => {
  if (!result || result.status !== "fulfilled") {
    return null;
  }

  return result.value;
};

export const useDashboardStats = (rol = null) => {
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
      if (rol === "CLIENTE_ROLE") {
        const [facturasResult, cobrosResult] = await Promise.allSettled([
          api.obtenerMisFacturas(1000, 0),
          api.obtenerMisCobros(1000, 0),
        ]);

        const facturasResponse = resolveSettledValue(facturasResult);
        const cobrosResponse = resolveSettledValue(cobrosResult);

        const facturasCount = extractCountFromResponse(facturasResponse, ["facturas", "misFacturas"]);
        const cobrosCount = extractCountFromResponse(cobrosResponse, ["cobros", "misCobros", "pagos"]);

        setStats({
          usuarios: 0,
          clientes: 0,
          proveedores: 0,
          facturas: facturasCount,
          cobros: cobrosCount,
          pagos: cobrosCount,
        });

        return;
      }

      const shouldFilterByRole = Boolean(rol);
      const canViewUsers = shouldFilterByRole ? puedeVerUsuarios(rol) : true;
      const canViewClients = shouldFilterByRole ? puedeVerClientes(rol) : true;
      const canViewSuppliers = shouldFilterByRole ? puedeVerProveedores(rol) : true;
      const canViewInvoiceReceivables = shouldFilterByRole ? puedeVerFacturasCobrar(rol) : true;
      const canViewInvoicePayables = shouldFilterByRole ? puedeVerFacturasPagar(rol) : true;
      const canViewCollections = shouldFilterByRole ? puedeVerCobros(rol) : true;
      const canViewPayments = shouldFilterByRole ? puedeVerPagos(rol) : true;

      const settledResults = await Promise.allSettled([
        canViewUsers ? api.obtenerConteoUsuarios() : Promise.resolve({ error: false, total: 0 }),
        canViewClients ? api.obtenerClientes(1000, 0) : Promise.resolve({ error: false, data: { total: 0 } }),
        canViewSuppliers ? api.obtenerProveedores(1000, 0) : Promise.resolve({ error: false, data: { total: 0 } }),
        canViewInvoiceReceivables ? api.obtenerFacturasCobrar(1000, 0) : Promise.resolve({ error: false, data: { total: 0 } }),
        canViewInvoicePayables ? api.obtenerFacturasPagar(1000, 0) : Promise.resolve({ error: false, data: { total: 0 } }),
        canViewCollections ? api.obtenerCobros(1000, 0) : Promise.resolve({ error: false, data: { total: 0 } }),
        canViewPayments ? api.obtenerPagosProveedor(1000, 0) : Promise.resolve({ error: false, data: { total: 0 } }),
      ]);

      const usuariosResponse = resolveSettledValue(settledResults[0]);
      const clientesResponse = resolveSettledValue(settledResults[1]);
      const proveedoresResponse = resolveSettledValue(settledResults[2]);
      const facturasCobrarResponse = resolveSettledValue(settledResults[3]);
      const facturasPagarResponse = resolveSettledValue(settledResults[4]);
      const cobrosResponse = resolveSettledValue(settledResults[5]);
      const pagosResponse = resolveSettledValue(settledResults[6]);

      const usuariosCount = canViewUsers && usuariosResponse && !usuariosResponse.error
        ? getNumericCount(usuariosResponse.total)
        : 0;

      const clientesCount = canViewClients
        ? extractCountFromResponse(clientesResponse, ["clientes"])
        : 0;

      const proveedoresCount = canViewSuppliers
        ? extractCountFromResponse(proveedoresResponse, ["proveedores"])
        : 0;

      const facturasCobrCount = canViewInvoiceReceivables
        ? extractCountFromResponse(facturasCobrarResponse, ["facturas"])
        : 0;

      const facturasPagCount = canViewInvoicePayables
        ? extractCountFromResponse(facturasPagarResponse, ["facturas"])
        : 0;

      const cobrosCount = canViewCollections
        ? extractCountFromResponse(cobrosResponse, ["cobros"])
        : 0;

      const pagosCount = canViewPayments
        ? extractCountFromResponse(pagosResponse, ["pagos"])
        : 0;

      const facturasCount = facturasCobrCount + facturasPagCount;

      setStats({
        usuarios: usuariosCount,
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
  }, [rol]);

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
