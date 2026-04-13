import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cobrosCrearSchema, cobrosEditarSchema } from "../../utils/cobrosValidators";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "./cobroForm.css";

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
      console.log("Inicializando formulario para edición con cobro:", cobro);
      
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
        console.log("Factura seleccionada:", factura);
        
        // Obtener el ID del cliente de la factura
        const clienteIdFromFactura = factura.cliente?.id || factura.cliente?._id || factura.cliente;
        
        console.log("Buscando cliente con ID:", clienteIdFromFactura);
        console.log("Clientes disponibles:", clientes);

        // Buscar el cliente
        const cliente = clientes.find(c => {
          const cId = c.id || c._id;
          return cId && cId.toString() === clienteIdFromFactura.toString();
        });

        if (cliente) {
          console.log("Cliente encontrado:", cliente);
          setClienteInfo(cliente);
        } else {
          console.warn("Cliente NO encontrado con ID:", clienteIdFromFactura);
          setClienteInfo(null);
        }

        // Establecer monto factura
        setMontoFactura(factura.monto || 0);
      } else {
        console.warn("Factura NO encontrada con ID:", facturaId);
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

    console.log("Datos finales a enviar:", datosEnvio);

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
      <form onSubmit={handleSubmit(handleFormSubmit)} className="cobro-form">
        <h3>Crear Nuevo Cobro</h3>
        
        {/* FILA 1: Factura y Cliente */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="facturaPorCobrarId">Factura * ({facturas.length} disponibles)</label>
            {facturas.length === 0 ? (
              <div className="input-warning">
                ⚠️ No hay facturas por cobrar disponibles
              </div>
            ) : (
              <select
                id="facturaPorCobrarId"
                value={selectedFactura}
                onChange={handleFacturaChange}
                className={errors.facturaPorCobrarId ? "input-error" : ""}
              >
                <option value="">Seleccionar factura...</option>
                {facturas.map((f) => (
                  <option key={f.id || f._id} value={f.id || f._id}>
                    {f.numeroFactura} - Q {f.monto.toFixed(2)}
                  </option>
                ))}
              </select>
            )}
            {errors.facturaPorCobrarId && <span className="error-msg">{errors.facturaPorCobrarId.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cliente">Cliente {clienteInfo ? "✓" : ""}</label>
            <input
              id="cliente"
              type="text"
              value={clienteInfo?.nombre || ""}
              disabled
              className="input-readonly"
              placeholder="Se auto-rellena al seleccionar factura"
            />
          </div>
        </div>

        {/* FILA 2: Monto Factura y Número Comprobante */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="montoFactura">Monto Factura</label>
            <input
              id="montoFactura"
              type="number"
              step="0.01"
              value={montoFactura}
              disabled
              className="input-readonly"
            />
          </div>

          <div className="form-group">
            <label htmlFor="numeroComprobante">Número Comprobante *</label>
            <input
              id="numeroComprobante"
              type="text"
              placeholder="Ej: COMB-001"
              {...register("numeroComprobante")}
              className={errors.numeroComprobante ? "input-error" : ""}
            />
            {errors.numeroComprobante && <span className="error-msg">{errors.numeroComprobante.message}</span>}
          </div>
        </div>

        {/* FILA 3: Monto Cobrado y Comisión */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="montoCobrado">Monto Cobrado *</label>
            <input
              id="montoCobrado"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("montoCobrado", { valueAsNumber: true })}
              className={errors.montoCobrado ? "input-error" : ""}
            />
            {errors.montoCobrado && <span className="error-msg">{errors.montoCobrado.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="comision">Comisión</label>
            <input
              id="comision"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("comision", { valueAsNumber: true })}
              className={errors.comision ? "input-error" : ""}
            />
            {errors.comision && <span className="error-msg">{errors.comision.message}</span>}
          </div>
        </div>

        {/* FILA 4: Neto Cobrado y Método Pago */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="netoCobrado">Neto Cobrado</label>
            <input
              id="netoCobrado"
              type="number"
              step="0.01"
              value={netoCobrado.toFixed(2)}
              disabled
              className="input-readonly"
            />
          </div>

          <div className="form-group">
            <label htmlFor="metodoPago">Método Pago *</label>
            <select
              id="metodoPago"
              {...register("metodoPago")}
              className={errors.metodoPago ? "input-error" : ""}
            >
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="CHEQUE">Cheque</option>
              <option value="TARJETA">Tarjeta</option>
            </select>
            {errors.metodoPago && <span className="error-msg">{errors.metodoPago.message}</span>}
          </div>
        </div>

        {/* FILA 5: Fecha Cobro y Referencia */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fechaCobro">Fecha Cobro *</label>
            <input
              id="fechaCobro"
              type="date"
              {...register("fechaCobro")}
              className={errors.fechaCobro ? "input-error" : ""}
            />
            {errors.fechaCobro && <span className="error-msg">{errors.fechaCobro.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="referencia">Referencia (Transacción/Cheque)</label>
            <input
              id="referencia"
              type="text"
              placeholder="Ej: TRF-2026-002, CHQ-478, REF-12345"
              {...register("referencia")}
              maxLength="100"
            />
            <small className="field-hint">ID de transferencia, número de cheque, etc.</small>
          </div>
        </div>

        {/* FILA 6: Descripción */}
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="descripcion">Descripción (Detalles del Cobro)</label>
            <textarea
              id="descripcion"
              placeholder="Ej: Cobro por venta de mercadería, Pago parcial de factura, Ajuste de comisión..."
              {...register("descripcion")}
              rows="3"
              maxLength="300"
            />
            <small className="field-hint">Notas adicionales del cobro (máx. 300 caracteres)</small>
          </div>
        </div>

        {/* Botones */}
        <div className="form-row full-width">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Cobro"}
          </button>
          {onCancel && (
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    );
  }

  // ==================== FORMULARIO DE EDITAR ====================
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="cobro-form">
      <h3>Actualizar Cobro</h3>

      {/* FILA 1: Monto Cobrado y Comisión */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="montoCobrado">Monto Cobrado *</label>
          <input
            id="montoCobrado"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("montoCobrado", { valueAsNumber: true })}
            className={errors.montoCobrado ? "input-error" : ""}
          />
          {errors.montoCobrado && <span className="error-msg">{errors.montoCobrado.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="comision">Comisión</label>
          <input
            id="comision"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("comision", { valueAsNumber: true })}
            className={errors.comision ? "input-error" : ""}
          />
          {errors.comision && <span className="error-msg">{errors.comision.message}</span>}
        </div>
      </div>

      {/* FILA 2: Neto Cobrado y Método Pago */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="netoCobrado">Neto Cobrado</label>
          <input
            id="netoCobrado"
            type="number"
            step="0.01"
            value={netoCobrado.toFixed(2)}
            disabled
            className="input-readonly"
          />
        </div>

        <div className="form-group">
          <label htmlFor="metodoPago">Método Pago *</label>
          <select
            id="metodoPago"
            {...register("metodoPago")}
            className={errors.metodoPago ? "input-error" : ""}
          >
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="CHEQUE">Cheque</option>
            <option value="TARJETA">Tarjeta</option>
          </select>
          {errors.metodoPago && <span className="error-msg">{errors.metodoPago.message}</span>}
        </div>
      </div>

      {/* FILA 3: Fecha Cobro y Referencia */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fechaCobro">Fecha Cobro *</label>
          <input
            id="fechaCobro"
            type="date"
            {...register("fechaCobro")}
            className={errors.fechaCobro ? "input-error" : ""}
          />
          {errors.fechaCobro && <span className="error-msg">{errors.fechaCobro.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="referencia">Referencia (Transacción/Cheque)</label>
          <input
            id="referencia"
            type="text"
            placeholder="Ej: TRF-2026-002, CHQ-478, REF-12345"
            {...register("referencia")}
            maxLength="100"
          />
          <small className="field-hint">ID de transferencia, número de cheque, etc.</small>
        </div>
      </div>

      {/* FILA 4: Descripción */}
      <div className="form-row">
        <div className="form-group full-width">
          <label htmlFor="descripcion">Descripción (Detalles del Cobro)</label>
          <textarea
            id="descripcion"
            placeholder="Ej: Cobro por venta de mercadería, Pago parcial de factura, Ajuste de comisión..."
            {...register("descripcion")}
            rows="3"
            maxLength="300"
          />
          <small className="field-hint">Notas adicionales del cobro (máx. 300 caracteres)</small>
        </div>
      </div>

      {/* Botones */}
      <div className="form-row full-width">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar Cobro"}
        </button>
        {onCancel && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
