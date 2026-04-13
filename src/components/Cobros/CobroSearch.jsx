import { useState } from "react";
import "./cobroSearch.css";

export const CobroSearch = ({ onSearch, clientes = [], loading = false }) => {
  const [filtros, setFiltros] = useState({
    cliente: "",
    metodoPago: "",
    fechaInicio: "",
    fechaFin: ""
  });

  const handleClienteChange = (e) => {
    const nuevosFiltros = { ...filtros, cliente: e.target.value };
    setFiltros(nuevosFiltros);
    onSearch(nuevosFiltros);
  };

  const handleMetodoPagoChange = (e) => {
    const nuevosFiltros = { ...filtros, metodoPago: e.target.value };
    setFiltros(nuevosFiltros);
    onSearch(nuevosFiltros);
  };

  const handleFechaDesdeChange = (e) => {
    const nuevosFiltros = { ...filtros, fechaInicio: e.target.value };
    setFiltros(nuevosFiltros);
    onSearch(nuevosFiltros);
  };

  const handleFechaHastaChange = (e) => {
    const nuevosFiltros = { ...filtros, fechaFin: e.target.value };
    setFiltros(nuevosFiltros);
    onSearch(nuevosFiltros);
  };

  const handleLimpiar = () => {
    const filtrosLimpios = {
      cliente: "",
      metodoPago: "",
      fechaInicio: "",
      fechaFin: ""
    };
    setFiltros(filtrosLimpios);
    onSearch(filtrosLimpios);
  };

  return (
    <div className="cobro-search">
      <div className="search-filters">
        <div className="filter-group">
          <label htmlFor="cliente">Cliente</label>
          <select
            id="cliente"
            value={filtros.cliente}
            onChange={handleClienteChange}
            disabled={loading || clientes.length === 0}
          >
            <option value="">Todos los clientes</option>
            {clientes.map((cliente) => (
              <option key={cliente.id || cliente._id} value={cliente.id || cliente._id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="metodoPago">Método Pago</label>
          <select
            id="metodoPago"
            value={filtros.metodoPago}
            onChange={handleMetodoPagoChange}
            disabled={loading}
          >
            <option value="">Todos</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="CHEQUE">Cheque</option>
            <option value="TARJETA">Tarjeta</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="fechaDesde">Fecha Desde</label>
          <input
            id="fechaDesde"
            type="date"
            value={filtros.fechaInicio}
            onChange={handleFechaDesdeChange}
            disabled={loading}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="fechaHasta">Fecha Hasta</label>
          <input
            id="fechaHasta"
            type="date"
            value={filtros.fechaFin}
            onChange={handleFechaHastaChange}
            disabled={loading}
          />
        </div>

        <button onClick={handleLimpiar} className="btn-limpiar" disabled={loading}>
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};
