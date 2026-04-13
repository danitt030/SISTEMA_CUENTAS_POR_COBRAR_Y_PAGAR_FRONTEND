import { useState } from "react";
import * as api from "../../services/api";
import "./facturaPorPagarSearch.css";

export const FacturaPorPagarSearch = ({ onResultados = () => {} }) => {
  const [estado, setEstado] = useState("PENDIENTE");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await api.buscarFacturasActivasPagar(estado, 100, 0);
      if (!response.error) {
        const datos = response.data?.facturas || response.data?.data || [];
        setResultados(Array.isArray(datos) ? datos : []);
        onResultados(Array.isArray(datos) ? datos : []);
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setEstado("PENDIENTE");
    setResultados([]);
    onResultados([]);
  };

  return (
    <div className="factura-search">
      <form onSubmit={handleBuscar}>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option key="PENDIENTE" value="PENDIENTE">Pendiente</option>
          <option key="PARCIAL" value="PARCIAL">Parcial</option>
          <option key="PAGADA" value="PAGADA">Pagada</option>
          <option key="VENCIDA" value="VENCIDA">Vencida</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar por Estado"}
        </button>
        {resultados.length > 0 && (
          <button type="button" onClick={handleLimpiar} className="btn-clear">
            Limpiar
          </button>
        )}
      </form>
      {resultados.length > 0 && (
        <p className="resultados-count">Se encontraron {resultados.length} resultado(s) con estado {estado}</p>
      )}
    </div>
  );
};
