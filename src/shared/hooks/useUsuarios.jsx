import { useState, useCallback } from "react";
import * as api from "../../services/api";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los usuarios
  const obtenerUsuarios = useCallback(async (limite = 10, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerUsuarios(limite, desde);
      if (response.error) {
        setError(response.err?.message || "Error al obtener usuarios");
        return { error: true, data: null };
      }
      const userData = response.data?.usuarios || response.data?.data || [];
      setUsuarios(userData);
      return { error: false, data: userData };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener usuarios por rol
  const obtenerUsuariosPorRol = useCallback(async (rol, limite = 10, desde = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerUsuariosPorRol(rol, limite, desde);
      if (response.error) {
        setError(response.err?.message || "Error al obtener usuarios por rol");
        return { error: true, data: null };
      }
      const userData = response.data?.usuarios || response.data?.data || [];
      setUsuarios(userData);
      return { error: false, data: userData };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener usuario por ID
  const obtenerUsuarioPorId = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerUsuarioPorId(id);
      if (response.error) {
        setError(response.err?.message || "Error al obtener usuario");
        return { error: true, data: null };
      }
      const userData = response.data?.usuario || response.data?.data || null;
      return { error: false, data: userData };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar usuario
  const actualizarUsuario = useCallback(async (id, datosActualizados) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.actualizarUsuario(id, datosActualizados);
      if (response.error) {
        setError(response.err?.message || "Error al actualizar usuario");
        return { error: true, data: null };
      }
      // Actualizar lista local
      const usuarioActualizado = response.data?.usuario || response.data;
      setUsuarios(prev =>
        prev.map(u => u.uid === id || u._id === id ? usuarioActualizado : u)
      );
      return { error: false, data: usuarioActualizado };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar contraseña
  const actualizarContraseña = useCallback(async (id, nuevaContraseña) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.actualizarContraseña(id, nuevaContraseña);
      if (response.error) {
        setError(response.err?.message || "Error al actualizar contraseña");
        return { error: true };
      }
      return { error: false };
    } catch (err) {
      setError(err.message);
      return { error: true };
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar rol
  const actualizarRol = useCallback(async (id, nuevoRol) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.actualizarRol(id, nuevoRol);
      if (response.error) {
        setError(response.err?.message || "Error al actualizar rol");
        return { error: true, data: null };
      }
      setUsuarios(prev =>
        prev.map(u => u.uid === id || u._id === id ? { ...u, rol: nuevoRol } : u)
      );
      return { error: false, data: response.data };
    } catch (err) {
      setError(err.message);
      return { error: true, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  // Desactivar usuario
  const desactivarUsuario = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.desactivarUsuario(id);
      if (response.error) {
        setError(response.err?.message || "Error al desactivar usuario");
        return { error: true };
      }
      setUsuarios(prev =>
        prev.map(u => u.uid === id || u._id === id ? { ...u, estado: false } : u)
      );
      return { error: false };
    } catch (err) {
      setError(err.message);
      return { error: true };
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar cuenta propia
  const eliminarCuentaPropia = useCallback(async (id, contraseña) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.eliminarCuentaPropia(id, contraseña);
      if (response.error) {
        setError(response.err?.message || "Error al eliminar cuenta");
        return { error: true };
      }
      setUsuarios(prev => prev.filter(u => u.uid !== id && u._id !== id));
      return { error: false };
    } catch (err) {
      setError(err.message);
      return { error: true };
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar usuarios (cliente-side)
  const buscarUsuarios = useCallback((termino) => {
    if (!termino) return usuarios;
    const lowerTermino = termino.toLowerCase();
    return usuarios.filter(u =>
      u.nombre?.toLowerCase().includes(lowerTermino) ||
      u.apellido?.toLowerCase().includes(lowerTermino) ||
      u.usuario?.toLowerCase().includes(lowerTermino) ||
      u.correo?.toLowerCase().includes(lowerTermino)
    );
  }, [usuarios]);

  return {
    usuarios,
    loading,
    error,
    obtenerUsuarios,
    obtenerUsuariosPorRol,
    obtenerUsuarioPorId,
    actualizarUsuario,
    actualizarContraseña,
    actualizarRol,
    desactivarUsuario,
    eliminarCuentaPropia,
    buscarUsuarios,
  };
};
