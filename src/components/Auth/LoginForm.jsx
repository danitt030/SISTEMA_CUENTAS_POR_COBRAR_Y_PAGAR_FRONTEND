import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../shared/validadores/authValidators";
import "./loginForm.css";

export const LoginForm = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmitForm = (data) => {
    console.log("Form submitted with data:", data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="login-form" noValidate>
      <div className="form-group">
        <label htmlFor="usuario">Usuario o Correo</label>
        <input
          id="usuario"
          type="text"
          placeholder="Usuario o Correo"
          className={`form-control ${errors.usuario ? "is-invalid" : ""}`}
          {...register("usuario")}
          disabled={isLoading}
        />
        {errors.usuario && (
          <div className="invalid-feedback" style={{ display: "block" }}>
            {errors.usuario.message}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="contraseña">Contraseña</label>
        <input
          id="contraseña"
          type="password"
          placeholder="Ingrese su contraseña"
          className={`form-control ${errors.contraseña ? "is-invalid" : ""}`}
          {...register("contraseña")}
          disabled={isLoading}
        />
        {errors.contraseña && (
          <div className="invalid-feedback" style={{ display: "block" }}>
            {errors.contraseña.message}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={isLoading}
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </form>
  );
};
