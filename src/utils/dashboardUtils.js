/**
 * Mapeo de roles a rutas de dashboard
 * @param {string} rol - El rol del usuario
 * @returns {string} - La ruta del dashboard para ese rol
 */
export const getDashboardRouteByRole = (rol) => {
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
