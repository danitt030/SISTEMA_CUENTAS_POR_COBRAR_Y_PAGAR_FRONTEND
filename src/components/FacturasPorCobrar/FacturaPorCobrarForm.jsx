import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { facturaPorCobrarCrearSchema, facturaPorCobrarEditarSchema } from "../../utils/facturaPorCobrarValidators";
import { useClientes } from "../../shared/hooks/useClientes";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import "./facturaPorCobrarForm.css";

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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="factura-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="clienteId">Cliente *</label>
          {isEditing && clienteActual ? (
            <div className="cliente-display">
              <p className="cliente-info">
                <strong>{clienteActual.nombre}</strong>
              </p>
              <p className="cliente-documento">{clienteActual.numeroDocumento}</p>
              <small className="cliente-note">No se puede cambiar el cliente en edición</small>
            </div>
          ) : (
            <select
              id="clienteId"
              value={selectedCliente}
              onChange={handleClienteChange}
              className={errors.clienteId ? "input-error" : ""}
              disabled={loadingClientes || isEditing}
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
          {errors.clienteId && <span className="error-msg">{errors.clienteId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="numeroFactura">Número Factura *</label>
          <input
            id="numeroFactura"
            type="text"
            placeholder="Ej: FAC-2024-001"
            {...register("numeroFactura")}
            className={errors.numeroFactura ? "input-error" : ""}
          />
          {errors.numeroFactura && <span className="error-msg">{errors.numeroFactura.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fechaEmision">Fecha Emisión *</label>
          <input
            id="fechaEmision"
            type="date"
            {...register("fechaEmision")}
            className={errors.fechaEmision ? "input-error" : ""}
          />
          {errors.fechaEmision && <span className="error-msg">{errors.fechaEmision.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="fechaVencimiento">Fecha Vencimiento *</label>
          <input
            id="fechaVencimiento"
            type="date"
            {...register("fechaVencimiento")}
            className={errors.fechaVencimiento ? "input-error" : ""}
          />
          {errors.fechaVencimiento && <span className="error-msg">{errors.fechaVencimiento.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="monto">Monto *</label>
          <input
            id="monto"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("monto", { valueAsNumber: true })}
            className={errors.monto ? "input-error" : ""}
          />
          {errors.monto && <span className="error-msg">{errors.monto.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="moneda">Moneda *</label>
          <select
            id="moneda"
            {...register("moneda")}
            className={errors.moneda ? "input-error" : ""}
          >
            <option value="GTQ">Quetzal (GTQ)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
          {errors.moneda && <span className="error-msg">{errors.moneda.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            {...register("estado")}
            className={errors.estado ? "input-error" : ""}
          >
            <option value="PENDIENTE">Pendiente</option>
            <option value="PARCIAL">Parcial</option>
            <option value="COBRADA">Cobrada</option>
            <option value="VENCIDA">Vencida</option>
          </select>
          {errors.estado && <span className="error-msg">{errors.estado.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group full-width">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            placeholder="Descripción de la factura..."
            {...register("descripcion")}
            rows="3"
          />
        </div>
      </div>

      <div className="form-row full-width">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Guardando..." : isEditing ? "Actualizar Factura" : "Crear Factura"}
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
