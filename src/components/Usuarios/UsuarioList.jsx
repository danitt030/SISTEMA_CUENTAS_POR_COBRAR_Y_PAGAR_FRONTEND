import React from "react";

export const UsuarioList = ({
  usuarios = [],
  loading = false,
  permisos = {},
  usuarioActualUid = null,
  onEdit = null,
  onDelete = null,
  onChangeRol = null,
  onVerDetalle = null,
  onCambiarPassword = null,
  onEliminarCuenta = null,
}) => {
  const getRolColor = (rol) => {
    const colors = {
      ADMINISTRADOR_ROLE: "#dc3545",
      GERENTE_GENERAL_ROLE: "#fd7e14",
      CONTADOR_ROLE: "#0dcaf0",
      GERENTE_ROLE: "#198754",
      VENDEDOR_ROLE: "#0d6efd",
      AUXILIAR_ROLE: "#6c757d",
      CLIENTE_ROLE: "#6f42c1",
    };
    return colors[rol] || "#999";
  };

  const getRolLabel = (rol) => {
    const labels = {
      ADMINISTRADOR_ROLE: "Administrador",
      GERENTE_GENERAL_ROLE: "Gerente General",
      CONTADOR_ROLE: "Contador",
      GERENTE_ROLE: "Gerente",
      VENDEDOR_ROLE: "Vendedor",
      AUXILIAR_ROLE: "Auxiliar",
      CLIENTE_ROLE: "Cliente",
    };
    return labels[rol] || rol;
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-400">Cargando usuarios...</div>;
  }

  if (!usuarios || usuarios.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <p className="text-gray-600 dark:text-gray-400">No hay usuarios registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <th className="px-4 py-3 text-left text-sm font-bold text-white">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-white">Usuario</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-white">Correo</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-white">Rol</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-white">Puesto</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-white">Estado</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario.uid}
                className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !usuario.estado ? "opacity-60 bg-gray-50 dark:bg-gray-800/50" : ""
                }`}
              >
                <td className="px-4 py-3 text-sm font-semibold text-white">
                  {usuario.nombre} {usuario.apellido}
                </td>
                <td className="px-4 py-3 text-sm text-white">{usuario.usuario}</td>
                <td className="px-4 py-3 text-sm text-white">{usuario.correo}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-white text-xs font-semibold"
                    style={{
                      backgroundColor: getRolColor(usuario.rol),
                    }}
                  >
                    {getRolLabel(usuario.rol)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-white">{usuario.puesto}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${
                      usuario.estado ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {usuario.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {onVerDetalle && permisos?.puedeVerDetalle?.(usuario.uid) && (
                      <button
                        onClick={() => onVerDetalle(usuario.uid)}
                        className="action-btn action-btn-view"
                        title="Ver detalle"
                      >
                        Ver
                      </button>
                    )}

                    {onEdit && permisos?.puedeEditar && (
                      <button
                        onClick={() => onEdit(usuario)}
                        className="action-btn action-btn-edit"
                        title="Editar"
                      >
                        Editar
                      </button>
                    )}

                    {onChangeRol && permisos?.puedeCambiarRoles && (
                      <button
                        onClick={() => onChangeRol(usuario)}
                        className="action-btn action-btn-purple"
                        title="Cambiar rol"
                      >
                        Rol
                      </button>
                    )}

                    {onCambiarPassword && permisos?.puedeCambiarContraseña?.(usuario.uid) && (
                      <button
                        onClick={() => onCambiarPassword(usuario)}
                        className="action-btn action-btn-info"
                        title="Cambiar contraseña"
                      >
                        Clave
                      </button>
                    )}

                    {usuario.estado && onDelete && permisos?.puedeDesactivar && (
                      <button
                        onClick={() => onDelete(usuario)}
                        className="action-btn action-btn-danger"
                        title="Desactivar"
                      >
                        Desactivar
                      </button>
                    )}

                    {onEliminarCuenta && usuarioActualUid === usuario.uid && (
                      <button
                        onClick={() => onEliminarCuenta(usuario)}
                        className="action-btn action-btn-dark"
                        title="Eliminar mi cuenta"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
