import * as yup from "yup";

// Validar login
export const loginSchema = yup.object().shape({
  usuario: yup
    .string()
    .required("El usuario es requerido")
    .min(3, "El usuario debe tener al menos 3 caracteres"),
  contraseña: yup
    .string()
    .required("La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Validar registro
export const registerSchema = yup.object().shape({
  nombre: yup
    .string()
    .required("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  apellido: yup
    .string()
    .required("El apellido es requerido")
    .min(3, "El apellido debe tener al menos 3 caracteres"),
  correo: yup
    .string()
    .required("El correo es requerido")
    .email("Correo inválido"),
  usuario: yup
    .string()
    .required("El usuario es requerido")
    .min(3, "El usuario debe tener al menos 3 caracteres"),
  contraseña: yup
    .string()
    .required("La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  departamento: yup
    .string()
    .required("El departamento es requerido"),
  puesto: yup
    .string()
    .required("El puesto es requerido"),
});
