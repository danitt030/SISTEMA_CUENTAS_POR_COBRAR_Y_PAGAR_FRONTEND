import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useUsuarios } from "../../shared/hooks/useUsuarios";
import { crearUsuario } from "../../services/api";
import { UsuarioForm } from "./UsuarioForm";
import { UsuarioList } from "./UsuarioList";
import { UsuarioSearch } from "./UsuarioSearch";
import {
  puedeVerUsuarios,
  puedeCrearUsuarios,
  puedeEditarUsuarios,
  puedeCambiarRol,
  puedeDesactivarUsuarios,
  puedeCambiarContraseña,
  puedeVerDetalleUsuario,
} from "../../utils/roleUtils";
import toast from "react-hot-toast";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./usuarios.css";

const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionArticle = motion.article;

const AnimatedModal = ({
  show,
  onClose,
  children,
  className = "",
  large = false,
  reducedMotion = false,
}) => {
  const overlayInitial = reducedMotion ? { opacity: 1 } : { opacity: 0 };
  const overlayAnimate = { opacity: 1 };
  const overlayExit = reducedMotion ? { opacity: 1 } : { opacity: 0 };

  const contentInitial = reducedMotion
    ? { opacity: 1, y: 0, scale: 1 }
    : { opacity: 0, y: 14, scale: 0.98 };
  const contentAnimate = { opacity: 1, y: 0, scale: 1 };
  const contentExit = reducedMotion
    ? { opacity: 1, y: 0, scale: 1 }
    : { opacity: 0, y: 8, scale: 0.98 };

  return (
    <AnimatePresence>
      {show && (
        <MotionDiv
          className="modal-overlay"
          onClick={onClose}
          initial={overlayInitial}
          animate={overlayAnimate}
          exit={overlayExit}
          transition={{ duration: reducedMotion ? 0 : 0.16 }}
        >
          <MotionDiv
            className={`${large ? "modal-content-large" : "modal-content"} ${className}`.trim()}
            onClick={(event) => event.stopPropagation()}
            initial={contentInitial}
            animate={contentAnimate}
            exit={contentExit}
            transition={{
              duration: reducedMotion ? 0 : 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {children}
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export const Usuarios = ({ onBack }) => {
  const reduceMotion = useReducedMotion();
  const { user } = useContext(AuthContext);
  const {
    usuarios,
    loading,
    error,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuariosPorRol,
    actualizarUsuario,
    actualizarContraseña,
    actualizarRol,
    desactivarUsuario,
    eliminarCuentaPropia,
  } = useUsuarios();

  // Verificar permisos del usuario actual
  const tieneAcceso = puedeVerUsuarios(user?.rol);
  const puedeCrear = puedeCrearUsuarios(user?.rol);
  const puedeEditar = puedeEditarUsuarios(user?.rol);
  const puedeCambiarRoles = puedeCambiarRol(user?.rol);
  const puedeDesactivar = puedeDesactivarUsuarios(user?.rol);

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [modalAgregar, setModalAgregar] = useState({ visible: false });
  const [modalEditar, setModalEditar] = useState({ visible: false, usuario: null });
  const [modalDesactivar, setModalDesactivar] = useState({ visible: false, usuario: null });
  const [modalEliminar, setModalEliminar] = useState({ visible: false, usuario: null });
  const [usuarioCambiarRol, setUsuarioCambiarRol] = useState(null);
  const [nuevoRol, setNuevoRol] = useState("");
  const [usuarioDetalle, setUsuarioDetalle] = useState(null);
  const [usuarioCambiarPass, setUsuarioCambiarPass] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const cargarUsuarios = useCallback(async () => {
    if (filtroRol) {
      const resultado = await obtenerUsuariosPorRol(filtroRol, 100, 0);
      if (resultado.error) {
        toast.error("Error al filtrar usuarios");
      }
    } else {
      const resultado = await obtenerUsuarios(100, 0);
      if (resultado.error) {
        toast.error(resultado.message || "Error al cargar usuarios");
      }
    }
  }, [filtroRol, obtenerUsuarios, obtenerUsuariosPorRol]);

  useEffect(() => {
    if (tieneAcceso) {
      cargarUsuarios();
    }
  }, [tieneAcceso, cargarUsuarios]);

  const handleSubmitUsuario = async (datos) => {
    if (modalEditar.usuario && !puedeEditar) {
      toast.error("No tienes permiso para editar usuarios");
      return { error: true, message: "Permiso denegado" };
    }

    if (!modalEditar.usuario && !puedeCrear) {
      toast.error("No tienes permiso para crear usuarios");
      return { error: true, message: "Permiso denegado" };
    }

    try {
      if (modalEditar.usuario) {
        // EDITAR usuario
        const usuarioId = modalEditar.usuario.uid || modalEditar.usuario._id;
        const rolActual = modalEditar.usuario.rol;
        const { rol, ...datosSinRol } = datos;
        const resultado = await actualizarUsuario(usuarioId, datosSinRol);
        if (resultado.error) {
          return resultado;
        }
        if (rol && rol !== rolActual) {
          if (!puedeCambiarRoles) {
            return { error: true, message: "No tienes permiso para cambiar roles" };
          }
          const resultadoRol = await actualizarRol(usuarioId, rol);
          if (resultadoRol.error) {
            return { error: true, message: "Error al cambiar rol" };
          }
        }
        setModalEditar({ visible: false, usuario: null });
      } else {
        // CREAR usuario
        const resultado = await crearUsuario(datos);
        if (resultado.error) {
          return { error: true, message: resultado.message || "Error al crear usuario" };
        }
        setModalAgregar({ visible: false });
      }

      await cargarUsuarios();
      return { error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  };

  const handleCambiarRol = async () => {
    if (!puedeCambiarRoles) {
      toast.error("Solo administradores pueden cambiar roles");
      return;
    }
    if (!nuevoRol) {
      toast.error("Selecciona un rol");
      return;
    }
    const resultado = await actualizarRol(usuarioCambiarRol.uid, nuevoRol);
    if (!resultado.error) {
      toast.success("Rol actualizado");
      setUsuarioCambiarRol(null);
      setNuevoRol("");
      await cargarUsuarios();
    } else {
      toast.error(resultado.message || "Error al cambiar rol");
    }
  };

  const handleDesactivar = async (id) => {
    if (!puedeDesactivar) {
      toast.error("Solo administradores pueden desactivar usuarios");
      return;
    }
    const resultado = await desactivarUsuario(id);
    if (!resultado.error) {
      toast.success("Usuario desactivado");
      setModalDesactivar({ visible: false, usuario: null });
      await cargarUsuarios();
    } else {
      toast.error(resultado.message || "Error al desactivar");
    }
  };

  const handleEliminarPermanente = async (id) => {
    const resultado = await eliminarCuentaPropia(id, "");
    if (!resultado.error) {
      toast.success("Usuario eliminado permanentemente");
      setModalEliminar({ visible: false, usuario: null });
      await cargarUsuarios();
    } else {
      toast.error(resultado.message || "Error al eliminar");
    }
  };

  const handleVerDetalle = async (id) => {
    if (!puedeVerDetalleUsuario(user?.rol, user?.uid, id)) {
      toast.error("No tienes permiso para ver este usuario");
      return;
    }
    const resultado = await obtenerUsuarioPorId(id);
    if (!resultado.error) {
      setUsuarioDetalle(resultado.data);
    } else {
      toast.error("Error al obtener detalle del usuario");
    }
  };

  const handleCambiarPassword = async () => {
    if (!puedeCambiarContraseña(user?.rol, user?.uid, usuarioCambiarPass?.uid)) {
      toast.error("No tienes permiso para cambiar esta contraseña");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    const resultado = await actualizarContraseña(usuarioCambiarPass.uid, newPassword);
    if (!resultado.error) {
      toast.success("Contraseña actualizada correctamente");
      setUsuarioCambiarPass(null);
      setNewPassword("");
    } else {
      toast.error(resultado.message || "Error al actualizar contraseña");
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    // Si no hay búsqueda, retorna todos
    if (!busqueda || busqueda.trim() === "") {
      return true;
    }
    
    const busquedaLower = busqueda.toLowerCase().trim();
    // Concatenar nombre + apellido para búsqueda completa
    const nombreCompleto = `${(u.nombre || "")} ${(u.apellido || "")}`.toLowerCase();
    const usuario = (u.usuario || "").toLowerCase();
    const correo = (u.correo || "").toLowerCase();
    
    return (
      nombreCompleto.includes(busquedaLower) ||
      usuario.includes(busquedaLower) ||
      correo.includes(busquedaLower)
    );
  });

  const totalUsuarios = usuarios.length;
  const totalActivos = usuarios.filter((u) => u.estado).length;
  const totalInactivos = totalUsuarios - totalActivos;
  const totalRoles = new Set(usuarios.map((u) => u.rol).filter(Boolean)).size;

  // Si no tiene acceso, mostrar mensaje
  if (!tieneAcceso) {
    return (
      <div className="usuarios-container">
        <div className="alert alert-danger">
          <strong>Acceso denegado</strong>
          <p>No tienes permiso para acceder al módulo de gestión de usuarios.</p>
          <p>Solo Administrador, Gerente General y Contador tienen acceso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="usuarios-container module-container table-density-compact">
      <div className="usuarios-header module-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          {onBack && (
            <button
              onClick={onBack}
              className="btn btn-primary"
              style={{ padding: '8px 12px', fontSize: '14px' }}
            >
              ← Volver
            </button>
          )}
          <h2>Gestión de Usuarios</h2>
        </div>
        {puedeCrear && (
          <button
            className="btn btn-primary"
            onClick={() => setModalAgregar({ visible: true })}
          >
            + Nuevo Usuario
          </button>
        )}
      </div>

      <MotionSection
        className="module-stats-grid usuarios-kpi-grid"
        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <MotionArticle
          className="module-stat-card"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : 0.02 }}
        >
          <p className="module-stat-label">Total Usuarios</p>
          <p className="module-stat-value">{totalUsuarios}</p>
        </MotionArticle>
        <MotionArticle
          className="module-stat-card"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : 0.05 }}
        >
          <p className="module-stat-label">Activos</p>
          <p className="module-stat-value">{totalActivos}</p>
        </MotionArticle>
        <MotionArticle
          className="module-stat-card"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : 0.08 }}
        >
          <p className="module-stat-label">Inactivos</p>
          <p className="module-stat-value">{totalInactivos}</p>
        </MotionArticle>
        <MotionArticle
          className="module-stat-card"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : 0.11 }}
        >
          <p className="module-stat-label">Roles Detectados</p>
          <p className="module-stat-value">{totalRoles}</p>
        </MotionArticle>
      </MotionSection>

      {error && <div className="alert alert-danger">{error}</div>}

      <MotionDiv
        className="usuarios-surface"
        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : 0.06 }}
      >
        <UsuarioSearch
          onSearch={setBusqueda}
          onRolChange={setFiltroRol}
          loading={loading}
        />
      </MotionDiv>

      {/* MODAL AGREGAR USUARIO */}
      <AnimatedModal
        show={modalAgregar.visible}
        onClose={() => setModalAgregar({ visible: false })}
        large
        className="usuarios-modal-content"
        reducedMotion={reduceMotion}
      >
        <div className="modal-header">
          <h3>Nuevo Usuario</h3>
          <button className="close-btn" onClick={() => setModalAgregar({ visible: false })}>×</button>
        </div>
        <div className="modal-body">
          <UsuarioForm
            usuario={null}
            onSubmit={handleSubmitUsuario}
            loading={loading}
          />
        </div>
      </AnimatedModal>

      {/* MODAL EDITAR USUARIO */}
      <AnimatedModal
        show={modalEditar.visible}
        onClose={() => setModalEditar({ visible: false, usuario: null })}
        large
        className="usuarios-modal-content"
        reducedMotion={reduceMotion}
      >
        <div className="modal-header">
          <h3>Editar Usuario</h3>
          <button className="close-btn" onClick={() => setModalEditar({ visible: false, usuario: null })}>×</button>
        </div>
        <div className="modal-body">
          <UsuarioForm
            usuario={modalEditar.usuario}
            onSubmit={handleSubmitUsuario}
            loading={loading}
          />
        </div>
      </AnimatedModal>

      <AnimatedModal
        show={Boolean(usuarioCambiarRol)}
        onClose={() => setUsuarioCambiarRol(null)}
        className="usuarios-modal-content"
        reducedMotion={reduceMotion}
      >
        <div className="modal-header">
          <h3>Cambiar Rol</h3>
          <button className="close-btn" onClick={() => setUsuarioCambiarRol(null)}>×</button>
        </div>
        <div className="modal-body">
          <p className="usuarios-modal-note">
            <strong>{usuarioCambiarRol?.nombre} {usuarioCambiarRol?.apellido}</strong>
          </p>
          <select
            value={nuevoRol}
            onChange={(e) => setNuevoRol(e.target.value)}
            className="form-select"
          >
            <option value="">-- Selecciona un rol --</option>
            <option value="ADMINISTRADOR_ROLE">Administrador</option>
            <option value="GERENTE_GENERAL_ROLE">Gerente General</option>
            <option value="CONTADOR_ROLE">Contador</option>
            <option value="GERENTE_ROLE">Gerente</option>
            <option value="VENDEDOR_ROLE">Vendedor</option>
            <option value="AUXILIAR_ROLE">Auxiliar</option>
            <option value="CLIENTE_ROLE">Cliente</option>
          </select>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setUsuarioCambiarRol(null)}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleCambiarRol}>
            Cambiar Rol
          </button>
        </div>
      </AnimatedModal>

      <AnimatedModal
        show={Boolean(usuarioDetalle)}
        onClose={() => setUsuarioDetalle(null)}
        className="usuarios-modal-content usuarios-modal-detail"
        reducedMotion={reduceMotion}
      >
        <div className="modal-header">
          <h3>Detalle del Usuario</h3>
          <button className="close-btn" onClick={() => setUsuarioDetalle(null)}>×</button>
        </div>
        <div className="modal-body usuarios-detail-body">
          <div className="detail-info">
            <article className="detail-item">
              <p className="detail-label">Nombre</p>
              <p className="detail-value">{usuarioDetalle?.nombre} {usuarioDetalle?.apellido}</p>
            </article>
            <article className="detail-item">
              <p className="detail-label">Usuario</p>
              <p className="detail-value">{usuarioDetalle?.usuario}</p>
            </article>
            <article className="detail-item detail-item-wide">
              <p className="detail-label">Correo</p>
              <p className="detail-value">{usuarioDetalle?.correo}</p>
            </article>
            <article className="detail-item">
              <p className="detail-label">Teléfono</p>
              <p className="detail-value">{usuarioDetalle?.telefono}</p>
            </article>
            <article className="detail-item">
              <p className="detail-label">Rol</p>
              <p className="detail-value">{usuarioDetalle?.rol}</p>
            </article>
            <article className="detail-item">
              <p className="detail-label">Departamento</p>
              <p className="detail-value">{usuarioDetalle?.departamento}</p>
            </article>
            <article className="detail-item">
              <p className="detail-label">Puesto</p>
              <p className="detail-value">{usuarioDetalle?.puesto}</p>
            </article>
            <article className="detail-item">
              <p className="detail-label">Estado</p>
              <span className={usuarioDetalle?.estado ? "detail-status detail-status-active" : "detail-status detail-status-inactive"}>
                {usuarioDetalle?.estado ? "Activo" : "Inactivo"}
              </span>
            </article>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setUsuarioDetalle(null)}>
            Cerrar
          </button>
        </div>
      </AnimatedModal>

      <AnimatedModal
        show={Boolean(usuarioCambiarPass)}
        onClose={() => setUsuarioCambiarPass(null)}
        className="usuarios-modal-content"
        reducedMotion={reduceMotion}
      >
        <div className="modal-header">
          <h3>Cambiar Contrasena</h3>
          <button className="close-btn" onClick={() => setUsuarioCambiarPass(null)}>×</button>
        </div>
        <div className="modal-body">
          <p className="usuarios-modal-note">
            <strong>{usuarioCambiarPass?.nombre}</strong>
          </p>
          <input
            type="password"
            placeholder="Nueva contraseña (mínimo 6 caracteres)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setUsuarioCambiarPass(null);
              setNewPassword("");
            }}
          >
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleCambiarPassword}>
            Cambiar Contraseña
          </button>
        </div>
      </AnimatedModal>

      {/* MODAL CONFIRMAR DESACTIVAR */}
      <AnimatedModal
        show={modalDesactivar.visible}
        onClose={() => setModalDesactivar({ visible: false, usuario: null })}
        className="usuarios-modal-content"
        reducedMotion={reduceMotion}
      >
        <div className="modal-header">
          <h3>Desactivar Usuario</h3>
          <button className="close-btn" onClick={() => setModalDesactivar({ visible: false, usuario: null })}>×</button>
        </div>
        <div className="modal-body">
          <p>¿Está seguro de que desea desactivar a <strong>{modalDesactivar.usuario?.nombre} {modalDesactivar.usuario?.apellido}</strong>?</p>
          <p className="usuarios-modal-note">El usuario será marcado como inactivo pero sus datos se conservarán.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModalDesactivar({ visible: false, usuario: null })}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={() => {
            if (modalDesactivar.usuario) {
              handleDesactivar(modalDesactivar.usuario.uid || modalDesactivar.usuario._id);
            }
          }}>
            Sí, Desactivar
          </button>
        </div>
      </AnimatedModal>

      {/* MODAL CONFIRMAR ELIMINAR */}
      <AnimatedModal
        show={modalEliminar.visible}
        onClose={() => setModalEliminar({ visible: false, usuario: null })}
        className="usuarios-modal-content"
        reducedMotion={reduceMotion}
      >
        <div className="modal-header">
          <h3>Eliminar Usuario Permanentemente</h3>
          <button className="close-btn" onClick={() => setModalEliminar({ visible: false, usuario: null })}>×</button>
        </div>
        <div className="modal-body">
          <p><strong>Advertencia:</strong> Esta accion es irreversible.</p>
          <p>¿Está seguro de que desea eliminar permanentemente a <strong>{modalEliminar.usuario?.nombre} {modalEliminar.usuario?.apellido}</strong>?</p>
          <p className="usuarios-danger-note">
            Todos los datos asociados a este usuario serán eliminados del sistema.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModalEliminar({ visible: false, usuario: null })}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={() => {
            if (modalEliminar.usuario) {
              handleEliminarPermanente(modalEliminar.usuario.uid || modalEliminar.usuario._id);
            }
          }}>
            Si, eliminar permanentemente
          </button>
        </div>
      </AnimatedModal>

      <UsuarioList
        usuarios={usuariosFiltrados}
        loading={loading}
        permisos={{
          puedeEditar,
          puedeDesactivar,
          puedeCambiarRoles,
          puedeCambiarContraseña: (usuarioTargetUid) =>
            puedeCambiarContraseña(user?.rol, user?.uid, usuarioTargetUid),
          puedeVerDetalle: (usuarioTargetUid) =>
            puedeVerDetalleUsuario(user?.rol, user?.uid, usuarioTargetUid),
        }}
        usuarioActualUid={user?.uid}
        onEdit={(u) => setModalEditar({ visible: true, usuario: u })}
        onDelete={(usuario) => setModalDesactivar({ visible: true, usuario })}
        onChangeRol={setUsuarioCambiarRol}
        onVerDetalle={handleVerDetalle}
        onCambiarPassword={setUsuarioCambiarPass}
        onEliminarCuenta={(usuario) => setModalEliminar({ visible: true, usuario })}
      />
    </div>
  );
};
