import { useState, useEffect } from "react";
import { obtenerFacturasPorCliente } from "../../services/api";
import "./FacturaSelector.css";

export const FacturaSelector = ({ clienteId, onSelect, selected, optional = false }) => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar facturas cuando cambia el cliente
  useEffect(() => {
    if (!clienteId) {
      setFacturas([]);
      onSelect(null);
      return;
    }

    const cargarFacturas = async () => {
      setLoading(true);
      try {
        const resultado = await obtenerFacturasPorCliente(clienteId, 100, 0);
        const facturasData = Array.isArray(resultado?.data?.facturas)
          ? resultado.data.facturas
          : [];
        setFacturas(facturasData);
      } catch (err) {
        console.error("Error cargando facturas:", err);
        setFacturas([]);
      }
      setLoading(false);
    };

    cargarFacturas();
  }, [clienteId, onSelect]);

  if (!clienteId) {
    return null;
  }

  return (
    <div className="factura-selector">
      <label htmlFor="factura-select">
        {optional ? "Selecciona una Factura (Opcional)" : "Selecciona una Factura:"}
      </label>

      <select
        id="factura-select"
        value={selected || ""}
        onChange={(e) => onSelect(e.target.value || null)}
        className="factura-select"
        disabled={loading || facturas.length === 0}
      >
        <option value="">
          {optional
            ? "-- Ninguna (Análisis General del Cliente) --"
            : "-- Selecciona una factura --"}
        </option>
        {facturas.map((factura) => (
          <option key={factura._id || factura.id} value={factura._id || factura.id}>
            {factura.numeroFactura} - Q {(factura.monto || 0).toLocaleString("es-CO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} ({factura.estado})
          </option>
        ))}
      </select>

      {loading && <small className="loading-text">Cargando facturas...</small>}
      {facturas.length === 0 && !loading && (
        <small className="empty-text">No hay facturas para este cliente</small>
      )}
    </div>
  );
};
