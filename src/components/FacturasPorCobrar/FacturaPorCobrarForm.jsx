import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { facturaPorCobrarCrearSchema, facturaPorCobrarEditarSchema } from "../../utils/facturaPorCobrarValidators";
import { useClientes } from "../../shared/hooks/useClientes";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export const FacturaPorCobrarForm = ({ factura = null, onSubmit, loading = false, onCancel }) => {
  const isEditing = !!factura;
  const schema = isEditing ? facturaPorCobrarEditarSchema : facturaPorCobrarCrearSchema;
  const { clientes, obtenerClientes } = useClientes();
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [clienteActual, setClienteActual] = useState(null); // Para mostrar el cliente actual en edición

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: isEditing ? {
      clienteId: factura.cliente?._id || factura.cliente?.id || factura.cliente || "",
      numeroFactura: factura.numeroFactura || "",
      fechaEmision: factura.fechaEmision ? new Date(factura.fechaEmision).toISOString().split('T')[0] : "",
      fechaVencimiento: factura.fechaVencimiento ? new Date(factura.fechaVencimiento).toISOString().split('T')[0] : "",
      monto: factura.monto || 0,
      moneda: factura.moneda || "GTQ",
      estado: factura.estado || "PENDIENTE",
      descripcion: factura.descripcion || "",
    } : {
      clienteId: "",
      numeroFactura: "",
      fechaEmision: new Date().toISOString().split('T')[0],
      fechaVencimiento: "",
      monto: 0,
      moneda: "GTQ",
      estado: "PENDIENTE",
      descripcion: "",
    },
  });

  useEffect(() => {
    const cargarClientes = async () => {
      setLoadingClientes(true);
      await obtenerClientes();
      setLoadingClientes(false);
    };
    cargarClientes();
  }, [obtenerClientes]);

  // Cuando está editando, establecer el cliente actual
  useEffect(() => {
    if (isEditing && factura && clientes.length > 0) {
      const clienteId = factura.cliente?._id || factura.cliente?.id || factura.cliente;
      const clienteEncontrado = clientes.find(c => (c.id || c._id) === clienteId);
      
      if (clienteEncontrado) {
        setSelectedCliente(clienteId);
        setClienteActual(clienteEncontrado);
        setValue("clienteId", clienteId);
      }
    }
  }, [isEditing, factura, clientes, setValue]);

  const handleClienteChange = (e) => {
    const selectedId = e.target.value;

    setSelectedCliente(selectedId);
    setValue("clienteId", selectedId, { shouldValidate: true });
  };

  const handleFormSubmit = async (data) => {
    if (!isEditing && !data.clienteId) {
      toast.error("Debe seleccionar un cliente");
      return;
    }

    const datosEnvio = {
      numeroFactura: data.numeroFactura,
      monto: parseFloat(data.monto),
      moneda: data.moneda,
      estado: data.estado || "PENDIENTE",
      fechaEmision: data.fechaEmision,
      fechaVencimiento: data.fechaVencimiento,
      descripcion: data.descripcion,
    };

    if (!isEditing) {
      datosEnvio.cliente = data.clienteId;
    }

    let result;
    if (isEditing) {
      result = await onSubmit(factura._id, datosEnvio);
    } else {
      result = await onSubmit(datosEnvio);
    }
    
    if (result !== false) {
      if (!isEditing) {
        reset();
        setSelectedCliente("");
        toast.success("Factura creada correctamente");
      } else {
        toast.success("Factura actualizada correctamente");
      }
    } else {
      toast.error("Error al procesar factura");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 animate-slideUp">
      {/* Grid Layout */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {/* Cliente - Full Width */}
        <div className="sm:col-span-2">
          <label htmlFor="clienteId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Cliente *
          </label>
          {isEditing && clienteActual ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
              <p className="font-semibold text-gray-900 dark:text-white">{clienteActual.nombre}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{clienteActual.numeroDocumento}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">No se puede cambiar el cliente en edición</p>
            </div>
          ) : (
            <select
              id="clienteId"
              value={selectedCliente}
              onChange={handleClienteChange}
              disabled={loadingClientes || isEditing}
              className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
                errors.clienteId 
                  ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                  : "border-gray-300"
              }`}
            >
              <option value="">Seleccionar cliente...</option>
              {!loadingClientes && clientes.length > 0 && (
                clientes.map((c) => (
                  <option key={c.id || c._id} value={c.id || c._id}>
                    {c.nombre} - {c.numeroDocumento}
                  </option>
                ))
              )}
              {!loadingClientes && clientes.length === 0 && (
                <option disabled>No hay clientes disponibles</option>
              )}
              {loadingClientes && (
                <option disabled>Cargando clientes...</option>
              )}
            </select>
          )}
          {errors.clienteId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clienteId.message}</p>
          )}
        </div>

        {/* Número Factura */}
        <div>
          <label htmlFor="numeroFactura" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Número Factura *
          </label>
          <input
            id="numeroFactura"
            type="text"
            placeholder="Ej: FAC-2024-001"
            {...register("numeroFactura")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.numeroFactura 
                ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                : "border-gray-300"
            }`}
          />
          {errors.numeroFactura && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.numeroFactura.message}</p>
          )}
        </div>

        {/* Monto */}
        <div>
          <label htmlFor="monto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Monto *
          </label>
          <input
            id="monto"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("monto", { valueAsNumber: true })}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.monto 
                ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                : "border-gray-300"
            }`}
          />
          {errors.monto && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.monto.message}</p>
          )}
        </div>

        {/* Fecha Emisión */}
        <div>
          <label htmlFor="fechaEmision" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Fecha Emisión *
          </label>
          <input
            id="fechaEmision"
            type="date"
            {...register("fechaEmision")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.fechaEmision 
                ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                : "border-gray-300"
            }`}
          />
          {errors.fechaEmision && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fechaEmision.message}</p>
          )}
        </div>

        {/* Fecha Vencimiento */}
        <div>
          <label htmlFor="fechaVencimiento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Fecha Vencimiento *
          </label>
          <input
            id="fechaVencimiento"
            type="date"
            {...register("fechaVencimiento")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.fechaVencimiento 
                ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                : "border-gray-300"
            }`}
          />
          {errors.fechaVencimiento && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fechaVencimiento.message}</p>
          )}
        </div>

        {/* Moneda */}
        <div>
          <label htmlFor="moneda" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Moneda *
          </label>
          <select
            id="moneda"
            {...register("moneda")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.moneda 
                ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                : "border-gray-300"
            }`}
          >
            <option value="GTQ">Quetzal (GTQ)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
          {errors.moneda && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.moneda.message}</p>
          )}
        </div>

        {/* Estado */}
        <div>
          <label htmlFor="estado" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Estado
          </label>
          <select
            id="estado"
            {...register("estado")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all ${
              errors.estado 
                ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                : "border-gray-300"
            }`}
          >
            <option value="PENDIENTE">Pendiente</option>
            <option value="PARCIAL">Parcial</option>
            <option value="COBRADA">Cobrada</option>
            <option value="VENCIDA">Vencida</option>
          </select>
          {errors.estado && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.estado.message}</p>
          )}
        </div>

        {/* Descripción - Full Width */}
        <div className="sm:col-span-2">
          <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Descripción
          </label>
          <textarea
            id="descripcion"
            placeholder="Descripción de la factura..."
            rows="4"
            {...register("descripcion")}
            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all resize-none ${
              errors.descripcion 
                ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                : "border-gray-300"
            }`}
          />
          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.descripcion.message}</p>
          )}
        </div>
      </div>

      {/* Buttons - Full Width */}
      <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          {loading ? "Guardando..." : isEditing ? "Actualizar Factura" : "Crear Factura"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
