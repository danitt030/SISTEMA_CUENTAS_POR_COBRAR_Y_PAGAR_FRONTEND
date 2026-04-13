import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:3002/sistemasCuentasPorPagarYCobrar/v1",
    timeout: 5000,
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
    (config) => {
        const userDetails = localStorage.getItem("user");

        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                if (parsedUser?.token) {
                    config.headers.Authorization = `Bearer ${parsedUser.token}`;
                }
            } catch (err) {
                console.error("Error al parsear el token:", err);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401 &&
            !window.location.pathname.includes('/auth') &&
            error.response.data?.message?.includes('token')) {

            localStorage.removeItem('user');
            window.location.href = '/auth';
        }

        return Promise.reject(error);
    }
);

// ==================== AUTH ====================
export const register = async (data) => {
    try {
        return await api.post("/auth/register", data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const login = async (data) => {
    try {
        return await api.post("/auth/login", data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

// ==================== USUARIO ====================
export const obtenerUsuarios = async (limite = 10, desde = 0) => {
    try {
        return await api.get(`/usuarios?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerUsuariosPorRol = async (rol, limite = 10, desde = 0) => {
    try {
        return await api.get(`/usuarios/rol/${rol}?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerUsuarioPorId = async (id) => {
    try {
        return await api.get(`/usuarios/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const actualizarUsuario = async (id, data) => {
    try {
        return await api.put(`/usuarios/actualizarUsuario/${id}`, data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const actualizarContraseña = async (id, nuevaContraseña) => {
    try {
        return await api.patch(`/usuarios/${id}/contrasena`, { nuevaContraseña });
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const actualizarRol = async (id, nuevoRol) => {
    try {
        return await api.patch(`/usuarios/${id}/rol`, { nuevoRol });
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const desactivarUsuario = async (id) => {
    try {
        return await api.delete(`/usuarios/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const eliminarCuentaPropia = async (id, contraseña) => {
    try {
        return await api.delete(`/usuarios/${id}/cuenta`, { data: { contraseña } });
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const crearUsuario = async (data) => {
    try {
        return await api.post("/usuarios/crear", data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerTodosUsuarios = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (filters.desde) queryParams.append('desde', filters.desde);
        if (filters.limite) queryParams.append('limite', filters.limite);

        const queryString = queryParams.toString();
        const url = queryString ? `/usuarios/?${queryString}` : '/usuarios/';

        return await api.get(url);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

// Obtener solo el conteo de usuarios
export const obtenerConteoUsuarios = async () => {
    try {
        const response = await api.get(`/usuarios?limite=1&desde=0`);
        return {
            error: false,
            total: response.data?.total || 0
        };
    } catch {
        return {
            error: true,
            total: 0
        };
    }
};

export const eliminarUsuario = async (id) => {
    try {
        return await api.delete(`/usuarios/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

// ==================== CLIENTES ====================
export const crearCliente = async (data) => {
    try {
        return await api.post("/clientes/crearCliente", data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerClientes = async (limite = 10, desde = 0) => {
    try {
        return await api.get(`/clientes/obtenerTodosClientes?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerClientePorId = async (id) => {
    try {
        return await api.get(`/clientes/obtenerClientePorId/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const actualizarCliente = async (id, data) => {
    try {
        return await api.put(`/clientes/actualizarCliente/${id}`, data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const desactivarCliente = async (id) => {
    try {
        return await api.delete(`/clientes/desactivarCliente/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const buscarClientesActivos = async (busqueda = "", limite = 10, desde = 0) => {
    try {
        return await api.get(`/clientes/buscarClientesActivos?busqueda=${busqueda}&limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerConcteoClientes = async () => {
    try {
        const response = await api.get(`/clientes/obtenerTodosClientes?limite=1&desde=0`);
        return {
            error: false,
            total: response.data?.total || 0
        };
    } catch {
        return {
            error: true,
            total: 0
        };
    }
};

export const eliminarCliente = async (id) => {
    try {
        return await api.delete(`/clientes/eliminarCliente/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerSaldoCliente = async (id) => {
    try {
        return await api.get(`/clientes/obtenerCliente/${id}/saldo`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerClientesPorGerente = async (gerenteId, limite = 10, desde = 0) => {
    try {
        return await api.get(`/clientes/gerenteClientes/${gerenteId}?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const verificarLimiteCredito = async (id) => {
    try {
        return await api.get(`/clientes/verificarLimiteCredito/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const exportarClientes = async () => {
    try {
        return await api.get(`/clientes/exportarClientes/excel`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

// ==================== PORTAL CLIENTE ====================

export const obtenerMiPerfil = async () => {
    try {
        return await api.get(`/clientes/portal/miPerfil`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerMisFacturas = async (limite = 10, desde = 0) => {
    try {
        return await api.get(`/clientes/portal/misFacturas?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerDetalleFactura = async (id) => {
    try {
        return await api.get(`/clientes/portal/miFactura/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerMisCobros = async (limite = 10, desde = 0) => {
    try {
        return await api.get(`/clientes/portal/misCobros?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerMiSaldo = async () => {
    try {
        return await api.get(`/clientes/portal/miSaldo`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerMisFacturasVencidas = async (limite = 10, desde = 0) => {
    try {
        return await api.get(`/clientes/portal/misFacturasVencidas?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

// ==================== PROVEEDORES ====================
export const crearProveedor = async (data) => {
    try {
        return await api.post("/proveedores/crearProveedor", data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerProveedores = async (limite = 10, desde = 0) => {
    try {
        return await api.get(`/proveedores/listarProveedores?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerProveedorPorId = async (id) => {
    try {
        return await api.get(`/proveedores/listarProveedorPorId/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const actualizarProveedor = async (id, data) => {
    try {
        return await api.put(`/proveedores/actualizarProveedor/${id}`, data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const desactivarProveedor = async (id) => {
    try {
        return await api.delete(`/proveedores/desactivarProveedor/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const buscarProveedoresActivos = async (busqueda = "", limite = 10, desde = 0) => {
    try {
        return await api.get(`/proveedores/buscarProveedoresActivos?busqueda=${busqueda}&limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const eliminarProveedor = async (id) => {
    try {
        return await api.delete(`/proveedores/eliminarProveedor/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerSaldoProveedor = async (id) => {
    try {
        return await api.get(`/proveedores/listarProveedor/${id}/saldo`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const exportarProveedores = async () => {
    try {
        return await api.get(`/proveedores/exportarProveedores/excel`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

// ==================== FACTURAS POR PAGAR ====================
export const crearFacturaPagar = async (data) => {
    try {
        return await api.post("/facturasPorPagar/crear", data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerFacturasPagar = async (limite = 10, desde = 0) => {
    try {
        return await api.get(`/facturasPorPagar?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerFacturaPagarPorId = async (id) => {
    try {
        return await api.get(`/facturasPorPagar/obtenerPorId/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const actualizarFacturaPagar = async (id, data) => {
    try {
        return await api.put(`/facturasPorPagar/actualizarFactura/${id}`, data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const desactivarFacturaPagar = async (id) => {
    try {
        return await api.delete(`/facturasPorPagar/desactivar/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const buscarFacturasActivasPagar = async (estado = "PENDIENTE", limite = 10, desde = 0) => {
    try {
        return await api.get(`/facturasPorPagar/buscar/activas?estado=${estado}&limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const eliminarFacturaPagar = async (id) => {
    try {
        return await api.delete(`/facturasPorPagar/eliminar/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerSaldoFacturaPagar = async (id) => {
    try {
        return await api.get(`/facturasPorPagar/saldo/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerFacturasPorProveedor = async (proveedorId, limite = 10, desde = 0) => {
    try {
        return await api.get(`/facturasPorPagar/proveedor/${proveedorId}?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const verificarLimiteCompra = async (proveedorId, montoNuevo = 0) => {
    try {
        return await api.post(`/facturasPorPagar/verificar-limite/${proveedorId}`, { montoNuevo });
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const exportarFacturasPagar = async () => {
    try {
        return await api.get(`/facturasPorPagar/exportar/excel`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

// ==================== FACTURAS POR COBRAR ====================
export const crearFacturaCobrar = async (data) => {
    try {
        return await api.post("/facturasPorCobrar/crear", data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerFacturasCobrar = async (limite = 10, desde = 0) => {
    try {
        return await api.get(`/facturasPorCobrar?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerFacturaCobrarPorId = async (id) => {
    try {
        return await api.get(`/facturasPorCobrar/obtenerPorId/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const actualizarFacturaCobrar = async (id, data) => {
    try {
        return await api.put(`/facturasPorCobrar/actualizarFactura/${id}`, data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const desactivarFacturaCobrar = async (id) => {
    try {
        return await api.delete(`/facturasPorCobrar/desactivar/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const buscarFacturasActivasCobrar = async (estado = "PENDIENTE", limite = 10, desde = 0) => {
    try {
        return await api.get(`/facturasPorCobrar/buscar/activas?estado=${estado}&limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

// ==================== FACTURAS POR COBRAR - FUNCIONES ADICIONALES ====================
export const eliminarFacturaCobrar = async (id) => {
    try {
        return await api.delete(`/facturasPorCobrar/eliminar/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerSaldoFacturaCobrar = async (id) => {
    try {
        return await api.get(`/facturasPorCobrar/saldo/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerFacturasPorCliente = async (clienteId, limite = 10, desde = 0) => {
    try {
        return await api.get(`/facturasPorCobrar/cliente/${clienteId}?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerFacturasVencidas = async (limite = 10, desde = 0) => {
    try {
        return await api.get(`/facturasPorCobrar/vencidas?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerFacturasProximas = async (dias = 15, limite = 10, desde = 0) => {
    try {
        return await api.get(`/facturasPorCobrar/proximas-vencer?dias=${dias}&limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const marcarFacturaVencida = async (id) => {
    try {
        return await api.patch(`/facturasPorCobrar/marcar-vencida/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const enviarRecordatorio = async (id) => {
    try {
        return await api.post(`/facturasPorCobrar/recordatorio/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const exportarFacturasCobrar = async () => {
    try {
        return await api.get(`/facturasPorCobrar/exportar/excel`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

// ==================== COBROS ====================
export const crearCobro = async (data) => {
    try {
        return await api.post("/cobrosClientes/crear", data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerCobros = async (limite = 10, desde = 0) => {
    try {
        return await api.get(`/cobrosClientes/obtener?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerCobroPorId = async (id) => {
    try {
        return await api.get(`/cobrosClientes/obtener/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const actualizarCobro = async (id, data) => {
    try {
        return await api.put(`/cobrosClientes/actualizar/${id}`, data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const buscarCobrosActivos = async (cliente = "", fechaInicio = "", fechaFin = "", limite = 10, desde = 0) => {
    try {
        let url = `/cobrosClientes/buscar/activos?limite=${limite}&desde=${desde}`;
        if (cliente) url += `&cliente=${cliente}`;
        if (fechaInicio) url += `&fechaInicio=${fechaInicio}`;
        if (fechaFin) url += `&fechaFin=${fechaFin}`;
        return await api.get(url);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const desactivarCobro = async (id) => {
    try {
        return await api.put(`/cobrosClientes/desactivar/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const eliminarCobro = async (id) => {
    try {
        return await api.delete(`/cobrosClientes/eliminar/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerSaldoCobro = async (id) => {
    try {
        return await api.get(`/cobrosClientes/saldo/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerCobrosPorCliente = async (clienteId, limite = 10, desde = 0) => {
    try {
        return await api.get(`/cobrosClientes/cliente/${clienteId}?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerComisionesTotales = async (fechaInicio = "", fechaFin = "") => {
    try {
        let url = `/cobrosClientes/comisiones/totales`;
        if (fechaInicio || fechaFin) {
            const params = [];
            if (fechaInicio) params.push(`fechaInicio=${fechaInicio}`);
            if (fechaFin) params.push(`fechaFin=${fechaFin}`);
            url += `?${params.join("&")}`;
        }
        return await api.get(url);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const exportarCobros = async () => {
    try {
        return await api.get(`/cobrosClientes/exportar/excel`, {
            responseType: "blob"
        });
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

// ========== PAGOS PROVEEDOR ==========

export const crearPagoProveedor = async (data) => {
    try {
        return await api.post(`/pagoProveedor/crear`, data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerPagosProveedor = async (limite = 10, desde = 0) => {
    try {
        return await api.get(`/pagoProveedor?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerPagoPorId = async (id) => {
    try {
        return await api.get(`/pagoProveedor/obtenerPorId/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const actualizarPagoProveedor = async (id, data) => {
    try {
        return await api.put(`/pagoProveedor/actualizar/${id}`, data);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const buscarPagosActivosProveedor = async (proveedor = "", fechaInicio = "", fechaFin = "", limite = 10, desde = 0) => {
    try {
        let url = `/pagoProveedor/buscar/activos?limite=${limite}&desde=${desde}`;
        if (proveedor) url += `&proveedor=${proveedor}`;
        if (fechaInicio) url += `&fechaInicio=${fechaInicio}`;
        if (fechaFin) url += `&fechaFin=${fechaFin}`;
        return await api.get(url);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const desactivarPagoProveedor = async (id) => {
    try {
        return await api.delete(`/pagoProveedor/desactivar/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const eliminarPagoProveedor = async (id) => {
    try {
        return await api.delete(`/pagoProveedor/eliminar/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerSaldoPagoProveedor = async (id) => {
    try {
        return await api.get(`/pagoProveedor/saldo/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerPagosPorProveedor = async (proveedorId, limite = 10, desde = 0) => {
    try {
        return await api.get(`/pagoProveedor/proveedor/${proveedorId}?limite=${limite}&desde=${desde}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const exportarPagosProveedor = async () => {
    try {
        return await api.get(`/pagoProveedor/exportar/excel`, {
            responseType: "blob"
        });
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

// ==================== REPORTES ====================
export const obtenerResumenSaldos = async () => {
    try {
        const response = await api.get(`/reportes/resumen/saldos`);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerResumenProveedor = async () => {
    try {
        const response = await api.get(`/reportes/resumen/proveedores`);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerResumenCliente = async () => {
    try {
        const response = await api.get(`/reportes/resumen/clientes`);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerFacturasPorVencer = async () => {
    try {
        const response = await api.get(`/reportes/facturas/porVencer`);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerFacturasVencidasReporte = async () => {
    try {
        const response = await api.get(`/reportes/facturas/vencidas`);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerCobrabilidad = async () => {
    try {
        const response = await api.get(`/reportes/analisis/cobrabilidad`);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerPagabilidad = async () => {
    try {
        const response = await api.get(`/reportes/analisis/pagabilidad`);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerFacturasPorEstado = async () => {
    try {
        const response = await api.get(`/reportes/facturas/estado`);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerTopClientesDeudores = async (limite = 10) => {
    try {
        const response = await api.get(`/reportes/top/deudores?limite=${limite}`);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerTopProveedoresAcreedores = async (limite = 10) => {
    try {
        const response = await api.get(`/reportes/top/acreedores?limite=${limite}`);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerAnalisisComisiones = async (fechaInicio = "", fechaFin = "") => {
    try {
        let url = `/reportes/analisis/comisiones`;
        if (fechaInicio || fechaFin) {
            const params = [];
            if (fechaInicio) params.push(`fechaInicio=${fechaInicio}`);
            if (fechaFin) params.push(`fechaFin=${fechaFin}`);
            url += `?${params.join("&")}`;
        }
        const response = await api.get(url);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const exportarReporte = async () => {
    try {
        const response = await api.get(`/reportes/exportar/excel`, {
            responseType: "blob"
        });
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

// ==================== AUDITORIA ====================
export const registrarEventoAuditoria = async (data) => {
    try {
        const response = await api.post("/auditoria/registrar", data);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const obtenerLogsAuditoria = async (limite = 50, pagina = 1) => {
    try {
        const response = await api.get(`/auditoria/logs?limite=${limite}&pagina=${pagina}`);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const filtrarLogsPorUsuario = async (usuarioId, limite = 50, pagina = 1) => {
    try {
        const response = await api.get(`/auditoria/usuario/${usuarioId}?limite=${limite}&pagina=${pagina}`);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const filtrarLogsPorFechaYAccion = async (fechaInicio, fechaFin, accion, limite = 50, pagina = 1) => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append("fechaInicio", fechaInicio);
        if (fechaFin) params.append("fechaFin", fechaFin);
        if (accion) params.append("accion", accion);
        params.append("limite", limite);
        params.append("pagina", pagina);

        const response = await api.get(`/auditoria/filtrar?${params.toString()}`);
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const exportarLogsAuditoria = async (fechaInicio, fechaFin, accion) => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append("fechaInicio", fechaInicio);
        if (fechaFin) params.append("fechaFin", fechaFin);
        if (accion) params.append("accion", accion);

        const response = await api.get(`/auditoria/exportar?${params.toString()}`, {
            responseType: "blob"
        });
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export default api;
