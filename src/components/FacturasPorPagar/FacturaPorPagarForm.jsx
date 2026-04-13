import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { facturaPorPagarCrearSchema, facturaPorPagarEditarSchema } from "../../shared/validadores/facturaPorPagarValidators";
import { useProveedores } from "../../shared/hooks/useProveedores";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import "./facturaPorPagarForm.css";

export const FacturaPorPagarForm = ({ factura = null, onSubmit, loading = false }) => {
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="factura-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="proveedorId">Proveedor *</label>
          {isEditing && proveedorActual ? (
            <div className="proveedor-display">
              <p className="proveedor-info">
                <strong>{proveedorActual.nombre}</strong>
              </p>
              <p className="proveedor-documento">{proveedorActual.numeroDocumento}</p>
              <small className="proveedor-note">No se puede cambiar el proveedor en edición</small>
            </div>
          ) : (
            <select
              id="proveedorId"
              value={selectedProveedor}
              onChange={handleProveedorChange}
              className={errors.proveedorId ? "input-error" : ""}
              disabled={loadingProveedores || isEditing}
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
          {errors.proveedorId && <span className="error-msg">{errors.proveedorId.message}</span>}
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
            <option value="PAGADA">Pagada</option>
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

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? "Guardando..." : isEditing ? "Actualizar Factura" : "Crear Factura"}
      </button>
    </form>
  );
};
