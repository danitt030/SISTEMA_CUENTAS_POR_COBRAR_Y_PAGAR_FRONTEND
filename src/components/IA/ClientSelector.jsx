import { useState, useEffect } from "react";
import { obtenerClientes } from "../../services/api";
import "./iaClientSelector.css";

export const ClientSelector = ({ onSelect, selected, optional = false }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar clientes una sola vez
  useEffect(() => {
    const cargarClientes = async () => {
      setLoading(true);
      try {
        const resultado = await obtenerClientes(100, 0);
        // La respuesta tiene estructura: { data: { success, total, clientes: [...] } }
        const clientesData = Array.isArray(resultado?.data?.clientes) 
          ? resultado.data.clientes 
          : [];
        setClientes(clientesData);
      } catch (err) {
        console.error("Error cargando clientes:", err);
        setClientes([]);
      }
      setLoading(false);
    };

    cargarClientes();
  }, []); // Solo una vez al montar

  return (
    <div className="ia-client-selector">
      <label htmlFor="cliente-select">{optional ? "Selecciona un Cliente (Opcional)" : "Selecciona un Cliente:"}</label>
      
      <select
        id="cliente-select"
        value={selected || ""}
        onChange={(e) => onSelect(e.target.value || null)}
        className="ia-select"
        disabled={loading || clientes.length === 0}
      >
        <option value="">{optional ? "-- Ninguno (Análisis General) --" : "-- Selecciona un cliente --"}</option>
        {clientes.map(cliente => (
          <option key={cliente._id || cliente.id} value={cliente._id || cliente.id}>
            {cliente.nombre} ({cliente.nit})
          </option>
        ))}
      </select>
    </div>
  );
};
