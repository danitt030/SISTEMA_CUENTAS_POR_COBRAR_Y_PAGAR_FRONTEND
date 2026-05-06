import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { getRoleName } from "../../utils/roleUtils";
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

  const secondaryActionClass =
    "inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-200 shadow-sm transition hover:border-slate-600 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60";
  const primaryActionClass =
    "inline-flex items-center justify-center rounded-xl border border-sky-500/40 bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 disabled:cursor-not-allowed disabled:opacity-60";

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

  const getInitials = (nombre = "", apellido = "") => {
    const first = String(nombre).trim().charAt(0);
    const last = String(apellido).trim().charAt(0);
    return `${first}${last}`.toUpperCase() || "U";
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-100 shadow-sm">
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-700 border-t-slate-100" />
            <h3 className="text-lg font-bold text-slate-100">Cargando perfil</h3>
            <p className="text-sm text-slate-400">Estamos preparando tus datos para que puedas continuar.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-rose-900 bg-slate-950 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-rose-300">No se pudo cargar el perfil</h3>
          <p className="mt-2 text-sm text-slate-400">{loadError}</p>
          <button
            onClick={() => {
              setLoading(true);
              setLoadError("");
              setReloadToken((prev) => prev + 1);
            }}
            className={`${secondaryActionClass} mt-4 px-4 py-2 text-slate-100 hover:border-sky-500/60`}
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
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-100">Perfil sin información</h3>
          <p className="mt-2 text-sm text-slate-400">No hay datos disponibles para mostrar en este momento.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 shadow-sm">
        <div className="border-b border-slate-800 px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-slate-700 bg-slate-900 text-lg font-bold text-sky-200">
                {getInitials(userData?.nombre, userData?.apellido)}
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-100">Mi Perfil</h2>
                <p className="text-sm text-slate-400">Gestiona tus datos personales y de contacto.</p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
              {getRoleName(userData?.rol)}
            </span>
          </div>
        </div>

        {editando ? (
          <form onSubmit={handleSubmit(handleActualizar)} className="space-y-6 px-6 py-8 sm:px-10">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="nombre" className="mb-1 block text-sm font-semibold text-slate-300">Nombre *</label>
                <input
                  id="nombre"
                  type="text"
                  {...register("nombre")}
                  className={`w-full rounded-xl border bg-slate-900 px-4 py-2.5 text-slate-100 transition placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                    errors.nombre ? "border-rose-500" : "border-slate-800"
                  }`}
                />
                {errors.nombre && (
                  <span className="mt-1 block text-xs font-medium text-rose-600">{errors.nombre.message}</span>
                )}
              </div>

              <div>
                <label htmlFor="apellido" className="mb-1 block text-sm font-semibold text-slate-300">Apellido *</label>
                <input
                  id="apellido"
                  type="text"
                  {...register("apellido")}
                  className={`w-full rounded-xl border bg-slate-900 px-4 py-2.5 text-slate-100 transition placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                    errors.apellido ? "border-rose-500" : "border-slate-800"
                  }`}
                />
                {errors.apellido && (
                  <span className="mt-1 block text-xs font-medium text-rose-600">{errors.apellido.message}</span>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="telefono" className="mb-1 block text-sm font-semibold text-slate-300">Teléfono *</label>
                <input
                  id="telefono"
                  type="text"
                  {...register("telefono")}
                  className={`w-full rounded-xl border bg-slate-900 px-4 py-2.5 text-slate-100 transition placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                    errors.telefono ? "border-rose-500" : "border-slate-800"
                  }`}
                />
                {errors.telefono && (
                  <span className="mt-1 block text-xs font-medium text-rose-600">{errors.telefono.message}</span>
                )}
              </div>

              <div>
                <label htmlFor="puesto" className="mb-1 block text-sm font-semibold text-slate-300">Puesto</label>
                <input
                  id="puesto"
                  type="text"
                  {...register("puesto")}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-slate-100 transition placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="departamento" className="mb-1 block text-sm font-semibold text-slate-300">Departamento</label>
                <input
                  id="departamento"
                  type="text"
                  {...register("departamento")}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-slate-100 transition placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label htmlFor="direccion" className="mb-1 block text-sm font-semibold text-slate-300">Dirección</label>
                <input
                  id="direccion"
                  type="text"
                  {...register("direccion")}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-slate-100 transition placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-800 pt-5">
              <button
                type="button"
                className={secondaryActionClass}
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
                className={primaryActionClass}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 px-6 py-8 sm:px-10">
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Nombre Completo</p>
                <p className="mt-1 text-base font-bold text-slate-100">
                {String(userData?.nombre || "")} {String(userData?.apellido || "")}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Usuario</p>
                <p className="mt-1 text-base font-bold text-slate-100">{String(userData?.usuario || "")}</p>
              </article>

              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Correo</p>
                <p className="mt-1 text-base font-bold text-slate-100">{String(userData?.correo || "")}</p>
              </article>

              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Teléfono</p>
                <p className="mt-1 text-base font-bold text-slate-100">{String(userData?.telefono || "-")}</p>
              </article>

              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Documento</p>
                <p className="mt-1 text-base font-bold text-slate-100">
                {String(userData?.tipoDocumento || "")}: {String(userData?.numeroDocumento || "")}
                </p>
              </article>

              {userData?.nit && (
                <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">NIT</p>
                  <p className="mt-1 text-base font-bold text-slate-100">{String(userData.nit)}</p>
                </article>
              )}

              {userData?.puesto && (
                <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Puesto</p>
                  <p className="mt-1 text-base font-bold text-slate-100">{String(userData.puesto)}</p>
                </article>
              )}

              {userData?.departamento && (
                <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Departamento</p>
                  <p className="mt-1 text-base font-bold text-slate-100">{String(userData.departamento)}</p>
                </article>
              )}

              {userData?.direccion && (
                <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Dirección</p>
                  <p className="mt-1 text-base font-bold text-slate-100">{String(userData.direccion)}</p>
                </article>
              )}

              {userData?.departamentoGeografico && (
                <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Departamento Geográfico</p>
                  <p className="mt-1 text-base font-bold text-slate-100">{String(userData.departamentoGeografico)}</p>
                </article>
              )}
            </div>

            <button
              type="button"
              className={primaryActionClass}
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
