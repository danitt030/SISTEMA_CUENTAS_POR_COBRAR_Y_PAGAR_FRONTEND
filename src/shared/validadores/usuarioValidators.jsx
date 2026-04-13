import * as yup from "yup";

export const usuarioCrearSchema = yup.object().shape({
  nombre: yup
    .string()
    .required("El nombre es requerido")
    .min(2, "Mínimo 2 caracteres"),
  apellido: yup
    .string()
    .required("El apellido es requerido")
    .min(2, "Mínimo 2 caracteres"),
  usuario: yup
    .string()
    .required("El usuario es requerido")
    .min(3, "Mínimo 3 caracteres"),
  correo: yup
    .string()
    .required("El correo es requerido")
    .email("Correo inválido"),
  contraseña: yup
    .string()
    .required("La contraseña es requerida")
    .min(6, "Mínimo 6 caracteres"),
  tipoDocumento: yup
    .string()
    .required("Tipo de documento requerido")
    .oneOf(["DPI", "NIT", "PASAPORTE"], "Tipo inválido"),
  numeroDocumento: yup
    .string()
    .required("El número de documento es requerido"),
  nit: yup
    .string()
    .optional(),
  teléfono: yup
    .string()
    .required("El teléfono es requerido"),
  puesto: yup
    .string()
    .required("El puesto es requerido"),
  departamento: yup
    .string()
    .required("El departamento es requerido"),
  rol: yup
    .string()
    .required("El rol es requerido")
    .oneOf([
      "ADMINISTRADOR_ROLE",
      "GERENTE_GENERAL_ROLE",
      "CONTADOR_ROLE",
      "GERENTE_ROLE",
      "VENDEDOR_ROLE",
      "AUXILIAR_ROLE",
      "CLIENTE_ROLE"
    ], "Rol inválido"),
  dirección: yup
    .string()
    .optional(),
});

export const usuarioEditarSchema = yup.object().shape({
  nombre: yup
    .string()
    .min(2, "Mínimo 2 caracteres"),
  apellido: yup
    .string()
    .min(2, "Mínimo 2 caracteres"),
  usuario: yup
    .string()
    .min(3, "Mínimo 3 caracteres"),
  correo: yup
    .string()
    .email("Correo inválido"),
  teléfono: yup
    .string(),
  puesto: yup
    .string(),
  departamento: yup
    .string(),
  rol: yup
    .string()
    .oneOf([
      "ADMINISTRADOR_ROLE",
      "GERENTE_GENERAL_ROLE",
      "CONTADOR_ROLE",
      "GERENTE_ROLE",
      "VENDEDOR_ROLE",
      "AUXILIAR_ROLE",
      "CLIENTE_ROLE"
    ], "Rol inválido"),
  dirección: yup
    .string()
    .optional(),
});

export const cambiarContraseñaSchema = yup.object().shape({
  nuevaContraseña: yup
    .string()
    .required("La nueva contraseña es requerida")
    .min(6, "Mínimo 6 caracteres"),
  confirmarContraseña: yup
    .string()
    .required("Confirmar contraseña es requerido")
    .oneOf([yup.ref("nuevaContraseña")], "Las contraseñas no coinciden"),
});
