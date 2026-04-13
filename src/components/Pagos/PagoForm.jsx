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

  useEffect(() => {
    if (pago) {
      setFormData({
        numeroRecibo: pago.numeroRecibo || "",
        proveedorId: pago.proveedor?._id || pago.proveedorId || "",
        facturaPorPagarId: pago.facturaPorPagar?._id || pago.facturaPorPagarId || "",
        monto: pago.monto || "",
        moneda: pago.moneda || "GTQ",
        metodoPago: pago.metodoPago || "TRANSFERENCIA",
        fechaPago: pago.fechaPago ? new Date(pago.fechaPago).toISOString().split("T")[0] : "",
        referencia: pago.referencia || "",
        descripcion: pago.descripcion || "",
      });
    }
  }, [pago]);

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
        >
          <option value="">-- Selecciona una factura --</option>
          {facturas.map((f) => (
            <option key={f._id || f.id} value={f._id || f.id}>
              {f.numeroFactura} - Q{f.monto}
            </option>
          ))}
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
