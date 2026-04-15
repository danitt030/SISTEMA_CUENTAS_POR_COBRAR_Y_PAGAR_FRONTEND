import { useState, useEffect } from "react";

export const UsuarioSearch = ({ onSearch, onRolChange, loading = false }) => {
  const [filtros, setFiltros] = useState({
    busqueda: "",
    rol: ""
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
      <div className="search-section">
        <label>Buscar por Nombre, Usuario o Correo</label>
        <input
          type="text"
          placeholder="Ingresa nombre, usuario o correo..."
          value={filtros.busqueda}
          onChange={handleBusquedaChange}
          disabled={loading}
          className="search-input"
        />
      </div>

      <div className="filter-section">
        <label>Filtrar por Rol -- Todos los roles --</label>
        <div className="role-buttons">
          {roles.map((rol) => (
            <button
              key={rol.value}
              onClick={() => handleRolChange(rol.value)}
              className={`btn ${
                filtros.rol === rol.value
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
              }}
            >
              {rol.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleLimpiar}
        className="btn btn-secondary"
        disabled={loading}
        style={{
          marginTop: "12px",
          opacity: loading ? 0.6 : 1,
        }}
      >
        Limpiar Filtros
      </button>
    </div>
  );
};
