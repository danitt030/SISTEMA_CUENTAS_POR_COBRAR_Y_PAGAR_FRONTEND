import * as yup from "yup";

export const proveedorCrearSchema = yup.object().shape({
  nombre: yup
    .string()
    .required("El nombre es requerido")
    .min(2, "Mínimo 2 caracteres"),
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
  correo: yup
    .string()
    .required("El correo es requerido")
    .email("Correo inválido"),
  telefono: yup
    .string()
    .required("El teléfono es requerido"),
  direccion: yup
    .string()
    .required("La dirección es requerida"),
  ciudad: yup
    .string()
    .required("La ciudad es requerida"),
  departamento: yup
    .string()
    .required("El departamento es requerido"),
  condicionPago: yup
    .string()
    .required("Condición de pago requerida")
    .oneOf(["CONTADO", "CREDITO"], "Condición inválida"),
  diasCredito: yup
    .number()
    .typeError("Debe ser un número")
    .optional(),
  limiteCreditoMes: yup
    .number()
    .typeError("Debe ser un número")
    .optional(),
  nombreContacto: yup
    .string()
    .optional(),
  telefonoContacto: yup
    .string()
    .optional(),
  correoContacto: yup
    .string()
    .email("Correo inválido")
    .optional(),
  codigoPostal: yup
    .string()
    .optional(),
  telefonoSecundario: yup
    .string()
    .optional(),
  banco: yup
    .string()
    .optional(),
  numeroCuenta: yup
    .string()
    .optional(),
  tipoCuenta: yup
    .string()
    .oneOf(["CORRIENTE", "AHORRO"], "Tipo de cuenta inválido")
    .optional(),
});

export const proveedorEditarSchema = yup.object().shape({
  nombre: yup
    .string()
    .optional()
    .min(2, "Mínimo 2 caracteres"),
  correo: yup
    .string()
    .email("Correo inválido")
    .optional(),
  telefono: yup
    .string()
    .optional(),
  direccion: yup
    .string()
    .optional(),
  ciudad: yup
    .string()
    .optional(),
  departamento: yup
    .string()
    .optional(),
  condicionPago: yup
    .string()
    .oneOf(["CONTADO", "CREDITO"], "Condición inválida")
    .optional(),
  diasCredito: yup
    .number()
    .optional(),
  limiteCreditoMes: yup
    .number()
    .optional(),
  nombreContacto: yup
    .string()
    .optional(),
  telefonoContacto: yup
    .string()
    .optional(),
  correoContacto: yup
    .string()
    .email("Correo inválido")
    .optional(),
  telefonoSecundario: yup
    .string()
    .optional(),
  banco: yup
    .string()
    .optional(),
  numeroCuenta: yup
    .string()
    .optional(),
});
