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
import "./usuarios.css";

export const Usuarios = ({ onBack }) => {
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
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);
  const [passwordEliminar, setPasswordEliminar] = useState("");

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
    if (!puedeEditar) {
      toast.error("No tienes permiso para editar usuarios");
      return { error: true, message: "Permiso denegado" };
    }
    try {
      if (modalEditar.usuario) {
        // EDITAR usuario
        const resultado = await actualizarUsuario(modalEditar.usuario.uid, datos);
        if (resultado.error) {
          return resultado;
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

  const handleEliminarCuenta = async () => {
    if (!passwordEliminar) {
      toast.error("Debes ingresar tu contraseña para eliminar la cuenta");
      return;
    }
    const resultado = await eliminarCuentaPropia(usuarioEliminar.uid, passwordEliminar);
    if (!resultado.error) {
      toast.success("Cuenta eliminada correctamente");
      setUsuarioEliminar(null);
      setPasswordEliminar("");
      await cargarUsuarios();
    } else {
      toast.error(resultado.message || "Error al eliminar cuenta");
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
            Nuevo Usuario
          </button>
        )}
      </div>

      <section className="module-stats-grid">
        <article className="module-stat-card">
          <p className="module-stat-label">Total Usuarios</p>
          <p className="module-stat-value">{totalUsuarios}</p>
        </article>
        <article className="module-stat-card">
          <p className="module-stat-label">Activos</p>
          <p className="module-stat-value">{totalActivos}</p>
        </article>
        <article className="module-stat-card">
          <p className="module-stat-label">Inactivos</p>
          <p className="module-stat-value">{totalInactivos}</p>
        </article>
        <article className="module-stat-card">
          <p className="module-stat-label">Roles Detectados</p>
          <p className="module-stat-value">{totalRoles}</p>
        </article>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* MODAL AGREGAR USUARIO */}
      {modalAgregar.visible && (
        <div className="modal-overlay" onClick={() => setModalAgregar({ visible: false })}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
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
          </div>
        </div>
      )}

      {/* MODAL EDITAR USUARIO */}
      {modalEditar.visible && (
        <div className="modal-overlay" onClick={() => setModalEditar({ visible: false, usuario: null })}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
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
          </div>
        </div>
      )}

      {usuarioCambiarRol && (
        <div className="modal-overlay" onClick={() => setUsuarioCambiarRol(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Cambiar Rol</h3>
              <button className="close-btn" onClick={() => setUsuarioCambiarRol(null)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '16px', color: '#374151' }}>
                <strong>{usuarioCambiarRol.nombre} {usuarioCambiarRol.apellido}</strong>
              </p>
              <select 
                value={nuevoRol} 
                onChange={(e) => setNuevoRol(e.target.value)}
                className="form-select"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  backgroundColor: '#f9fafb',
                  color: '#111827',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
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
          </div>
        </div>
      )}

      {usuarioDetalle && (
        <div className="modal-overlay" onClick={() => setUsuarioDetalle(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Detalle del Usuario</h3>
              <button className="close-btn" onClick={() => setUsuarioDetalle(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-info">
                <div className="detail-row">
                  <strong>Nombre:</strong>
                  <span>{usuarioDetalle.nombre} {usuarioDetalle.apellido}</span>
                </div>
                <div className="detail-row">
                  <strong>Usuario:</strong>
                  <span>{usuarioDetalle.usuario}</span>
                </div>
                <div className="detail-row">
                  <strong>Correo:</strong>
                  <span>{usuarioDetalle.correo}</span>
                </div>
                <div className="detail-row">
                  <strong>Teléfono:</strong>
                  <span>{usuarioDetalle.telefono}</span>
                </div>
                <div className="detail-row">
                  <strong>Rol:</strong>
                  <span>{usuarioDetalle.rol}</span>
                </div>
                <div className="detail-row">
                  <strong>Departamento:</strong>
                  <span>{usuarioDetalle.departamento}</span>
                </div>
                <div className="detail-row">
                  <strong>Puesto:</strong>
                  <span>{usuarioDetalle.puesto}</span>
                </div>
                <div className="detail-row">
                  <strong>Estado:</strong>
                  <span className={usuarioDetalle.estado ? 'status-active' : 'status-inactive'}>
                    {usuarioDetalle.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setUsuarioDetalle(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {usuarioCambiarPass && (
        <div className="modal-overlay" onClick={() => setUsuarioCambiarPass(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Cambiar Contrasena</h3>
              <button className="close-btn" onClick={() => setUsuarioCambiarPass(null)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '16px', color: '#374151' }}>
                <strong>{usuarioCambiarPass.nombre}</strong>
              </p>
              <input
                type="password"
                placeholder="Nueva contraseña (mínimo 6 caracteres)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  backgroundColor: '#f9fafb',
                  color: '#111827',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
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
          </div>
        </div>
      )}

      {usuarioEliminar && (
        <div className="modal-overlay" onClick={() => setUsuarioEliminar(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <h3 className="danger">Eliminar Cuenta: {usuarioEliminar.nombre}</h3>
            <p className="warning-text">Esta acción es irreversible. Ingresa tu contraseña para confirmar.</p>
            <input
              type="password"
              placeholder="Tu contraseña"
              value={passwordEliminar}
              onChange={(e) => setPasswordEliminar(e.target.value)}
              className="input-field"
            />
            <div className="modal-buttons">
              <button className="btn btn-danger" onClick={handleEliminarCuenta}>
                Eliminar Cuenta
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setUsuarioEliminar(null);
                  setPasswordEliminar("");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR DESACTIVAR */}
      {modalDesactivar.visible && (
        <div className="modal-overlay" onClick={() => setModalDesactivar({ visible: false, usuario: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Desactivar Usuario</h3>
              <button className="close-btn" onClick={() => setModalDesactivar({ visible: false, usuario: null })}>×</button>
            </div>
            <div className="modal-body">
              <p>¿Está seguro de que desea desactivar a <strong>{modalDesactivar.usuario?.nombre} {modalDesactivar.usuario?.apellido}</strong>?</p>
              <p style={{ marginTop: '10px', color: '#6b7280', fontSize: '14px' }}>El usuario será marcado como inactivo pero sus datos se conservarán.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalDesactivar({ visible: false, usuario: null })}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={() => {
                if (modalDesactivar.usuario) {
                  handleDesactivar(modalDesactivar.usuario.uid || modalDesactivar.usuario._id);
                }
              }} style={{ backgroundColor: '#dc2626' }}>
                Sí, Desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINAR */}
      {modalEliminar.visible && (
        <div className="modal-overlay" onClick={() => setModalEliminar({ visible: false, usuario: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>Eliminar Usuario Permanentemente</h3>
              <button className="close-btn" onClick={() => setModalEliminar({ visible: false, usuario: null })}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Advertencia:</strong> Esta accion es irreversible.</p>
              <p>¿Está seguro de que desea eliminar permanentemente a <strong>{modalEliminar.usuario?.nombre} {modalEliminar.usuario?.apellido}</strong>?</p>
              <p style={{ marginTop: '10px', color: '#991b1b', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
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
              }} style={{ backgroundColor: '#000000' }}>
                Si, eliminar permanentemente
              </button>
            </div>
          </div>
        </div>
      )}

      <UsuarioSearch 
        onSearch={setBusqueda}
        onRolChange={setFiltroRol}
        loading={loading}
      />

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

      <style>{`
        @keyframes fadeInZoom {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};
