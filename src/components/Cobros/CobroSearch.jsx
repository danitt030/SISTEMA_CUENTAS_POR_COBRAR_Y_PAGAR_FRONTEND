import "./cobroSearch.css";

export const CobroSearch = ({ onSearch, clientes = [], loading = false }) => {
  const handleMetodoPagoChange = (e) => {
    const metodoPago = e.target.value;
    onSearch({ metodoPago: metodoPago || null });
  };

  const handleClienteChange = (e) => {
    const cliente = e.target.value;
    onSearch({ cliente: cliente || null });
  };

  const handleFechaDesdeChange = (e) => {
    const fechaInicio = e.target.value;
    onSearch({ fechaInicio: fechaInicio || null });
  };

  const handleFechaHastaChange = (e) => {
    const fechaFin = e.target.value;
    onSearch({ fechaFin: fechaFin || null });
  };

  const handleLimpiar = () => {
    // Limpiar todos los filtros
    document.querySelectorAll(".cobro-search input, .cobro-search select").forEach(el => {
      el.value = "";
    });
    onSearch({ metodoPago: null, cliente: null, fechaInicio: null, fechaFin: null });
  };

  return (
    <div className="cobro-search">
      <div className="search-filters">
        <div className="filter-group">
          <label htmlFor="cliente">Cliente</label>
          <select
            id="cliente"
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
            onChange={handleFechaDesdeChange}
            disabled={loading}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="fechaHasta">Fecha Hasta</label>
          <input
            id="fechaHasta"
            type="date"
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
