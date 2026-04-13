import * as yup from "yup";

export const cobrosCrearSchema = yup.object().shape({
  facturaPorCobrarId: yup
    .string()
    .required("La factura es requerida"),
  numeroComprobante: yup
    .string()
    .required("El número de comprobante es requerido"),
  montoCobrado: yup
    .number()
    .positive("El monto cobrado debe ser positivo")
    .required("El monto cobrado es requerido"),
  metodoPago: yup
    .string()
    .oneOf(["TRANSFERENCIA", "EFECTIVO", "CHEQUE", "TARJETA"], "Método de pago inválido")
    .required("El método de pago es requerido"),
  comision: yup
    .number()
    .min(0, "La comisión no puede ser negativa")
    .optional(),
  fechaCobro: yup
    .string()
    .required("La fecha de cobro es requerida"),
  referencia: yup
    .string()
    .optional(),
  descripcion: yup
    .string()
    .optional(),
});

export const cobrosEditarSchema = yup.object().shape({
  montoCobrado: yup
    .number()
    .positive("El monto cobrado debe ser positivo")
    .optional(),
  comision: yup
    .number()
    .min(0, "La comisión no puede ser negativa")
    .optional(),
  metodoPago: yup
    .string()
    .oneOf(["TRANSFERENCIA", "EFECTIVO", "CHEQUE", "TARJETA"], "Método de pago inválido")
    .optional(),
  fechaCobro: yup
    .string()
    .optional(),
  referencia: yup
    .string()
    .optional(),
  descripcion: yup
    .string()
    .optional(),
});
