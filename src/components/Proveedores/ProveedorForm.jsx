import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { proveedorCrearSchema, proveedorEditarSchema } from "../../shared/validadores/proveedorValidators";
import toast from "react-hot-toast";
import { useEffect } from "react";
import "./proveedorForm.css";

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

  // Actualizar formulario cuando el proveedor a editar cambia
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="proveedor-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            type="text"
            placeholder="Nombre del proveedor"
            {...register("nombre")}
            className={errors.nombre ? "input-error" : ""}
          />
          {errors.nombre && <span className="error-msg">{errors.nombre.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nombreContacto">Nombre Contacto</label>
          <input
            id="nombreContacto"
            type="text"
            placeholder="Nombre del contacto"
            {...register("nombreContacto")}
            className={errors.nombreContacto ? "input-error" : ""}
          />
          {errors.nombreContacto && <span className="error-msg">{errors.nombreContacto.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="telefonoContacto">Teléfono Contacto</label>
          <input
            id="telefonoContacto"
            type="text"
            placeholder="Teléfono contacto"
            {...register("telefonoContacto")}
            className={errors.telefonoContacto ? "input-error" : ""}
          />
          {errors.telefonoContacto && <span className="error-msg">{errors.telefonoContacto.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="correoContacto">Correo Contacto</label>
          <input
            id="correoContacto"
            type="email"
            placeholder="correo.contacto@ejemplo.com"
            {...register("correoContacto")}
            className={errors.correoContacto ? "input-error" : ""}
          />
          {errors.correoContacto && <span className="error-msg">{errors.correoContacto.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tipoDocumento">Tipo de Documento *</label>
          <select 
            id="tipoDocumento"
            {...register("tipoDocumento")}
            className={errors.tipoDocumento ? "input-error" : ""}
          >
            <option key="DPI" value="DPI">DPI</option>
            <option key="NIT" value="NIT">NIT</option>
            <option key="PASAPORTE" value="PASAPORTE">Pasaporte</option>
          </select>
          {errors.tipoDocumento && <span className="error-msg">{errors.tipoDocumento.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="numeroDocumento">Número de Documento *</label>
          <input
            id="numeroDocumento"
            type="text"
            placeholder="Número"
            {...register("numeroDocumento")}
            className={errors.numeroDocumento ? "input-error" : ""}
          />
          {errors.numeroDocumento && <span className="error-msg">{errors.numeroDocumento.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nit">NIT</label>
          <input
            id="nit"
            type="text"
            placeholder="NIT"
            {...register("nit")}
            className={errors.nit ? "input-error" : ""}
          />
          {errors.nit && <span className="error-msg">{errors.nit.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="correo">Correo *</label>
          <input
            id="correo"
            type="email"
            placeholder="correo@ejemplo.com"
            {...register("correo")}
            className={errors.correo ? "input-error" : ""}
          />
          {errors.correo && <span className="error-msg">{errors.correo.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono *</label>
          <input
            id="telefono"
            type="text"
            placeholder="Teléfono"
            {...register("telefono")}
            className={errors.telefono ? "input-error" : ""}
          />
          {errors.telefono && <span className="error-msg">{errors.telefono.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="telefonoSecundario">Teléfono Secundario</label>
          <input
            id="telefonoSecundario"
            type="text"
            placeholder="Teléfono secundario"
            {...register("telefonoSecundario")}
            className={errors.telefonoSecundario ? "input-error" : ""}
          />
          {errors.telefonoSecundario && <span className="error-msg">{errors.telefonoSecundario.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="direccion">Dirección *</label>
          <input
            id="direccion"
            type="text"
            placeholder="Dirección"
            {...register("direccion")}
            className={errors.direccion ? "input-error" : ""}
          />
          {errors.direccion && <span className="error-msg">{errors.direccion.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="ciudad">Ciudad *</label>
          <input
            id="ciudad"
            type="text"
            placeholder="Ciudad"
            {...register("ciudad")}
            className={errors.ciudad ? "input-error" : ""}
          />
          {errors.ciudad && <span className="error-msg">{errors.ciudad.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="departamento">Departamento *</label>
          <input
            id="departamento"
            type="text"
            placeholder="Departamento"
            {...register("departamento")}
            className={errors.departamento ? "input-error" : ""}
          />
          {errors.departamento && <span className="error-msg">{errors.departamento.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="codigoPostal">Código Postal</label>
          <input
            id="codigoPostal"
            type="text"
            placeholder="Código postal"
            {...register("codigoPostal")}
            className={errors.codigoPostal ? "input-error" : ""}
          />
          {errors.codigoPostal && <span className="error-msg">{errors.codigoPostal.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="condicionPago">Condición de Pago *</label>
          <select 
            id="condicionPago"
            {...register("condicionPago")}
            className={errors.condicionPago ? "input-error" : ""}
          >
            <option key="CONTADO" value="CONTADO">Contado</option>
            <option key="CREDITO" value="CREDITO">Crédito</option>
          </select>
          {errors.condicionPago && <span className="error-msg">{errors.condicionPago.message}</span>}
        </div>

        {condicionPago === "CREDITO" && (
          <>
            <div className="form-group">
              <label htmlFor="diasCredito">Días de Crédito</label>
              <input
                id="diasCredito"
                type="number"
                placeholder="Días"
                {...register("diasCredito", { valueAsNumber: true })}
                className={errors.diasCredito ? "input-error" : ""}
              />
              {errors.diasCredito && <span className="error-msg">{errors.diasCredito.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="limiteCreditoMes">Límite Crédito Mes</label>
              <input
                id="limiteCreditoMes"
                type="number"
                placeholder="Monto"
                {...register("limiteCreditoMes", { valueAsNumber: true })}
                className={errors.limiteCreditoMes ? "input-error" : ""}
              />
              {errors.limiteCreditoMes && <span className="error-msg">{errors.limiteCreditoMes.message}</span>}
            </div>
          </>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="banco">Banco</label>
          <input
            id="banco"
            type="text"
            placeholder="Banco"
            {...register("banco")}
            className={errors.banco ? "input-error" : ""}
          />
          {errors.banco && <span className="error-msg">{errors.banco.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="numeroCuenta">Número de Cuenta</label>
          <input
            id="numeroCuenta"
            type="text"
            placeholder="Número de cuenta"
            {...register("numeroCuenta")}
            className={errors.numeroCuenta ? "input-error" : ""}
          />
          {errors.numeroCuenta && <span className="error-msg">{errors.numeroCuenta.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="tipoCuenta">Tipo de Cuenta</label>
          <select 
            id="tipoCuenta"
            {...register("tipoCuenta")}
            className={errors.tipoCuenta ? "input-error" : ""}
          >
            <option key="CORRIENTE" value="CORRIENTE">Corriente</option>
            <option key="AHORRO" value="AHORRO">Ahorro</option>
          </select>
          {errors.tipoCuenta && <span className="error-msg">{errors.tipoCuenta.message}</span>}
        </div>
      </div>

      <div className="form-buttons">
        <button 
          type="reset" 
          className="btn btn-secondary"
          onClick={() => reset()}
        >
          Limpiar
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Guardando..." : isEditing ? "Actualizar Proveedor" : "Crear Proveedor"}
        </button>
      </div>
    </form>
  );
};
