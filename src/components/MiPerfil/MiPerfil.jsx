import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import * as api from "../../services/api";
import toast from "react-hot-toast";
import "./miPerfil.css";

// Schema de validación
const perfilSchema = yup.object().shape({
  nombre: yup
    .string()
    .required("El nombre es requerido")
    .min(2, "Mínimo 2 caracteres"),
  apellido: yup
    .string()
    .required("El apellido es requerido")
    .min(2, "Mínimo 2 caracteres"),
  telefono: yup
    .string()
    .required("El teléfono es requerido"),
  departamento: yup
    .string()
    .optional(),
  puesto: yup
    .string()
    .optional(),
  direccion: yup
    .string()
    .optional(),
});

export const MiPerfil = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [userData, setUserData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(perfilSchema),
  });

  // Cargar datos completos del usuario desde el backend
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await api.obtenerUsuarioPorId(user?.uid);
        
        if (response.error) {
          toast.error("Error al cargar los datos del perfil");
          setLoading(false);
          return;
        }

        // Extraer datos del usuario
        const datosCompletos = response?.data?.usuario || response?.usuario;
        
        if (!datosCompletos) {
          toast.error("Error al procesar los datos del perfil");
          setLoading(false);
          return;
        }

        setUserData(datosCompletos);
        reset({
          nombre: datosCompletos.nombre || "",
          apellido: datosCompletos.apellido || "",
          telefono: datosCompletos.telefono || "",
          departamento: datosCompletos.departamento || "",
          puesto: datosCompletos.puesto || "",
          direccion: datosCompletos.direccion || "",
        });
      } catch {
        toast.error("Error al cargar los datos del perfil");
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      setLoading(true);
      cargarDatos();
    }
  }, [user?.uid, reset]);

  const handleActualizar = async (datos) => {
    setLoading(true);
    try {
      const response = await api.actualizarUsuario(user?.uid, datos);
      
      if (response.error) {
        toast.error(response.err?.message || "Error al actualizar perfil");
        setLoading(false);
        return;
      }

      toast.success("Perfil actualizado correctamente");
      setEditando(false);
      
      // Recargar datos completos desde el backend para asegurar estructura correcta
      const responseGET = await api.obtenerUsuarioPorId(user?.uid);
      if (!responseGET.error) {
        const datosActualizados = responseGET?.data?.usuario || responseGET?.usuario;
        if (datosActualizados) {
          setUserData(datosActualizados);
          reset({
            nombre: datosActualizados.nombre || "",
            apellido: datosActualizados.apellido || "",
            telefono: datosActualizados.telefono || "",
            departamento: datosActualizados.departamento || "",
            puesto: datosActualizados.puesto || "",
            direccion: datosActualizados.direccion || "",
          });
        }
      }
    } catch {
      toast.error("Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !userData) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="mi-perfil-container">
      <div className="perfil-card">
        <div className="perfil-header">
          <div className="perfil-avatar">👤</div>
          <div className="perfil-titulo">
            <h2>Mi Perfil</h2>
            <p className="rol-badge">{String(userData?.rol || "")}</p>
          </div>
        </div>

        {editando ? (
          <form onSubmit={handleSubmit(handleActualizar)} className="perfil-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  id="nombre"
                  type="text"
                  {...register("nombre")}
                  className={errors.nombre ? "input-error" : ""}
                />
                {errors.nombre && (
                  <span className="error-msg">{errors.nombre.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="apellido">Apellido *</label>
                <input
                  id="apellido"
                  type="text"
                  {...register("apellido")}
                  className={errors.apellido ? "input-error" : ""}
                />
                {errors.apellido && (
                  <span className="error-msg">{errors.apellido.message}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  id="telefono"
                  type="text"
                  {...register("telefono")}
                  className={errors.telefono ? "input-error" : ""}
                />
                {errors.telefono && (
                  <span className="error-msg">{errors.telefono.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="puesto">Puesto</label>
                <input
                  id="puesto"
                  type="text"
                  {...register("puesto")}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="departamento">Departamento</label>
                <input
                  id="departamento"
                  type="text"
                  {...register("departamento")}
                />
              </div>

              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input
                  id="direccion"
                  type="text"
                  {...register("direccion")}
                />
              </div>
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditando(false);
                  reset({
                    nombre: userData?.nombre || "",
                    apellido: userData?.apellido || "",
                    telefono: userData?.telefono || "",
                    departamento: userData?.departamento || "",
                    puesto: userData?.puesto || "",
                    direccion: userData?.direccion || "",
                  });
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        ) : (
          <div className="perfil-datos">
            <div className="dato-item">
              <label>Nombre Completo:</label>
              <p>
                {String(userData?.nombre || "")} {String(userData?.apellido || "")}
              </p>
            </div>

            <div className="dato-item">
              <label>Usuario:</label>
              <p>{String(userData?.usuario || "")}</p>
            </div>

            <div className="dato-item">
              <label>Correo:</label>
              <p>{String(userData?.correo || "")}</p>
            </div>

            <div className="dato-item">
              <label>Teléfono:</label>
              <p>{String(userData?.telefono || "-")}</p>
            </div>

            <div className="dato-item">
              <label>Documento:</label>
              <p>
                {String(userData?.tipoDocumento || "")}: {String(userData?.numeroDocumento || "")}
              </p>
            </div>

            {userData?.nit && (
              <div className="dato-item">
                <label>NIT:</label>
                <p>{String(userData.nit)}</p>
              </div>
            )}

            {userData?.puesto && (
              <div className="dato-item">
                <label>Puesto:</label>
                <p>{String(userData.puesto)}</p>
              </div>
            )}

            {userData?.departamento && (
              <div className="dato-item">
                <label>Departamento:</label>
                <p>{String(userData.departamento)}</p>
              </div>
            )}

            {userData?.direccion && (
              <div className="dato-item">
                <label>Dirección:</label>
                <p>{String(userData.direccion)}</p>
              </div>
            )}

            {userData?.departamentoGeografico && (
              <div className="dato-item">
                <label>Departamento Geográfico:</label>
                <p>{String(userData.departamentoGeografico)}</p>
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={() => setEditando(true)}
            >
              ✏️ Editar Perfil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
