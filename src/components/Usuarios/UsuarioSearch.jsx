import { useState } from "react";

export const UsuarioSearch = ({ onSearch, onRolChange, loading = false }) => {
  const [filtros, setFiltros] = useState({
    busqueda: "",
    rol: "",
  });

  const roles = [
    { value: "", label: "Todos los roles" },
    { value: "ADMINISTRADOR_ROLE", label: "Administrador" },
    { value: "GERENTE_GENERAL_ROLE", label: "Gerente General" },
    { value: "CONTADOR_ROLE", label: "Contador" },
    { value: "GERENTE_ROLE", label: "Gerente" },
    { value: "VENDEDOR_ROLE", label: "Vendedor" },
    { value: "AUXILIAR_ROLE", label: "Auxiliar" },
    { value: "CLIENTE_ROLE", label: "Cliente" },
  ];

  const handleBusquedaChange = (e) => {
    const texto = e.target.value;
    setFiltros(prev => ({ ...prev, busqueda: texto }));
    if (onSearch) {
      onSearch(texto);
    }
  };

  const handleRolChange = (rol) => {
    setFiltros(prev => ({ ...prev, rol }));
    if (onRolChange) {
      onRolChange(rol);
    }
  };

  const handleLimpiar = () => {
    setFiltros({ busqueda: "", rol: "" });
    if (onSearch) onSearch("");
    if (onRolChange) onRolChange("");
  };

  return (
    <div className="usuario-search">
      <div className="usuario-search-grid">
        <div className="search-section usuario-search-field">
          <label htmlFor="usuarios-busqueda">Buscar por nombre, usuario o correo</label>
          <input
            id="usuarios-busqueda"
            type="text"
            placeholder="Ej: juan, jperez, juan@mail.com"
            value={filtros.busqueda}
            onChange={handleBusquedaChange}
            disabled={loading}
            className="search-input"
          />
        </div>

        <div className="search-section usuario-search-field">
          <label htmlFor="usuarios-rol">Filtrar por rol</label>
          <select
            id="usuarios-rol"
            value={filtros.rol}
            onChange={(e) => handleRolChange(e.target.value)}
            disabled={loading}
            className="search-select"
          >
            {roles.map((rol) => (
              <option key={rol.value || "all"} value={rol.value}>
                {rol.label}
              </option>
            ))}
          </select>
        </div>

        <div className="usuario-search-actions">
          <button
            onClick={handleLimpiar}
            className="btn btn-secondary"
            disabled={loading}
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
};
