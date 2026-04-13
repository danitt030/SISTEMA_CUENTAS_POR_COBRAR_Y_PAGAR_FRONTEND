// Obtener ruta según rol del usuario
export const getDashboardByRole = (rol) => {
  const roleMap = {
    ADMINISTRADOR_ROLE: "/dashboard/admin",
    GERENTE_GENERAL_ROLE: "/dashboard/gerente-general",
    CONTADOR_ROLE: "/dashboard/contador",
    GERENTE_ROLE: "/dashboard/gerente",
    VENDEDOR_ROLE: "/dashboard/vendedor",
    AUXILIAR_ROLE: "/dashboard/auxiliar",
    CLIENTE_ROLE: "/dashboard/cliente",
  };

  return roleMap[rol] || "/dashboard";
};

// Obtener nombre amigable del rol
export const getRoleName = (rol) => {
  const nameMap = {
    ADMINISTRADOR_ROLE: "Administrador",
    GERENTE_GENERAL_ROLE: "Gerente General",
    CONTADOR_ROLE: "Contador",
    GERENTE_ROLE: "Gerente",
    VENDEDOR_ROLE: "Vendedor",
    AUXILIAR_ROLE: "Auxiliar",
    CLIENTE_ROLE: "Cliente",
  };

  return nameMap[rol] || "Usuario";
};

// Obtener módulos accesibles por rol
export const getModulesByRole = (rol) => {
  const moduleMap = {
    ADMINISTRADOR_ROLE: [
      { path: "/usuarios", label: "Usuarios", icon: "👥", color: "#0d6efd" },
      { path: "/clientes", label: "Clientes", icon: "🤝", color: "#198754" },
      { path: "/proveedores", label: "Proveedores", icon: "📦", color: "#fd7e14" },
      { path: "/facturas-cobrar", label: "Facturas Cobrar", icon: "📄", color: "#dc3545" },
      { path: "/facturas-pagar", label: "Facturas Pagar", icon: "📋", color: "#ffc107" },
      { path: "/cobros", label: "Cobros", icon: "💰", color: "#28a745" },
      { path: "/pagos", label: "Pagos", icon: "💳", color: "#17a2b8" },
      { path: "/reportes", label: "Reportes", icon: "📊", color: "#6f42c1" },
      { path: "/auditoria", label: "Auditoría", icon: "🔍", color: "#6c757d" },
    ],
    GERENTE_GENERAL_ROLE: [
      { path: "/clientes", label: "Clientes", icon: "🤝", color: "#198754" },
      { path: "/proveedores", label: "Proveedores", icon: "📦", color: "#fd7e14" },
      { path: "/facturas-cobrar", label: "Facturas Cobrar", icon: "📄", color: "#dc3545" },
      { path: "/facturas-pagar", label: "Facturas Pagar", icon: "📋", color: "#ffc107" },
      { path: "/cobros", label: "Cobros", icon: "💰", color: "#28a745" },
      { path: "/pagos", label: "Pagos", icon: "💳", color: "#17a2b8" },
      { path: "/reportes", label: "Reportes", icon: "📊", color: "#6f42c1" },
    ],
    CONTADOR_ROLE: [
      { path: "/clientes", label: "Clientes", icon: "🤝", color: "#198754" },
      { path: "/proveedores", label: "Proveedores", icon: "📦", color: "#fd7e14" },
      { path: "/facturas-cobrar", label: "Facturas Cobrar", icon: "📄", color: "#dc3545" },
      { path: "/facturas-pagar", label: "Facturas Pagar", icon: "📋", color: "#ffc107" },
      { path: "/cobros", label: "Cobros", icon: "💰", color: "#28a745" },
      { path: "/pagos", label: "Pagos", icon: "💳", color: "#17a2b8" },
      { path: "/reportes", label: "Reportes", icon: "📊", color: "#6f42c1" },
      { path: "/auditoria", label: "Auditoría", icon: "🔍", color: "#6c757d" },
    ],
    GERENTE_ROLE: [
      { path: "/clientes", label: "Clientes", icon: "🤝", color: "#198754" },
      { path: "/facturas-cobrar", label: "Facturas Cobrar", icon: "📄", color: "#dc3545" },
      { path: "/cobros", label: "Cobros", icon: "💰", color: "#28a745" },
      { path: "/reportes", label: "Reportes", icon: "📊", color: "#6f42c1" },
    ],
    VENDEDOR_ROLE: [
      { path: "/clientes", label: "Clientes", icon: "🤝", color: "#198754" },
      { path: "/facturas-cobrar", label: "Facturas Cobrar", icon: "📄", color: "#dc3545" },
      { path: "/cobros", label: "Cobros", icon: "💰", color: "#28a745" },
    ],
    AUXILIAR_ROLE: [
      { path: "/clientes", label: "Clientes", icon: "🤝", color: "#198754" },
      { path: "/facturas-cobrar", label: "Facturas Cobrar", icon: "📄", color: "#dc3545" },
    ],
    CLIENTE_ROLE: [
      { path: "/cliente-portal", label: "Mi Portal", icon: "🏠", color: "#0d6efd" },
    ],
  };

  return moduleMap[rol] || [];
};

