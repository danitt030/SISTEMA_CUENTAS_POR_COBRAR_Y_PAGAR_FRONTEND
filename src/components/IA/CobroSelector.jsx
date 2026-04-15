import { useState, useEffect } from "react";
import { obtenerCobrosPorCliente } from "../../services/api";

export const CobroSelector = ({ clienteId, onSelect, selected, optional = false }) => {
  const [cobros, setCobros] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar cobros cuando cambia el cliente
  useEffect(() => {
    if (!clienteId) {
      const resetData = () => {
        setCobros([]);
        onSelect(null);
      };
      resetData();
      return;
    }

    const cargarCobros = async () => {
      setLoading(true);
      try {
        const resultado = await obtenerCobrosPorCliente(clienteId, 100, 0);
        const cobrosData = Array.isArray(resultado?.data?.cobros)
          ? resultado.data.cobros
          : [];
        setCobros(cobrosData);
      } catch (err) {
        console.error("Error cargando cobros:", err);
        setCobros([]);
      }
      setLoading(false);
    };

    cargarCobros();
  }, [clienteId, onSelect]);

  if (!clienteId) {
    return null;
  }

  return (
    <div className="ia-filter-field cobro-selector">
      <label htmlFor="cobro-select">
        {optional ? "Selecciona un Cobro (Opcional)" : "Selecciona un Cobro:"}
      </label>

      <select
        id="cobro-select"
        value={selected || ""}
        onChange={(e) => onSelect(e.target.value || null)}
        className="cobro-select ia-field-input"
        disabled={loading || cobros.length === 0}
      >
        <option value="">
          {optional
            ? "-- Ninguno (Análisis General del Cliente) --"
            : "-- Selecciona un cobro --"}
        </option>
        {cobros.map((cobro) => (
          <option key={cobro._id || cobro.id} value={cobro._id || cobro.id}>
            Cobro de Q {(cobro.montoCobrado || 0).toLocaleString("es-CO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} - {new Date(cobro.fechaCobro).toLocaleDateString("es-CO")}
          </option>
        ))}
      </select>

      {loading && <small className="loading-text">Cargando cobros...</small>}
      {cobros.length === 0 && !loading && (
        <small className="empty-text">No hay cobros para este cliente</small>
      )}
    </div>
  );
};
