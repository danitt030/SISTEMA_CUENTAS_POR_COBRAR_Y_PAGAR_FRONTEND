import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { getDashboardByRole } from "../../utils/roleUtils";
import { LoginForm } from "./LoginForm";
import toast from "react-hot-toast";
import "./login.css";

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (data) => {
    console.log("Datos del formulario:", data);
    setIsLoading(true);

    try {
      const response = await loginUser(data);
      console.log("Respuesta del login:", response);

      if (response.success) {
        toast.success(response.message);
        // Redirigir según el rol del usuario
        const dashboardUrl = getDashboardByRole(response.data?.rol);
        setTimeout(() => {
          navigate(dashboardUrl);
        }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error("Error en handleSubmit:", err);
      toast.error("Error inesperado al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Cuentas por Cobrar y Pagar</h1>
          <p>Inicia sesión en tu cuenta</p>
        </div>
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};
