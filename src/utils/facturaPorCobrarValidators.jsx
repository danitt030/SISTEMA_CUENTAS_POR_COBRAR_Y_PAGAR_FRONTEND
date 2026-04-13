import * as yup from "yup";

export const facturaPorCobrarCrearSchema = yup.object().shape({
  clienteId: yup
    .string()
    .required("El cliente es requerido"),
  numeroFactura: yup
    .string()
    .required("El número de factura es requerido"),
  monto: yup
    .number()
    .positive("El monto debe ser positivo")
    .required("El monto es requerido"),
  moneda: yup
    .string()
    .oneOf(["GTQ", "USD", "EUR"], "La moneda debe ser GTQ, USD o EUR")
    .required("La moneda es requerida"),
  estado: yup
    .string()
    .oneOf(["PENDIENTE", "PARCIAL", "COBRADA", "VENCIDA"], "El estado no es válido")
    .required("El estado es requerido"),
  fechaEmision: yup
    .string()
    .required("La fecha de emisión es requerida"),
  fechaVencimiento: yup
    .string()
    .required("La fecha de vencimiento es requerida"),
  descripcion: yup.string().optional(),
});

export const facturaPorCobrarEditarSchema = yup.object().shape({
  numeroFactura: yup
    .string()
    .optional(),
  monto: yup
    .number()
    .positive("El monto debe ser positivo")
    .optional(),
  moneda: yup
    .string()
    .oneOf(["GTQ", "USD", "EUR"], "La moneda debe ser GTQ, USD o EUR")
    .optional(),
  estado: yup
    .string()
    .oneOf(["PENDIENTE", "PARCIAL", "COBRADA", "VENCIDA"], "El estado no es válido")
    .optional(),
  fechaEmision: yup
    .string()
    .optional(),
  fechaVencimiento: yup
    .string()
    .optional(),
  descripcion: yup.string().optional(),
});
