import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cobrosCrearSchema, cobrosEditarSchema } from "../../utils/cobrosValidators";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CobroForm = ({ cobro = null, onSubmit, loading = false, onCancel, facturas = [], clientes = [] }) => {
  const isEditing = !!cobro;
  const schema = isEditing ? cobrosEditarSchema : cobrosCrearSchema;
  const [selectedFactura, setSelectedFactura] = useState("");
  const [clienteInfo, setClienteInfo] = useState(null);
  const [montoFactura, setMontoFactura] = useState(0);
  const [netoCobrado, setNetoCobrado] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      numeroComprobante: "",
      facturaPorCobrarId: "",
      montoCobrado: 0,
      metodoPago: "TRANSFERENCIA",
      comision: 0,
      fechaCobro: new Date().toISOString().split('T')[0],
      referencia: "",
      descripcion: "",
    },
  });

  // Efecto para inicializar valores en modo edición
  useEffect(() => {
    if (isEditing && cobro) {
      // Extraer IDs de la factura y cliente
      const facturaId = cobro.facturaPorCobrar?.id || cobro.facturaPorCobrar?._id || cobro.facturaPorCobrar;
      const clienteId = cobro.cliente?.id || cobro.cliente?._id || cobro.cliente;
      
      // Si la factura viene poblada del backend, usarla directamente
      let facturaPoblada = null;
      if (cobro.facturaPorCobrar && typeof cobro.facturaPorCobrar === 'object' && cobro.facturaPorCobrar.monto) {
        facturaPoblada = cobro.facturaPorCobrar;
        setSelectedFactura(facturaId);
        // Usar el monto guardado en el cobro (monto histórico), no el monto actual de la factura
        setMontoFactura(cobro.montoFactura || facturaPoblada.monto || 0);
      } else {
        // Si no está poblada, buscar en el array de facturas
        if (facturaId) {
          setSelectedFactura(facturaId);
          const factura = facturas.find(f => {
            const fId = f.id || f._id;
            return fId && fId.toString() === facturaId.toString();
          });
          if (factura) {
            setMontoFactura(cobro.montoFactura || factura.monto || 0);
          }
        }
      }

      // Si el cliente viene poblado del backend, usarlo directamente
      if (cobro.cliente && typeof cobro.cliente === 'object' && cobro.cliente.nombre) {
        setClienteInfo(cobro.cliente);
      } else {
        // Si no está poblado, buscar en el array de clientes
        if (clienteId) {
          const cliente = clientes.find(c => {
            const cId = c.id || c._id;
            return cId && cId.toString() === clienteId.toString();
          });
          if (cliente) {
            setClienteInfo(cliente);
          }
        }
      }

      // Setear valores del formulario
      setValue("numeroComprobante", cobro.numeroComprobante || "");
      setValue("facturaPorCobrarId", facturaId || "");
      setValue("montoCobrado", cobro.montoCobrado || 0);
      setValue("metodoPago", cobro.metodoPago || "TRANSFERENCIA");
      setValue("comision", cobro.comision || 0);
      setValue("fechaCobro", cobro.fechaCobro ? new Date(cobro.fechaCobro).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      setValue("referencia", cobro.referencia || "");
      setValue("descripcion", cobro.descripcion || "");
      
      // Calcular y setear netoCobrado inicial
      const neto = (cobro.montoCobrado || 0) - (cobro.comision || 0);
      setNetoCobrado(neto);
    } else {
      // Modo creación - resetear valores
      reset();
      setSelectedFactura("");
      setClienteInfo(null);
      setMontoFactura(0);
      setNetoCobrado(0);
    }
  }, [cobro, isEditing, facturas, clientes, setValue, reset]);

  const montoCobradoValue = watch("montoCobrado");
  const comisionValue = watch("comision");

  // Calcular netoCobrado automáticamente cuando cambian montoCobrado o comision
  useEffect(() => {
    const neto = (parseFloat(montoCobradoValue) || 0) - (parseFloat(comisionValue) || 0);
    setNetoCobrado(neto);
  }, [montoCobradoValue, comisionValue]);

  // Cuando se selecciona una factura, auto-llenar cliente y montoFactura
  const handleFacturaChange = (e) => {
    const facturaId = e.target.value;
    setSelectedFactura(facturaId);
    setValue("facturaPorCobrarId", facturaId, { shouldValidate: true });

    if (facturaId) {
      // Buscar la factura en el array
      const factura = facturas.find(f => {
        const fId = f.id || f._id;
        return fId && fId.toString() === facturaId.toString();
      });

      if (factura) {
        // Obtener el ID del cliente de la factura
        const clienteIdFromFactura = factura.cliente?.id || factura.cliente?._id || factura.cliente;
        
        // Buscar el cliente
        const cliente = clientes.find(c => {
          const cId = c.id || c._id;
          return cId && cId.toString() === clienteIdFromFactura.toString();
        });

        if (cliente) {
          setClienteInfo(cliente);
        } else {
          setClienteInfo(null);
        }

        // Establecer monto factura
        setMontoFactura(factura.monto || 0);
      } else {
        setClienteInfo(null);
        setMontoFactura(0);
      }
    } else {
      setClienteInfo(null);
      setMontoFactura(0);
    }
  };

  const handleFormSubmit = async (data) => {
    if (!isEditing && !data.facturaPorCobrarId) {
      toast.error("Debe seleccionar una factura");
      return;
    }

    // Validar que montoCobrado no supere montoFactura
    if (parseFloat(data.montoCobrado) > montoFactura) {
      toast.error(`El monto cobrado no puede superar ${montoFactura}`);
      return;
    }

    let datosEnvio;
    
    if (isEditing) {
      // En edición solo se envían los campos que se pueden actualizar
      datosEnvio = {
        montoCobrado: parseFloat(data.montoCobrado),
        metodoPago: data.metodoPago,
        fechaCobro: data.fechaCobro,
        referencia: data.referencia,
        comision: data.comision ? parseFloat(data.comision) : 0,
        descripcion: data.descripcion,
      };
    } else {
      // En creación se envían todos los campos
      datosEnvio = {
        numeroComprobante: data.numeroComprobante,
        facturaPorCobrarId: data.facturaPorCobrarId,
        clienteId: clienteInfo?.id || clienteInfo?._id,
        montoFactura: montoFactura,
        montoCobrado: parseFloat(data.montoCobrado),
        moneda: "GTQ",
        metodoPago: data.metodoPago,
        fechaCobro: data.fechaCobro,
        referencia: data.referencia,
        comision: data.comision ? parseFloat(data.comision) : 0,
        descripcion: data.descripcion,
      };
    }

    let result;
    if (isEditing) {
      result = await onSubmit({ datosEnvio, cobroId: cobro._id });
    } else {
      result = await onSubmit(datosEnvio);
    }

    if (result !== false) {
      if (!isEditing) {
        reset();
        setSelectedFactura("");
        setClienteInfo(null);
        setMontoFactura(0);
        toast.success("Cobro creado correctamente");
      } else {
        toast.success("Cobro actualizado correctamente");
      }
    } else {
      toast.error("Error al procesar cobro");
    }
  };

  // ==================== FORMULARIO DE CREAR ====================
  if (!isEditing) {
    return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Factura */}
          <div className="flex flex-col">
            <label htmlFor="facturaPorCobrarId" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
              Factura * ({facturas.length} disponibles)
            </label>
            {facturas.length === 0 ? (
              <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200 text-sm font-medium">
                No hay facturas por cobrar disponibles
              </div>
            ) : (
              <select
                id="facturaPorCobrarId"
                value={selectedFactura}
                onChange={handleFacturaChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border ${errors.facturaPorCobrarId ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-gray-200`}
              >
                <option value="">Seleccionar factura...</option>
                {facturas.map((f) => (
                  <option key={f.id || f._id} value={f.id || f._id}>
                    {f.numeroFactura} - Q {f.monto.toFixed(2)}
                  </option>
                ))}
              </select>
            )}
            {errors.facturaPorCobrarId && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.facturaPorCobrarId.message}</span>}
          </div>

          {/* Cliente */}
          <div className="flex flex-col">
            <label htmlFor="cliente" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
              Cliente
            </label>
            <input
              id="cliente"
              type="text"
              value={clienteInfo?.nombre || ""}
              disabled
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-gray-400 cursor-not-allowed"
              placeholder="Se auto-rellena al seleccionar factura"
            />
          </div>

          {/* Monto Factura */}
          <div className="flex flex-col">
            <label htmlFor="montoFactura" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
              Monto Factura
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">Q</span>
              <input
                id="montoFactura"
                type="number"
                step="0.01"
                value={montoFactura}
                disabled
                className="w-full pl-8 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-gray-400 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {/* Número Comprobante */}
          <div className="flex flex-col">
            <label htmlFor="numeroComprobante" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
              Número de Comprobante *
            </label>
            <input
              id="numeroComprobante"
              type="text"
              placeholder="Ej: COMB-001"
              {...register("numeroComprobante")}
              className={`w-full px-4 py-2.5 bg-white dark:bg-gray-700 border ${errors.numeroComprobante ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white`}
            />
            {errors.numeroComprobante && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.numeroComprobante.message}</span>}
          </div>

          {/* Monto Cobrado */}
          <div className="flex flex-col">
            <label htmlFor="montoCobrado" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
              Monto Cobrado *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">Q</span>
              <input
                id="montoCobrado"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("montoCobrado", { valueAsNumber: true })}
                className={`w-full pl-8 pr-4 py-2.5 bg-white dark:bg-gray-700 border ${errors.montoCobrado ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white font-bold`}
              />
            </div>
            {errors.montoCobrado && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.montoCobrado.message}</span>}
          </div>

          {/* Comisión */}
          <div className="flex flex-col">
            <label htmlFor="comision" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
              Comisión Bancaria/Pasarela
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">Q</span>
              <input
                id="comision"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("comision", { valueAsNumber: true })}
                className={`w-full pl-8 pr-4 py-2.5 bg-white dark:bg-gray-700 border ${errors.comision ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white`}
              />
            </div>
            {errors.comision && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.comision.message}</span>}
          </div>

          {/* Neto Cobrado */}
          <div className="flex flex-col">
            <label htmlFor="netoCobrado" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
              Neto Cobrado Real
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 font-bold">Q</span>
              <input
                id="netoCobrado"
                type="number"
                step="0.01"
                value={netoCobrado.toFixed(2)}
                disabled
                className="w-full pl-8 pr-4 py-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg text-black dark:text-green-400 cursor-not-allowed font-bold"
              />
            </div>
          </div>

          {/* Método Pago */}
          <div className="flex flex-col">
            <label htmlFor="metodoPago" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
              Método de Pago *
            </label>
            <select
              id="metodoPago"
              {...register("metodoPago")}
              className={`w-full px-4 py-2.5 bg-white dark:bg-gray-700 border ${errors.metodoPago ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white`}
            >
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="CHEQUE">Cheque</option>
              <option value="TARJETA">Tarjeta</option>
            </select>
            {errors.metodoPago && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.metodoPago.message}</span>}
          </div>

          {/* Fecha Cobro */}
          <div className="flex flex-col">
            <label htmlFor="fechaCobro" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
              Fecha de Cobro *
            </label>
            <input
              id="fechaCobro"
              type="date"
              {...register("fechaCobro")}
              className={`w-full px-4 py-2.5 bg-white dark:bg-gray-700 border ${errors.fechaCobro ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white`}
            />
            {errors.fechaCobro && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.fechaCobro.message}</span>}
          </div>

          {/* Referencia */}
          <div className="flex flex-col">
            <label htmlFor="referencia" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
              Referencia (Opcional)
            </label>
            <input
              id="referencia"
              type="text"
              placeholder="ID Transacción, No. Cheque..."
              {...register("referencia")}
              maxLength="100"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white"
            />
            <span className="text-xs text-black dark:text-gray-400 mt-1">TRF-001, CHQ-478, etc.</span>
          </div>

          {/* Descripción */}
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="descripcion" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
              Descripción / Detalles
            </label>
            <textarea
              id="descripcion"
              placeholder="Ej: Cobro por venta de mercadería, Pago parcial de factura, Ajuste de comisión..."
              {...register("descripcion")}
              rows="3"
              maxLength="300"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white resize-none"
            />
            <span className="text-xs text-black dark:text-gray-400 mt-1">Notas adicionales del cobro (máx. 300 caracteres)</span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
          {onCancel && (
            <button 
              type="button" 
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg transition-all dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600" 
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
          <button 
            type="submit" 
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Creando...
              </>
            ) : "Crear Cobro"}
          </button>
        </div>
      </form>
    );
  }

  // ==================== FORMULARIO DE EDITAR ====================
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded text-yellow-800 dark:text-yellow-200 text-sm mb-4">
        <strong>Estás editando un cobro existente.</strong> La factura y el comprobante no pueden modificarse por seguridad.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Monto Cobrado */}
        <div className="flex flex-col">
          <label htmlFor="montoCobrado" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
            Monto Cobrado *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">Q</span>
            <input
              id="montoCobrado"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("montoCobrado", { valueAsNumber: true })}
              className={`w-full pl-8 pr-4 py-2.5 bg-white dark:bg-gray-700 border ${errors.montoCobrado ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white font-bold`}
            />
          </div>
          {errors.montoCobrado && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.montoCobrado.message}</span>}
        </div>

        {/* Comisión */}
        <div className="flex flex-col">
          <label htmlFor="comision" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
            Comisión Bancaria/Pasarela
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">Q</span>
            <input
              id="comision"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("comision", { valueAsNumber: true })}
              className={`w-full pl-8 pr-4 py-2.5 bg-white dark:bg-gray-700 border ${errors.comision ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white`}
            />
          </div>
          {errors.comision && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.comision.message}</span>}
        </div>

        {/* Neto Cobrado */}
        <div className="flex flex-col">
          <label htmlFor="netoCobrado" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
            Neto Cobrado Real
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 font-bold">Q</span>
            <input
              id="netoCobrado"
              type="number"
              step="0.01"
              value={netoCobrado.toFixed(2)}
              disabled
              className="w-full pl-8 pr-4 py-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg text-black dark:text-green-400 cursor-not-allowed font-bold"
            />
          </div>
        </div>

        {/* Método Pago */}
        <div className="flex flex-col">
          <label htmlFor="metodoPago" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
            Método de Pago *
          </label>
          <select
            id="metodoPago"
            {...register("metodoPago")}
            className={`w-full px-4 py-2.5 bg-white dark:bg-gray-700 border ${errors.metodoPago ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white`}
          >
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="CHEQUE">Cheque</option>
            <option value="TARJETA">Tarjeta</option>
          </select>
          {errors.metodoPago && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.metodoPago.message}</span>}
        </div>

        {/* Fecha Cobro */}
        <div className="flex flex-col">
          <label htmlFor="fechaCobro" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
            Fecha de Cobro *
          </label>
          <input
            id="fechaCobro"
            type="date"
            {...register("fechaCobro")}
            className={`w-full px-4 py-2.5 bg-white dark:bg-gray-700 border ${errors.fechaCobro ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white`}
          />
          {errors.fechaCobro && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.fechaCobro.message}</span>}
        </div>

        {/* Referencia */}
        <div className="flex flex-col">
          <label htmlFor="referencia" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
            Referencia (Opcional)
          </label>
          <input
            id="referencia"
            type="text"
            placeholder="ID Transacción, No. Cheque..."
            {...register("referencia")}
            maxLength="100"
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white"
          />
          <span className="text-xs text-black dark:text-gray-400 mt-1">TRF-001, CHQ-478, etc.</span>
        </div>

        {/* Descripción */}
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="descripcion" className="block text-sm font-semibold text-black dark:text-gray-300 mb-1">
            Descripción / Detalles
          </label>
          <textarea
            id="descripcion"
            placeholder="Ej: Cobro por venta de mercadería, Pago parcial de factura, Ajuste de comisión..."
            {...register("descripcion")}
            rows="3"
            maxLength="300"
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white resize-none"
          />
          <span className="text-xs text-black dark:text-gray-400 mt-1">Notas adicionales del cobro (máx. 300 caracteres)</span>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <button 
            type="button" 
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg transition-all dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600" 
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
        <button 
          type="submit" 
          className="px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(202,138,4,0.4)] hover:shadow-[0_0_20px_rgba(202,138,4,0.6)] transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Actualizando...
            </>
          ) : "💾 Guardar Cambios"}
        </button>
      </div>
    </form>
  );
};
