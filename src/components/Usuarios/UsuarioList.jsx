import { useState } from "react";

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
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

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
    return <div className="loading">Cargando usuarios...</div>;
  }

  if (!usuarios || usuarios.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay usuarios registrados</p>
      </div>
    );
  }

  return (
    <div className="usuarios-list">
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Puesto</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.uid} className={!usuario.estado ? "inactivo" : ""}>
              <td>
                <strong>{usuario.nombre} {usuario.apellido}</strong>
              </td>
              <td>{usuario.usuario}</td>
              <td>{usuario.correo}</td>
              <td>
                <span
                  className="rol-badge"
                  style={{
                    backgroundColor: getRolColor(usuario.rol),
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  {getRolLabel(usuario.rol)}
                </span>
              </td>
              <td>{usuario.puesto}</td>
              <td>
                <span className={`estado-badge ${usuario.estado ? "activo" : "inactivo"}`}>
                  {usuario.estado ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <div className="acciones">
                  {onVerDetalle && permisos?.puedeVerDetalle?.(usuario.uid) && (
                    <button
                      onClick={() => onVerDetalle(usuario.uid)}
                      className="btn btn-sm btn-info"
                      title="Ver detalle"
                    >
                      👁️
                    </button>
                  )}

                  {onEdit && permisos?.puedeEditar && (
                    <button
                      onClick={() => {
                        setUsuarioSeleccionado(usuario);
                        onEdit(usuario);
                      }}
                      className="btn btn-sm btn-info"
                      title="Editar"
                    >
                      ✏️
                    </button>
                  )}

                  {onCambiarPassword && permisos?.puedeCambiarContraseña?.(usuario.uid) && (
                    <button
                      onClick={() => onCambiarPassword(usuario)}
                      className="btn btn-sm btn-warning"
                      title="Cambiar contraseña"
                    >
                      🔐
                    </button>
                  )}

                  {onChangeRol && permisos?.puedeCambiarRoles && (
                    <button
                      onClick={() => {
                        setUsuarioSeleccionado(usuario);
                        onChangeRol(usuario);
                      }}
                      className="btn btn-sm btn-warning"
                      title="Cambiar rol"
                    >
                      🔄
                    </button>
                  )}

                  {onDelete && permisos?.puedeDesactivar && (
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Desactivar usuario ${usuario.usuario}?`)) {
                          onDelete(usuario.uid);
                        }
                      }}
                      className="btn btn-sm btn-danger"
                      title="Desactivar"
                      disabled={!usuario.estado}
                    >
                      ⊘
                    </button>
                  )}

                  {onEliminarCuenta && usuarioActualUid === usuario.uid && (
                    <button
                      onClick={() => {
                        if (window.confirm(`⚠️ ATENCIÓN: ¿Eliminar permanentemente tu cuenta? Esta acción no se puede deshacer.`)) {
                          onEliminarCuenta(usuario);
                        }
                      }}
                      className="btn btn-sm btn-danger-dark"
                      title="Eliminar mi cuenta permanentemente"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {usuarioSeleccionado && (
        <div className="usuario-detail-preview">
          <h4>Detalles: {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</h4>
          <p><strong>Documento:</strong> {usuarioSeleccionado.numeroDocumento}</p>
          <p><strong>Teléfono:</strong> {usuarioSeleccionado.teléfono}</p>
          <p><strong>Departamento:</strong> {usuarioSeleccionado.departamento}</p>
          <p><strong>Dirección:</strong> {usuarioSeleccionado.dirección}</p>
        </div>
      )}
    </div>
  );
};
