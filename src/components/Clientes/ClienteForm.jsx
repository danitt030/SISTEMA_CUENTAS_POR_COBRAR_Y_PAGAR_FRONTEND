import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { clienteCrearSchema, clienteEditarSchema } from "../../shared/validadores/clienteValidators";
import { useUsuarios } from "../../shared/hooks/useUsuarios";
import toast from "react-hot-toast";

export const ClienteForm = ({ cliente = null, onSubmit, loading = false }) => {
  const isEditing = !!cliente;
  const schema = isEditing ? clienteEditarSchema : clienteCrearSchema;
  const { obtenerUsuariosPorRol, obtenerUsuarios } = useUsuarios();
  const [gerentesDisponibles, setGerentesDisponibles] = useState([]);
  const [vendedoresDisponibles, setVendedoresDisponibles] = useState([]);
  const normalizeId = (id) => {
    if (!id) {
      return "";
    }
    if (typeof id === "string") {
      return id;
    }
    if (typeof id === "number") {
      return String(id);
    }
    if (typeof id === "object" && typeof id.toString === "function") {
      return id.toString();
    }
    return "";
  };
  const resolveUsuarioId = (value) => {
    if (!value) {
      return "";
    }
    if (typeof value === "string") {
      return value;
    }
    return normalizeId(value._id || value.uid || value.id || value);
  };
  const dedupeUsuarios = (lista) => {
    const map = new Map();
    lista.forEach((usuario) => {
      const id = resolveUsuarioId(usuario);
      if (id) {
        map.set(id, usuario);
      }
    });
    return Array.from(map.values());
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: cliente ? {
      ...cliente,
      gerenteAsignado: resolveUsuarioId(cliente.gerenteAsignado),
      vendedorAsignado: resolveUsuarioId(cliente.vendedorAsignado),
    } : {
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
      gerenteAsignado: "",
      vendedorAsignado: "",
    },
  });

  // Cargar gerentes y vendedores disponibles
  useEffect(() => {
    const cargarUsuariosDisponibles = async () => {
      const rolesGerente = ["GERENTE_ROLE", "GERENTE_GENERAL_ROLE"];
      const rolesVendedor = ["VENDEDOR_ROLE"];

      const resultadosGerentes = await Promise.all(
        rolesGerente.map((rol) => obtenerUsuariosPorRol(rol, 100))
      );
      let gerentes = resultadosGerentes.flatMap((resultado) =>
        !resultado.error && Array.isArray(resultado.data) ? resultado.data : []
      );

      const resultadoVendedores = await obtenerUsuariosPorRol("VENDEDOR_ROLE", 100);
      let vendedores = !resultadoVendedores.error && Array.isArray(resultadoVendedores.data)
        ? resultadoVendedores.data
        : [];

      if ((!gerentes.length || !vendedores.length) && obtenerUsuarios) {
        const resultadoTodos = await obtenerUsuarios(200, 0);
        if (!resultadoTodos.error && Array.isArray(resultadoTodos.data)) {
          if (!gerentes.length) {
            gerentes = resultadoTodos.data.filter((usuario) => rolesGerente.includes(usuario.rol));
          }
          if (!vendedores.length) {
            vendedores = resultadoTodos.data.filter((usuario) => rolesVendedor.includes(usuario.rol));
          }
        }
      }

      setGerentesDisponibles(dedupeUsuarios(gerentes));
      setVendedoresDisponibles(dedupeUsuarios(vendedores));

      if (cliente?.gerenteAsignado) {
        setValue("gerenteAsignado", resolveUsuarioId(cliente.gerenteAsignado));
      }
      if (cliente?.vendedorAsignado) {
        setValue("vendedorAsignado", resolveUsuarioId(cliente.vendedorAsignado));
      }
    };
    cargarUsuariosDisponibles();
  }, [obtenerUsuariosPorRol, obtenerUsuarios, cliente, setValue]);

  const condicionPago = watch("condicionPago");

  const handleFormSubmit = async (data) => {
    const result = await onSubmit(data);
    if (!result.error) {
      if (!isEditing) {
        reset();
        toast.success("Cliente creado correctamente");
      } else {
        toast.success("Cliente actualizado correctamente");
      }
    } else {
      toast.error(result.message || "Error al procesar cliente");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 animate-slideUp">
        {/* Grid Layout */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Nombre - Full Width */}
          <div className="sm:col-span-2">
            <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nombre del Cliente *
            </label>
            <input
              id="nombre"
              type="text"
              placeholder="Ej: Empresa ABC S.A."
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

          {/* Contacto y Teléfono */}
          <div>
            <label htmlFor="nombreContacto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nombre Contacto
            </label>
            <input
              id="nombreContacto"
              type="text"
              placeholder="Contacto principal"
              {...register("nombreContacto")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.nombreContacto ? "border-red-500" : ""
              }`}
            />
            {errors.nombreContacto && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombreContacto.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="telefonoContacto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Teléfono Contacto
            </label>
            <input
              id="telefonoContacto"
              type="text"
              placeholder="+502 xxxx xxxx"
              {...register("telefonoContacto")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.telefonoContacto ? "border-red-500" : ""
              }`}
            />
            {errors.telefonoContacto && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.telefonoContacto.message}</p>
            )}
          </div>

          {/* Email Contacto - Full Width */}
          <div className="sm:col-span-2">
            <label htmlFor="correoContacto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Correo Contacto
            </label>
            <input
              id="correoContacto"
              type="email"
              placeholder="contacto@empresa.com"
              {...register("correoContacto")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.correoContacto ? "border-red-500" : ""
              }`}
            />
            {errors.correoContacto && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.correoContacto.message}</p>
            )}
          </div>

          {/* Documento */}
          <div>
            <label htmlFor="tipoDocumento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tipo de Documento *
            </label>
            <select
              id="tipoDocumento"
              {...register("tipoDocumento")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.tipoDocumento ? "border-red-500" : ""
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
              placeholder="Número"
              {...register("numeroDocumento")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.numeroDocumento ? "border-red-500" : ""
              }`}
            />
            {errors.numeroDocumento && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.numeroDocumento.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="nit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              NIT
            </label>
            <input
              id="nit"
              type="text"
              placeholder="NIT"
              {...register("nit")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.nit ? "border-red-500" : ""
              }`}
            />
            {errors.nit && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nit.message}</p>
            )}
          </div>

          {/* Contacto Principal */}
          <div>
            <label htmlFor="correo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Correo Principal *
            </label>
            <input
              id="correo"
              type="email"
              placeholder="empresa@ejemplo.com"
              {...register("correo")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.correo ? "border-red-500" : ""
              }`}
            />
            {errors.correo && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.correo.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Teléfono Principal *
            </label>
            <input
              id="telefono"
              type="text"
              placeholder="+502 xxxx xxxx"
              {...register("telefono")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.telefono ? "border-red-500" : ""
              }`}
            />
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.telefono.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="telefonoSecundario" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Teléfono Secundario
            </label>
            <input
              id="telefonoSecundario"
              type="text"
              placeholder="+502 xxxx xxxx"
              {...register("telefonoSecundario")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.telefonoSecundario ? "border-red-500" : ""
              }`}
            />
            {errors.telefonoSecundario && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.telefonoSecundario.message}</p>
            )}
          </div>

          {/* Ubicación */}
          <div className="sm:col-span-2">
            <label htmlFor="direccion" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Dirección *
            </label>
            <input
              id="direccion"
              type="text"
              placeholder="Calle principal #123"
              {...register("direccion")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.direccion ? "border-red-500" : ""
              }`}
            />
            {errors.direccion && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.direccion.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ciudad" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Ciudad *
            </label>
            <input
              id="ciudad"
              type="text"
              placeholder="Ciudad"
              {...register("ciudad")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.ciudad ? "border-red-500" : ""
              }`}
            />
            {errors.ciudad && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.ciudad.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="departamento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Departamento *
            </label>
            <input
              id="departamento"
              type="text"
              placeholder="Departamento"
              {...register("departamento")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.departamento ? "border-red-500" : ""
              }`}
            />
            {errors.departamento && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.departamento.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="codigoPostal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Código Postal
            </label>
            <input
              id="codigoPostal"
              type="text"
              placeholder="Código postal"
              {...register("codigoPostal")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.codigoPostal ? "border-red-500" : ""
              }`}
            />
            {errors.codigoPostal && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.codigoPostal.message}</p>
            )}
          </div>

          {/* Condición de Pago */}
          <div>
            <label htmlFor="condicionPago" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Condición de Pago *
            </label>
            <select
              id="condicionPago"
              {...register("condicionPago")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.condicionPago ? "border-red-500" : ""
              }`}
            >
              <option value="CONTADO">Contado</option>
              <option value="CREDITO">Crédito</option>
            </select>
            {errors.condicionPago && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.condicionPago.message}</p>
            )}
          </div>

          {/* Crédito Condicional */}
          {condicionPago === "CREDITO" && (
            <>
              <div>
                <label htmlFor="diasCredito" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Días de Crédito
                </label>
                <input
                  id="diasCredito"
                  type="number"
                  placeholder="30"
                  {...register("diasCredito", { valueAsNumber: true })}
                  className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                    errors.diasCredito ? "border-red-500" : ""
                  }`}
                />
                {errors.diasCredito && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.diasCredito.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="limiteCreditoMes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Límite Crédito Mes
                </label>
                <input
                  id="limiteCreditoMes"
                  type="number"
                  placeholder="10000"
                  {...register("limiteCreditoMes", { valueAsNumber: true })}
                  className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                    errors.limiteCreditoMes ? "border-red-500" : ""
                  }`}
                />
                {errors.limiteCreditoMes && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.limiteCreditoMes.message}</p>
                )}
              </div>
            </>
          )}

          {/* Información Bancaria */}
          <div>
            <label htmlFor="banco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Banco
            </label>
            <input
              id="banco"
              type="text"
              placeholder="Nombre del banco"
              {...register("banco")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.banco ? "border-red-500" : ""
              }`}
            />
            {errors.banco && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.banco.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="numeroCuenta" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Número de Cuenta
            </label>
            <input
              id="numeroCuenta"
              type="text"
              placeholder="Número de cuenta"
              {...register("numeroCuenta")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.numeroCuenta ? "border-red-500" : ""
              }`}
            />
            {errors.numeroCuenta && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.numeroCuenta.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tipoCuenta" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tipo de Cuenta
            </label>
            <select
              id="tipoCuenta"
              {...register("tipoCuenta")}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                errors.tipoCuenta ? "border-red-500" : ""
              }`}
            >
              <option value="CORRIENTE">Corriente</option>
              <option value="AHORRO">Ahorro</option>
            </select>
            {errors.tipoCuenta && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tipoCuenta.message}</p>
            )}
          </div>

          {/* Asignaciones - Solo si Edita */}
          {isEditing && (
            <>
              <div>
                <label htmlFor="vendedorAsignado" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Asignar Vendedor
                </label>
                <select
                  id="vendedorAsignado"
                  {...register("vendedorAsignado")}
                  className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                    errors.vendedorAsignado ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Sin asignar Vendedor</option>
                  {vendedoresDisponibles.map((vendedor) => (
                    <option
                      key={vendedor.uid || vendedor._id || vendedor.id}
                      value={vendedor.uid || vendedor._id || vendedor.id}
                    >
                      {vendedor.nombre} {vendedor.apellido}
                    </option>
                  ))}
                </select>
                {errors.vendedorAsignado && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.vendedorAsignado.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="gerenteAsignado" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Asignar Gerente
                </label>
                <select
                  id="gerenteAsignado"
                  {...register("gerenteAsignado")}
                  className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-primary-600 dark:focus:ring-primary-500 transition-all ${
                    errors.gerenteAsignado ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Sin asignar Gerente</option>
                  {gerentesDisponibles.map((gerente) => (
                    <option
                      key={gerente.uid || gerente._id || gerente.id}
                      value={gerente.uid || gerente._id || gerente.id}
                    >
                      {gerente.nombre} {gerente.apellido}
                    </option>
                  ))}
                </select>
                {errors.gerenteAsignado && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gerenteAsignado.message}</p>
                )}
              </div>
            </>
          )}
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
              "Actualizar Cliente"
            ) : (
              "Crear Cliente"
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
}
