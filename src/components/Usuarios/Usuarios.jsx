import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useUsuarios } from "../../shared/hooks/useUsuarios";
import { UsuarioForm } from "./UsuarioForm";
import { UsuarioList } from "./UsuarioList";
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

export const Usuarios = () => {
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

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [usuarioCambiarRol, setUsuarioCambiarRol] = useState(null);
  const [nuevoRol, setNuevoRol] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [usuarioDetalle, setUsuarioDetalle] = useState(null);
  const [usuarioCambiarPass, setUsuarioCambiarPass] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);
  const [passwordEliminar, setPasswordEliminar] = useState("");

  useEffect(() => {
    if (tieneAcceso) {
      cargarUsuarios();
    }
  }, []);

  const cargarUsuarios = async () => {
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
  };

  useEffect(() => {
    if (tieneAcceso) {
      cargarUsuarios();
    }
  }, [filtroRol]);

  const handleSubmitUsuario = async (datos) => {
    if (!puedeEditar) {
      toast.error("No tienes permiso para editar usuarios");
      return { error: true, message: "Permiso denegado" };
    }
    try {
      if (usuarioEditar) {
        const resultado = await actualizarUsuario(usuarioEditar.uid, datos);
        if (!resultado.error) {
          setUsuarioEditar(null);
          setMostrarFormulario(false);
          await cargarUsuarios();
          return { error: false };
        }
        return resultado;
      } else {
        toast.success("Usuario creado (verificar con backend)");
        setMostrarFormulario(false);
        await cargarUsuarios();
        return { error: false };
      }
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
      await cargarUsuarios();
    } else {
      toast.error(resultado.message || "Error al desactivar");
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

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.usuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.correo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Si no tiene acceso, mostrar mensaje
  if (!tieneAcceso) {
    return (
      <div className="usuarios-container">
        <div className="alert alert-danger">
          <strong>❌ Acceso Denegado</strong>
          <p>No tienes permiso para acceder al módulo de gestión de usuarios.</p>
          <p>Solo Administrador, Gerente General y Contador tienen acceso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h2>Gestión de Usuarios</h2>
        {puedeCrear && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setMostrarFormulario(!mostrarFormulario);
              setUsuarioEditar(null);
            }}
          >
            {mostrarFormulario ? "Cancelar" : "+ Nuevo Usuario"}
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {mostrarFormulario && (
        <div className="formulario-section">
          <h3>{usuarioEditar ? "Editar Usuario" : "Crear Nuevo Usuario"}</h3>
          <UsuarioForm
            usuario={usuarioEditar}
            onSubmit={handleSubmitUsuario}
            loading={loading}
          />
        </div>
      )}

      {usuarioCambiarRol && (
        <div className="modal-overlay" onClick={() => setUsuarioCambiarRol(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Cambiar Rol: {usuarioCambiarRol.nombre} {usuarioCambiarRol.apellido}</h3>
            <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)}>
              <option key="empty" value="">-- Selecciona un rol --</option>
              <option key="ADMINISTRADOR_ROLE" value="ADMINISTRADOR_ROLE">Administrador</option>
              <option key="GERENTE_GENERAL_ROLE" value="GERENTE_GENERAL_ROLE">Gerente General</option>
              <option key="CONTADOR_ROLE" value="CONTADOR_ROLE">Contador</option>
              <option key="GERENTE_ROLE" value="GERENTE_ROLE">Gerente</option>
              <option key="VENDEDOR_ROLE" value="VENDEDOR_ROLE">Vendedor</option>
              <option key="AUXILIAR_ROLE" value="AUXILIAR_ROLE">Auxiliar</option>
              <option key="CLIENTE_ROLE" value="CLIENTE_ROLE">Cliente</option>
            </select>
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={handleCambiarRol}>
                Cambiar Rol
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setUsuarioCambiarRol(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {usuarioDetalle && (
        <div className="modal-overlay" onClick={() => setUsuarioDetalle(null)}>
          <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Detalle del Usuario</h3>
            <div className="detail-info">
              <p><strong>Nombre:</strong> {usuarioDetalle.nombre} {usuarioDetalle.apellido}</p>
              <p><strong>Usuario:</strong> {usuarioDetalle.usuario}</p>
              <p><strong>Correo:</strong> {usuarioDetalle.correo}</p>
              <p><strong>Teléfono:</strong> {usuarioDetalle.telefono}</p>
              <p><strong>Rol:</strong> {usuarioDetalle.rol}</p>
              <p><strong>Departamento:</strong> {usuarioDetalle.departamento}</p>
              <p><strong>Puesto:</strong> {usuarioDetalle.puesto}</p>
              <p><strong>Estado:</strong> {usuarioDetalle.estado ? "Activo" : "Inactivo"}</p>
            </div>
            <button className="btn btn-secondary" onClick={() => setUsuarioDetalle(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {usuarioCambiarPass && (
        <div className="modal-overlay" onClick={() => setUsuarioCambiarPass(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Cambiar Contraseña: {usuarioCambiarPass.nombre}</h3>
            <input
              type="password"
              placeholder="Nueva contraseña (mínimo 6 caracteres)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field"
            />
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={handleCambiarPassword}>
                Cambiar Contraseña
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setUsuarioCambiarPass(null);
                  setNewPassword("");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {usuarioEliminar && (
        <div className="modal-overlay" onClick={() => setUsuarioEliminar(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="danger">⚠️ Eliminar Cuenta: {usuarioEliminar.nombre}</h3>
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
                ✓ Eliminar Cuenta
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

      <div className="filters-section">
        <div className="filter-group">
          <label>Filtrar por Rol:</label>
          <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
            <option value="">-- Todos los roles --</option>
            <option value="ADMINISTRADOR_ROLE">Administrador</option>
            <option value="GERENTE_GENERAL_ROLE">Gerente General</option>
            <option value="CONTADOR_ROLE">Contador</option>
            <option value="GERENTE_ROLE">Gerente</option>
            <option value="VENDEDOR_ROLE">Vendedor</option>
            <option value="AUXILIAR_ROLE">Auxiliar</option>
            <option value="CLIENTE_ROLE">Cliente</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Buscar por nombre, usuario o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
      </div>

      <UsuarioList
        usuarios={usuariosFiltrados}
        loading={loading}
        permisos={{
          puedeEditar,
          puedeCambiarRoles,
          puedeDesactivar,
          puedeCambiarContraseña: (usuarioTargetUid) => 
            puedeCambiarContraseña(user?.rol, user?.uid, usuarioTargetUid),
          puedeVerDetalle: (usuarioTargetUid) => 
            puedeVerDetalleUsuario(user?.rol, user?.uid, usuarioTargetUid),
        }}
        usuarioActualUid={user?.uid}
        onEdit={(u) => {
          setUsuarioEditar(u);
          setMostrarFormulario(true);
        }}
        onDelete={handleDesactivar}
        onChangeRol={setUsuarioCambiarRol}
        onVerDetalle={handleVerDetalle}
        onCambiarPassword={setUsuarioCambiarPass}
        onEliminarCuenta={setUsuarioEliminar}
      />
    </div>
  );
};
