import { useState, useEffect } from "react";
import "./usuarioSearch.css";

export const UsuarioSearch = ({ onSearch, onRolChange, loading = false }) => {
  const [filtros, setFiltros] = useState({
    busqueda: "",
    rol: ""
  });

  const handleBusquedaChange = (e) => {
    const texto = e.target.value;
    setFiltros(prev => ({ ...prev, busqueda: texto }));
    if (onSearch) {
      onSearch(texto);
    }
  };

  const handleRolChange = (e) => {
    const nuevoRol = e.target.value;
    setFiltros(prev => ({ ...prev, rol: nuevoRol }));
    if (onRolChange) {
      onRolChange(nuevoRol);
    }
  };

  const handleLimpiar = () => {
    setFiltros({ busqueda: "", rol: "" });
    if (onSearch) onSearch("");
    if (onRolChange) onRolChange("");
  };

  return (
    <div className="usuario-search">
      <div className="search-filters">
        <div className="filter-group">
          <label htmlFor="busqueda">Buscar por Nombre, Usuario o Correo</label>
          <input
            id="busqueda"
            type="text"
            placeholder="Ingresa nombre, usuario o correo..."
            value={filtros.busqueda}
            onChange={handleBusquedaChange}
            disabled={loading}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="rol">Filtrar por Rol</label>
          <select
            id="rol"
            value={filtros.rol}
            onChange={handleRolChange}
            disabled={loading}
          >
            <option value="">-- Todos los roles --</option>
            <option value="ADMINISTRADOR_ROLE">Administrador</option>
            <option value="GERENTE_GENERAL_ROLE">Gerente General</option>
            <option value="CONTADOR_ROLE">Contador</option>
            <option value="GERENTE_ROLE">Gerente</option>
            <option value="VENDEDOR_ROLE">Vendedor</option>
            <option value="AUXILIAR_ROLE">Auxiliar</option>
            <option value="CLIENTE_ROLE">Cliente</option>
          </select>
        </div>

        <button 
          onClick={handleLimpiar} 
          className="btn-limpiar" 
          disabled={loading}
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};
