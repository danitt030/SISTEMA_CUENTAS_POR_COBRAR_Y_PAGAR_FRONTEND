import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import * as api from "../../services/api";

export const useAuth = () => {
  const { user, login, logout } = useContext(AuthContext);

  // Registrar nuevo usuario
  const register = async (data) => {
    try {
      const response = await api.register(data);

      if (response.error) {
        return {
          success: false,
          message: response.err?.response?.data?.message || "Error al registrar",
          error: true,
        };
      }

      return {
        success: true,
        message: response.data?.message || "Registrado exitosamente",
        error: false,
        data: response.data,
      };
    } catch (err) {
      return {
        success: false,
        message: "Error al registrar",
        error: true,
        err,
      };
    }
  };

  // Iniciar sesión
  const loginUser = async (data) => {
    try {
      const response = await api.login(data);

      if (response.error) {
        return {
          success: false,
          message: response.err?.response?.data?.message || "Error al iniciar sesión",
          error: true,
        };
      }

      // Guardar usuario en contexto (AuthContext)
      // El backend devuelve el token dentro de usuarioDetalles
      const usuarioDetalles = response.data?.usuarioDetalles;

      if (usuarioDetalles && usuarioDetalles?.token) {
        login(usuarioDetalles);

        return {
          success: true,
          message: response.data?.message || "Sesión iniciada",
          error: false,
          data: usuarioDetalles,
        };
      }

      return {
        success: false,
        message: "Datos de respuesta inválidos",
        error: true,
      };
    } catch (err) {
      return {
        success: false,
        message: "Error al iniciar sesión",
        error: true,
        err,
      };
    }
  };

  // Cerrar sesión
  const logoutUser = () => {
    logout();
  };

  return {
    user,
    register,
    loginUser,
    logoutUser,
  };
};
