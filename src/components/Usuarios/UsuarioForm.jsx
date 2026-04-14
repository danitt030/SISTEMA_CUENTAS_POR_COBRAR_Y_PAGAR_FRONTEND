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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="usuario-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            type="text"
            placeholder="Juan"
            {...register("nombre")}
            className={errors.nombre ? "input-error" : ""}
          />
          {errors.nombre && <span className="error-msg">{errors.nombre.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido *</label>
          <input
            id="apellido"
            type="text"
            placeholder="Pérez"
            {...register("apellido")}
            className={errors.apellido ? "input-error" : ""}
          />
          {errors.apellido && <span className="error-msg">{errors.apellido.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="usuario">Usuario *</label>
          <input
            id="usuario"
            type="text"
            placeholder="jperez"
            {...register("usuario")}
            disabled={isEditing}
            className={errors.usuario ? "input-error" : ""}
          />
          {errors.usuario && <span className="error-msg">{errors.usuario.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo *</label>
          <input
            id="correo"
            type="email"
            placeholder="juan@example.com"
            {...register("correo")}
            className={errors.correo ? "input-error" : ""}
          />
          {errors.correo && <span className="error-msg">{errors.correo.message}</span>}
        </div>
      </div>

      {!isEditing && (
        <div className="form-group">
          <label htmlFor="contraseña">Contraseña *</label>
          <input
            id="contraseña"
            type="password"
            placeholder="Mínimo 6 caracteres"
            {...register("contraseña")}
            className={errors.contraseña ? "input-error" : ""}
          />
          {errors.contraseña && <span className="error-msg">{errors.contraseña.message}</span>}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tipoDocumento">Tipo de Documento *</label>
          <select id="tipoDocumento" {...register("tipoDocumento")} disabled={isEditing}>
            <option key="DPI" value="DPI">DPI</option>
            <option key="NIT" value="NIT">NIT</option>
            <option key="PASAPORTE" value="PASAPORTE">Pasaporte</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="numeroDocumento">Número de Documento *</label>
          <input
            id="numeroDocumento"
            type="text"
            placeholder="1234567890101"
            {...register("numeroDocumento")}
            disabled={isEditing}
            className={errors.numeroDocumento ? "input-error" : ""}
          />
          {errors.numeroDocumento && <span className="error-msg">{errors.numeroDocumento.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nit">NIT</label>
          <input
            id="nit"
            type="text"
            placeholder="123456789"
            {...register("nit")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="teléfono">Teléfono *</label>
          <input
            id="teléfono"
            type="tel"
            placeholder="+502 1234 5678"
            {...register("teléfono")}
            className={errors.teléfono ? "input-error" : ""}
          />
          {errors.teléfono && <span className="error-msg">{errors.teléfono.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="puesto">Puesto *</label>
          <input
            id="puesto"
            type="text"
            placeholder="Gerente de Ventas"
            {...register("puesto")}
            className={errors.puesto ? "input-error" : ""}
          />
          {errors.puesto && <span className="error-msg">{errors.puesto.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="departamento">Departamento *</label>
          <input
            id="departamento"
            type="text"
            placeholder="Ventas"
            {...register("departamento")}
            className={errors.departamento ? "input-error" : ""}
          />
          {errors.departamento && <span className="error-msg">{errors.departamento.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="rol">Rol *</label>
          <select
            id="rol"
            {...register("rol")}
            className={errors.rol ? "input-error" : ""}
          >
            {ROLES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          {errors.rol && <span className="error-msg">{errors.rol.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="dirección">Dirección</label>
          <input
            id="dirección"
            type="text"
            placeholder="Calle Principal 123"
            {...register("dirección")}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Procesando..." : isEditing ? "Actualizar Usuario" : "Crear Usuario"}
        </button>
      </div>
    </form>
  );
};
