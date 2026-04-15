import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import * as api from "../../services/api";
import toast from "react-hot-toast";

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
  const [loadError, setLoadError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
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
          setLoadError("No fue posible cargar los datos del perfil.");
          setUserData(null);
          toast.error("Error al cargar los datos del perfil");
          setLoading(false);
          return;
        }

        // Extraer datos del usuario
        const datosCompletos = response?.data?.usuario || response?.usuario;
        
        if (!datosCompletos) {
          setLoadError("La respuesta del servidor no contiene información de perfil.");
          setUserData(null);
          toast.error("Error al procesar los datos del perfil");
          setLoading(false);
          return;
        }

        setLoadError("");
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
        setLoadError("Ocurrió un problema al consultar tu perfil.");
        setUserData(null);
        toast.error("Error al cargar los datos del perfil");
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      setLoading(true);
      cargarDatos();
    }
  }, [user?.uid, reset, reloadToken]);

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

  const getRoleLabel = (rol = "") => {
    const role = String(rol).toLowerCase();
    const map = {
      admin: "Administrador",
      gerente: "Gerente",
      gerentegeneral: "Gerente General",
      gerente_general: "Gerente General",
      auxiliar: "Auxiliar",
      contador: "Contador",
      vendedor: "Vendedor",
      cliente: "Cliente"
    };

    return map[role] || String(rol || "Sin rol");
  };

  const getInitials = (nombre = "", apellido = "") => {
    const first = String(nombre).trim().charAt(0);
    const last = String(apellido).trim().charAt(0);
    return `${first}${last}`.toUpperCase() || "U";
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-blue-300/30 bg-gradient-to-br from-blue-950/90 via-blue-900/90 to-indigo-900/80 p-8 text-white shadow-2xl shadow-blue-950/40">
          <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative flex flex-col items-center gap-4 py-8 text-center">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/25 border-t-white" />
            <h3 className="text-lg font-bold">Cargando perfil</h3>
            <p className="text-sm text-blue-100">Estamos preparando tus datos para que puedas continuar.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-red-200 bg-white/95 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-red-700">No se pudo cargar el perfil</h3>
          <p className="mt-2 text-sm text-slate-600">{loadError}</p>
          <button
            onClick={() => {
              setLoading(true);
              setLoadError("");
              setReloadToken((prev) => prev + 1);
            }}
            className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-2 text-sm font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-blue-200 bg-white/95 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-800">Perfil sin información</h3>
          <p className="mt-2 text-sm text-slate-600">No hay datos disponibles para mostrar en este momento.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-white/95 shadow-xl shadow-blue-200/40 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),transparent_42%),radial-gradient(circle_at_bottom_left,_rgba(30,64,175,0.14),transparent_36%)]" />

        <div className="relative border-b border-blue-100 px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-lg font-bold text-white shadow-lg shadow-blue-500/30">
                {getInitials(userData?.nombre, userData?.apellido)}
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Mi Perfil</h2>
                <p className="text-sm text-slate-500">Gestiona tus datos personales y de contacto.</p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              {getRoleLabel(userData?.rol)}
            </span>
          </div>
        </div>

        {editando ? (
          <form onSubmit={handleSubmit(handleActualizar)} className="relative space-y-6 px-6 py-8 sm:px-10">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="nombre" className="mb-1 block text-sm font-semibold text-slate-700">Nombre *</label>
                <input
                  id="nombre"
                  type="text"
                  {...register("nombre")}
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                    errors.nombre ? "border-rose-400" : "border-slate-300"
                  }`}
                />
                {errors.nombre && (
                  <span className="mt-1 block text-xs font-medium text-rose-600">{errors.nombre.message}</span>
                )}
              </div>

              <div>
                <label htmlFor="apellido" className="mb-1 block text-sm font-semibold text-slate-700">Apellido *</label>
                <input
                  id="apellido"
                  type="text"
                  {...register("apellido")}
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                    errors.apellido ? "border-rose-400" : "border-slate-300"
                  }`}
                />
                {errors.apellido && (
                  <span className="mt-1 block text-xs font-medium text-rose-600">{errors.apellido.message}</span>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="telefono" className="mb-1 block text-sm font-semibold text-slate-700">Teléfono *</label>
                <input
                  id="telefono"
                  type="text"
                  {...register("telefono")}
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                    errors.telefono ? "border-rose-400" : "border-slate-300"
                  }`}
                />
                {errors.telefono && (
                  <span className="mt-1 block text-xs font-medium text-rose-600">{errors.telefono.message}</span>
                )}
              </div>

              <div>
                <label htmlFor="puesto" className="mb-1 block text-sm font-semibold text-slate-700">Puesto</label>
                <input
                  id="puesto"
                  type="text"
                  {...register("puesto")}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="departamento" className="mb-1 block text-sm font-semibold text-slate-700">Departamento</label>
                <input
                  id="departamento"
                  type="text"
                  {...register("departamento")}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="direccion" className="mb-1 block text-sm font-semibold text-slate-700">Dirección</label>
                <input
                  id="direccion"
                  type="text"
                  {...register("direccion")}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        ) : (
          <div className="relative space-y-6 px-6 py-8 sm:px-10">
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre Completo</p>
                <p className="mt-1 text-base font-bold text-slate-900">
                {String(userData?.nombre || "")} {String(userData?.apellido || "")}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Usuario</p>
                <p className="mt-1 text-base font-bold text-slate-900">{String(userData?.usuario || "")}</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Correo</p>
                <p className="mt-1 text-base font-bold text-slate-900">{String(userData?.correo || "")}</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Teléfono</p>
                <p className="mt-1 text-base font-bold text-slate-900">{String(userData?.telefono || "-")}</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Documento</p>
                <p className="mt-1 text-base font-bold text-slate-900">
                {String(userData?.tipoDocumento || "")}: {String(userData?.numeroDocumento || "")}
                </p>
              </article>

              {userData?.nit && (
                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">NIT</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{String(userData.nit)}</p>
                </article>
              )}

              {userData?.puesto && (
                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Puesto</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{String(userData.puesto)}</p>
                </article>
              )}

              {userData?.departamento && (
                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Departamento</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{String(userData.departamento)}</p>
                </article>
              )}

              {userData?.direccion && (
                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dirección</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{String(userData.direccion)}</p>
                </article>
              )}

              {userData?.departamentoGeografico && (
                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Departamento Geográfico</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{String(userData.departamentoGeografico)}</p>
                </article>
              )}
            </div>

            <button
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:brightness-110"
              onClick={() => setEditando(true)}
            >
              Editar Perfil
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
