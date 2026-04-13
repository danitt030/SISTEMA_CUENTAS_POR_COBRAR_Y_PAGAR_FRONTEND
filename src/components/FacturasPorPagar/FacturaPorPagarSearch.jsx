export const FacturaPorPagarSearch = ({ onSearch }) => {
  const estados = ["PENDIENTE", "PARCIAL", "PAGADA", "VENCIDA"];

  const handleEstadoChange = (event) => {
    const estado = event.target.value;
    onSearch(estado);
  };

  return (
    <div className="factura-search">
      <div className="search-group">
        <label htmlFor="estado-filter">Filtrar por Estado:</label>
        <select 
          id="estado-filter"
          onChange={handleEstadoChange}
          defaultValue=""
          className="form-select"
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

