import * as yup from "yup";

export const facturaPorCobrarCrearSchema = yup.object().shape({
  clienteId: yup
    .string()
    .required("El cliente es requerido"),
  numeroFactura: yup
    .string()
    .required("El número de factura es requerido")
    .min(3, "Mínimo 3 caracteres"),
  fechaEmision: yup
    .string()
    .required("La fecha de emisión es requerida"),
  fechaVencimiento: yup
    .string()
    .required("La fecha de vencimiento es requerida"),
  monto: yup
    .number()
    .required("El monto es requerido")
    .typeError("Debe ser un número")
    .positive("El monto debe ser mayor a 0"),
  moneda: yup
    .string()
    .required("La moneda es requerida")
    .oneOf(["GTQ", "USD", "EUR"], "Moneda inválida"),
  estado: yup
    .string()
    .required("El estado es requerido")
    .oneOf(["PENDIENTE", "PARCIAL", "COBRADA", "VENCIDA"], "Estado inválido"),
  descripcion: yup
    .string()
    .optional(),
});

export const facturaPorCobrarEditarSchema = yup.object().shape({
  numeroFactura: yup.string().optional().min(3, "Mínimo 3 caracteres"),
  fechaEmision: yup.string().optional(),
  fechaVencimiento: yup.string().optional(),
  monto: yup.number().optional().positive("El monto debe ser mayor a 0"),
  moneda: yup.string().optional().oneOf(["GTQ", "USD", "EUR"]),
  estado: yup.string().optional().oneOf(["PENDIENTE", "PARCIAL", "COBRADA", "VENCIDA"]),
  descripcion: yup.string().optional(),
});
