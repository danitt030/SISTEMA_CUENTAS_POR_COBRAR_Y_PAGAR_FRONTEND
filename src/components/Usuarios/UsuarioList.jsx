import { useEffect, useRef, useState } from "react";
import { ChevronDown, KeyRound, ShieldCheck, Trash2, UserX } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const MotionDiv = motion.div;
const MotionRow = motion.tr;

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
  const reduceMotion = useReducedMotion();
  const [openMenuUid, setOpenMenuUid] = useState(null);
  const menuContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuContainerRef.current) return;

      if (!menuContainerRef.current.contains(event.target)) {
        setOpenMenuUid(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (openMenuUid === null) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenMenuUid(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [openMenuUid]);

  const toggleMenu = (uid) => {
    setOpenMenuUid((prev) => (prev === uid ? null : uid));
  };

  const closeMenu = () => {
    setOpenMenuUid(null);
  };

  const getRolClass = (rol) => {
    const roleClasses = {
      ADMINISTRADOR_ROLE: "usuario-role-admin",
      GERENTE_GENERAL_ROLE: "usuario-role-gerencia",
      CONTADOR_ROLE: "usuario-role-contador",
      GERENTE_ROLE: "usuario-role-gerente",
      VENDEDOR_ROLE: "usuario-role-vendedor",
      AUXILIAR_ROLE: "usuario-role-auxiliar",
      CLIENTE_ROLE: "usuario-role-cliente",
    };

    return roleClasses[rol] || "usuario-role-default";
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
    return <div className="usuarios-empty-state">Cargando usuarios...</div>;
  }

  if (!usuarios || usuarios.length === 0) {
    return <div className="usuarios-empty-state">No hay usuarios registrados</div>;
  }

  return (
    <MotionDiv
      className="usuarios-table-shell"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="overflow-x-auto">
        <table className="w-full usuarios-table">
          <thead className="usuarios-table-head">
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Puesto</th>
              <th>Estado</th>
              <th className="usuarios-actions-col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <MotionRow
                key={usuario.uid}
                className={`usuarios-row ${!usuario.estado ? "usuarios-row-disabled" : ""}`}
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.18,
                  delay: reduceMotion ? 0 : Math.min(index * 0.02, 0.18),
                }}
              >
                <td className="usuarios-cell usuario-name">
                  {usuario.nombre} {usuario.apellido}
                </td>
                <td className="usuarios-cell">{usuario.usuario}</td>
                <td className="usuarios-cell usuario-mail">{usuario.correo}</td>
                <td className="usuarios-cell">
                  <span className={`usuario-role-chip ${getRolClass(usuario.rol)}`}>
                    {getRolLabel(usuario.rol)}
                  </span>
                </td>
                <td className="usuarios-cell">{usuario.puesto || "-"}</td>
                <td className="usuarios-cell">
                  <span className={`usuario-status-chip ${usuario.estado ? "usuario-status-active" : "usuario-status-inactive"}`}>
                    {usuario.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="usuarios-cell usuarios-actions-col">
                  <div className="usuarios-actions">
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

                    {(onChangeRol && permisos?.puedeCambiarRoles) ||
                    (onCambiarPassword && permisos?.puedeCambiarContraseña?.(usuario.uid)) ||
                    (usuario.estado && onDelete && permisos?.puedeDesactivar) ||
                    (onEliminarCuenta && usuarioActualUid === usuario.uid) ? (
                      <div
                        className="usuarios-row-menu"
                        ref={openMenuUid === usuario.uid ? menuContainerRef : null}
                      >
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleMenu(usuario.uid);
                          }}
                          className="action-btn action-btn-dark usuarios-row-menu-trigger"
                          title="Más acciones"
                          aria-haspopup="menu"
                          aria-expanded={openMenuUid === usuario.uid}
                        >
                          <span className="usuarios-row-menu-trigger-label">Más</span>
                          <ChevronDown
                            size={14}
                            className={`usuarios-row-menu-icon ${openMenuUid === usuario.uid ? "is-open" : ""}`}
                          />
                        </button>

                        <AnimatePresence>
                          {openMenuUid === usuario.uid && (
                            <MotionDiv
                              className="usuarios-row-menu-content"
                              role="menu"
                              initial={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -4, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -2, scale: 0.98 }}
                              transition={{ duration: reduceMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
                            >
                              {onChangeRol && permisos?.puedeCambiarRoles && (
                                <button
                                  onClick={() => {
                                    closeMenu();
                                    onChangeRol(usuario);
                                  }}
                                  className="usuarios-row-menu-item"
                                  type="button"
                                >
                                  <span className="usuarios-row-menu-item-icon">
                                    <ShieldCheck size={14} />
                                  </span>
                                  Cambiar rol
                                </button>
                              )}

                              {onCambiarPassword && permisos?.puedeCambiarContraseña?.(usuario.uid) && (
                                <button
                                  onClick={() => {
                                    closeMenu();
                                    onCambiarPassword(usuario);
                                  }}
                                  className="usuarios-row-menu-item"
                                  type="button"
                                >
                                  <span className="usuarios-row-menu-item-icon">
                                    <KeyRound size={14} />
                                  </span>
                                  Cambiar contraseña
                                </button>
                              )}

                              {usuario.estado && onDelete && permisos?.puedeDesactivar && usuarioActualUid !== usuario.uid && (
                                <button
                                  onClick={() => {
                                    closeMenu();
                                    onDelete(usuario);
                                  }}
                                  className="usuarios-row-menu-item usuarios-row-menu-item-danger"
                                  type="button"
                                >
                                  <span className="usuarios-row-menu-item-icon">
                                    <UserX size={14} />
                                  </span>
                                  Desactivar usuario
                                </button>
                              )}

                              {onEliminarCuenta && usuarioActualUid === usuario.uid && (
                                <button
                                  onClick={() => {
                                    closeMenu();
                                    onEliminarCuenta(usuario);
                                  }}
                                  className="usuarios-row-menu-item usuarios-row-menu-item-danger"
                                  type="button"
                                >
                                  <span className="usuarios-row-menu-item-icon">
                                    <Trash2 size={14} />
                                  </span>
                                  Eliminar cuenta
                                </button>
                              )}
                            </MotionDiv>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : null}
                  </div>
                </td>
              </MotionRow>
            ))}
          </tbody>
        </table>
      </div>
    </MotionDiv>
  );
};
