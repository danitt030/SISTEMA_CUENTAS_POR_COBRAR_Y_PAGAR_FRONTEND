export const FacturaPorCobrarSearch = ({ onSearch }) => {
  const estados = ["PENDIENTE", "PARCIAL", "COBRADA", "VENCIDA"];

  const handleEstadoChange = (event) => {
    const estado = event.target.value;
    onSearch(estado);
  };

  return (
    <div className="factura-search factura-search-compact">
      <div className="search-group search-group-inline">
        <label htmlFor="estado-filter" className="search-label">Estado</label>
        <select 
          id="estado-filter"
          onChange={handleEstadoChange}
          defaultValue=""
          className="form-select factura-estado-select"
        >
          <option value="">Todos</option>
          {estados.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
