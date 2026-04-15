import { useState } from "react";
import * as api from "../../services/api";

export const ProveedorSearch = ({ onResultados }) => {
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) {
      onResultados([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.buscarProveedoresActivos(busqueda, 100, 0);
      if (!response.error) {
        const proveedores = response.data?.proveedores || response.proveedores || [];
        onResultados(Array.isArray(proveedores) ? proveedores : []);
      }
    } catch (err) {
      onResultados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleBuscar} className="proveedor-search">
      <input
        type="text"
        placeholder="Buscar proveedores..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="search-input"
      />
      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Buscando..." : "Buscar"}
      </button>
    </form>
  );
};
