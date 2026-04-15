import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { usuarioCrearSchema, usuarioEditarSchema } from "../../shared/validadores/usuarioValidators";
import toast from "react-hot-toast";

export const UsuarioForm = ({ usuario = null, onSubmit, loading = false }) => {
  const isEditing = !!usuario;
  const schema = isEditing ? usuarioEditarSchema : usuarioCrearSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
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
      teléfono: "",
      puesto: "",
      departamento: "",
      rol: "CLIENTE_ROLE",
      dirección: "",
    },
  });

  const rol = watch("rol");

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
            <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nombre *
            </label>
            <input
              id="nombre"
              type="text"
              placeholder="Juan"
              {...register("nombre")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
                errors.nombre 
                  ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                  : "border-gray-300"
              }`}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="apellido" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Apellido *
            </label>
            <input
              id="apellido"
              type="text"
              placeholder="Pérez"
              {...register("apellido")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
                errors.apellido 
                  ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                  : "border-gray-300"
              }`}
            />
            {errors.apellido && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.apellido.message}</p>
            )}
          </div>

          {/* Usuario y Correo */}
          <div>
            <label htmlFor="usuario" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Usuario *
            </label>
            <input
              id="usuario"
              type="text"
              placeholder="jperez"
              {...register("usuario")}
              disabled={isEditing}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all disabled:opacity-50 ${
                errors.usuario 
                  ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                  : "border-gray-300"
              }`}
            />
            {errors.usuario && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.usuario.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="correo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Correo *
            </label>
            <input
              id="correo"
              type="email"
              placeholder="juan@example.com"
              {...register("correo")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
                errors.correo 
                  ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                  : "border-gray-300"
              }`}
            />
            {errors.correo && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.correo.message}</p>
            )}
          </div>

          {/* Contraseña - Solo si es nuevo */}
          {!isEditing && (
            <div className="sm:col-span-2">
              <label htmlFor="contraseña" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Contraseña *
              </label>
              <input
                id="contraseña"
                type="password"
                placeholder="Mínimo 6 caracteres"
                {...register("contraseña")}
                className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
                  errors.contraseña 
                    ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                    : "border-gray-300"
                }`}
              />
              {errors.contraseña && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contraseña.message}</p>
              )}
            </div>
          )}

          {/* Tipo Documento y Número */}
          <div>
            <label htmlFor="tipoDocumento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tipo de Documento *
            </label>
            <select
              id="tipoDocumento"
              {...register("tipoDocumento")}
              disabled={isEditing}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all disabled:opacity-50 ${
                errors.tipoDocumento 
                  ? "border-red-500 dark:border-red-500" 
                  : "border-gray-300"
              }`}
            >
              <option value="DPI">DPI</option>
              <option value="NIT">NIT</option>
              <option value="PASAPORTE">Pasaporte</option>
            </select>
            {errors.tipoDocumento && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tipoDocumento.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="numeroDocumento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Número de Documento *
            </label>
            <input
              id="numeroDocumento"
              type="text"
              placeholder="1234567890101"
              {...register("numeroDocumento")}
              disabled={isEditing}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all disabled:opacity-50 ${
                errors.numeroDocumento 
                  ? "border-red-500 dark:border-red-500" 
                  : "border-gray-300"
              }`}
            />
            {errors.numeroDocumento && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.numeroDocumento.message}</p>
            )}
          </div>

          {/* NIT */}
          <div>
            <label htmlFor="nit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              NIT
            </label>
            <input
              id="nit"
              type="text"
              placeholder="123456789"
              {...register("nit")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.nit ? "border-red-500" : ""
              }`}
            />
            {errors.nit && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nit.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="teléfono" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Teléfono *
            </label>
            <input
              id="teléfono"
              type="tel"
              placeholder="+502 1234 5678"
              {...register("teléfono")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
                errors.teléfono 
                  ? "border-red-500 dark:border-red-500" 
                  : "border-gray-300"
              }`}
            />
            {errors.teléfono && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.teléfono.message}</p>
            )}
          </div>

          {/* Puesto y Departamento */}
          <div>
            <label htmlFor="puesto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Puesto *
            </label>
            <input
              id="puesto"
              type="text"
              placeholder="Gerente de Ventas"
              {...register("puesto")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
                errors.puesto 
                  ? "border-red-500 dark:border-red-500" 
                  : "border-gray-300"
              }`}
            />
            {errors.puesto && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.puesto.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="departamento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Departamento *
            </label>
            <input
              id="departamento"
              type="text"
              placeholder="Ventas"
              {...register("departamento")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
                errors.departamento 
                  ? "border-red-500 dark:border-red-500" 
                  : "border-gray-300"
              }`}
            />
            {errors.departamento && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.departamento.message}</p>
            )}
          </div>

          {/* Rol y Dirección */}
          <div>
            <label htmlFor="rol" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Rol *
            </label>
            <select
              id="rol"
              {...register("rol")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
                errors.rol 
                  ? "border-red-500 dark:border-red-500" 
                  : "border-gray-300"
              }`}
            >
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {errors.rol && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rol.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="dirección" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Dirección
            </label>
            <input
              id="dirección"
              type="text"
              placeholder="Calle Principal 123"
              {...register("dirección")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.dirección ? "border-red-500" : ""
              }`}
            />
            {errors.dirección && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dirección.message}</p>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="reset"
            onClick={() => reset()}
            className="px-6 py-2.5 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200"
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

      {/* Animaciones */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
};