// ==================== PERMISOS PARA MÓDULO DE USUARIOS ====================

// Verificar si puede ver y acceder al módulo de usuarios
export const puedeVerUsuarios = (rol) => {
  return ["ADMINISTRADOR_ROLE", "GERENTE_GENERAL_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// Verificar si puede crear usuarios (SOLO ADMINISTRADOR - mala práctica permitir otros)
export const puedeCrearUsuarios = (rol) => {
  return rol === "ADMINISTRADOR_ROLE";
};

// Verificar si puede editar usuarios
export const puedeEditarUsuarios = (rol) => {
  return ["ADMINISTRADOR_ROLE", "GERENTE_GENERAL_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// Verificar si puede cambiar rol de usuarios (solo ADMIN)
export const puedeCambiarRol = (rol) => {
  return rol === "ADMINISTRADOR_ROLE";
};

// Verificar si puede desactivar/eliminar usuarios (solo ADMIN)
export const puedeDesactivarUsuarios = (rol) => {
  return rol === "ADMINISTRADOR_ROLE";
};

// Verificar si puede cambiar contraseña de un usuario
// Parámetros: rol del usuario actual, uid de usuario actual, uid del usuario target
export const puedeCambiarContraseña = (rolActual, uidActual, uidTarget) => {
  // Todos pueden cambiar su propia contraseña
  if (uidActual === uidTarget) {
    return true;
  }

  // Solo ADMIN, GERENTE_GENERAL y CONTADOR pueden cambiar la de otros
  return ["ADMINISTRADOR_ROLE", "GERENTE_GENERAL_ROLE", "CONTADOR_ROLE"].includes(rolActual);
};

// Verificar si puede ver detalles de un usuario
export const puedeVerDetalleUsuario = (rolActual, uidActual, uidTarget) => {
  // Todos pueden ver su propio perfil
  if (uidActual === uidTarget) {
    return true;
  }

  // ADMIN, GERENTE_GENERAL y CONTADOR pueden ver todos
  return ["ADMINISTRADOR_ROLE", "GERENTE_GENERAL_ROLE", "CONTADOR_ROLE"].includes(rolActual);
};

// ==================== PERMISOS PARA MÓDULO DE CLIENTES ====================

// Verificar si puede ver y acceder al módulo de clientes
export const puedeVerClientes = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE", "GERENTE_GENERAL_ROLE", "AUXILIAR_ROLE", "GERENTE_ROLE", "VENDEDOR_ROLE"].includes(rol);
};

// Verificar si puede crear clientes (SOLO ADMINISTRADOR)
export const puedeCrearCliente = (rol) => {
  return rol === "ADMINISTRADOR_ROLE";
};

// Verificar si puede editar clientes (Todos excepto CLIENTE puede editar)
export const puedeEditarCliente = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE", "GERENTE_GENERAL_ROLE", "GERENTE_ROLE", "VENDEDOR_ROLE", "AUXILIAR_ROLE"].includes(rol);
};

// Verificar si puede desactivar clientes
export const puedeDesactivarCliente = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// Verificar si puede eliminar permanentemente clientes (solo ADMIN)
export const puedeEliminarCliente = (rol) => {
  return rol === "ADMINISTRADOR_ROLE";
};

// Verificar si puede exportar clientes
export const puedeExportarClientes = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE", "GERENTE_GENERAL_ROLE"].includes(rol);
};

// Verificar si puede ver clientes filtrados por gerente
export const puedeVerClientesPorGerente = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE", "GERENTE_GENERAL_ROLE", "GERENTE_ROLE"].includes(rol);
};

// ==================== PERMISOS PARA PORTAL CLIENTE ====================

// Solo CLIENTE_ROLE puede acceder al portal
export const puedeVerPortalCliente = (rol) => {
  return rol === "CLIENTE_ROLE";
};

// Permisos para ver datos del portal cliente
export const puedeVerMiPerfilPortal = (rol) => {
  return rol === "CLIENTE_ROLE";
};

export const puedeVerMisFacturasPortal = (rol) => {
  return rol === "CLIENTE_ROLE";
};

export const puedeVerMisCobrosPortal = (rol) => {
  return rol === "CLIENTE_ROLE";
};

export const puedeVerMiSaldoPortal = (rol) => {
  return rol === "CLIENTE_ROLE";
};

export const puedeVerMisFacturasVencidasPortal = (rol) => {
  return rol === "CLIENTE_ROLE";
};

// ==================== PERMISOS PARA MÓDULO DE FACTURAS POR COBRAR ====================

