import React, { useState, useEffect } from "react";
import "./pagoForm.css";

const PagoForm = ({ pago, proveedores = [], facturas = [], onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    numeroRecibo: "",
    proveedorId: "",
    facturaPorPagarId: "",
    monto: "",
    moneda: "GTQ",
    metodoPago: "TRANSFERENCIA",
    fechaPago: new Date().toISOString().split("T")[0],
    referencia: "",
    descripcion: "",
  });

  const [facturasProveedorSeleccionado, setFacturasProveedorSeleccionado] = useState([]);
  const [proveedorOriginal, setProveedorOriginal] = useState(null);

  useEffect(() => {
    if (pago) {
      // Extraer proveedorId - soporta múltiples formatos
      const proveedorId = (() => {
        if (pago.proveedor) {
          if (typeof pago.proveedor === "object") {
            return pago.proveedor._id || pago.proveedor.id || "";
          }
          return String(pago.proveedor);
        }
        return pago.proveedorId || "";
      })();

      // Extraer facturaPorPagarId - soporta múltiples formatos
      const facturaPorPagarId = (() => {
        if (pago.facturaPorPagar) {
          if (typeof pago.facturaPorPagar === "object") {
            return pago.facturaPorPagar._id || pago.facturaPorPagar.id || "";
          }
          return String(pago.facturaPorPagar);
        }
        return pago.facturaPorPagarId || "";
      })();

      setProveedorOriginal(proveedorId);
      setFormData({
        numeroRecibo: pago.numeroRecibo || "",
        proveedorId,
        facturaPorPagarId,
        monto: pago.monto || "",
        moneda: pago.moneda || "GTQ",
        metodoPago: pago.metodoPago || "TRANSFERENCIA",
        fechaPago: pago.fechaPago ? new Date(pago.fechaPago).toISOString().split("T")[0] : "",
        referencia: pago.referencia || "",
        descripcion: pago.descripcion || "",
      });
    } else {
      // Limpiar cuando no hay pago (formulario nuevo)
      setProveedorOriginal(null);
      setFormData({
        numeroRecibo: "",
        proveedorId: "",
        facturaPorPagarId: "",
        monto: "",
        moneda: "GTQ",
        metodoPago: "TRANSFERENCIA",
        fechaPago: new Date().toISOString().split("T")[0],
        referencia: "",
        descripcion: "",
      });
    }
  }, [pago]);

  // ==================== FILTRAR FACTURAS POR PROVEEDOR ====================
  useEffect(() => {
    if (formData.proveedorId) {
      // Obtener el proveedor seleccionado
      const proveedorSeleccionado = proveedores.find(
        (p) => String(p._id || p.id) === String(formData.proveedorId)
      );

      if (proveedorSeleccionado) {
        // Convertir IDs a strings para comparación segura
        const proveedorIdStr = String(proveedorSeleccionado._id || proveedorSeleccionado.id);

        // Filtrar facturas que pertenecen al proveedor seleccionado
        let facturasDelProveedor = facturas.filter((f) => {
          const facturaProveedorId = String(
            (typeof f.proveedor === "object" ? f.proveedor?.id || f.proveedor?._id : f.proveedor) || 
            f.proveedorId || 
            ""
          ).trim();
          
          return facturaProveedorId === proveedorIdStr;
        });

        // Si estamos editando (pago existe) y la factura original no está en la lista filtrada,
        // la agregamos para que siempre esté disponible
        if (pago && formData.facturaPorPagarId) {
          const facturaOriginalExiste = facturasDelProveedor.some(
            (f) => String(f._id || f.id) === String(formData.facturaPorPagarId)
          );

          if (!facturaOriginalExiste) {
            // Buscar la factura original en la lista completa
            const facturaOriginal = facturas.find(
              (f) => String(f._id || f.id) === String(formData.facturaPorPagarId)
            );

            // Si la encontramos, la agregamos a la lista
            if (facturaOriginal) {
              facturasDelProveedor = [facturaOriginal, ...facturasDelProveedor];
            }
          }
        }

        setFacturasProveedorSeleccionado(facturasDelProveedor);

        // Solo resetear factura si el proveedor CAMBIÓ (es diferente del original)
        // Si es edición y el proveedor sigue siendo el mismo, mantener la factura original
        const proveedorCambio = String(formData.proveedorId) !== String(proveedorOriginal);

        if (proveedorCambio && formData.facturaPorPagarId) {
          // El usuario cambió de proveedor, resetear factura
          const facturaEsValida = facturasDelProveedor.some(
            (f) => String(f._id || f.id) === String(formData.facturaPorPagarId)
          );

          if (!facturaEsValida) {
            setFormData((prev) => ({
              ...prev,
              facturaPorPagarId: "",
              monto: "",
            }));
          }
        }
      }
    } else {
      setFacturasProveedorSeleccionado([]);
      
      // Solo resetear si no estamos en edición (pago null) o si proveedorOriginal no está set
      // Esto previene que se limpie facturaPorPagarId mientras se carga un pago para editar
      if (!pago && !proveedorOriginal) {
        setFormData((prev) => ({
          ...prev,
          facturaPorPagarId: "",
          monto: "",
        }));
      }
    }
  }, [formData.proveedorId, facturas, proveedores, proveedorOriginal, pago]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="pago-form">
      <div className="form-group">
        <label>Número Recibo</label>
        <input
          type="text"
          name="numeroRecibo"
          value={formData.numeroRecibo}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Proveedor</label>
        <select
          name="proveedorId"
          value={formData.proveedorId}
          onChange={handleChange}
          required
          disabled={Boolean(pago)}
        >
          <option value="">-- Selecciona un proveedor --</option>
          {proveedores.map((p) => (
            <option key={p._id || p.id} value={p._id || p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Factura por Pagar</label>
        <select
          name="facturaPorPagarId"
          value={formData.facturaPorPagarId}
          onChange={handleChange}
          required
          disabled={!formData.proveedorId || Boolean(pago)}
          aria-label="Selecciona una factura del proveedor"
        >
          <option value="">
            {formData.proveedorId
              ? facturasProveedorSeleccionado.length === 0
                ? "-- No hay facturas para este proveedor --"
                : "-- Selecciona una factura --"
              : "-- Selecciona un proveedor primero --"}
          </option>
          {facturasProveedorSeleccionado && facturasProveedorSeleccionado.length > 0 ? (
            facturasProveedorSeleccionado.map((f) => (
              <option key={f._id || f.id} value={f._id || f.id}>
                {f.numeroFactura} - Q{f.monto}
              </option>
            ))
          ) : (
            <option value="">-- Cargando facturas... --</option>
          )}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Monto</label>
          <input
            type="number"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Moneda</label>
          <select name="moneda" value={formData.moneda} onChange={handleChange}>
            <option value="GTQ">GTQ</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Método de Pago</label>
        <select name="metodoPago" value={formData.metodoPago} onChange={handleChange} required>
          <option value="TRANSFERENCIA">Transferencia</option>
          <option value="CHEQUE">Cheque</option>
          <option value="EFECTIVO">Efectivo</option>
          <option value="TARJETA">Tarjeta</option>
        </select>
      </div>

      <div className="form-group">
        <label>Fecha de Pago</label>
        <input
          type="date"
          name="fechaPago"
          value={formData.fechaPago}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Referencia (Transacción)</label>
        <input
          type="text"
          name="referencia"
          value={formData.referencia}
          onChange={handleChange}
          placeholder="Ej: TRX123456"
        />
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-buttons">
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Guardando..." : "Guardar Pago"}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default PagoForm;
