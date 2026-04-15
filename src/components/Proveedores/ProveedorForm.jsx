import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { proveedorCrearSchema, proveedorEditarSchema } from "../../shared/validadores/proveedorValidators";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const ProveedorForm = ({ proveedor = null, onSubmit, loading = false }) => {
  const isEditing = !!proveedor;
  const schema = isEditing ? proveedorEditarSchema : proveedorCrearSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: proveedor || {
      nombre: "",
      nombreContacto: "",
      telefonoContacto: "",
      correoContacto: "",
      tipoDocumento: "DPI",
      numeroDocumento: "",
      nit: "",
      correo: "",
      telefono: "",
      telefonoSecundario: "",
      direccion: "",
      ciudad: "",
      departamento: "",
      codigoPostal: "",
      condicionPago: "CONTADO",
      diasCredito: 0,
      limiteCreditoMes: 0,
      banco: "",
      numeroCuenta: "",
      tipoCuenta: "CORRIENTE",
    },
  });

  useEffect(() => {
    if (proveedor) {
      reset(proveedor);
    }
  }, [proveedor, reset]);

  const condicionPago = useWatch({
    control,
    name: "condicionPago",
    defaultValue: "CONTADO",
  });

  const handleFormSubmit = async (data) => {
    const result = await onSubmit(data);
    if (!result.error) {
      if (!isEditing) {
        reset();
        toast.success("Proveedor creado correctamente");
      } else {
        toast.success("Proveedor actualizado correctamente");
      }
    } else {
      toast.error(result.message || "Error al procesar proveedor");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 animate-slideUp">
      {/* Nombre y Nombre Contacto */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Nombre *
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Empresa XYZ"
            {...register("nombre")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.nombre ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombre.message}</p>}
        </div>

        <div>
          <label htmlFor="nombreContacto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Nombre Contacto
          </label>
          <input
            id="nombreContacto"
            type="text"
            placeholder="Juan Pérez"
            {...register("nombreContacto")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.nombreContacto ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.nombreContacto && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombreContacto.message}</p>}
        </div>
      </div>

      {/* Teléfono Contacto y Correo Contacto */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label htmlFor="telefonoContacto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Teléfono Contacto
          </label>
          <input
            id="telefonoContacto"
            type="text"
            placeholder="123456789"
            {...register("telefonoContacto")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.telefonoContacto ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.telefonoContacto && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.telefonoContacto.message}</p>}
        </div>

        <div>
          <label htmlFor="correoContacto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Correo Contacto
          </label>
          <input
            id="correoContacto"
            type="email"
            placeholder="contacto@empresa.com"
            {...register("correoContacto")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.correoContacto ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.correoContacto && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.correoContacto.message}</p>}
        </div>
      </div>

      {/* Tipo de Documento, Número Documento, NIT */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label htmlFor="tipoDocumento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Tipo de Documento *
          </label>
          <select
            id="tipoDocumento"
            {...register("tipoDocumento")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.tipoDocumento ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          >
            <option value="DPI">DPI</option>
            <option value="NIT">NIT</option>
            <option value="PASAPORTE">Pasaporte</option>
          </select>
          {errors.tipoDocumento && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tipoDocumento.message}</p>}
        </div>

        <div>
          <label htmlFor="numeroDocumento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Número de Documento *
          </label>
          <input
            id="numeroDocumento"
            type="text"
            placeholder="12345678901"
            {...register("numeroDocumento")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.numeroDocumento ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.numeroDocumento && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.numeroDocumento.message}</p>}
        </div>
      </div>

      {/* NIT y Correo */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label htmlFor="nit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            NIT
          </label>
          <input
            id="nit"
            type="text"
            placeholder="12345678-K"
            {...register("nit")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.nit ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.nit && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nit.message}</p>}
        </div>

        <div>
          <label htmlFor="correo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Correo *
          </label>
          <input
            id="correo"
            type="email"
            placeholder="empresa@email.com"
            {...register("correo")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.correo ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.correo && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.correo.message}</p>}
        </div>
      </div>

      {/* Teléfono y Teléfono Secundario */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Teléfono *
          </label>
          <input
            id="telefono"
            type="text"
            placeholder="22221111"
            {...register("telefono")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.telefono ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.telefono && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.telefono.message}</p>}
        </div>

        <div>
          <label htmlFor="telefonoSecundario" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Teléfono Secundario
          </label>
          <input
            id="telefonoSecundario"
            type="text"
            placeholder="22222222"
            {...register("telefonoSecundario")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.telefonoSecundario ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.telefonoSecundario && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.telefonoSecundario.message}</p>}
        </div>
      </div>

      {/* Dirección, Ciudad, Departamento, Código Postal */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label htmlFor="direccion" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Dirección *
          </label>
          <input
            id="direccion"
            type="text"
            placeholder="Calle Principal 123"
            {...register("direccion")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.direccion ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.direccion && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.direccion.message}</p>}
        </div>

        <div>
          <label htmlFor="ciudad" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Ciudad *
          </label>
          <input
            id="ciudad"
            type="text"
            placeholder="Ciudad de Guatemala"
            {...register("ciudad")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.ciudad ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.ciudad && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.ciudad.message}</p>}
        </div>

        <div>
          <label htmlFor="departamento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Departamento *
          </label>
          <input
            id="departamento"
            type="text"
            placeholder="Guatemala"
            {...register("departamento")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.departamento ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.departamento && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.departamento.message}</p>}
        </div>

        <div>
          <label htmlFor="codigoPostal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Código Postal
          </label>
          <input
            id="codigoPostal"
            type="text"
            placeholder="01000"
            {...register("codigoPostal")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.codigoPostal ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.codigoPostal && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.codigoPostal.message}</p>}
        </div>
      </div>

      {/* Condición de Pago */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label htmlFor="condicionPago" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Condición de Pago *
          </label>
          <select
            id="condicionPago"
            {...register("condicionPago")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.condicionPago ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          >
            <option value="CONTADO">Contado</option>
            <option value="CREDITO">Crédito</option>
          </select>
          {errors.condicionPago && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.condicionPago.message}</p>}
        </div>
      </div>

      {/* Campos de Crédito - Condicionales */}
      {condicionPago === "CREDITO" && (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div>
            <label htmlFor="diasCredito" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Días de Crédito
            </label>
            <input
              id="diasCredito"
              type="number"
              placeholder="30"
              {...register("diasCredito", { valueAsNumber: true })}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
                errors.diasCredito ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.diasCredito && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.diasCredito.message}</p>}
          </div>

          <div>
            <label htmlFor="limiteCreditoMes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Límite Crédito Mes
            </label>
            <input
              id="limiteCreditoMes"
              type="number"
              placeholder="5000"
              {...register("limiteCreditoMes", { valueAsNumber: true })}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
                errors.limiteCreditoMes ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.limiteCreditoMes && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.limiteCreditoMes.message}</p>}
          </div>
        </div>
      )}

      {/* Información Bancaria */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label htmlFor="banco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Banco
          </label>
          <input
            id="banco"
            type="text"
            placeholder="Banco de Guatemala"
            {...register("banco")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.banco ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.banco && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.banco.message}</p>}
        </div>

        <div>
          <label htmlFor="numeroCuenta" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Número de Cuenta
          </label>
          <input
            id="numeroCuenta"
            type="text"
            placeholder="123456789"
            {...register("numeroCuenta")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.numeroCuenta ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.numeroCuenta && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.numeroCuenta.message}</p>}
        </div>

        <div>
          <label htmlFor="tipoCuenta" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Tipo de Cuenta
          </label>
          <select
            id="tipoCuenta"
            {...register("tipoCuenta")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.tipoCuenta ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          >
            <option value="CORRIENTE">Corriente</option>
            <option value="AHORRO">Ahorro</option>
          </select>
          {errors.tipoCuenta && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tipoCuenta.message}</p>}
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-6">
        <button
          type="reset"
          onClick={() => reset()}
          className="flex-1 px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Limpiar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? "Guardando..." : isEditing ? "Actualizar Proveedor" : "Crear Proveedor"}
        </button>
      </div>
    </form>
  );
};