// Verificar si puede ver módulo de facturas por cobrar (SOLO administrativos, NO cliente)
export const puedeVerFacturasCobrar = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE", "GERENTE_GENERAL_ROLE", "GERENTE_ROLE", "VENDEDOR_ROLE", "AUXILIAR_ROLE"].includes(rol);
};

// ==================== PERMISOS PARA MÓDULO DE FACTURAS POR PAGAR ====================

// Verificar si puede ver módulo de facturas por pagar (SOLO administrativos, NO cliente)
export const puedeVerFacturasPagar = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE", "GERENTE_GENERAL_ROLE"].includes(rol);
};

// ==================== PERMISOS PARA MÓDULO DE COBROS ====================

// Verificar si puede ver módulo de cobros (SOLO administrativos, NO cliente)
export const puedeVerCobros = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE", "GERENTE_GENERAL_ROLE", "GERENTE_ROLE", "VENDEDOR_ROLE"].includes(rol);
};

// ==================== PERMISOS PARA MÓDULO DE PAGOS ====================

// Verificar si puede ver módulo de pagos (SOLO administrativos, NO cliente)
export const puedeVerPagos = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE", "GERENTE_GENERAL_ROLE"].includes(rol);
};

// ==================== PERMISOS PARA MÓDULO DE AUDITORÍA ====================

// Verificar si puede ver módulo de auditoría (ADMINISTRADOR y CONTADOR pueden ver)
export const puedeVerAuditoria = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// ==================== PERMISOS PARA MÓDULO DE REPORTES ====================

// Verificar si puede ver módulo de reportes (ADMIN, GERENTE_GENERAL, CONTADOR)
export const puedeVerReportes = (rol) => {
  return ["ADMINISTRADOR_ROLE", "GERENTE_GENERAL_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// ==================== PERMISOS PARA MÓDULO DE PROVEEDORES ====================

// Verificar si puede ver módulo de proveedores
export const puedeVerProveedores = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE", "GERENTE_GENERAL_ROLE"].includes(rol);
};

// Verificar si puede crear proveedores (SOLO ADMINISTRADOR)
export const puedeCrearProveedor = (rol) => {
  return rol === "ADMINISTRADOR_ROLE";
};

// Verificar si puede editar proveedores (Todos pueden editar excepto CLIENTE)
export const puedeEditarProveedor = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE", "GERENTE_GENERAL_ROLE", "GERENTE_ROLE", "VENDEDOR_ROLE", "AUXILIAR_ROLE"].includes(rol);
};

// Verificar si puede desactivar proveedores
export const puedeDesactivarProveedor = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// ==================== PERMISOS PARA MÓDULO DE FACTURAS POR COBRAR ====================

// Verificar si puede crear facturas por cobrar
export const puedeCrearFacturaCobrar = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE", "GERENTE_GENERAL_ROLE"].includes(rol);
};

// Verificar si puede editar facturas por cobrar
export const puedeEditarFacturaCobrar = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// Verificar si puede desactivar facturas por cobrar
export const puedeDesactivarFacturaCobrar = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// ==================== PERMISOS PARA MÓDULO DE FACTURAS POR PAGAR ====================

// Verificar si puede crear facturas por pagar
export const puedeCrearFacturaPagar = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// Verificar si puede editar facturas por pagar
export const puedeEditarFacturaPagar = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// Verificar si puede desactivar facturas por pagar
export const puedeDesactivarFacturaPagar = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// ==================== PERMISOS PARA MÓDULO DE COBROS ====================

// Verificar si puede crear cobros
export const puedeCrearCobro = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE", "GERENTE_GENERAL_ROLE", "VENDEDOR_ROLE"].includes(rol);
};

// Verificar si puede editar cobros
export const puedeEditarCobro = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE", "GERENTE_GENERAL_ROLE"].includes(rol);
};

// Verificar si puede desactivar cobros
export const puedeDesactivarCobro = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// ==================== PERMISOS PARA MÓDULO DE PAGOS ====================

// Verificar si puede crear pagos
export const puedeCrearPago = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// Verificar si puede editar pagos
export const puedeEditarPago = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// Verificar si puede desactivar pagos
export const puedeDesactivarPago = (rol) => {
  return ["ADMINISTRADOR_ROLE", "CONTADOR_ROLE"].includes(rol);
};

// ==================== PERMISOS PARA ELIMINAR (HARD DELETE) ====================
// Solo ADMINISTRADOR_ROLE puede eliminar permanentemente

export const puedeEliminarCobros = (rol) => {
  return rol === "ADMINISTRADOR_ROLE";
};

export const puedeEliminarFacturasCobrar = (rol) => {
  return rol === "ADMINISTRADOR_ROLE";
};

export const puedeEliminarFacturasPagar = (rol) => {
  return rol === "ADMINISTRADOR_ROLE";
};

export const puedeEliminarPagos = (rol) => {
  return rol === "ADMINISTRADOR_ROLE";
};

export const puedeEliminarProveedores = (rol) => {
  return rol === "ADMINISTRADOR_ROLE";
};
