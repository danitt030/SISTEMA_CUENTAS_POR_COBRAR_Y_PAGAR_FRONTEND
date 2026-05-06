import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usuarioCrearSchema, usuarioEditarSchema } from "../../shared/validadores/usuarioValidators";
import toast from "react-hot-toast";

export const UsuarioForm = ({ usuario = null, onSubmit, loading = false }) => {
  const isEditing = !!usuario;
  const schema = isEditing ? usuarioEditarSchema : usuarioCrearSchema;

  const baseInputClass =
    "w-full rounded-xl border bg-slate-900/75 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-55";
  const normalInputClass = `${baseInputClass} border-slate-700`;
  const errorInputClass = `${baseInputClass} border-rose-500 focus:border-rose-500 focus:ring-rose-500/30`;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: usuario || {
      nombre: "",
      apellido: "",
      usuario: "",
      correo: "",
      contraseña: "",
      tipoDocumento: "DPI",
      numeroDocumento: "",
      nit: "",
      telefono: "",
      puesto: "",
      departamento: "",
      departamentoGeografico: "",
      rol: "CLIENTE_ROLE",
      direccion: "",
    },
  });

  const handleFormSubmit = async (data) => {
    const result = await onSubmit(data);
    if (!result.error) {
      if (!isEditing) {
        reset();
        toast.success("Usuario creado correctamente");
      } else {
        toast.success("Usuario actualizado correctamente");
      }
    } else {
      toast.error(result.message || "Error al procesar usuario");
    }
  };

  const ROLES = [
    { value: "ADMINISTRADOR_ROLE", label: "Administrador" },
    { value: "GERENTE_GENERAL_ROLE", label: "Gerente General" },
    { value: "CONTADOR_ROLE", label: "Contador" },
    { value: "GERENTE_ROLE", label: "Gerente" },
    { value: "VENDEDOR_ROLE", label: "Vendedor" },
    { value: "AUXILIAR_ROLE", label: "Auxiliar" },
    { value: "CLIENTE_ROLE", label: "Cliente" },
  ];

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 animate-slideUp">
        {/* Grid Layout */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Nombre y Apellido */}
          <div>
            <label htmlFor="nombre" className="mb-2 block text-sm font-semibold text-slate-200">
              Nombre *
            </label>
            <input
              id="nombre"
              type="text"
              placeholder="Juan"
              {...register("nombre")}
              className={errors.nombre ? errorInputClass : normalInputClass}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-rose-400">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="apellido" className="mb-2 block text-sm font-semibold text-slate-200">
              Apellido *
            </label>
            <input
              id="apellido"
              type="text"
              placeholder="Pérez"
              {...register("apellido")}
              className={errors.apellido ? errorInputClass : normalInputClass}
            />
            {errors.apellido && (
              <p className="mt-1 text-sm text-rose-400">{errors.apellido.message}</p>
            )}
          </div>

          {/* Usuario y Correo */}
          <div>
            <label htmlFor="usuario" className="mb-2 block text-sm font-semibold text-slate-200">
              Usuario *
            </label>
            <input
              id="usuario"
              type="text"
              placeholder="jperez"
              {...register("usuario")}
              disabled={isEditing}
              className={errors.usuario ? errorInputClass : normalInputClass}
            />
            {errors.usuario && (
              <p className="mt-1 text-sm text-rose-400">{errors.usuario.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="correo" className="mb-2 block text-sm font-semibold text-slate-200">
              Correo *
            </label>
            <input
              id="correo"
              type="email"
              placeholder="juan@example.com"
              {...register("correo")}
              className={errors.correo ? errorInputClass : normalInputClass}
            />
            {errors.correo && (
              <p className="mt-1 text-sm text-rose-400">{errors.correo.message}</p>
            )}
          </div>

          {/* Contraseña - Solo si es nuevo */}
          {!isEditing && (
            <div className="sm:col-span-2">
              <label htmlFor="contraseña" className="mb-2 block text-sm font-semibold text-slate-200">
                Contraseña *
              </label>
              <input
                id="contraseña"
                type="password"
                placeholder="Mínimo 6 caracteres"
                {...register("contraseña")}
                className={errors.contraseña ? errorInputClass : normalInputClass}
              />
              {errors.contraseña && (
                <p className="mt-1 text-sm text-rose-400">{errors.contraseña.message}</p>
              )}
            </div>
          )}

          {/* Tipo Documento y Número */}
          <div>
            <label htmlFor="tipoDocumento" className="mb-2 block text-sm font-semibold text-slate-200">
              Tipo de Documento *
            </label>
            <select
              id="tipoDocumento"
              {...register("tipoDocumento")}
              disabled={isEditing}
              className={errors.tipoDocumento ? errorInputClass : normalInputClass}
            >
              <option value="DPI">DPI</option>
              <option value="NIT">NIT</option>
              <option value="PASAPORTE">Pasaporte</option>
            </select>
            {errors.tipoDocumento && (
              <p className="mt-1 text-sm text-rose-400">{errors.tipoDocumento.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="numeroDocumento" className="mb-2 block text-sm font-semibold text-slate-200">
              Número de Documento *
            </label>
            <input
              id="numeroDocumento"
              type="text"
              placeholder="1234567890101"
              {...register("numeroDocumento")}
              disabled={isEditing}
              className={errors.numeroDocumento ? errorInputClass : normalInputClass}
            />
            {errors.numeroDocumento && (
              <p className="mt-1 text-sm text-rose-400">{errors.numeroDocumento.message}</p>
            )}
          </div>

          {/* NIT */}
          <div>
            <label htmlFor="nit" className="mb-2 block text-sm font-semibold text-slate-200">
              NIT
            </label>
            <input
              id="nit"
              type="text"
              placeholder="123456789"
              {...register("nit")}
              className={errors.nit ? errorInputClass : normalInputClass}
            />
            {errors.nit && (
              <p className="mt-1 text-sm text-rose-400">{errors.nit.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="mb-2 block text-sm font-semibold text-slate-200">
              Teléfono *
            </label>
            <input
              id="telefono"
              type="tel"
              placeholder="+502 1234 5678"
              {...register("telefono")}
              className={errors.telefono ? errorInputClass : normalInputClass}
            />
            {errors.telefono && (
              <p className="mt-1 text-sm text-rose-400">{errors.telefono.message}</p>
            )}
          </div>

          {/* Puesto y Departamento */}
          <div>
            <label htmlFor="puesto" className="mb-2 block text-sm font-semibold text-slate-200">
              Puesto *
            </label>
            <input
              id="puesto"
              type="text"
              placeholder="Gerente de Ventas"
              {...register("puesto")}
              className={errors.puesto ? errorInputClass : normalInputClass}
            />
            {errors.puesto && (
              <p className="mt-1 text-sm text-rose-400">{errors.puesto.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="departamento" className="mb-2 block text-sm font-semibold text-slate-200">
              Departamento *
            </label>
            <input
              id="departamento"
              type="text"
              placeholder="Ventas"
              {...register("departamento")}
              className={errors.departamento ? errorInputClass : normalInputClass}
            />
            {errors.departamento && (
              <p className="mt-1 text-sm text-rose-400">{errors.departamento.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="departamentoGeografico"
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              Departamento geográfico *
            </label>
            <input
              id="departamentoGeografico"
              type="text"
              placeholder="Guatemala"
              {...register("departamentoGeografico")}
              className={errors.departamentoGeografico ? errorInputClass : normalInputClass}
            />
            {errors.departamentoGeografico && (
              <p className="mt-1 text-sm text-rose-400">
                {errors.departamentoGeografico.message}
              </p>
            )}
          </div>

          {/* Rol y Dirección */}
          <div>
            <label htmlFor="rol" className="mb-2 block text-sm font-semibold text-slate-200">
              Rol *
            </label>
            <select
              id="rol"
              {...register("rol")}
              className={errors.rol ? errorInputClass : normalInputClass}
            >
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {errors.rol && (
              <p className="mt-1 text-sm text-rose-400">{errors.rol.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="direccion" className="mb-2 block text-sm font-semibold text-slate-200">
              Dirección
            </label>
            <input
              id="direccion"
              type="text"
              placeholder="Calle Principal 123"
              {...register("direccion")}
              className={errors.direccion ? errorInputClass : normalInputClass}
            />
            {errors.direccion && (
              <p className="mt-1 text-sm text-rose-400">{errors.direccion.message}</p>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3 border-t border-slate-700/70 pt-4">
          <button
            type="reset"
            onClick={() => reset()}
            className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-2.5 font-medium text-slate-200 transition-colors duration-200 hover:bg-slate-800"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 font-medium text-white shadow-[0_10px_24px_rgba(37,99,235,0.35)] transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">...</span>
                Guardando...
              </>
            ) : isEditing ? (
              "Actualizar Usuario"
            ) : (
              "Crear Usuario"
            )}
          </button>
        </div>
      </form>
    </>
  );
};
