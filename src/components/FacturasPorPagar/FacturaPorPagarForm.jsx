import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { facturaPorPagarCrearSchema, facturaPorPagarEditarSchema } from "../../shared/validadores/facturaPorPagarValidators";
import { useProveedores } from "../../shared/hooks/useProveedores";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export const FacturaPorPagarForm = ({ factura = null, onSubmit, loading = false, onCancel }) => {
  const isEditing = !!factura;
  const schema = isEditing ? facturaPorPagarEditarSchema : facturaPorPagarCrearSchema;
  const { proveedores, obtenerProveedores } = useProveedores();
  const [loadingProveedores, setLoadingProveedores] = useState(true);
  const [selectedProveedor, setSelectedProveedor] = useState(""); // Estado local para el proveedor
  const [proveedorActual, setProveedorActual] = useState(null); // Para mostrar el proveedor actual en edición

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
      proveedorId: factura.proveedor?._id || factura.proveedor?.id || factura.proveedor || "",
      numeroFactura: factura.numeroFactura || "",
      fechaEmision: factura.fechaEmision ? new Date(factura.fechaEmision).toISOString().split('T')[0] : "",
      fechaVencimiento: factura.fechaVencimiento ? new Date(factura.fechaVencimiento).toISOString().split('T')[0] : "",
      monto: factura.monto || 0,
      moneda: factura.moneda || "GTQ",
      estado: factura.estado || "PENDIENTE",
      descripcion: factura.descripcion || "",
    } : {
      proveedorId: "",
      numeroFactura: "",
      fechaEmision: new Date().toISOString().split('T')[0],
      fechaVencimiento: "",
      monto: 0,
      moneda: "GTQ",
      estado: "PENDIENTE",
      descripcion: "",
    },
  });

  // Cargar proveedores al montar el componente
  useEffect(() => {
    const cargarProveedores = async () => {
      setLoadingProveedores(true);
      await obtenerProveedores();
      setLoadingProveedores(false);
    };
    cargarProveedores();
  }, [obtenerProveedores]);

  // Cuando está editando, establecer el proveedor actual
  useEffect(() => {
    if (isEditing && factura && proveedores.length > 0) {
      const proveedorId = factura.proveedor?._id || factura.proveedor?.id || factura.proveedor;
      const proveedorEncontrado = proveedores.find(p => (p.id || p._id) === proveedorId);
      
      if (proveedorEncontrado) {
        setSelectedProveedor(proveedorId);
        setProveedorActual(proveedorEncontrado);
        setValue("proveedorId", proveedorId);
      }
    }
  }, [isEditing, factura, proveedores, setValue]);

  const handleProveedorChange = (e) => {
    const selectedId = e.target.value;
    const selectedText = e.target.options[e.target.selectedIndex]?.text || "";
    
    // Buscar directamente en el array por id o _id
    const found = proveedores.find(p => (p.id || p._id) === selectedId);
    
    // Actualizar tanto el estado local como el formulario de react-hook-form
    setSelectedProveedor(selectedId);
    setValue("proveedorId", selectedId, { shouldValidate: true });
  };

  const handleFormSubmit = async (data) => {
    // Validar que proveedor esté seleccionado en creación
    if (!isEditing && !data.proveedorId) {
      toast.error("Debe seleccionar un proveedor");
      return;
    }

    // Construir datos a enviar
    const datosEnvio = {
      numeroFactura: data.numeroFactura,
      monto: parseFloat(data.monto),
      moneda: data.moneda,
      estado: data.estado || "PENDIENTE",
      fechaEmision: data.fechaEmision,
      fechaVencimiento: data.fechaVencimiento,
      descripcion: data.descripcion,
    };

    // En creación, agregar el proveedor (usar el valor del formulario)
    if (!isEditing) {
      datosEnvio.proveedor = data.proveedorId;
    }
    
    const result = await onSubmit(datosEnvio);
    if (!result.error) {
      if (!isEditing) {
        reset();
        setSelectedProveedor("");
        toast.success("Factura creada correctamente");
      } else {
        toast.success("Factura actualizada correctamente");
      }
    } else {
      toast.error(result.message || "Error al procesar factura");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 animate-slideUp">
        {/* Grid Layout */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Proveedor */}
          <div className="sm:col-span-2">
            <label htmlFor="proveedorId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Proveedor *
            </label>
            {isEditing && proveedorActual ? (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                <p className="font-semibold text-gray-900 dark:text-white">{proveedorActual.nombre}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{proveedorActual.numeroDocumento}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">No se puede cambiar el proveedor en edición</p>
              </div>
            ) : (
              <select
                id="proveedorId"
                value={selectedProveedor}
                onChange={handleProveedorChange}
                disabled={loadingProveedores || isEditing}
                className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:border-primary-600 dark:border-gray-600 dark:focus:ring-primary-500 transition-all disabled:opacity-50 ${
                  errors.proveedorId 
                    ? "border-red-500 dark:border-red-500 focus:ring-red-500" 
                    : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar proveedor...</option>
                {!loadingProveedores && proveedores.length > 0 && (
                  proveedores.map((p) => (
                    <option key={p.id || p._id} value={p.id || p._id}>
                      {p.nombre} - {p.numeroDocumento}
                    </option>
                  ))
                )}
                {!loadingProveedores && proveedores.length === 0 && (
                  <option disabled>No hay proveedores disponibles</option>
                )}
                {loadingProveedores && (
                  <option disabled>Cargando proveedores...</option>
                )}
              </select>
            )}
            {errors.proveedorId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.proveedorId.message}</p>
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
              <option value="PAGADA">Pagada</option>
              <option value="VENCIDA">Vencida</option>
            </select>
            {errors.estado && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.estado.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="sm:col-span-2">
            <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Descripción
            </label>
            <textarea
              id="descripcion"
              placeholder="Descripción de la factura..."
              rows="3"
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

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-blue-500/30"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">...</span>
                Guardando...
              </>
            ) : isEditing ? (
              "Actualizar Factura"
            ) : (
              "Crear Factura"
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
